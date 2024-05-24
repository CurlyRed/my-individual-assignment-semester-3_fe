import axios from 'axios';
import TokenManager from './TokenManager';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const TransactionService = {
    getAllTransaction : async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/transactions`,
                {
                    headers: {
                        Authorization: `Bearer ${TokenManager.getAccessToken()}`
                    }
                }
            )
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.message || 'An error occurred during the top-up process');
            } else if (error.request) {
                throw new Error('Server is not accessible');
            } else {
                throw new Error('Request error: ' + error.message);
            }
        }
    },

    getTransactionsForUser: async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/transactions/user/${TokenManager.getUserId()}`,
                {
                    headers: {
                        Authorization: `Bearer ${TokenManager.getAccessToken()}`
                    }
                }
            )
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.message || 'An error occurred during the top-up process');
            } else if (error.request) {
                throw new Error('Server is not accessible');
            } else {
                throw new Error('Request error: ' + error.message);
            }
        }
    }
}

export default TransactionService;