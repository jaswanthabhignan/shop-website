const API_BASE = '/api';

/**
 * Handle API responses with robust error handling
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(url, config);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMsg = errorData.detail || `Request failed with status ${res.status}`;
      throw new Error(errorMsg);
    }
    return await res.json();
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'} ${url}]:`, err);
    throw err;
  }
}

// Stores
export const getStores = () => request('/stores');
export const getStore = (codeOrId) => request(`/stores/${codeOrId}`);

// Categories
export const getCategories = () => request('/categories');
export const getCategory = (slug) => request(`/categories/${slug}`);

// Products
export const getProducts = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      searchParams.append(key, val);
    }
  });
  const queryString = searchParams.toString();
  return request(`/products${queryString ? `?${queryString}` : ''}`);
};

export const getProduct = (slugOrId) => request(`/products/${slugOrId}`);

// Offers
export const getOffers = () => request('/offers');

// Enquiries
export const createEnquiry = (enquiryData) =>
  request('/enquiries', {
    method: 'POST',
    body: JSON.stringify(enquiryData),
  });

export const getEnquiries = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      searchParams.append(key, val);
    }
  });
  const query = searchParams.toString();
  return request(`/enquiries${query ? `?${query}` : ''}`);
};

export const updateEnquiryStatus = (id, status, admin_notes = null) =>
  request(`/enquiries/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, admin_notes }),
  });

// Admin
export const getAdminStats = () => request('/admin/stats');
export const createProduct = (productData) =>
  request('/admin/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });

export const updateProduct = (id, productData) =>
  request(`/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  });

export const deleteProduct = (id) =>
  request(`/admin/products/${id}`, {
    method: 'DELETE',
  });

export const createOffer = (offerData) =>
  request('/admin/offers', {
    method: 'POST',
    body: JSON.stringify(offerData),
  });

export const deleteOffer = (id) =>
  request(`/admin/offers/${id}`, {
    method: 'DELETE',
  });
