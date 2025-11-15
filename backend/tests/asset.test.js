const request = require('supertest');
const app = require('../server');

let authToken;

beforeAll(async () => {
  const response = await request(app)
    .post('/auth/login')
    .send({ username: 'admin', password: 'admin123' });
  
  authToken = response.body.token;
});

describe('Asset Management API', () => {
  let testAssetId;

  test('POST /assets should create a new asset', async () => {
    const assetData = {
      asset_id: 'TEST-LAP-001',
      name: 'Test Laptop',
      category: 'Laptop',
      status: 'Available'
    };

    const response = await request(app)
      .post('/assets')
      .set('Authorization', `Bearer ${authToken}`)
      .send(assetData);
    
    expect(response.status).toBe(201);
    expect(response.body.asset_id).toBe('TEST-LAP-001');
    expect(response.body.name).toBe('Test Laptop');
    expect(response.body.category).toBe('Laptop');
    expect(response.body.status).toBe('Available');

    testAssetId = response.body.id;
  });

  test('POST /assets should not allow faulty assets to be allocated', async () => {
    const response = await request(app)
      .post('/assets')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        asset_id: 'FAULTY-001',
        name: 'Faulty Laptop',
        category: 'Laptop',
        status: 'Faulty',
        assigned_to: 'John Doe'
      });
    
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Faulty assets cannot be allocated');
  });

  test('POST /assets should validate required fields', async () => {
    const response = await request(app)
      .post('/assets')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        asset_id: '',
        name: '',
        category: 'InvalidCategory',
        status: 'InvalidStatus'
      });
    
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeInstanceOf(Array);
  });

  test('GET /assets should return all assets', async () => {
    const response = await request(app)
      .get('/assets')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('GET /assets should filter by category', async () => {
    const response = await request(app)
      .get('/assets?category=Laptop')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    
    if (response.body.length > 0) {
      expect(response.body[0].category).toBe('Laptop');
    }
  });

  test('GET /assets should search assets', async () => {
    const response = await request(app)
      .get('/assets?search=TEST-LAP')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('PUT /assets/:id should update an asset', async () => {
    const updateData = {
      asset_id: 'TEST-LAP-001-UPDATED',
      name: 'Updated Test Laptop',
      category: 'Laptop',
      status: 'Allocated',
      assigned_to: 'Test User'
    };

    const response = await request(app)
      .put(`/assets/${testAssetId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateData);
    
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated Test Laptop');
    expect(response.body.status).toBe('Allocated');
    expect(response.body.assigned_to).toBe('Test User');
  });

  test('PUT /assets/:id should not update non-existent asset', async () => {
    const response = await request(app)
      .put('/assets/9999')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        asset_id: 'NON-EXISTENT',
        name: 'Test',
        category: 'Laptop',
        status: 'Available'
      });
    
    expect(response.status).toBe(404);
  });

  test('DELETE /assets/:id should delete an asset', async () => {
    const response = await request(app)
      .delete(`/assets/${testAssetId}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Asset deleted successfully');
  });

  test('DELETE /assets/:id should not delete non-existent asset', async () => {
    const response = await request(app)
      .delete('/assets/9999')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(404);
  });
});