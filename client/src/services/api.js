import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (window.location.origin.includes('localhost') ? 'http://localhost:5000/api' : '/api')
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const apiService = {
  // Products
  getProducts: () => api.get('/products').then(res => res.data),
  getProductsByCategory: (category) => api.get(`/products/category/${category}`).then(res => res.data),
  getProductById: (id) => api.get(`/products/${id}`).then(res => res.data),
  createProduct: (product) => api.post('/products', product).then(res => res.data),
  updateProduct: (id, product) => api.put(`/products/${id}`, product).then(res => res.data),
  deleteProduct: (id) => api.delete(`/products/${id}`).then(res => res.data),

  // Users / Auth
  login: (credentials) => api.post('/auth/login', credentials).then(res => res.data),
  register: (userData) => api.post('/auth/register', userData).then(res => res.data),
  getUserById: (id) => api.get(`/auth/${id}`).then(res => res.data),
  updateUser: (id, data) => api.put(`/auth/${id}`, data).then(res => res.data),
  getUsers: () => api.get('/auth').then(res => res.data),
  deleteUser: (id) => api.delete(`/auth/${id}`).then(res => res.data),

  // Wishlist
  getWishlist: (userId) => api.get(`/wishlist/${userId}`).then(res => res.data),
  addToWishlist: (userId, productId) => api.post('/wishlist', { userId, productId }).then(res => res.data),
  removeFromWishlist: (userId, productId) => api.delete('/wishlist', { data: { userId, productId } }).then(res => res.data),

  // Categories
  getCategories: () => api.get('/categories').then(res => res.data),
  createCategory: (category) => api.post('/categories', category).then(res => res.data),
  updateCategory: (id, category) => api.put(`/categories/${id}`, category).then(res => res.data),
  deleteCategory: (id) => api.delete(`/categories/${id}`).then(res => res.data),

  // Taxes
  getTaxes: () => api.get('/taxes').then(res => res.data),
  createTax: (tax) => api.post('/taxes', tax).then(res => res.data),
  updateTax: (id, tax) => api.put(`/taxes/${id}`, tax).then(res => res.data),
  deleteTax: (id) => api.delete(`/taxes/${id}`).then(res => res.data),

  // Orders
  createOrder: (orderData) => api.post('/orders', orderData).then(res => res.data),
  getOrders: (userId) => api.get(`/orders/user/${userId}`).then(res => res.data),
  getAllOrders: () => api.get('/orders').then(res => res.data),
  updateOrderStatus: (orderId, status) => api.put(`/orders/${orderId}/status`, { orderStatus: status }).then(res => res.data),
  cancelOrder: (orderId) => api.put(`/orders/${orderId}/cancel`, {}).then(res => res.data)
};

export default api;
