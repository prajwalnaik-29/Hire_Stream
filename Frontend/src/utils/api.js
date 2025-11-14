// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL||'https://hire-stream.onrender.com' || 'http://localhost:5000';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to handle logout on 401
const handleUnauthorized = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// Main fetch wrapper function
const apiFetch = async (endpoint, options = {}) => {
  // Build full URL
  const url = `${API_BASE_URL}${endpoint}`;

  // Get token
  const token = getAuthToken();

  // Default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add Authorization header if token exists
  if (token) {
    headers.Authorization = `${token}`;
  }

  // Merge options
  const config = {
    ...options,
    headers,
  };

  try {
    // Make fetch request
    const response = await fetch(url, config);

    // Parse JSON response
    const data = await response.json();

    // Handle error responses
    if (!response.ok) {
      // Handle specific status codes
      switch (response.status) {
        case 401:
          // Unauthorized - Clear auth and redirect
          handleUnauthorized();
          throw new Error(data.message || 'Unauthorized');

        case 403:
          // Forbidden
          throw new Error(data.message || 'Access forbidden');

        case 404:
          // Not found
          throw new Error(data.message || 'Resource not found');

        case 500:
          // Server error
          throw new Error(data.message || 'Server error occurred');

        default:
          throw new Error(data.message || 'An error occurred');
      }
    }

    // Return data directly
    return data;
  } catch (error) {
    // Network error or other errors
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Network error. Please check your connection.');
    }

    // Re-throw the error
    throw error;
  }
};

// API methods
const api = {
  // GET request
  get: (endpoint, options = {}) => {
    return apiFetch(endpoint, {
      method: 'GET',
      ...options,
    });
  },

  // POST request
  post: (endpoint, body, options = {}) => {
    return apiFetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      ...options,
    });
  },

  // PUT request
  put: (endpoint, body, options = {}) => {
    return apiFetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      ...options,
    });
  },

  // PATCH request
  patch: (endpoint, body, options = {}) => {
    return apiFetch(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
      ...options,
    });
  },

  // DELETE request
  delete: (endpoint, options = {}) => {
    return apiFetch(endpoint, {
      method: 'DELETE',
      ...options,
    });
  },

  // Upload file (FormData)
  // Upload file (FormData)
  upload: async (endpoint, formData, options = {}) => {
    const token = getAuthToken();
    const headers = {
      ...options.headers,
    };

    // Add Authorization header
    if (token) {
      headers.Authorization = `${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: options.method || 'POST',
        headers, // ❌ no 'Content-Type' manually set here!
        body: formData, // ✅ browser sets correct multipart/form-data with boundary
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Upload failed');
      return data;
    } catch (error) {
      throw error;
    }
  },
};

// Helper function to set auth token manually
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

// Helper function to clear auth
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Export the API object
export default api;
