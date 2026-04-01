const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/config/db');

describe('Users API', () => {
  let adminToken;
  let viewerToken;

  beforeAll(async () => {
    const adminEmail = `admin_${Date.now()}@test.com`;
    const viewerEmail = `viewer_${Date.now()}@test.com`;

    // 1. Register Admin
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Admin User', email: adminEmail, password: 'password123' });
    
    // Promote to Admin via SQL 
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

  describe('GET /api/users/me', () => {
    it('should return the logged-in user profile with permissions', async () => {
      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.role).toEqual('admin');
      expect(res.body.data.permissions).toContain('MANAGE_USERS');
    });
  });

  describe('GET /api/users (Admin-only)', () => {
    it('should allow admin to list all users with pagination meta', async () => {
      const res = await request(app)
        .get('/api/users?page=1&limit=5')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('meta');
      expect(res.body.meta.limit).toEqual(5);
    });

    it('should deny non-admin users access to user list', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${viewerToken}`);
      
      expect(res.statusCode).toEqual(403);
      expect(res.body.message).toMatch(/Access denied/);
    });
  });
});
