const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const USE_MOCK = true; // Set to false when backend is available

// Mock data
const mockProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 149.99,
    category: "Electronics",
    description: "High-quality wireless headphones with noise cancellation",
    image_urls: ["https://placehold.co/400x400/2ea32e/white?text=Headphones"],
    average_rating: 4.5,
    total_reviews: 120,
    stock_quantity: 50,
    min_order_quantity: 1,
    is_featured: true
  },
  {
    id: 2,
    name: "Ergonomic Office Chair",
    price: 299.99,
    category: "Furniture",
    description: "Premium ergonomic office chair with lumbar support",
    image_urls: ["https://placehold.co/400x400/2ea32e/white?text=Chair"],
    average_rating: 4.8,
    total_reviews: 85,
    stock_quantity: 25,
    min_order_quantity: 1,
    is_featured: true
  },
  {
    id: 3,
    name: "Smart LED Light Bulbs (4-Pack)",
    price: 39.99,
    category: "Smart Home",
    description: "WiFi-enabled smart LED bulbs with color control",
    image_urls: ["https://placehold.co/400x400/2ea32e/white?text=Bulbs"],
    average_rating: 4.2,
    total_reviews: 200,
    stock_quantity: 100,
    min_order_quantity: 1,
    is_featured: false
  },
  {
    id: 4,
    name: "Stainless Steel Water Bottle",
    price: 29.99,
    category: "Home & Kitchen",
    description: "Double-walled vacuum insulated water bottle",
    image_urls: ["https://placehold.co/400x400/2ea32e/white?text=Bottle"],
    average_rating: 4.6,
    total_reviews: 150,
    stock_quantity: 200,
    min_order_quantity: 2,
    is_featured: false
  }
];

const mockCategories = ["Electronics", "Furniture", "Smart Home", "Home & Kitchen"];

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.token = localStorage.getItem('access_token');
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
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    async request(endpoint, options = {}) {
        if (USE_MOCK) {
            // Return mock data
            return this.mockRequest(endpoint, options);
        }

        const url = `${this.baseURL}${endpoint}`;
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
            // Fallback to mock data on error
            return this.mockRequest(endpoint, options);
        }
    }

    async mockRequest(endpoint, options = {}) {
        // Mock responses
        if (endpoint.includes('/products') && !endpoint.includes('categories')) {
            // Get products with optional category filter
            const urlParams = new URLSearchParams(endpoint.split('?')[1] || '');
            const category = urlParams.get('category');
            let products = mockProducts;
            if (category) {
                products = products.filter(p => p.category === category);
            }
            return { products };
        }
        if (endpoint.includes('/categories')) {
            return { categories: mockCategories };
        }
        if (endpoint.includes('/auth/me')) {
            if (this.token) {
                return { user: { 
                    id: 1, 
                    email: 'admin@harykims.com', 
                    first_name: 'Admin', 
                    last_name: 'Harykims',
                    is_admin: true,
                    company_name: 'Harykims Intertech'
                }};
            }
            throw new Error('Unauthorized');
        }
        if (endpoint.includes('/auth/login')) {
            const data = JSON.parse(options.body);
            if (data.email && data.password) {
                this.setToken('mock-token');
                return { 
                    user: { id: 1, email: data.email, first_name: 'Admin', last_name: 'Harykims' },
                    access_token: 'mock-token'
                };
            }
            throw new Error('Invalid credentials');
        }
        return {};
    }

    // All existing methods...
    async getProducts(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.request(`/products${query ? '?' + query : ''}`);
    }

    async getCategories() {
        return this.request('/products/categories');
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

    // ... (keep other methods from your original api.js)
}

export const apiService = new ApiService();
export default apiService;
