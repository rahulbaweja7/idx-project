import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import PropertyFilters from '../components/PropertyFilters';
import { fetchProperties } from '../api/client';

function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProperties({ ...filters, limit: 20, offset: 0 })
      .then(data => {
        setProperties(data.results);
        setTotal(data.total);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [filters]);

  function handleSearch(newFilters) {
    setFilters(newFilters);
  }

  return (
    <div className="listings-page">
      <h1>Property Listings</h1>
      <PropertyFilters onSearch={handleSearch} />
      {loading && <div className="status-message">Loading properties...</div>}
      {error && <div className="status-message error">Error: {error}</div>}
      {!loading && !error && (
        <>
          <p className="results-count">
            Showing {properties.length} of {total.toLocaleString()} properties
          </p>
          {properties.length === 0 ? (
            <div className="status-message">No properties found. Try adjusting your filters.</div>
          ) : (
            <div className="property-grid">
              {properties.map(property => (
                <PropertyCard key={property.L_ListingID} property={property} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ListingsPage;