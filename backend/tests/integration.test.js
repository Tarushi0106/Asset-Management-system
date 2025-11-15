const request = require('supertest');
const app = require('../server');

describe('Asset Manager Integration Tests', () => {
  let authToken;
  let createdAssetId;

  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    
    authToken = loginResponse.body.token;
  });

  test('Complete asset lifecycle', async () => {

    const createResponse = await request(app)
      .post('/assets')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        asset_id: 'INTEGRATION-TEST-001',
        name: 'Integration Test Laptop',
        category: 'Laptop',
        status: 'Available'
      });
    
    expect(createResponse.status).toBe(201);
    createdAssetId = createResponse.body.id;

  
    const getResponse = await request(app)
      .get('/assets')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(getResponse.status).toBe(200);
    const createdAsset = getResponse.body.find(asset => asset.id === createdAssetId);
    expect(createdAsset).toBeDefined();
    expect(createdAsset.asset_id).toBe('INTEGRATION-TEST-001');

  
    const updateResponse = await request(app)
      .put(`/assets/${createdAssetId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        asset_id: 'INTEGRATION-TEST-001-UPDATED',
        name: 'Updated Integration Test Laptop',
        category: 'Laptop',
        status: 'Allocated',
        assigned_to: 'Integration Test User'
      });
    
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.assigned_to).toBe('Integration Test User');


    const searchResponse = await request(app)
      .get('/assets?search=Integration')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(searchResponse.status).toBe(200);
    expect(searchResponse.body.length).toBeGreaterThan(0);


    const deleteResponse = await request(app)
      .delete(`/assets/${createdAssetId}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(deleteResponse.status).toBe(200);

    
    const finalGetResponse = await request(app)
      .get('/assets')
      .set('Authorization', `Bearer ${authToken}`);
    
    const deletedAsset = finalGetResponse.body.find(asset => asset.id === createdAssetId);
    expect(deletedAsset).toBeUndefined();
  });

  test('Asset validation rules are enforced', async () => {
 
    const response = await request(app)
      .post('/assets')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        asset_id: 'FAULTY-INTEGRATION',
        name: 'Faulty Integration Asset',
        category: 'Laptop',
        status: 'Faulty',
        assigned_to: 'Should Not Be Assigned'
      });
    
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Faulty assets cannot be allocated');
  });
});