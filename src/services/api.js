import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
console.log('API_BASE_URL:', API_BASE_URL)

// Create a separate axios instance for refresh token requests
const refreshApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
})

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false
})

// Add a request interceptor to handle public routes
api.interceptors.request.use(
  (config) => {
    // Allow public routes without authentication
    if (config.url.startsWith('/snippets') && config.method === 'get') {
      return config
    }
    const token = localStorage.getItem('access_token')
    console.log('Making request to:', config.url)
    console.log('Auth token present:', !!token)
    console.log('Full request config:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    })
    
    // Add token if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Modify the response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 && 
      !originalRequest._retry &&
      !originalRequest.url.includes('auth/token/refresh/')
    ) {
      originalRequest._retry = true
      
      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const response = await auth.refreshToken()
        
        if (response.data.access) {
          localStorage.setItem('access_token', response.data.access)
          api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`
          return api(originalRequest)
        }
      } catch (refreshError) {
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
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }
    
    // Use the separate axios instance that doesn't have the interceptors
    return refreshApi.post('auth/token/refresh/', { 
      refresh: refreshToken 
    })
  },
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
  getAll: async (params) => {
    try {
      console.log('Fetching snippets with params:', params)
      const response = await api.get('snippets/', { 
        params,
        headers: {
          // Don't send Authorization header for public routes
          ...(params.is_public && { Authorization: undefined })
        }
      })
      return response
    } catch (error) {
      console.error('Error fetching snippets:', error)
      throw error
    }
  },
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
      console.log('Sending like request for snippet:', snippetId)
      const response = await api.post(`snippets/${snippetId}/like/`)
      console.log('Like response:', response.data)
      
      // Handle different possible response formats
      const data = response.data
      return {
        is_liked: data.data?.is_liked || data.is_liked,
        likes_count: data.data?.likes_count || data.likes_count
      }
    } catch (error) {
      console.error('Like error:', {
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