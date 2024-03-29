import axios from 'axios';

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
      const response = await axios.post(`${API_BASE_URL}/categories`, categoryData);
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

  updateCategory: async (categoryId, categoryData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/categories/${categoryId}`, categoryData);
      return response.data;
    } catch (error) {
      throw new Error('Error updating category:', error);
    }
  },

  deleteCategory: async (categoryId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      throw new Error('Error deleting category:', error);
    }
  }
};

export default CategoryService;
