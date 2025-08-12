import { User } from "../contexts/AuthContext"

const API_BASE_URL = import.meta.env.VITE_BACK_END_URL
if(!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_BACK_END_URL is not defined')
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  username: string
  email: string
  password: string
}

export interface ApiResponse<T> {
  message?: string
  error?: string
  user?: T
}



// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultOptions: RequestInit = {
    credentials: 'include', // Important for sessions/cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, defaultOptions)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error('API call failed:', error)
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}

// Auth API functions
export const authApi = {
  // Login with email and password
  login: async (credentials: LoginCredentials): Promise<ApiResponse<User>> => {
    return apiCall<User>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    } )
  },

  // Register new user
  register: async (credentials: RegisterCredentials): Promise<ApiResponse<User>> => {
    return apiCall<User>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  },

  // Logout
  logout: async (): Promise<ApiResponse<null>> => {
    return apiCall<null>('/api/auth/logout', {
      method: 'POST',
    })
  },

  // Check current session
  checkSession: async (): Promise<{ isAuthenticated: boolean; user?: User; message?: string; error?: string }> => {
    return apiCall<User>('/api/auth/check-session') as Promise<{ isAuthenticated: boolean; user?: User; message?: string; error?: string }>
  },

  // Reset password
  resetPassword: async (userId: string): Promise<ApiResponse<null>> => {
    return apiCall<null>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    })
  },

  // OAuth URLs (with credentials support)
  getGoogleAuthUrl: (): string => `${API_BASE_URL}/api/auth/google`,
  getFacebookAuthUrl: (): string => `${API_BASE_URL}/api/auth/facebook`,
}
