import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';
const TEST_EMAIL = `test${Date.now()}@example.com`;
const TEST_PASSWORD = 'test_password_123';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

async function test(name: string, fn: () => Promise<void>) {
  try {
    console.log(`\n[TEST] ${name}...`);
    await fn();
    results.push({ name, passed: true });
    console.log(`[PASS] ${name}`);
  } catch (error: any) {
    results.push({ name, passed: false, error: error.message });
    console.error(`[FAIL] ${name}: ${error.message}`);
  }
}

async function main() {
  console.log('[v0] Starting API tests...\n');

  let sessionCookie = '';

  // Test 1: Sign Up
  await test('Sign Up User', async () => {
    const response = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        name: 'Test User',
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json() as any;
    if (!data.user?.email) throw new Error('No user in response');

    sessionCookie = response.headers.get('set-cookie') || '';
  });

  // Test 2: Get Meetings (should be empty)
  await test('Get Meetings (Empty)', async () => {
    const response = await fetch(`${BASE_URL}/api/meetings`, {
      headers: { 'Cookie': sessionCookie },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json() as any;
    if (!Array.isArray(data)) throw new Error('Response is not an array');
  });

  // Test 3: Create Meeting
  let meetingId = '';
  await test('Create Meeting', async () => {
    const response = await fetch(`${BASE_URL}/api/meetings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie,
      },
      body: JSON.stringify({
        title: 'Test Meeting',
        description: 'Testing the API',
        startTime: new Date(Date.now() + 3600000).toISOString(),
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json() as any;
    if (!data.id) throw new Error('No meeting ID in response');

    meetingId = data.id;
  });

  // Test 4: Get Meeting Details
  await test('Get Meeting Details', async () => {
    const response = await fetch(`${BASE_URL}/api/meetings/${meetingId}`, {
      headers: { 'Cookie': sessionCookie },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json() as any;
    if (data.id !== meetingId) throw new Error('Meeting ID mismatch');
  });

  // Test 5: Update Meeting
  await test('Update Meeting', async () => {
    const response = await fetch(`${BASE_URL}/api/meetings/${meetingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie,
      },
      body: JSON.stringify({
        title: 'Updated Meeting Title',
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
  });

  // Test 6: Delete Meeting
  await test('Delete Meeting', async () => {
    const response = await fetch(`${BASE_URL}/api/meetings/${meetingId}`, {
      method: 'DELETE',
      headers: { 'Cookie': sessionCookie },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
  });

  // Summary
  console.log('\n\n[SUMMARY]');
  console.log(`Total Tests: ${results.length}`);
  console.log(`Passed: ${results.filter(r => r.passed).length}`);
  console.log(`Failed: ${results.filter(r => !r.passed).length}`);

  results.forEach(r => {
    if (!r.passed) {
      console.log(`  - ${r.name}: ${r.error}`);
    }
  });

  process.exit(results.every(r => r.passed) ? 0 : 1);
}

main().catch(console.error);
