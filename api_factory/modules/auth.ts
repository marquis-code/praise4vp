import { GATEWAY_ENDPOINT } from '../axios.config'
import { useUser } from '@/composables/auth/user'

// Corrected interface definitions
export interface CreateAdminInterface {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
}

export interface LoginInterface {
  email: string
  password: string
}

export const auth_api = {
  $_create_admin: (credential: CreateAdminInterface) => {
    const url = '/auth/create'
    return GATEWAY_ENDPOINT.post(url, credential)
  },
  $_admin_login: (credential: LoginInterface) => {
    const url = '/auth/login'
    return GATEWAY_ENDPOINT.post(url, credential)
  }
}
