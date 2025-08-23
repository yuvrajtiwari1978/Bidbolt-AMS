import axios from 'axios';

async function testAPI() {
  try {
    console.log('Testing API endpoints...');
    
    // Test health endpoint
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Health check:', healthResponse.status, healthResponse.data.message);
    console.log('   Database:', healthResponse.data.database.status);
    
    // Test registration
    console.log('\n2. Testing registration...');
    const timestamp = Date.now();
    const userData = {
      username: `testuser${timestamp}`,
      email: `test${timestamp}@example.com`,
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    };
    
    try {
      const registerResponse = await axios.post('http://localhost:5000/api/v1/auth/register', userData);
      console.log('✅ Registration successful:', registerResponse.data.message);
      console.log('   User ID:', registerResponse.data.data.user._id);
      
      // Test login
      console.log('\n3. Testing login...');
      const loginResponse = await axios.post('http://localhost:5000/api/v1/auth/login', {
        email: userData.email,
        password: userData.password
      });
      
      console.log('✅ Login successful:', loginResponse.data.message);
      console.log('   Token received:', loginResponse.data.data.token ? 'Yes' : 'No');
      
    } catch (error) {
      if (error.response) {
        console.log('❌ API Error:');
        console.log('   Status:', error.response.status);
        console.log('   Message:', error.response.data.message);
        console.log('   Error:', error.response.data.error);
      } else {
        console.log('❌ Network Error:', error.message);
      }
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testAPI();
