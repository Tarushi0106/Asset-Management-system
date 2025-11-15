const request = require('supertest');
const app = require('../server');

describe('Authentication API', () => {
  test('POST /auth/login should authenticate with valid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toBeDefined();
    expect(response.body.user.username).toBe('admin');
  });

  test('POST /auth/login should reject invalid username', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'wronguser', password: 'admin123' });
    
    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Invalid credentials');
  });

  test('POST /auth/login should reject invalid password', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'admin', password: 'wrongpassword' });
    
    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Invalid credentials');
  });

  test('POST /auth/login should validate required fields', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ username: '', password: '' });
    
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeInstanceOf(Array);
  });

  test('Protected routes should require authentication', async () => {
    const response = await request(app)
      .get('/assets');
    
    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Access token required');
  });

  test('Protected routes should reject invalid tokens', async () => {
    const response = await request(app)
      .get('/assets')
      .set('Authorization', 'Bearer invalid-token');
    
    expect(response.status).toBe(403);
    expect(response.body.error).toBe('Invalid token');
  });
});