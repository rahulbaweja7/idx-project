import React from 'react';

function PropertyMap({ lat, lng, address }) {
  if (!lat || !lng || parseFloat(lat) === 0 || parseFloat(lng) === 0) {
    return null;
  }

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&zoom=15`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div className="property-map">
      <h3>Location</h3>
      <iframe
        title="Property Map"
        src={mapSrc}
        width="100%"
        height="300"
        style={{ border: 0, borderRadius: 8 }}
        allowFullScreen
        loading="lazy"
      />
      <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="directions-link">
        Get Directions
      </a>
    </div>
  );
}

export default PropertyMap;