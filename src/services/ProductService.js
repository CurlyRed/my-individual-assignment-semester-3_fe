import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const ProductService = {

    createProduct: async (productData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/products`, productData);
      return response.data;
    } catch (error) {
      throw new Error('Error creating product:', error);
    }
  },

  getProduct: async (productId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
      return response.data;
    } catch (error) {
      throw new Error('Error getting product:', error);
    }
  },

  updateProduct: async (productId, productData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      throw new Error('Error updating product:', error);
    }
  },

  deleteProduct: async (productId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/products/${productId}`);
      return response.data;
    } catch (error) {
      throw new Error('Error deleting product:', error);
    }
  },

  getProducts: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      return response.data;
    } catch (error) {
      throw new Error('Error getting products:', error);
    }
  }
};

export default ProductService;
