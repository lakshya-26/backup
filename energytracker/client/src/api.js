import axios from 'axios';

const API_URL = 'http://localhost:5000/api/energy';

export const fetchEnergyData = () => axios.get(API_URL);
export const uploadEnergyData = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading energy data:', error);
        throw error;
    }
};

export const getEnergyData = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching energy data:', error);
        throw error;
    }
};