import axios from 'axios';
import TokenManager from './TokenManager';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const CategoryService = {
    
  getAllCategories: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching categories:', error);
    }
  },

  createCategory: async (categoryData) => {
    try {
      const response = await axios.post(
            `${API_BASE_URL}/categories`, 
            categoryData,
          {
            headers: {
              Authorization: `Bearer ${TokenManager.getToken()}`
            }
          });
      return response.data;
    } catch (error) {
      throw new Error('Error creating category:', error);
    }
  },

  getCategory: async (categoryId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      throw new Error('Error getting category:', error);
    }
  },

  deleteCategory: async (categoryId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/categories/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${TokenManager.getToken()}`
          }
        });
      return response.data;
    } catch (error) {
      throw new Error('Error deleting category:', error);
    }
  }
};

export default CategoryService;