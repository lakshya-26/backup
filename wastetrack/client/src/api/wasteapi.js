import axios from 'axios';

const API_URL = 'http://localhost:5000/api/waste';

export const submitWasteData = async (data) => {
    try {
        const response = await axios.post(`${API_URL}`, data);
        return response.data;
    } catch (error) {
        console.error('Error submitting waste data:', error);
        throw error;
    }
};
