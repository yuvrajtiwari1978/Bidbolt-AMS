import axios from 'axios';

async function testAuth() {
  try {
    console.log('Testing registration...');
    
    // Test registration with unique credentials
    const timestamp = Date.now();
    const registerResponse = await axios.post('http://localhost:5000/api/v1/auth/register', {
      username: `testuser${timestamp}`,
      email: `test${timestamp}@example.com`,
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Registration successful:', registerResponse.data);
    
    // Test login
    console.log('Testing login...');
    const loginResponse = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: `test${timestamp}@example.com`,
      password: 'password123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Login successful:', loginResponse.data);
    
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testAuth();
