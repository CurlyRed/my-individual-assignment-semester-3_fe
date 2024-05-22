import axios from 'axios';
import TokenManager from './TokenManager';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const UserService = {
  createUser: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users`, userData);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error;
      } else if (error.request) {
          throw new Error('Server is not accessible');
      } else {
          throw new Error('Request error');
      }
    }
  },

  getUser: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${TokenManager.getAccessToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('Error getting user:', error);
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw new Error('Error updating user:', error);
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error('Error deleting user:', error);
    }
  },

  getUserByProductId: async (productId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/product/${productId}`);
      return response.data;
    } catch (error){
      throw new Error('Error fetching user:', error);
    }
  }
};

export default UserService;
