import api from './api'
import type { AuthUser, LoginResponse } from '../types/auth'

export const authService = {
  async register(data: {
    email: string
    username: string
    password: string
  }) {
    const response = await api.post<AuthUser>('/auth/register', data)
    return response.data
  },

  async login(data: { email: string; password: string }) {
    const response = await api.post<LoginResponse>('/auth/login', data)
    return response.data
  },

  async getMe() {
    const response = await api.get<AuthUser>('/auth/me')
    return response.data
  },
}