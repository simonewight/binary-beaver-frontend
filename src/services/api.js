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
  console.log('Request URL:', config.url)  // Debug log
  console.log('Token present:', !!token)    // Debug log
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response success:', response.config.url)  // Debug log
    return response
  },
  async (error) => {
    console.log('Response error:', {  // Debug log
      url: error.config.url,
      status: error.response?.status,
      data: error.response?.data
    })

    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      console.log('Attempting token refresh...')  // Debug log

      try {
        const response = await api.post('/auth/token/refresh/', {
          refresh: localStorage.getItem('refresh_token')
        })

        if (response.data.access) {
          console.log('Token refresh successful')  // Debug log
          localStorage.setItem('access_token', response.data.access)
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)  // Debug log
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
  get: async (id) => {
    const response = await api.get(`/snippets/${id}/`)
    console.log('API Response for snippet:', response)
    return response
  },
  create: (data) => {
    console.log('Creating snippet with data:', data)
    return api.post('/snippets/', data).then(response => {
      console.log('Create snippet response full:', response)
      if (!response.data?.data?.id) {
        console.error('No ID in snippet response. Full response data:', response.data)
      }
      return response
    }).catch(error => {
      console.error('Create snippet error:', error.response || error)
      throw error
    })
  },
  update: (id, data) => {
    console.log('Updating snippet:', id, data)
    return api.put(`/snippets/${id}/`, data)
  },
  delete: (id) => api.delete(`/snippets/${id}/`),
  like: (id) => api.post(`/snippets/${id}/like/`),
}

// Collections endpoints
export const collections = {
  getAll: () => {
    return api.get('/collections/').then(response => {
      console.log('Collections response:', response.data) // Debug log
      return response
    })
  },
  get: (id) => api.get(`/collections/${id}/`),
  create: (data) => api.post('/collections/', data),
  update: (id, data) => api.put(`/collections/${id}/`, data),
  delete: (id) => api.delete(`/collections/${id}/`),
  addSnippet: (collectionId, snippetId) => 
    api.post(`/collections/${collectionId}/add_snippet/`, { snippet_id: snippetId }),
  removeSnippet: (collectionId, snippetId) => 
    api.post(`/collections/${collectionId}/remove_snippet/`, { snippet_id: snippetId }),
}

export default api 