import axios from 'axios';
import TokenManager from './TokenManager';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const AuthenticationService = {
    login: async (userData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/users/auth/login`, userData);
            console.log(response)
            return response.data.accessToken;
        } catch (error) {
            if (error.response) {
              throw error;
            } else if (error.request) {
                throw new Error('Server is not accessible');
            } else {
                throw new Error('Request error' + error.message);
            }
        }
    },

    logout: async() => {
        try {
            TokenManager.clear();
        } catch (error){
            console.log('error logging out: ', error);
        }
    }
}

export default AuthenticationService;