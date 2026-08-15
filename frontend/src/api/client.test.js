import { fetchProperties, fetchPropertyDetail } from './client';

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

test('fetchProperties returns data on success', async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ total: 100, limit: 20, offset: 0, results: [] })
  });

  const data = await fetchProperties({ city: 'Beverly Hills' });
  expect(data.total).toBe(100);
  expect(fetch).toHaveBeenCalledWith(
    expect.stringContaining('city=Beverly+Hills')
  );
});

test('fetchProperties throws on error response', async () => {
  global.fetch.mockResolvedValueOnce({
    ok: false,
    json: async () => ({ error: 'Database error' })
  });

  await expect(fetchProperties()).rejects.toThrow('Database error');
});

test('fetchPropertyDetail returns property on success', async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ L_ListingID: '123', L_Address: '123 Main St' })
  });

  const data = await fetchPropertyDetail('123');
  expect(data.L_ListingID).toBe('123');
});