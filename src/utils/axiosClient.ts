import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/';

async function sentRegistrateData(data: {
  email: string,
  password: string
}) {

  try {
    const response = await axios.post(`${BASE_URL}api/users/register/`, data, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log('Response from server:', response.data);
    return response.data
  } catch (error) {
    console.error('Error sending data:', error);
  }
}

export default sentRegistrateData;