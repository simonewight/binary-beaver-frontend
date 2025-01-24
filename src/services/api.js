import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'  // adjust this to match your Django API URL

// Get token from localStorage
const getAuthToken = () => localStorage.getItem('access_token')

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth endpoints
export const auth = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/registration/', userData),
  refreshToken: () => api.post('/auth/token/refresh/'),
  logout: () => api.post('/auth/logout/'),
}

// Snippets endpoints
export const snippets = {
  getAll: (params) => api.get('/snippets/', { params }),
  get: (id) => api.get(`/snippets/${id}/`),
  create: (data) => api.post('/snippets/', data),
  update: (id, data) => api.put(`/snippets/${id}/`, data),
  delete: (id) => api.delete(`/snippets/${id}/`),
  like: (id) => api.post(`/snippets/${id}/like/`),
}

// Collections endpoints
export const collections = {
  getAll: () => api.get('/collections/'),
  get: (id) => api.get(`/collections/${id}/`),
  create: (data) => api.post('/collections/', data),
  update: (id, data) => api.put(`/collections/${id}/`, data),
  delete: (id) => api.delete(`/collections/${id}/`),
  addSnippet: (id, snippetId) => api.post(`/collections/${id}/add_snippet/`, { snippet_id: snippetId }),
  removeSnippet: (id, snippetId) => api.post(`/collections/${id}/remove_snippet/`, { snippet_id: snippetId }),
}

export default api 