import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getErrorMessage(error) {
  return error.response?.data?.error || error.message || 'Ошибка запроса';
}

function authOrigin() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  return new URL(apiUrl).origin;
}

export function loginRequest(email, password) {
  return axios.post(`${authOrigin()}/auth/login`, { email, password });
}

export function fetchDocuments() {
  return api.get('/documents');
}

export function addDocumentRequest(item) {
  return api.post('/documents', item);
}

export function updateDocumentRequest(id, updated) {
  return api.put(`/documents/${id}`, updated);
}

export function deleteDocumentRequest(id) {
  return api.delete(`/documents/${id}`);
}

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchDocumentsWithRetry(onAttempt, maxAttempts = 3) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    if (onAttempt) onAttempt(attempt, maxAttempts);
    try {
      return await fetchDocuments();
    } catch (error) {
      lastError = error;
      const status = error.response?.status;
      if (status && status < 500) {
        throw error;
      }
      if (attempt < maxAttempts) {
        await delay(600 * attempt);
      }
    }
  }

  throw lastError;
}

export default api;
