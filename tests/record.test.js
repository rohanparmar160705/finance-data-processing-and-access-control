const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/config/db');

describe('Financial Records API', () => {
  let adminToken;
  let viewerToken;
  let recordId;

  const testRecord = {
    amount: 1500.50,
    type: 'income',
    category: 'Testing',
    record_date: '2026-04-01',
    notes: 'A test entry'
  };

  beforeAll(async () => {
    const adminEmail = `admin_rec_${Date.now()}@test.com`;
    const viewerEmail = `viewer_rec_${Date.now()}@test.com`;

    // 1. Register and promote Admin
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Admin User', email: adminEmail, password: 'password123' });
    
    await pool.query(
      "UPDATE users SET role_id = (SELECT id FROM roles WHERE name = 'admin') WHERE email = $1",
      [adminEmail]
    );

    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: adminEmail, password: 'password123' });
    adminToken = adminLogin.body.token;

    // 2. Register Viewer
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Viewer User', email: viewerEmail, password: 'password123' });
    
    const viewerLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: viewerEmail, password: 'password123' });
    viewerToken = viewerLogin.body.token;
  });

  describe('POST /api/records', () => {
    it('should create a new record as an admin', async () => {
      const res = await request(app)
        .post('/api/records')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testRecord);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.data.amount).toEqual("1500.50");
      recordId = res.body.data.id;
    });

    it('should fail with invalid data format', async () => {
      const res = await request(app)
        .post('/api/records')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ amount: -10, type: 'invalid' });
      
      expect(res.statusCode).toEqual(422);
    });

    it('should deny record creation to a viewer', async () => {
      const res = await request(app)
        .post('/api/records')
        .set('Authorization', `Bearer ${viewerToken}`)
        .send(testRecord);
      
      expect(res.statusCode).toEqual(403);
    });
  });

  describe('GET /api/records', () => {
    it('should list records with pagination meta', async () => {
      const res = await request(app)
        .get('/api/records?page=1&limit=10&type=income')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('meta');
      expect(res.body.meta).toHaveProperty('total');
    });
  });

  describe('DELETE /api/records/:id', () => {
    it('should allow admin to soft delete a record', async () => {
      const res = await request(app)
        .delete(`/api/records/${recordId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(204);
    });

    it('should deny a viewer from deleting a record', async () => {
      const res = await request(app)
        .delete(`/api/records/${recordId}`) // record is soft-deleted, but RBAC check happens first
        .set('Authorization', `Bearer ${viewerToken}`);
      
      expect(res.statusCode).toEqual(403);
    });
  });
});
