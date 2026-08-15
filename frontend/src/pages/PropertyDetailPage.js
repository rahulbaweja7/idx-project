import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPropertyDetail } from '../api/client';
import PropertyMap from '../components/PropertyMap';

function parsePhotos(photosRaw) {
  try {
    const parsed = JSON.parse(photosRaw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch (e) {}
  return [];
}

function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [openHouses, setOpenHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    fetchPropertyDetail(id)
      .then(data => {
        setProperty(data);
        setLoading(false);
        return fetch(`/api/properties/${id}/openhouses`);
      })
      .then(res => res.json())
      .then(data => setOpenHouses(data))
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="status-message">Loading property...</div>;
  if (error) return <div className="status-message error">Error: {error}</div>;
  if (!property) return null;

  const photos = parsePhotos(property.L_Photos);
  const price = property.L_SystemPrice
    ? `$${property.L_SystemPrice.toLocaleString()}`
    : 'Price not available';

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back to Listings</button>

      {/* Photo Gallery */}
      <div className="detail-gallery">
        {photos.length > 0 ? (
          <>
            <div className="main-photo" onClick={() => setLightbox(true)}>
              <img src={photos[currentPhoto]} alt="Property" />
            </div>
            <div className="thumbnail-strip">
              {photos.map((photo, i) => (
                <img
                  key={i}
                  src={photo}
                  alt={`Photo ${i + 1}`}
                  className={i === currentPhoto ? 'active' : ''}
                  onClick={() => setCurrentPhoto(i)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="no-photo" style={{ height: 300 }}>No Photos Available</div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="lightbox"
          onClick={() => setLightbox(false)}
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Escape') setLightbox(false);
            if (e.key === 'ArrowRight') setCurrentPhoto(p => Math.min(p + 1, photos.length - 1));
            if (e.key === 'ArrowLeft') setCurrentPhoto(p => Math.max(p - 1, 0));
          }}
        >
          <img src={photos[currentPhoto]} alt="Property" onClick={e => e.stopPropagation()} />
          <span className="lightbox-close">✕</span>
        </div>
      )}

      {/* Property Info */}
      <div className="detail-info">
        <h1>{price}</h1>
        <h2>{property.L_Address}</h2>
        <p>{property.L_City}, {property.L_State} {property.L_Zip}</p>

        <div className="detail-stats">
          {property.L_Keyword2 != null && <span>{property.L_Keyword2} Beds</span>}
          {property.LM_Dec_3 != null && <span>{property.LM_Dec_3} Baths</span>}
          {property.LM_Int2_3 != null && <span>{property.LM_Int2_3.toLocaleString()} sqft</span>}
          {property.YearBuilt && <span>Built {property.YearBuilt}</span>}
          {property.LotSizeAcres && <span>{property.LotSizeAcres} acres</span>}
        </div>

        {property.L_Remarks && (
          <div className="detail-description">
            <h3>Description</h3>
            <p>{property.L_Remarks}</p>
          </div>
        )}

        {/* Map */}
        <PropertyMap
          lat={property.LMD_MP_Latitude}
          lng={property.LMD_MP_Longitude}
          address={property.L_Address}
        />

        {/* Open Houses */}
        <div className="open-houses">
          <h3>Open Houses</h3>
          {openHouses.length === 0 ? (
            <p>No open houses scheduled</p>
          ) : (
            openHouses.map((oh, i) => {
              let remarks = '';
              try {
                const allData = JSON.parse(oh.all_data);
                remarks = allData.OpenHouseRemarks || '';
              } catch (e) {}
              return (
                <div key={i} className="open-house-item">
                  <p><strong>Date:</strong> {new Date(oh.OpenHouseDate).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {oh.OH_StartTime} - {oh.OH_EndTime}</p>
                  {remarks && <p><strong>Remarks:</strong> {remarks}</p>}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default PropertyDetailPage;