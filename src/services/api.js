const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.token = localStorage.getItem('access_token');
        this.cacheBuster = Date.now();
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('access_token', token);
        } else {
            localStorage.removeItem('access_token');
        }
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    getCacheBuster() {
        return `_t=${Date.now()}`;
    }

    async request(endpoint, options = {}) {
        let url = `${this.baseURL}${endpoint}`;
        if (options.method === 'GET' || !options.method) {
            const separator = url.includes('?') ? '&' : '?';
            url = `${url}${separator}${this.getCacheBuster()}`;
        }
        
        const config = {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    this.setToken(null);
                    if (!window.location.pathname.includes('/login')) {
                        window.location.href = '/login';
                    }
                }
                throw new Error(data.error || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth
    async register(data) {
        const response = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        if (response.access_token) {
            this.setToken(response.access_token);
        }
        return response;
    }

    async login(data) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        if (response.access_token) {
            this.setToken(response.access_token);
        }
        return response;
    }

    async getCurrentUser() {
        return this.request('/auth/me');
    }

    async updateProfile(data) {
        return this.request('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    // Products
    async getProducts(params = {}) {
        const cleanParams = {};
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined && value !== null && value !== '' && value !== 'undefined') {
                cleanParams[key] = value;
            }
        }
        const query = new URLSearchParams(cleanParams).toString();
        const endpoint = `/products${query ? '?' + query : ''}`;
        return this.request(endpoint);
    }

    async getProduct(id) {
        return this.request(`/products/${id}`);
    }

    async createProduct(data) {
        const response = await this.request('/products', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        this.cacheBuster = Date.now();
        return response;
    }

    async updateProduct(id, data) {
        const response = await this.request(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        this.cacheBuster = Date.now();
        return response;
    }

    async deleteProduct(id) {
        const response = await this.request(`/products/${id}`, {
            method: 'DELETE',
        });
        this.cacheBuster = Date.now();
        return response;
    }

    async getCategories() {
        return this.request('/products/categories');
    }

    // Orders
    async createOrder(data) {
        return this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getOrders() {
        return this.request('/orders');
    }

    async getOrder(id) {
        return this.request(`/orders/${id}`);
    }

    async updateOrderStatus(id, status) {
        return this.request(`/orders/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    }

    // Reviews
    async getProductReviews(productId) {
        return this.request(`/reviews/product/${productId}`);
    }

    async createReview(data) {
        return this.request('/reviews', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async deleteReview(id) {
        return this.request(`/reviews/${id}`, {
            method: 'DELETE',
        });
    }

    async getAllReviews() {
        return this.request('/reviews/all');
    }

    // Inquiries
    async createInquiry(data) {
        return this.request('/inquiries', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getUserInquiries() {
        return this.request('/inquiries/user');
    }

    async getAllInquiries() {
        return this.request('/inquiries/all');
    }

    async replyToInquiry(id, reply) {
        return this.request(`/inquiries/${id}/reply`, {
            method: 'POST',
            body: JSON.stringify({ reply }),
        });
    }

    // Wishlist
    async getWishlist() {
        return this.request('/wishlist');
    }

    async addToWishlist(productId) {
        return this.request(`/wishlist/${productId}`, {
            method: 'POST',
        });
    }

    async removeFromWishlist(productId) {
        return this.request(`/wishlist/${productId}`, {
            method: 'DELETE',
        });
    }
}

export const apiService = new ApiService();
export default apiService;
