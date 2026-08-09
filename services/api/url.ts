import { api } from "@/services/apiBuilder"

// ============================================================================
// API METHODS
// ============================================================================

export const urlApi = {
    create: (originalUrl: string, expiresAt?: string) =>
        api.post('/url', { originalUrl, expiresAt }),

    getMyUrls: () =>
        api.get('/url'),

    getById: (id: string) =>
        api.get(`/url/${id}`),

    delete: (id: string) =>
        api.delete(`/url/${id}`),

    admin: {
        getAll: () =>
            api.get('/url/admin/all'),

        getUserUrls: (targetUserEmail: string) =>
            api.get(`/url/admin/user/${targetUserEmail}`),
    },
}