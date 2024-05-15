import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const LocationService = {

    getAllLocations: async () => {
        try {
        const response = await axios.get(`${API_BASE_URL}/locations`);
        return response.data;
        } catch (error) {
        throw new Error('Error fetching locations:', error);
        }
    },

    getLocationForProduct: async (productId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/locations/product/${productId}`)
            return response.data
        } catch (error) {
            throw new Error('Error fetching location for product', error);
        }
    }
}

export default LocationService;