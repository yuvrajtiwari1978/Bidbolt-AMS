import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

async function testAuth() {
  try {
    console.log('🧪 Testing authentication system...\n');

    // Test 1: Health check
    console.log('1. Testing health check...');
    try {
      const healthResponse = await axios.get(`${API_BASE}/health`);
      console.log('✅ Health check successful:', healthResponse.data.message);
      console.log('   Database status:', healthResponse.data.database.status);
    } catch (healthError) {
      console.log('❌ Health check failed - server may not be running');
      console.log('   Error:', healthError.message);
      return;
    }

    // Test 2: Registration with unique credentials
    console.log('\n2. Testing registration...');
    const timestamp = Date.now();
    const testUser = {
      username: `testuser${timestamp}`,
      email: `test${timestamp}@example.com`,
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    };

    try {
      const registerResponse = await axios.post(`${API_BASE}/auth/register`, testUser, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      
      console.log('✅ Registration successful:', registerResponse.data.message);
      console.log('   User:', registerResponse.data.data.user.email);
      
      // Test 3: Login with registered credentials
      console.log('\n3. Testing login...');
      const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      
      console.log('✅ Login successful:', loginResponse.data.message);
      console.log('   Token received:', loginResponse.data.data.token ? 'Yes' : 'No');
      
      // Test 4: Get current user with token
      console.log('\n4. Testing current user endpoint...');
      const token = loginResponse.data.data.token;
      const userResponse = await axios.get(`${API_BASE}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        timeout: 10000
      });
      
      console.log('✅ Current user endpoint successful:', userResponse.data.message);
      console.log('   User email:', userResponse.data.data.email);

      console.log('\n🎉 All authentication tests passed successfully!');
      
    } catch (error) {
      if (error.response) {
        console.log('❌ API Error:');
        console.log('   Status:', error.response.status);
        console.log('   Message:', error.response.data.message);
        console.log('   Error:', error.response.data.error);
        
        if (error.response.status === 409) {
          console.log('   💡 This is a duplicate user error - trying with different credentials...');
          // Retry with different credentials
          await testAuth();
        }
      } else if (error.request) {
        console.log('❌ Network Error: No response received from server');
        console.log('   Error:', error.message);
      } else {
        console.log('❌ Unexpected Error:', error.message);
      }
    }

  } catch (error) {
    console.log('❌ Test suite failed:', error.message);
  }
}

// Test validation errors
async function testValidation() {
  console.log('\n🧪 Testing validation errors...\n');

  // Test invalid email
  console.log('1. Testing invalid email validation...');
  try {
    await axios.post(`${API_BASE}/auth/register`, {
      username: 'testuser',
      email: 'invalid-email',
      password: 'pass',
      firstName: 'Test',
      lastName: 'User'
    });
  } catch (error) {
    if (error.response?.status === 400) {
      console.log('✅ Validation working - invalid email rejected');
    }
  }

  // Test short password
  console.log('\n2. Testing short password validation...');
  try {
    await axios.post(`${API_BASE}/auth/register`, {
      username: 'testuser',
      email: 'test@example.com',
      password: 'pass',
      firstName: 'Test',
      lastName: 'User'
    });
  } catch (error) {
    if (error.response?.status === 400) {
      console.log('✅ Validation working - short password rejected');
    }
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting authentication system tests...\n');
  
  await testAuth();
  await testValidation();
  
  console.log('\n📋 Test suite completed!');
}

runTests().catch(console.error);
