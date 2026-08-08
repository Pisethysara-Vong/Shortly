
import { api } from "@/services/apiBuilder"

// ============================================================================
// API METHODS
// ============================================================================

export const accountApi = {
    register: (email: string, password: string, username: string) =>
        api.post('/account/register', { email, password, username }),

    login: (email: string, password: string) =>
        api.post('/account/login', { email, password }),

    googleAuth: (idToken: string) =>
        api.post('/account/google', { idToken }),

    refresh: () =>
        api.post('/account/refresh'),

    logout: () =>
        api.post('/account/logout'),

    me: () =>
        api.get('/account/me'),
}