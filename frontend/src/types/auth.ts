export interface AuthUser {
  id: number
  email: string
  username: string
  avatar?: string | null
  bio?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface LoginResponse {
  accessToken: string
  user: AuthUser
}