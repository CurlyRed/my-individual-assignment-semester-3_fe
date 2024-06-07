import axios from 'axios';
import TokenManager from './TokenManager';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const ChatService = {
    getChats: async (userId) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/chats`,
                userId,
                {
                    headers: {
                        Authorization: `Bearer ${TokenManager.getAccessToken()}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.message || 'Error happened');
            } else if (error.request) {
                throw new Error('Server is not accessible');
            } else {
                throw new Error('Request error: ' + error.message);
            }
        }
    },

    deleteChat: async (chatId) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/chats/${chatId}/delete`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${TokenManager.getAccessToken()}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.message || 'Error happened');
            } else if (error.request) {
                throw new Error('Server is not accessible');
            } else {
                throw new Error('Request error: ' + error.message);
            }
        }
    },

    recoverChat: async (chatId) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/chats/${chatId}/recover`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${TokenManager.getAccessToken()}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.message || 'Error happened');
            } else if (error.request) {
                throw new Error('Server is not accessible');
            } else {
                throw new Error('Request error: ' + error.message);
            }
        }
    }
};

export default ChatService;
