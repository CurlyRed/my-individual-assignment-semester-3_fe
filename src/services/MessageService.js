import axios from 'axios';
import TokenManager from './TokenManager';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const MessageService = {

    getMessages: async (chatId) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/messages/${chatId}`,
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
}