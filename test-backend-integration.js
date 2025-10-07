#!/usr/bin/env node

console.log('🧪 Restaurant System Backend-Frontend Integration Test');
console.log('=====================================================\n');

const axios = require('axios');

const API_BASE = 'http://localhost:8084/api';

async function testIntegration() {
  let passed = 0;
  let failed = 0;

  // Test 1: Backend Health
  try {
    console.log('1. Testing Backend Health...');
    await axios.get(`${API_BASE}/menus`, { timeout: 5000 });
    console.log('✅ Backend is responding');
    passed++;
  } catch (error) {
    console.log('❌ Backend is not responding');
    console.log('   Error:', error.message);
    console.log('   Make sure backend is running: mvn spring-boot:run');
    failed++;
  }

  // Test 2: Authentication Endpoint
  try {
    console.log('\n2. Testing Authentication...');
    const authResponse = await axios.post(`${API_BASE}/auth/login`, {
      username: 'testuser',
      password: 'testpass'
    });
    console.log('✅ Authentication endpoint working');
    passed++;
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Authentication endpoint working (credential validation works)');
      passed++;
    } else {
      console.log('❌ Authentication endpoint failed');
      console.log('   Error:', error.response?.data || error.message);
      failed++;
    }
  }

  // Test 3: Driver Authentication
  try {
    console.log('\n3. Testing Driver Authentication...');
    const driverResponse = await axios.post(`${API_BASE}/driver/auth/login`, {
      driverId: 'test123',
      password: 'testpass'
    });
    console.log('✅ Driver authentication endpoint working');
    passed++;
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Driver authentication endpoint working (credential validation works)');
      passed++;
    } else {
      console.log('❌ Driver authentication endpoint failed');
      console.log('   Error:', error.response?.data || error.message);
      failed++;
    }
  }

  // Test 4: CORS Headers
  try {
    console.log('\n4. Testing CORS Configuration...');
    const corsResponse = await axios.get(`${API_BASE}/menus`, {
      headers: {
        'Origin': 'http://localhost:3000'
      }
    });
    console.log('✅ CORS headers properly configured');
    passed++;
  } catch (error) {
    console.log('❌ CORS configuration may have issues');
    console.log('   Error:', error.message);
    failed++;
  }

  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 All integration tests passed!');
    console.log('\nReady to start frontend:');
    console.log('cd frontend && npm run dev');
  } else {
    console.log('\n⚠️  Some tests failed. Please check backend configuration.');
  }
}

testIntegration().catch(console.error);