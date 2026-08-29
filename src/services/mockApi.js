// Mock data for static demo
export const mockProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 149.99,
    category: "Electronics",
    description: "High-quality wireless headphones",
    image_urls: ["https://placehold.co/400x400/2ea32e/white?text=Headphones"],
    average_rating: 4.5,
    total_reviews: 120,
    stock_quantity: 50,
    min_order_quantity: 1,
    is_featured: true
  },
  // Add more mock products...
];

export const mockCategories = ["Electronics", "Fashion", "Home & Living"];

// Mock functions
export const getProducts = () => Promise.resolve({ products: mockProducts });
export const getCategories = () => Promise.resolve({ categories: mockCategories });
