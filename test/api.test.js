// API Automated Test Suite for CareerMitra
import http from 'http';

const BASE_URL = 'http://localhost:3000';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, options);
  const json = await response.json().catch(() => null);
  return { status: response.status, data: json };
}

async function runTests() {
  console.log('🧪 Starting CareerMitra API Automated Verification Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health Check
    console.log('[Test 1] Health Check Endpoint');
    const health = await request('/api/health');
    assert(health.status === 200, 'Health endpoint responds with 200 OK');
    assert(health.data.status === 'online', 'Server reports online status');

    // 2. Careers Catalog
    console.log('\n[Test 2] Careers Catalog Endpoint');
    const careers = await request('/api/careers');
    assert(careers.status === 200, 'Careers list responds with 200 OK');
    assert(Array.isArray(careers.data.clusters) && careers.data.clusters.length >= 6, 'Contains at least 6 cosmic clusters');
    assert(Array.isArray(careers.data.careers) && careers.data.careers.length >= 6, 'Contains at least 6 core engineering careers');

    // 3. Single Career Retrieval
    console.log('\n[Test 3] Single Career Retrieval');
    const single = await request('/api/career/ai-engineer');
    assert(single.status === 200, 'AI Engineer career blueprint responds with 200 OK');
    assert(single.data.career.title.includes('AI'), 'Title contains AI');
    assert(Array.isArray(single.data.career.skillsTree), 'Contains valid skillsTree');

    // 4. Roadmap Generation Endpoint
    console.log('\n[Test 4] Roadmap Generation Endpoint');
    const gen = await request('/api/roadmap/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roleId: 'fullstack-architect',
        backgroundSkills: ['TypeScript', 'Git'],
        hoursPerWeek: 20
      })
    });
    assert(gen.status === 200, 'Roadmap generation responds with 200 OK');
    assert(gen.data.success === true, 'Success flag is true');
    assert(gen.data.roadmap.skillsTree.length > 0, 'Roadmap has progressive phases');

    // 5. Dynamic Replanning Endpoint
    console.log('\n[Test 5] Dynamic Replanning Endpoint');
    const replan = await request('/api/roadmap/replan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roadmap: single.data.career,
        completedSkills: ['py-scientific'],
        exemptSkills: ['math-foundations'],
        hoursPerWeek: 15
      })
    });
    assert(replan.status === 200, 'Replanning responds with 200 OK');
    assert(replan.data.metrics.progressPercent > 0, 'Progress percentage updated');
    assert(replan.data.metrics.earnedXP > 0, 'XP correctly calculated');

    // 6. Career Comparison Matrix Endpoint
    console.log('\n[Test 6] Career Comparison Endpoint');
    const comp = await request('/api/career/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roleIdA: 'ai-engineer',
        roleIdB: 'fullstack-architect'
      })
    });
    assert(comp.status === 200, 'Career comparison responds with 200 OK');
    assert(comp.data.comparison.metrics.overlapPercent >= 0, 'Computes overlap percentage');
    assert(comp.data.comparison.careerA.radarStats !== undefined, 'Includes radar stats for Career A');

    // 7. Auth Endpoints: Guest Login
    console.log('\n[Test 7] Auth Guest Login');
    const guest = await request('/api/auth/guest', { method: 'POST' });
    assert(guest.status === 200, 'Guest login responds with 200 OK');
    assert(guest.data.token !== undefined, 'Returns JWT token for guest');
    assert(guest.data.user.isGuest === true, 'Identifies user as guest');

    // 8. Auth Endpoints: Register & Profile
    console.log('\n[Test 8] Auth Register & Me Endpoint');
    const testEmail = `test-${Date.now()}@test.com`;
    const reg = await request('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Cosmic Tester',
        email: testEmail,
        password: 'securePassword123!',
        targetRole: 'ai-engineer'
      })
    });
    assert(reg.status === 201, 'Registration responds with 201 Created');
    assert(reg.data.token !== undefined, 'Returns JWT token upon registration');

    const me = await request('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${reg.data.token}` }
    });
    assert(me.status === 200, '/api/auth/me responds with 200 OK');
    assert(me.data.user.email === testEmail, 'User profile matches registered email');

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  }

  console.log(`\n================================`);
  console.log(`Verification Complete: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
