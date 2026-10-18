const request = require('supertest');
const { app } = require('../server');

describe('Paylora Pro API', () => {
  it('GET /api/health returns 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
  it('POST /api/payments rejects invalid amount', async () => {
    const res = await request(app).post('/api/payments').send({ amount: -5, currency: 'USD' });
    expect(res.status).toBe(400);
  });
  it('POST /api/payments creates payment', async () => {
    const res = await request(app).post('/api/payments').send({ amount: 100, currency: 'USD' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  });
});
