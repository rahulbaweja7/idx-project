const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/properties
router.get('/', async (req, res) => {
  const { city, zipcode, minPrice, maxPrice, beds, baths, limit = 20, offset = 0, sortBy, sortOrder = 'asc' } = req.query;

  // Validate numeric inputs
  const limitNum = parseInt(limit);
  const offsetNum = parseInt(offset);

  if (isNaN(limitNum) || limitNum <= 0 || limitNum > 100) {
    return res.status(400).json({ error: 'limit must be a number between 1 and 100' });
  }
  if (isNaN(offsetNum) || offsetNum < 0) {
    return res.status(400).json({ error: 'offset must be a non-negative number' });
  }
  if (minPrice && isNaN(Number(minPrice))) {
    return res.status(400).json({ error: 'minPrice must be a number' });
  }
  if (maxPrice && isNaN(Number(maxPrice))) {
    return res.status(400).json({ error: 'maxPrice must be a number' });
  }
  if (beds && isNaN(Number(beds))) {
    return res.status(400).json({ error: 'beds must be a number' });
  }
  if (baths && isNaN(Number(baths))) {
    return res.status(400).json({ error: 'baths must be a number' });
  }

  // Validate sort params
  const allowedSortFields = {
    price: 'L_SystemPrice',
    beds: 'L_Keyword2',
    baths: 'LM_Dec_3',
    sqft: 'LM_Int2_3',
    year: 'YearBuilt'
  };

  if (sortBy && !allowedSortFields[sortBy]) {
    return res.status(400).json({ error: 'Invalid sortBy value' });
  }
  if (sortOrder && !['asc', 'desc'].includes(sortOrder)) {
    return res.status(400).json({ error: 'sortOrder must be asc or desc' });
  }

  const sortColumn = sortBy ? allowedSortFields[sortBy] : null;

  // Build WHERE clause dynamically
  const conditions = [];
  const values = [];

  if (city) {
    conditions.push('LOWER(TRIM(L_City)) = LOWER(TRIM(?))');
    values.push(city);
  }
  if (zipcode) {
    conditions.push('L_Zip = ?');
    values.push(zipcode);
  }
  if (minPrice) {
    conditions.push('L_SystemPrice >= ?');
    values.push(Number(minPrice));
  }
  if (maxPrice) {
    conditions.push('L_SystemPrice <= ?');
    values.push(Number(maxPrice));
  }
  if (beds) {
    conditions.push('L_Keyword2 = ?');
    values.push(Number(beds));
  }
  if (baths) {
    conditions.push('LM_Dec_3 >= ?');
    values.push(Number(baths));
  }

  const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

  try {
    await db.query("SET SESSION sql_mode = ''");
    const [countRows] = await db.query(
      `SELECT COUNT(*) as total FROM rets_property ${whereClause}`,
      values
    );
    const total = countRows[0].total;

    await db.query("SET SESSION sql_mode = ''");
    const [rows] = await db.query(
      `SELECT L_ListingID, L_Address, L_City, L_State, L_Zip,
              L_SystemPrice, L_Keyword2, LM_Dec_3, LM_Int2_3,
              L_Photos, LMD_MP_Latitude, LMD_MP_Longitude,
              L_Remarks, YearBuilt, LotSizeAcres
       FROM rets_property ${whereClause}
       ${sortColumn ? `ORDER BY ${sortColumn} ${sortOrder.toUpperCase()}` : ''}
       LIMIT ? OFFSET ?`,
      [...values, limitNum, offsetNum]
    );

    res.json({ total, limit: limitNum, offset: offsetNum, results: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/properties/:id/openhouses — must be before /:id
router.get('/:id/openhouses', async (req, res) => {
  const { id } = req.params;

  if (!id || id.length > 50) {
    return res.status(400).json({ error: 'Invalid listing ID' });
  }

  try {
    const [property] = await db.query(
      'SELECT L_ListingID FROM rets_property WHERE L_ListingID = ?',
      [id]
    );
    if (property.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const [openhouses] = await db.query(
      `SELECT L_ListingID, OpenHouseDate, OH_StartTime, OH_EndTime, all_data
       FROM rets_openhouse
       WHERE L_ListingID = ?
       ORDER BY OpenHouseDate, OH_StartTime`,
      [id]
    );

    res.json(openhouses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/properties/:id — must be after /openhouses
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id || id.length > 50) {
    return res.status(400).json({ error: 'Invalid listing ID' });
  }

  try {
    const [rows] = await db.query(
      `SELECT L_ListingID, L_Address, L_City, L_State, L_Zip,
              L_SystemPrice, L_Keyword2, LM_Dec_3, LM_Int2_3,
              L_Photos, LMD_MP_Latitude, LMD_MP_Longitude,
              L_Remarks, YearBuilt, LotSizeAcres
       FROM rets_property WHERE L_ListingID = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;