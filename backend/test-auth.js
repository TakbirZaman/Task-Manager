const axios = require('axios');

const client = axios.create({
  baseURL: 'http://localhost:5000/api'
});

client.interceptors.request.use((config) => {
  const token = localStorage?.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function test() {
  try {
    const res = await client.post('/auth/register', {
      name: 'Test',
      email: 'test4@example.com',
      password: 'password123'
    });
    console.log('Success:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.log('Error Status:', err.response?.status);
    console.log('Error Data:', JSON.stringify(err.response?.data, null, 2));
    console.log('Error Message:', err.message);
  }
}

test();
