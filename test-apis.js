const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
let authToken = '';

async function testAPIs() {
    console.log('🚀 Testing Express MongoDB API...\n');

    try {
        // Test 1: Health Check
        console.log('1️⃣ Testing Health Check...');
        const healthResponse = await axios.get(`${BASE_URL}/health`);
        console.log('✅ Health Check:', healthResponse.data);
        console.log('');

        // Test 2: Register User
        console.log('2️⃣ Testing User Registration...');
        const registerData = {
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User',
            role: 'user'
        };

        const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, registerData);
        console.log('✅ Registration Response:', registerResponse.data);

        if (registerResponse.data.success && registerResponse.data.data.token) {
            authToken = registerResponse.data.data.token;
            console.log('🔑 Token received:', authToken.substring(0, 20) + '...');
        }
        console.log('');

        // Test 3: Login
        console.log('3️⃣ Testing User Login...');
        const loginData = {
            email: 'test@example.com',
            password: 'password123'
        };

        const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, loginData);
        console.log('✅ Login Response:', loginResponse.data);
        console.log('');

        // Test 4: Get Profile (with auth)
        console.log('4️⃣ Testing Get Profile (with auth)...');
        if (authToken) {
            const profileResponse = await axios.get(`${BASE_URL}/api/auth/profile`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            console.log('✅ Profile Response:', profileResponse.data);
        } else {
            console.log('❌ No auth token available for profile test');
        }
        console.log('');

        // Test 5: Get All Users (admin only - should fail for regular user)
        console.log('5️⃣ Testing Get All Users (should fail for regular user)...');
        try {
            const usersResponse = await axios.get(`${BASE_URL}/api/users`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            console.log('✅ Users Response:', usersResponse.data);
        } catch (error) {
            console.log('✅ Expected Error (403):', error.response?.data?.message || error.message);
        }
        console.log('');

        // Test 6: Register Admin User
        console.log('6️⃣ Testing Admin User Registration...');
        const adminData = {
            email: 'admin@example.com',
            password: 'admin123',
            name: 'Admin User',
            role: 'admin'
        };

        const adminResponse = await axios.post(`${BASE_URL}/api/auth/register`, adminData);
        console.log('✅ Admin Registration Response:', adminResponse.data);

        let adminToken = '';
        if (adminResponse.data.success && adminResponse.data.data.token) {
            adminToken = adminResponse.data.data.token;
            console.log('🔑 Admin Token received:', adminToken.substring(0, 20) + '...');
        }
        console.log('');

        // Test 7: Get All Users (with admin token)
        console.log('7️⃣ Testing Get All Users (with admin token)...');
        if (adminToken) {
            const usersResponse = await axios.get(`${BASE_URL}/api/users`, {
                headers: { 'Authorization': `Bearer ${adminToken}` }
            });
            console.log('✅ Users Response (Admin):', usersResponse.data);
        } else {
            console.log('❌ No admin token available for users test');
        }
        console.log('');

        console.log('🎉 All API tests completed!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.response?.status) {
            console.error('Status:', error.response.status);
        }
        if (error.code === 'ECONNREFUSED') {
            console.error('💡 Make sure the server is running with: npm run dev');
        }
    }
}

// Check if server is running first
async function checkServer() {
    try {
        await axios.get(`${BASE_URL}/health`);
        console.log('✅ Server is running!');
        await testAPIs();
    } catch (error) {
        console.error('❌ Server is not running or not accessible');
        console.error('💡 Start the server with: npm run dev');
        console.error('💡 Make sure MongoDB is running');
    }
}

checkServer(); 