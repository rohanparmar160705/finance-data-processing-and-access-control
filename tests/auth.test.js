const request = require('supertest');
const app = require('../src/app');

describe('Auth API', () => {
  // we will generate unique users inside each test to avoid conflicts
  const getUniqueUser = () => ({
    name: 'Jest User',
    email: `jest_${Date.now()}_${Math.floor(Math.random() * 1000)}@example.com`,
    password: 'password123'
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const user = getUniqueUser();
      const res = await request(app)
        .post('/api/auth/register')
        .send(user);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.data.email).toEqual(user.email);
    });

    it('should fail to register with an existing email', async () => {
      const user = getUniqueUser();
      // first registration
      await request(app).post('/api/auth/register').send(user);
      // second registration with same email
      const res = await request(app).post('/api/auth/register').send(user);
      
      expect(res.statusCode).toEqual(500);
    });

    it('should fail with invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Fail', email: 'not-email', password: 'password123' });
      
      expect(res.statusCode).toEqual(422);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully and return a token', async () => {
      const user = getUniqueUser();
      await request(app).post('/api/auth/register').send(user);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: user.password
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should fail with incorrect password', async () => {
      const user = getUniqueUser();
      await request(app).post('/api/auth/register').send(user);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: 'wrong-password'
        });
      
      expect(res.statusCode).toEqual(400);
    });
  });
});
