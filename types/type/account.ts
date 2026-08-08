// ============================================================================
// r1-account RESPONSES
// ============================================================================

import { User } from "../shared"

// register, login, googleAuth all return this
export interface AuthResponse {
    message: string
    user?: User
    accessToken?: string
}

// refresh
export interface RefreshResponse {
    message: string
    accessToken: string
}

// logout
export interface LogoutResponse {
    message: string
}

// me
// -> UserResponse (returned directly, no wrapper)