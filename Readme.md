# AI Finance Platform Hackathon Progress

**Date:** 09 July 2026

---

# Project Goal

Build an **AI-powered Financial Planning & Decision Support Platform** that enables organizations to:

- Create and manage budgets
- Modify business assumptions
- Instantly recalculate financial outcomes
- Compare multiple scenarios
- Forecast revenue and expenses
- Manage payroll and employees
- Generate AI-powered financial insights
- Visualize KPIs and business impact
- Help management make data-driven decisions

---

# Tech Stack

## Frontend

- React.js (Vite)
- Redux Toolkit
- React Router
- Axios
- Chart.js / Recharts (Planned)

## Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Gemini AI API

---

# Project Structure Created

## Root

```
Hackathon/
├── client/
├── server/
├── shared/
├── package.json
├── Readme.md
```

---

## Client Structure

Created:

- API Layer
- Feature-based architecture
- Components
- Charts
- Common UI
- Financial Components
- Dashboard
- Auth
- Budget
- Forecast
- Payroll
- Reports
- AI Insights
- Scenario Planning

---

## Backend Structure

Created:

### Config

- env.js
- db.js
- ai.js

### Constants

- index.js

### Engines

- AI Engine
- Forecast Engine
- Payroll Engine
- Scenario Engine
- Calculation Engine

### Modules

Created module structure for:

- Auth
- Budget
- Dashboard
- Scenarios
- Versions
- Assumptions
- Employees
- Payroll
- Forecasts
- Analytics
- Reports
- Notifications
- Insights

Each module follows:

```
controller
service
repository
routes
validation
mapper
```

(where applicable)

---

### Services

Created

- Gemini Service
- Email Service
- Cache Service

---

### Utilities

Created

- ApiResponse
- ApiError
- Logger
- Async Handler
- Calculation Utilities

---

### Middleware

Created

- Authentication
- Validation
- Error Handler
- Rate Limiter

---

### Database

Created

```
db/
    migrations/
    seeds/
    queries/
    schema.sql
```

---

### Prisma

Created

```
schema.prisma
seed.js
```

---

### Tests

```
tests/
    integration/
    unit/
```

---

# Environment Setup Completed

Installed

- Homebrew
- PostgreSQL 17
- Prisma
- Prisma Client
- Express
- JWT
- Bcrypt
- Helmet
- Morgan
- CORS
- Zod
- Nodemon

---

# PostgreSQL Setup

Installed PostgreSQL using Homebrew.

Started PostgreSQL service successfully.

```
brew services start postgresql@17
```

Verified service:

```
brew services list
```

Status:

```
started
```

---

# Database Created

Database Name

```
finance_ai
```

Verified database exists.

---

# Prisma Setup

Initially installed Prisma 7.

Encountered breaking changes with datasource configuration.

Downgraded to Prisma 6.

Current Version

```
Prisma CLI 6.19.3
```

---

# Environment Variables

Configured

```
DATABASE_URL
JWT_SECRET
PORT
GEMINI_API_KEY
```

---

# Database Connection

Initially used

```
postgres
```

Resolved authentication issue by changing to

```
prathamarora
```

Database connection is now working correctly.

---

# Prisma Status

Attempted

```
npx prisma db pull
```

Received

```
P4001
Database is empty
```

This is expected because the project follows a **Code First** approach instead of Database First.

---

# Development Approach

Chosen Architecture

```
Code First
```

Workflow

```
schema.prisma

↓

Prisma Migration

↓

PostgreSQL Tables

↓

Prisma Client

↓

Express APIs

↓

React Frontend
```

---

# Planned Core Modules

- Authentication
- Budgets
- Budget Versions
- Assumptions
- Scenario Planning
- Forecasting
- Payroll
- Employee Management
- Analytics
- Reports
- Notifications
- AI Insights

---

# Planned AI Features

- Financial Advisor
- Business Risk Detection
- Revenue Forecasting
- Cost Optimization
- Payroll Suggestions
- Hiring Recommendations
- Budget Optimization
- Scenario Comparison
- Natural Language Financial Queries

---

# Current Status

## Completed

- Project architecture
- Folder structure
- Backend scaffold
- Frontend scaffold
- PostgreSQL installation
- PostgreSQL configuration
- Database creation
- Prisma installation
- Prisma downgrade
- Environment configuration

---

## Next Step

Design a complete **Prisma Schema** including:

- User
- Budget
- Budget Version
- Assumption
- Scenario
- Employee
- Payroll
- Forecast
- Report
- AI Insight
- Notification

After schema creation:

```
npx prisma migrate dev --name init
```

Then begin implementing the backend APIs.

---

# Progress

Overall Progress

```
███████░░░░░░░░░░░░ 30%
```

Infrastructure Progress

```
████████████████████ 100%
```

Backend Development

```
██░░░░░░░░░░░░░░░░░░ 10%
```

Frontend Development

```
██░░░░░░░░░░░░░░░░░░ 10%
```

Database Design

```
░░░░░░░░░░░░░░░░░░░░ 0%
```

AI Integration

```
░░░░░░░░░░░░░░░░░░░░ 0%
```

---

# Notes

- PostgreSQL is running successfully.
- Prisma is correctly configured.
- Database connectivity has been verified.
- The project will follow a modular architecture.
- Development will proceed using the Code First approach with Prisma.