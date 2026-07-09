const test = require('node:test');
const assert = require('node:assert/strict');
const authService = require('../../src/modules/auth/auth.service');

const uniqueEmail = `hackathon-${Date.now()}@example.com`;

test('register and login flow works for a new user', async () => {
  const registration = await authService.register({
    fullName: 'Hackathon Tester',
    email: uniqueEmail,
    password: 'StrongPass123!',
    role: 'ORG_ADMIN',
  });

  assert.equal(registration.email, uniqueEmail);
  assert.equal(registration.fullName, 'Hackathon Tester');

  const loginResult = await authService.login({
    email: uniqueEmail,
    password: 'StrongPass123!',
  });

  assert.ok(loginResult.token);
  assert.equal(loginResult.user.email, uniqueEmail);
});
