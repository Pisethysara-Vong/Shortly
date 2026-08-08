export interface User {
  id: string
  email: string
  username: string
  role: "ADMIN" | "USER"
  profileImage?: string | null
  createdAt?: string // ISO date string over the wire
}

export interface UrlResponse {
  id: string
  shortCode: string
  originalUrl: string
  clickCount: number
  createdAt: string   // ISO date string over the wire
  expiresAt: string | null
}

// Shape of NestJS's default HttpException body — useful for typing catch blocks
export interface ApiErrorResponse {
  statusCode: number
  message: string | string[]
  error: string
}