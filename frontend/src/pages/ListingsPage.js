import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import { fetchProperties } from '../api/client';

function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProperties({ limit: 20, offset: 0 })
      .then(data => {
        setProperties(data.results);
        setTotal(data.total);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="status-message">Loading properties...</div>;
  if (error) return <div className="status-message error">Error: {error}</div>;

  return (
    <div className="listings-page">
      <h1>Property Listings</h1>
      <p className="results-count">Showing {properties.length} of {total.toLocaleString()} properties</p>
      <div className="property-grid">
        {properties.map(property => (
          <PropertyCard key={property.L_ListingID} property={property} />
        ))}
      </div>
    </div>
  );
}

export default ListingsPage;