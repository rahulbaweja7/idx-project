# IDX Exchange — Property Search Application

A Zillow/Redfin-style property search app built with React, Node/Express, and MySQL.

![Property Listings](./frontend/public/screenshot.png)

## Tech Stack

- **Frontend:** React 19, React Router 6
- **Backend:** Node.js, Express 4
- **Database:** MySQL 8 (Docker)
- **Testing:** Jest, Supertest, React Testing Library

## Local Setup

### Prerequisites

- Node.js (LTS)
- Docker Desktop
- Git

### 1. Clone the repo

```bash
git clone https://github.com/rahulbaweja7/idx-project.git
cd idx-project
```

### 2. Start the database

```bash
docker start idx-mysql-local
```

If first time setup:

```bash
docker run --name idx-mysql-local -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=rets -p 3306:3306 -d mysql:8
docker exec -i idx-mysql-local mysql -uroot -proot rets < rets_property.sql
docker exec -i idx-mysql-local mysql -uroot -proot rets < rets_openhouse.sql
```

### 3. Start the backend

```bash
cd backend
cp .env.example .env  # fill in your values
npm install
node index.js
```

Backend runs on http://localhost:3001

### 4. Start the frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on http://localhost:3000

## API Reference

### GET /api/health

Returns database connection status.

```json
{ "status": "ok", "database": "connected" }
```

### GET /api/properties

Returns paginated, filterable property listings.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| city | string | Filter by city |
| zipcode | string | Filter by ZIP code |
| minPrice | number | Minimum price |
| maxPrice | number | Maximum price |
| beds | number | Number of bedrooms |
| baths | number | Minimum bathrooms |
| limit | number | Results per page (default: 20, max: 100) |
| offset | number | Pagination offset |
| sortBy | string | Sort field: price, beds, baths, sqft, year |
| sortOrder | string | asc or desc |

**Example:**
**Response:**

```json
{
  "total": 287,
  "limit": 20,
  "offset": 0,
  "results": [...]
}
```

### GET /api/properties/:id

Returns a single property by listing ID.

**Response:** Full property object or 404.

### GET /api/properties/:id/openhouses

Returns open house events for a property.

**Response:** Array of open house objects (empty array if none).

## Database Schema

### rets_property (53,122 rows)

Key columns:

- `L_ListingID` — unique listing ID
- `L_Address`, `L_City`, `L_State`, `L_Zip` — location
- `L_SystemPrice` — listing price
- `L_Keyword2` — bedrooms
- `LM_Dec_3` — bathrooms
- `LM_Int2_3` — square footage
- `L_Photos` — JSON array of photo URLs
- `LMD_MP_Latitude`, `LMD_MP_Longitude` — coordinates
- `L_Remarks` — property description
- `YearBuilt`, `LotSizeAcres`

### rets_openhouse (4,282 rows)

Key columns:

- `L_ListingID` — foreign key to rets_property
- `OpenHouseDate`, `OH_StartTime`, `OH_EndTime`
- `all_data` — JSON blob containing OpenHouseRemarks and other fields

## Known Issues

- Sorting has a MySQL sql_mode conflict in Docker that causes ORDER BY to be ignored in some cases
- Some L_Photos values are null or malformed — handled gracefully with fallback
- Some properties have missing lat/lng — map conditionally renders
- City names have inconsistent casing — normalized with LOWER(TRIM())

## Future Improvements

- Fix MySQL sql_mode issue for sorting
- Add favorites feature
- Deploy to Render + Vercel
- Add natural language search with Claude API
