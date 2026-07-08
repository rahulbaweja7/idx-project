const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/properties
router.get('/', async (req, res) => {
  const { city, zipcode, minPrice, maxPrice, beds, baths, limit = 20, offset = 0 } = req.query;

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
    // Get total count
    const [countRows] = await db.query(
      `SELECT COUNT(*) as total FROM rets_property ${whereClause}`,
      values
    );
    const total = countRows[0].total;

    // Get paginated results
    const [rows] = await db.query(
      `SELECT L_ListingID, L_Address, L_City, L_State, L_Zip,
              L_SystemPrice, L_Keyword2, LM_Dec_3, LM_Int2_3,
              L_Photos, LMD_MP_Latitude, LMD_MP_Longitude,
              L_Remarks, YearBuilt, LotSizeAcres
       FROM rets_property ${whereClause}
       LIMIT ? OFFSET ?`,
      [...values, limitNum, offsetNum]
    );

    res.json({ total, limit: limitNum, offset: offsetNum, results: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;