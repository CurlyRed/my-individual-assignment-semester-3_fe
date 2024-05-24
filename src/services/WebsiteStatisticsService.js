import axios from 'axios';
import TokenManager from './TokenManager';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const WebsiteStatisticsService = {
    getTotalProducts: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/statistics/total-products`, {
                headers: {
                    Authorization: `Bearer ${TokenManager.getAccessToken()}`
                }
            });
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    getPromotedProducts: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/statistics/promoted-products`, {
                headers: {
                    Authorization: `Bearer ${TokenManager.getAccessToken()}`
                }
            });
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    getTotalUsers: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/statistics/total-users`, {
                headers: {
                    Authorization: `Bearer ${TokenManager.getAccessToken()}`
                }
            });
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    getNewUsers: async (startDate, endDate) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/statistics/new-users`, {
                headers: {
                    Authorization: `Bearer ${TokenManager.getAccessToken()}`
                },
                params: { startDate, endDate }
            });
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    getActiveUsers: async (startDate, endDate) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/statistics/active-users`, {
                headers: {
                    Authorization: `Bearer ${TokenManager.getAccessToken()}`
                },
                params: { startDate, endDate }
            });
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    getUserDemographicsByAge: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/statistics/user-demographics/age`, {
                headers: {
                    Authorization: `Bearer ${TokenManager.getAccessToken()}`
                }
            });
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    getUserDemographicsByGender: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/statistics/user-demographics/gender`, {
                headers: {
                    Authorization: `Bearer ${TokenManager.getAccessToken()}`
                }
            });
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    getUserDemographicsByLocation: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/statistics/user-demographics/location`, {
                headers: {
                    Authorization: `Bearer ${TokenManager.getAccessToken()}`
                }
            });
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    getTotalSales: async (startDate, endDate) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/statistics/total-sales`, {
                headers: {
                    Authorization: `Bearer ${TokenManager.getAccessToken()}`
                },
                params: { startDate, endDate }
            });
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    getAverageOrderValue: async (startDate, endDate) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/statistics/average-order-value`, {
                headers: {
                    Authorization: `Bearer ${TokenManager.getAccessToken()}`
                },
                params: { startDate, endDate }
            });
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    getSalesByCategory: async (startDate, endDate) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/statistics/sales-by-category`, {
                headers: {
                    Authorization: `Bearer ${TokenManager.getAccessToken()}`
                },
                params: { startDate, endDate }
            });
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    getMonthlyRevenue: async (startDate, endDate) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/statistics/monthly-revenue`, {
                headers: {
                    Authorization: `Bearer ${TokenManager.getAccessToken()}`
                },
                params: { startDate, endDate }
            });
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    getTransactionsByType: async (startDate, endDate) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/statistics/transactions-by-type`, {
                headers: {
                    Authorization: `Bearer ${TokenManager.getAccessToken()}`
                },
                params: { startDate, endDate }
            });
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    getProductListingsByCategory: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/statistics/product-listings-by-category`, {
                headers: {
                    Authorization: `Bearer ${TokenManager.getAccessToken()}`
                }
            });
            return response.data;
        } catch (error) {
            handleError(error);
        }
    }
};

const handleError = (error) => {
    if (error.response) {
        throw new Error(error.response.data.message || 'An error occurred');
    } else if (error.request) {
        throw new Error('Server is not accessible');
    } else {
        throw new Error('Request error: ' + error.message);
    }
};

export default WebsiteStatisticsService;