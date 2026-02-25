const BASE_URL = 'http://localhost:5000/api';

/**
 * Enhanced fetch wrapper for ClientPilot API
 */
async function request(endpoint, options = {}) {
    const token = localStorage.getItem('access_token');

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);

        // Handle 401 Unauthorized globally
        if (response.status === 401) {
            localStorage.removeItem('access_token');
            window.location.href = '/login';
            throw new Error('Unauthorized - Redirecting to login');
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.error || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

export const api = {
    // Auth
    login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    signup: (data) => request('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),

    // Clients
    getClients: () => request('/clients'),
    getClient: (id) => request(`/clients/${id}`),
    createClient: (data) => request('/clients', { method: 'POST', body: JSON.stringify(data) }),
    updateClient: (id, data) => request(`/clients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteClient: (id) => request(`/clients/${id}`, { method: 'DELETE' }),

    // Projects (nested under client)
    getClientProjects: (clientId) => request(`/clients/${clientId}/projects`),
    getProjects: () => request('/projects'),
    getProject: (id) => request(`/projects/${id}`),
    createProject: (data) => request('/projects', { method: 'POST', body: JSON.stringify(data) }),
    updateProject: (id, data) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteProject: (id) => request(`/projects/${id}`, { method: 'DELETE' }),
    transitionProjectStatus: (id, status) => request(`/projects/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
    }),

    // Deliverables (nested under project)
    getProjectDeliverables: (projectId) => request(`/projects/${projectId}/deliverables`),
    createDeliverable: (projectId, data) => request(`/projects/${projectId}/deliverables`, { method: 'POST', body: JSON.stringify(data) }),
    updateDeliverableStatus: (id, status) => request(`/deliverables/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
    }),
    deleteDeliverable: (id) => request(`/deliverables/${id}`, { method: 'DELETE' }),

    // Dashboard
    getDashboardStats: () => request('/dashboard'),
};
