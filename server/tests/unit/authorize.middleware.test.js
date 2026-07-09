const test = require('node:test');
const assert = require('node:assert/strict');
const authorizeRoles = require('../../src/middlewares/authorize.middleware');

test('authorize middleware accepts normalized admin roles', () => {
  let called = false;

  const middleware = authorizeRoles('ADMIN', 'FINANCE_MANAGER');
  const req = { user: { role: 'SUPER_ADMIN' } };
  const res = {
    status(code) {
      this.code = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };

  middleware(req, res, () => {
    called = true;
  });

  assert.equal(called, true);
  assert.equal(res.code, undefined);
});
