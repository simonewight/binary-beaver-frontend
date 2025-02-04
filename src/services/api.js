import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'  // Verify this matches your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  console.log('Making request to:', config.url)
  console.log('Auth token present:', !!token)
  console.log('Full request config:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data
  })
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  console.error('Request interceptor error:', error)
  return Promise.reject(error)
})

// Add response interceptor with enhanced error handling
api.interceptors.response.use(
  (response) => {
    console.log('Response success:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    })
    return response
  },
  async (error) => {
    console.error('Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    })

    const originalRequest = error.config

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      console.log('Attempting token refresh...')

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (!refreshToken) {
          console.log('No refresh token found, redirecting to login')
          window.location.href = '/login'
          return Promise.reject(error)
        }

        const response = await api.post('/auth/token/refresh/', {
          refresh: refreshToken
        })

        if (response.data.access) {
          console.log('Token refresh successful')
          localStorage.setItem('access_token', response.data.access)
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        // Clear tokens and redirect to login
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
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
  register: async (userData) => {
    try {
      console.log('Registering with data:', userData) // Debug log
      const response = await api.post('/auth/registration/', userData)
      console.log('Registration response:', response.data) // Debug log
      
      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access)
        localStorage.setItem('refresh_token', response.data.refresh)
        
        // Get the full user profile after registration
        const profileResponse = await api.get('/users/me/')
        console.log('Profile after registration:', profileResponse.data) // Debug log
        
        return {
          ...response,
          profile: profileResponse.data
        }
      }
      throw new Error('Registration failed')
    } catch (error) {
      console.error('Registration error:', error.response?.data || error)
      throw error
    }
  },
  refreshToken: () => api.post('/auth/token/refresh/'),
  logout: () => api.post('/auth/logout/'),
  getProfile: () => api.get('/users/me/'),
  updateProfile: (data) => api.patch('/users/me/', data),
  getStats: () => api.get('/users/me/stats/'),
  getActivity: () => api.get('/users/me/activity/'),
  updateAvatar: (formData) => {
    return api.post('/auth/update-avatar/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
  },
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
  like: async (id) => {
    try {
      console.log('Sending like request for snippet:', id)
      const response = await api.post(`/snippets/${id}/like/`)
      console.log('Like response:', response.data)
      
      if (response.data.success) {
        return {
          success: true,
          is_liked: response.data.data.is_liked,
          likes_count: response.data.data.likes_count
        }
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error('Error liking snippet:', error.response?.data || error)
      throw error
    }
  },
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
  share: (id) => api.post(`/collections/${id}/share/`),
  getShared: (shareId) => api.get(`/collections/shared/${shareId}/`),
}

export default api 