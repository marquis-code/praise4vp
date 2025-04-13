import { ref, readonly } from 'vue'

interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}

export function useAuth() {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // In a real app, this would make an API call
  const login = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock successful login
      if (email === 'admin@comiles.com' && password === 'password') {
        user.value = {
          id: '1',
          name: 'Admin User',
          email: 'admin@comiles.com',
          role: 'admin',
          avatar: '/avatar.png'
        }
        isAuthenticated.value = true
        
        // Store auth token in localStorage or cookie
        localStorage.setItem('auth_token', 'mock_jwt_token')
        return user.value
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (e) {
      if (e instanceof Error) {
        error.value = e.message
      } else {
        error.value = 'An unknown error occurred'
      }
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      user.value = null
      isAuthenticated.value = false
      localStorage.removeItem('auth_token')
    } catch (e) {
      if (e instanceof Error) {
        error.value = e.message
      } else {
        error.value = 'An unknown error occurred'
      }
    } finally {
      isLoading.value = false
    }
  }

  const checkAuth = async () => {
    isLoading.value = true
    
    try {
      const token = localStorage.getItem('auth_token')
      
      if (token) {
        // In a real app, validate the token with the server
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Mock user data
        user.value = {
          id: '1',
          name: 'Admin User',
          email: 'admin@comiles.com',
          role: 'admin',
          avatar: '/avatar.png'
        }
        isAuthenticated.value = true
      }
    } catch (e) {
      if (e instanceof Error) {
        error.value = e.message
      } else {
        error.value = 'An unknown error occurred'
      }
      // Clear invalid auth state
      user.value = null
      isAuthenticated.value = false
      localStorage.removeItem('auth_token')
    } finally {
      isLoading.value = false
    }
  }

  return {
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    isLoading: readonly(isLoading),
    error: readonly(error),
    login,
    logout,
    checkAuth
  }
}