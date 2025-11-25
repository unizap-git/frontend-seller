import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost';

const api = {
  // User Service
  userService: {
    register: (data) => axios.post(`${API_BASE_URL}:8081/api/users/register`, data),
    login: (data) => axios.post(`${API_BASE_URL}:8081/api/users/login`, data),
  },

  // Store Service
  storeService: {
    createStore: (data) => axios.post(`${API_BASE_URL}:8082/api/stores`, data),
    getStoresBySeller: (sellerId) => axios.get(`${API_BASE_URL}:8082/api/stores/seller/${sellerId}`),
    updateStore: (id, data) => axios.put(`${API_BASE_URL}:8082/api/stores/${id}`, data),
    deleteStore: (id) => axios.delete(`${API_BASE_URL}:8082/api/stores/${id}`),
  },

  // Product Service
  productService: {
    createProduct: (data) => axios.post(`${API_BASE_URL}:8083/api/products`, data),
    getProductsByStore: (storeId) => axios.get(`${API_BASE_URL}:8083/api/products/store/${storeId}`),
    updateProduct: (id, data) => axios.put(`${API_BASE_URL}:8083/api/products/${id}`, data),
    deleteProduct: (id) => axios.delete(`${API_BASE_URL}:8083/api/products/${id}`),
  },

  // Order Service
  orderService: {
    getOrdersByStore: (storeId) => axios.get(`${API_BASE_URL}:8085/api/orders/store/${storeId}`),
    updateOrderStatus: (id, status) => axios.patch(`${API_BASE_URL}:8085/api/orders/${id}/status?status=${status}`),
  },
};

export default api;
