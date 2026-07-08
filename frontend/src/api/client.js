const API_BASE = '/api';

export async function fetchProperties(params = {}) {
  const query = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      query.append(key, value);
    }
  });

  const res = await fetch(`${API_BASE}/properties?${query.toString()}`);
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed with status ${res.status}`);
  }
  
  return res.json();
}

export async function fetchPropertyDetail(id) {
  const res = await fetch(`${API_BASE}/properties/${id}`);
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed with status ${res.status}`);
  }
  
  return res.json();
}