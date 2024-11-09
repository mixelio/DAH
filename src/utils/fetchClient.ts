import axios from 'axios';

const BASE_URL = 'http://localhost:5173/DAH';

async function sentRegistrateData(data: string) {
  try {
    const response = await axios.post(`${BASE_URL}api/users/register/`, data);
    console.log('Response from server:', response.data);
  } catch (error) {
    console.error('Error sending data:', error);
  }
}

export default sentRegistrateData;