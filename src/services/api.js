import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
console.log('API_BASE_URL:', API_BASE_URL)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false  // Change this to false for JWT
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

        const response = await api.post('auth/token/refresh/', {
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
    console.log('Login request to:', `${API_BASE_URL}/auth/login/`)
    return api.post('auth/login/', {
      username: credentials.username,
      password: credentials.password
    })
  },
  register: async (userData) => {
    try {
      console.log('Registering with data:', userData)
      const response = await api.post('auth/registration/', userData)
      console.log('Registration response:', response.data)
      
      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access)
        localStorage.setItem('refresh_token', response.data.refresh)
        
        // Get the full user profile after registration
        const profileResponse = await api.get('users/me/')
        console.log('Profile after registration:', profileResponse.data)
        
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
  refreshToken: () => api.post('auth/token/refresh/'),
  logout: () => api.post('auth/logout/'),
  getProfile: () => api.get('users/me/'),
  updateProfile: (data) => api.patch('users/me/', data),
  getStats: () => api.get('users/me/stats/'),
  getActivity: () => api.get('users/me/activity/'),
  updateAvatar: (formData) => {
    return api.post('auth/update-avatar/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
  },
}

// Snippets endpoints
export const snippets = {
  getAll: (params) => api.get('snippets/', { params }),
  get: async (id) => {
    const response = await api.get(`snippets/${id}/`)
    console.log('API Response for snippet:', response)
    return response
  },
  create: (data) => {
    console.log('Creating snippet with data:', data)
    return api.post('snippets/', data)
  },
  update: (id, data) => {
    console.log('Updating snippet:', id, data)
    return api.put(`snippets/${id}/`, data)
  },
  delete: (id) => api.delete(`snippets/${id}/`),
  toggleLike: async (snippetId) => {
    try {
      console.log('Sending toggle like request for snippet:', snippetId)
      const response = await api.post(`snippets/${snippetId}/like/`)
      console.log('Toggle like response:', response.data)
      
      // Make sure we're returning the correct data structure
      return {
        is_liked: response.data.is_liked,
        likes_count: response.data.likes_count
      }
    } catch (error) {
      console.error('Toggle like error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      throw error
    }
  },
}

// Collections endpoints
export const collections = {
  getAll: () => {
    return api.get('collections/').then(response => {
      console.log('Collections response:', response.data)
      return response
    })
  },
  get: (id) => api.get(`collections/${id}/`),
  create: (data) => api.post('collections/', data),
  update: (id, data) => api.put(`collections/${id}/`, data),
  delete: (id) => api.delete(`collections/${id}/`),
  addSnippet: (collectionId, snippetId) => 
    api.post(`collections/${collectionId}/add_snippet/`, { snippet_id: snippetId }),
  removeSnippet: (collectionId, snippetId) => 
    api.post(`collections/${collectionId}/remove_snippet/`, { snippet_id: snippetId }),
  share: (id) => api.post(`collections/${id}/share/`),
  getShared: (shareId) => api.get(`collections/shared/${shareId}/`),
}

export default api 