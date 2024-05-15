import axios from 'axios';
import TokenManager from '../services/TokenManager.js';

const API_BASE_URL = import.meta.env.VITE_API_URL;
const token = TokenManager.getToken();
const userId = TokenManager.getUserId();

const ProductService = {

  createProduct: async (productData) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/products`,
            productData,
            {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            }
        );
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
  },

  getProductsForUser: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/products/user/${userId}`,
        {
            headers: {
                Authorization: `Bearer ${token}` 
            }
        }
      );
      return response.data;
    } catch (error) {
      if (error.response){
        if (error.response.status === 401) {
          throw new Error("Unauthorized access")
        } else if (error.response.status === 403) {
          throw new Error("Forbidden access")
        } else {
          throw new Error("Internal server error")
        }
      } else if (error.request) {
          throw new Error("Server is not accessible or response was not recieved")
      } else {
        throw new Error("Request error:" + error.message)
      }
    }
  },

  getProductsByCategory: async (categoryId) => {
    try {
      const response =  await axios.get(`${API_BASE_URL}/products/category/${categoryId}`);
      return response.data;
    } catch (error) {
        throw new Error('Error etting products:', error);
    }
  }
};

export default ProductService;
