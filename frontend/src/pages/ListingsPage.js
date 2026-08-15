import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import PropertyFilters from '../components/PropertyFilters';
import Pagination from '../components/Pagination';
import { fetchProperties } from '../api/client';

const ITEMS_PER_PAGE = 20;

function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    fetchProperties({ ...filters, limit: ITEMS_PER_PAGE, offset })
      .then(data => {
        setProperties(data.results);
        setTotal(data.total);
        setLoading(false);
        window.scrollTo(0, 0);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [filters, currentPage]);

  function handleSearch(newFilters) {
    setFilters(newFilters);
    setCurrentPage(1);
  }

  function handlePageChange(page) {
    setCurrentPage(page);
  }

  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, total);

  return (
    <div className="listings-page">
      <h1>Property Listings</h1>
      <PropertyFilters onSearch={handleSearch} />
      {loading && <div className="status-message">Loading properties...</div>}
      {error && <div className="status-message error">Error: {error}</div>}
      {!loading && !error && (
        <>
          <p className="results-count">
            Showing {startItem}-{endItem} of {total.toLocaleString()} properties
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

export default ListingsPage;