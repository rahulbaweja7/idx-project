import React from 'react';

function parsePhotos(photosRaw) {
  try {
    const parsed = JSON.parse(photosRaw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
  } catch (e) {}
  return null;
}

function PropertyCard({ property }) {
  const photo = parsePhotos(property.L_Photos);
  const price = property.L_SystemPrice
    ? `$${property.L_SystemPrice.toLocaleString()}`
    : 'Price not available';

  return (
    <div className="property-card">
      <div className="property-card-image">
        {photo ? (
          <img src={photo} alt={property.L_Address} />
        ) : (
          <div className="no-photo">No Photo Available</div>
        )}
      </div>
      <div className="property-card-info">
        <div className="property-price">{price}</div>
        <div className="property-address">{property.L_Address}</div>
        <div className="property-location">
          {property.L_City}, {property.L_State} {property.L_Zip}
        </div>
        <div className="property-stats">
          {property.L_Keyword2 != null && <span>{property.L_Keyword2} bd</span>}
          {property.LM_Dec_3 != null && <span>{property.LM_Dec_3} ba</span>}
          {property.LM_Int2_3 != null && <span>{property.LM_Int2_3.toLocaleString()} sqft</span>}
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;