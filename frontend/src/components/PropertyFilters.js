import React, { useState } from 'react';

function PropertyFilters({ onSearch }) {
  const [filters, setFilters] = useState({
    city: '',
    zipcode: '',
    minPrice: '',
    maxPrice: '',
    beds: '',
    baths: ''
  });

  function handleChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const active = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '')
    );
    onSearch(active);
  }

  function handleClear() {
    setFilters({ city: '', zipcode: '', minPrice: '', maxPrice: '', beds: '', baths: '' });
    onSearch({});
  }

  return (
    <form className="filters-form" onSubmit={handleSubmit}>
      <input
        name="city"
        placeholder="City"
        value={filters.city}
        onChange={handleChange}
      />
      <input
        name="zipcode"
        placeholder="ZIP Code"
        value={filters.zipcode}
        onChange={handleChange}
      />
      <input
        name="minPrice"
        placeholder="Min Price"
        type="number"
        value={filters.minPrice}
        onChange={handleChange}
      />
      <input
        name="maxPrice"
        placeholder="Max Price"
        type="number"
        value={filters.maxPrice}
        onChange={handleChange}
      />
      <select name="beds" value={filters.beds} onChange={handleChange}>
        <option value="">Any Beds</option>
        {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}+</option>)}
      </select>
      <select name="baths" value={filters.baths} onChange={handleChange}>
        <option value="">Any Baths</option>
        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}+</option>)}
      </select>
      <button type="submit">Search</button>
      <button type="button" onClick={handleClear}>Clear</button>
    </form>
  );
}

export default PropertyFilters;