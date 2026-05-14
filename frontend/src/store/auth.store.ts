import { create } from 'zustand'
import type { AuthUser } from '../types/auth'

interface AuthState {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  setAuth: (token: string, user: AuthUser) => void
  setUser: (user: AuthUser | null) => void
  logout: () => void
}

const getStoredToken = () => localStorage.getItem('minitok_token')
const getStoredUser = () => {
  const raw = localStorage.getItem('minitok_user')
  return raw ? (JSON.parse(raw) as AuthUser) : null
}

export const useAuthStore = create<AuthState>((set) => ({
  token: getStoredToken(),
  user: getStoredUser(),
  isAuthenticated: !!getStoredToken(),

  setAuth: (token, user) => {
    localStorage.setItem('minitok_token', token)
    localStorage.setItem('minitok_user', JSON.stringify(user))

    set({
      token,
      user,
      isAuthenticated: true,
    })
  },

  setUser: (user) => {
    if (user) {
      localStorage.setItem('minitok_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('minitok_user')
    }

    set({ user })
  },

  logout: () => {
    localStorage.removeItem('minitok_token')
    localStorage.removeItem('minitok_user')

    set({
      token: null,
      user: null,
      isAuthenticated: false,
    })
  },
}))