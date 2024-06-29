import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/energy';

// Helper function to get the token from local storage
const getAuthToken = () => localStorage.getItem('token');

export const fetchEnergyData = async () => {
  try {
    const response = await axios.get(`${API_URL}/getEnergyData`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching energy data:', error);
    throw error;
  }
};

export const uploadEnergyData = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/logEnergyData`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading energy data:', error);
    throw error;
  }
};

export const createEnergyData = async (data) => {
  try {
    const response = await axios.post(API_URL, data, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating energy data:', error);
    throw error;
  }
};
