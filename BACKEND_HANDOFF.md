# Backend Handoff Guide

This document summarizes the current backend state of the AI Finance Platform project so another LLM or developer can continue from the present implementation without guessing.

## 1. Project Goal

The backend is intended to support an AI-powered financial planning platform with:
- authentication and user management
- organization, employee, and payroll data
- budget creation and versioning
- scenario planning
- forecasting
- assumptions management
- analytics, reports, notifications, and insights

## 2. Current Backend Stack

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT authentication
- bcrypt for password hashing
- CORS, helmet, morgan, compression, express-rate-limit

## 3. Backend Entry Points

### App bootstrap
- Main app entry: [server/src/app.js](server/src/app.js)
- Server startup: [server/src/server.js](server/src/server.js)
- Route mounting: [server/src/routes/index.js](server/src/routes/index.js)

The app exposes the API under `/api`.

## 4. Architecture Pattern

The backend follows a modular structure per feature:
- controller
- service
- repository
- routes
- validation
- mapper

Example modules:
- [server/src/modules/auth](server/src/modules/auth)
- [server/src/modules/budgets](server/src/modules/budgets)
- [server/src/modules/scenarios](server/src/modules/scenarios)
- [server/src/modules/versions](server/src/modules/versions)

## 5. Implemented Modules

### Authentication
Implemented and verified:
- register
- login
- profile retrieval

Files:
- [server/src/modules/auth/auth.routes.js](server/src/modules/auth/auth.routes.js)
- [server/src/modules/auth/auth.controller.js](server/src/modules/auth/auth.controller.js)
- [server/src/modules/auth/auth.service.js](server/src/modules/auth/auth.service.js)
- [server/src/modules/auth/auth.repository.js](server/src/modules/auth/auth.repository.js)
- [server/src/modules/auth/auth.mapper.js](server/src/modules/auth/auth.mapper.js)

Important note:
- The service was aligned to the Prisma schema fields `fullName` and `passwordHash`.
- The auth flow is currently compatible with the Prisma `UserRole` enum values.

### Budgets
Implemented and wired:
- list budgets
- get budget by id
- create budget
- update budget
- delete budget

Files:
- [server/src/modules/budgets/budget.routes.js](server/src/modules/budgets/budget.routes.js)
- [server/src/modules/budgets/budget.service.js](server/src/modules/budgets/budget.service.js)
- [server/src/modules/budgets/budget.repository.js](server/src/modules/budgets/budget.repository.js)
- [server/src/modules/budgets/budget.validation.js](server/src/modules/budgets/budget.validation.js)

### Versions
Implemented and wired:
- list versions
- get version by id
- create version
- update version
- delete version

Files:
- [server/src/modules/versions/version.routes.js](server/src/modules/versions/version.routes.js)
- [server/src/modules/versions/version.service.js](server/src/modules/versions/version.service.js)
- [server/src/modules/versions/version.repository.js](server/src/modules/versions/version.repository.js)
- [server/src/modules/versions/version.validation.js](server/src/modules/versions/version.validation.js)

### Scenarios
Implemented and wired:
- list scenarios
- get scenario by id
- create scenario
- update scenario
- delete scenario

Files:
- [server/src/modules/scenarios/scenario.routes.js](server/src/modules/scenarios/scenario.routes.js)
- [server/src/modules/scenarios/scenario.service.js](server/src/modules/scenarios/scenario.service.js)
- [server/src/modules/scenarios/scenario.repository.js](server/src/modules/scenarios/scenario.repository.js)
- [server/src/modules/scenarios/scenario.validation.js](server/src/modules/scenarios/scenario.validation.js)

### Other modules
The following module folders exist and are mounted in the router:
- analytics
- assumptions
- dashboard
- employees
- forecasts
- insights
- notifications
- payroll
- reports

Some of them are partially implemented or still need additional refinement, but the structure is in place.

## 6. Middleware

### Authentication
- [server/src/middlewares/auth.middleware.js](server/src/middlewares/auth.middleware.js)

This validates a JWT bearer token and attaches the decoded user to `req.user`.

### Authorization
- [server/src/middlewares/authorize.middleware.js](server/src/middlewares/authorize.middleware.js)

This checks role-based access. It was updated to normalize legacy role names to the Prisma enum values used by the backend.

## 7. Database Layer

The Prisma schema is defined in:
- [server/prisma/schema.prisma](server/prisma/schema.prisma)

The DB client is configured in:
- [server/src/config/db.js](server/src/config/db.js)

## 8. Current Status

### Working
- backend starts successfully
- auth register/login/profile flow works
- role authorization middleware works for normalized roles
- budget/version/scenario modules are implemented and route-wired
- frontend API helpers are available for auth and budget calls

### Verified
I ran these checks successfully:
- `node --test tests/integration/auth-flow.test.js tests/unit/authorize.middleware.test.js`
- `npm run build` in the client

## 9. Important Notes for the Next AI Agent

1. The backend is not fully feature-complete yet, but the auth and core planning modules are now usable.
2. The most important next step is to connect the frontend forms to the backend endpoints and test the full flow:
   - register
   - login
   - create budget
   - create version
   - create scenario
3. The auth layer now expects `fullName` and `passwordHash` because of the Prisma schema.
4. If you add new routes, keep the module pattern consistent with existing files.
5. For demo readiness, focus on one end-to-end flow first rather than polishing every module.

## 10. Suggested Demo Flow

A strong hackathon demo path is:
1. register a user
2. log in
3. create a budget
4. create a budget version
5. create a scenario
6. review the returned planning data

## 11. Files to Review First

- [server/src/app.js](server/src/app.js)
- [server/src/routes/index.js](server/src/routes/index.js)
- [server/src/modules/auth/auth.service.js](server/src/modules/auth/auth.service.js)
- [server/src/modules/budgets/budget.service.js](server/src/modules/budgets/budget.service.js)
- [server/src/modules/versions/version.service.js](server/src/modules/versions/version.service.js)
- [server/src/modules/scenarios/scenario.service.js](server/src/modules/scenarios/scenario.service.js)
