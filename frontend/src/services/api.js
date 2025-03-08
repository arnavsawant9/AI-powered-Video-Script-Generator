// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const apiService = {
  // Generate a script
  generateScript: async (formData) => {
    const response = await axios.post(`${API_BASE_URL}/generate-script/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  // Get scripts with optional search parameters
  getScripts: async (page = 1, search = '', language = '') => {
    const response = await axios.get(`${API_BASE_URL}/search-scripts/`, {
      params: {
        page,
        page_size: 5,
        q: search,
        language
      }
    });
    return response.data;
  },
  
  // Export a script in specific format
  exportScript: async (scriptId, format = 'txt') => {
    const response = await axios.get(`${API_BASE_URL}/export-script/${scriptId}/?format=${format}`);
    return response.data;
  },
  
  // Get a single script by ID
  getScriptById: async (scriptId) => {
    const response = await axios.get(`${API_BASE_URL}/scripts/${scriptId}/`);
    return response.data;
  }
};

export default apiService;