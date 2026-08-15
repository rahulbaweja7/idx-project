const request = require('supertest');
const express = require('express');

jest.mock('../db', () => ({
  query: jest.fn(),
  getConnection: jest.fn()
}));

const db = require('../db');
const propertiesRouter = require('./properties');

const app = express();
app.use(express.json());
app.use('/api/properties', propertiesRouter);

const mockProperty = {
  L_ListingID: '123',
  L_Address: '123 Main St',
  L_City: 'Beverly Hills',
  L_State: 'CA',
  L_Zip: '90210',
  L_SystemPrice: 1000000,
  L_Keyword2: 3,
  LM_Dec_3: '2.0',
  LM_Int2_3: 1500,
  L_Photos: '[]',
  LMD_MP_Latitude: '34.0',
  LMD_MP_Longitude: '-118.0',
  L_Remarks: 'Nice house',
  YearBuilt: 2000,
  LotSizeAcres: '0.25'
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /api/properties', () => {
  test('returns 20 properties by default', async () => {
    db.query
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([[{ total: 100 }]])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([[mockProperty]]);

    const res = await request(app).get('/api/properties');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('results');
  });

  test('returns 400 for invalid limit', async () => {
    const res = await request(app).get('/api/properties?limit=0');
    expect(res.status).toBe(400);
  });

  test('returns 400 for invalid minPrice', async () => {
    const res = await request(app).get('/api/properties?minPrice=abc');
    expect(res.status).toBe(400);
  });

  test('returns 400 for invalid sortBy', async () => {
    const res = await request(app).get('/api/properties?sortBy=invalid');
    expect(res.status).toBe(400);
  });
});

describe('GET /api/properties/:id', () => {
  test('returns property for valid ID', async () => {
    db.query.mockResolvedValueOnce([[mockProperty]]);
    const res = await request(app).get('/api/properties/123');
    expect(res.status).toBe(200);
    expect(res.body.L_ListingID).toBe('123');
  });

  test('returns 404 for unknown ID', async () => {
    db.query.mockResolvedValueOnce([[]]);
    const res = await request(app).get('/api/properties/FAKEID');
    expect(res.status).toBe(404);
  });

  test('returns 400 for oversized ID', async () => {
    const longId = 'a'.repeat(51);
    const res = await request(app).get(`/api/properties/${longId}`);
    expect(res.status).toBe(400);
  });
});

describe('GET /api/properties/:id/openhouses', () => {
  test('returns open houses for valid property', async () => {
    db.query
      .mockResolvedValueOnce([[mockProperty]])
      .mockResolvedValueOnce([[{
        L_ListingID: '123',
        OpenHouseDate: '2026-01-01',
        OH_StartTime: '10:00:00',
        OH_EndTime: '12:00:00',
        all_data: '{}'
      }]]);

    const res = await request(app).get('/api/properties/123/openhouses');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('returns 404 for unknown property', async () => {
    db.query.mockResolvedValueOnce([[]]);
    const res = await request(app).get('/api/properties/FAKEID/openhouses');
    expect(res.status).toBe(404);
  });

  test('returns empty array when no open houses', async () => {
    db.query
      .mockResolvedValueOnce([[mockProperty]])
      .mockResolvedValueOnce([[]]);

    const res = await request(app).get('/api/properties/123/openhouses');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});