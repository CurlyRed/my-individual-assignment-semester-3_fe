import axios from 'axios';
import TokenManager from './TokenManager';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const WalletService = {
    topUp: async (request) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/wallet/topup`, 
                request, 
                {
                    headers: {
                        Authorization: `Bearer ${TokenManager.getAccessToken()}`
                    }
                }
            );
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

    purchasePromotion: async (request) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/wallet/purchasepromotion`, 
                request,
                {
                    headers: {
                        Authorization: `Bearer ${TokenManager.getAccessToken()}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.message || 'An error occurred during the promotion purchase process');
            } else if (error.request) {
                throw new Error('Server is not accessible');
            } else {
                throw new Error('Request error: ' + error.message);
            }
        }
    }
};

export default WalletService;
