import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'  // Make sure this matches your Django server

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const response = await api.post('/auth/token/refresh/', {
          refresh: localStorage.getItem('refresh_token')
        })

        if (response.data.access) {
          localStorage.setItem('access_token', response.data.access)
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Auth endpoints
export const auth = {
  login: (credentials) => {
    return api.post('/auth/login/', {
      username: credentials.username,
      password: credentials.password
    })
  },
  register: (userData) => api.post('/auth/registration/', userData),
  refreshToken: () => api.post('/auth/token/refresh/'),
  logout: () => api.post('/auth/logout/'),
  getProfile: () => api.get('/users/me/'),
  updateProfile: (data) => api.patch('/users/me/', data),
  getStats: () => api.get('/users/me/stats/'),
  getActivity: () => api.get('/users/me/activity/'),
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