const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/config/db');

describe('Dashboard API', () => {
  let adminToken;
  let viewerToken;

  beforeAll(async () => {
    const adminEmail = `admin_dash_${Date.now()}@test.com`;
    const viewerEmail = `viewer_dash_${Date.now()}@test.com`;

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

  describe('GET /api/dashboard/summary', () => {
    it('should allow admin to view summary totals', async () => {
      const res = await request(app)
        .get('/api/dashboard/summary')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveProperty('total_income');
      expect(res.body.data).toHaveProperty('total_expense');
      expect(res.body.data).toHaveProperty('net_balance');
    });

    it('should allow viewer to view dashboard', async () => {
      const res = await request(app)
        .get('/api/dashboard/summary')
        .set('Authorization', `Bearer ${viewerToken}`);
      
      expect(res.statusCode).toEqual(200);
    });
  });

  describe('GET /api/dashboard/categories', () => {
    it('should return a list of category breakdowns', async () => {
      const res = await request(app)
        .get('/api/dashboard/categories')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /api/dashboard/trends', () => {
    it('should return monthly trend data', async () => {
      const res = await request(app)
        .get('/api/dashboard/trends')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /api/dashboard/recent', () => {
    it('should return the latest activity log', async () => {
      const res = await request(app)
        .get('/api/dashboard/recent?limit=5')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.length).toBeLessThanOrEqual(5);
    });
  });
});
