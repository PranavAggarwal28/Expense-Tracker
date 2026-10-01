# 💰 Expense Tracker — Full-Stack MERN Application

A production-ready, full-stack Personal Finance and Expense Tracking Web Application built with the **MERN Stack** (MongoDB, Express.js, React 18, Node.js). Designed with clean architecture, enterprise authentication standards, responsive UI/UX, and real-time financial analytics.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [How It Works](#-how-it-works)
  - [1. Authentication & Security Flow](#1-authentication--security-flow)
  - [2. Transaction Lifecycle](#2-transaction-lifecycle)
  - [3. Analytics & Aggregation Engine](#3-analytics--aggregation-engine)
- [Database Schema & Data Models](#-database-schema--data-models)
- [RESTful API Reference](#-restful-api-reference)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Environment Variables](#environment-variables)
- [Design Decisions & Best Practices](#-design-decisions--best-practices)
- [Author & Contact](#-author--contact)

---

## 🌟 Overview

Managing personal finances effectively requires speed, clarity, and actionable insights. **Expense Tracker** provides users with an intuitive dashboard to monitor income, control expenditures, inspect category-specific distributions via interactive charts, and maintain accurate transaction histories with server-side pagination and filtering.

Engineered with scalability in mind:
- **Decoupled Architecture**: Strict separation of concerns between client (SPA) and REST API.
- **Robust Error Handling**: Centralized error interceptors, standard API response wrappers, and validation.
- **Performance Optimized**: Database index tuning for fast user-specific temporal queries and aggregation pipelines.

---

## 🚀 Key Features

- **🔐 Secure Authentication & Authorization**
  - BCrypt salted hashing (10 rounds) for password security.
  - Stateless JSON Web Tokens (JWT) stored in HTTP-Only, Secure cookies and authorization headers.
  - Protected API routes guarded by reusable authentication middleware.

- **📊 Interactive Financial Analytics**
  - **Dynamic Metric Cards**: Live total balance, total income, total expense, and transaction count.
  - **Expense Categorization Donut Chart**: Breakdown of expenditures across 14 life categories using Recharts.
  - **6-Month Comparative Bar Chart**: Income vs. Expense monthly progression calculated via MongoDB aggregations.

- **💳 Complete Transaction Management (CRUD)**
  - Add, edit, view, and delete income and expense records.
  - Categorization into pre-defined categories (Salary, Freelance, Food & Dining, Travel, Housing, etc.).
  - Date picking, currency formatting (₹ INR), and note annotations.

- **🔍 Advanced Querying & Filtering**
  - Multi-parameter filtering by transaction type (`income` / `expense`), category, and date intervals.
  - Server-side pagination with dynamic page-number controls to handle large datasets efficiently.

- **🎨 Modern, Responsive UI/UX**
  - Built with custom CSS custom properties (design system tokens) — no heavy UI bloat.
  - Smooth transitions, micro-interactions, responsive sidebars, modals, and toast notifications (`react-hot-toast`).

---

## 🛠️ Tech Stack

### Frontend
- **Library/Framework**: [React 18](https://react.dev/) (Pure JavaScript / JSX)
- **Build Tool**: [Vite](https://vitejs.dev/) for lightning-fast HMR and bundle optimization
- **Routing**: [React Router v6](https://reactrouter.com/) (Protected & Public Route guards)
- **State Management**: React Context API (`AuthContext`, `ExpenseContext`)
- **Data Fetching**: [Axios](https://axios-http.com/) with request/response interceptors
- **Data Visualization**: [Recharts](https://recharts.org/) (Interactive SVG charts)
- **Icons & Feedback**: `react-icons` (Feather Icons) & `react-hot-toast`

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express 5](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose ODM](https://mongoosejs.com/)
- **Security & Utilities**:
  - `bcrypt` — Password hashing
  - `jsonwebtoken` — Access token issuance & verification
  - `cookie-parser` — Secure cookie handling
  - `cors` — Cross-Origin Resource Sharing configuration

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Client Layer (React)                 │
│   ┌──────────────┐   ┌───────────────┐  ┌───────────┐  │
│   │ Dashboard UI │   │  Expenses UI  │  │  Auth UI  │  │
│   └──────┬───────┘   └───────┬───────┘  └─────┬─────┘  │
│          │                   │                │        │
│   ┌──────┴───────────────────┴────────────────┴─────┐  │
│   │   Context Layer (AuthContext, ExpenseContext)   │  │
│   └──────────────────────────┬──────────────────────┘  │
│                              │ Axios HTTP Client       │
└──────────────────────────────┼─────────────────────────┘
                               │ JSON / REST API Requests
                               ▼
┌────────────────────────────────────────────────────────┐
│                   Server Layer (Express)               │
│   ┌─────────────────────────────────────────────────┐  │
│   │ CORS & Cookie Parser & Body Parsing Middlewares │  │
│   └──────────────────────────┬──────────────────────┘  │
│                              │                         │
│   ┌──────────────────────────┴──────────────────────┐  │
│   │            JWT Auth Guard Middleware            │  │
│   └──────────────────────────┬──────────────────────┘  │
│                              │                         │
│         ┌────────────────────┴────────────────────┐    │
│         ▼                                         ▼    │
│  User Controller                         Expense Controller
│  (Register, Login, Profile)              (CRUD + Aggregations)
│         │                                         │    │
│         └────────────────────┬────────────────────┘    │
│                              ▼                         │
│                    Mongoose Data Models                │
└──────────────────────────────┼─────────────────────────┘
                               │ Mongoose Driver
                               ▼
┌────────────────────────────────────────────────────────┐
│                  Database Layer (MongoDB)              │
│      Collections: `users`, `expenses` (Indexed)        │
└────────────────────────────────────────────────────────┘
```

---

## ⚙️ How It Works

### 1. Authentication & Security Flow
1. **Registration**: User inputs credentials $\rightarrow$ Validated on client and server $\rightarrow$ Password is salted and hashed with `bcrypt` (10 rounds) in a Mongoose `pre('save')` hook $\rightarrow$ User document stored.
2. **Login**: Credentials verified against hash via `userSchema.methods.isPasswordCorrect` $\rightarrow$ Server issues a signed JWT containing user ID $\rightarrow$ Sent back in both an `httpOnly` secure cookie and authorization payload.
3. **Session Verification**: Axios request interceptor attaches the JWT token from `localStorage` into `Authorization: Bearer <token>` for cross-origin compliance. Backend middleware `verifyJwt` extracts and validates the token on protected routes, attaching `req.user` to the request context.

### 2. Transaction Lifecycle
1. User creates or updates an income/expense record via modal forms with category selection and validation.
2. API validates data schema and associates the record with `req.user._id`.
3. MongoDB writes the document and indexes it under `{ user: 1, date: -1 }`.
4. Client context triggers parallel refetches for the updated list and calculated aggregates.

### 3. Analytics & Aggregation Engine
The `/api/v1/expenses/summary` endpoint executes three high-performance aggregation pipelines concurrently via `Promise.all`:
- **Total Balance & Counts**: Computes total sum grouped by transaction type (`income` vs `expense`).
- **Category Breakdown**: Groups total spent by category for the donut chart.
- **Monthly Trend**: Aggregates entries by `{ year, month, type }` over a rolling 6-month window for comparative bar charts.

---

## 🗄️ Database Schema & Data Models

### User Model (`User`)
| Field | Type | Attributes | Description |
|---|---|---|---|
| `_id` | ObjectId | Primary Key | Unique User ID |
| `username` | String | Required, Unique, Lowercase, Trim | Handle for the user account |
| `email` | String | Required, Unique, Lowercase, Trim | User email address |
| `fullname` | String | Required, Trim | Display name of the user |
| `password` | String | Required, Hashed | BCrypt salted hash |
| `createdAt` / `updatedAt` | Date | Timestamps | Automatic record creation/update time |

### Expense Model (`Expense`)
| Field | Type | Attributes | Description |
|---|---|---|---|
| `_id` | ObjectId | Primary Key | Unique Transaction ID |
| `title` | String | Required, Trim, Max: 100 | Transaction description |
| `amount` | Number | Required, Min: 0.01 | Monetary value |
| `type` | String | Required, Enum: `['income', 'expense']` | Financial direction |
| `category` | String | Required, Enum: 14 Categories | Categorization descriptor |
| `date` | Date | Required, Default: `Date.now` | Date of occurrence |
| `note` | String | Optional, Max: 500 | Additional notes or remarks |
| `user` | ObjectId | Required, Ref: `'User'` | Foreign key reference to User |
| `createdAt` / `updatedAt` | Date | Timestamps | Audit timestamps |

**Indexes**:
- `{ user: 1, date: -1 }` (Optimized chronological queries per user)
- `{ user: 1, type: 1 }` (Optimized income vs expense filtering)
- `{ user: 1, category: 1 }` (Optimized category filtering)

---

## 📡 RESTful API Reference

### 1. Authentication Endpoints (`/api/v1/users`)
- `POST /register` — Register a new user account.
  ```json
  { "username": "johndoe", "fullname": "John Doe", "email": "john@example.com", "password": "securepassword" }
  ```
- `POST /login` — Authenticate and receive JWT cookie & token.
  ```json
  { "email": "john@example.com", "password": "securepassword" }
  ```
- `POST /logout` — Invalidate user cookie session `[Protected]`.
- `GET /profile` — Fetch currently authenticated user details `[Protected]`.

### 2. Expense Endpoints (`/api/v1/expenses`)
- `GET /` — Fetch paginated transactions with optional filters (`type`, `category`, `startDate`, `endDate`, `page`, `limit`) `[Protected]`.
- `POST /` — Create a new transaction `[Protected]`.
  ```json
  { "title": "Freelance Client Payment", "amount": 45000, "type": "income", "category": "Freelance", "date": "2026-10-01", "note": "Q4 design sprint" }
  ```
- `GET /:id` — Get single transaction by ID `[Protected]`.
- `PUT /:id` — Update existing transaction by ID `[Protected]`.
- `DELETE /:id` — Delete transaction by ID `[Protected]`.
- `GET /summary` — Retrieve aggregated stats (totals, balance, category & monthly breakdown) `[Protected]`.
- `GET /categories` — List all allowable transaction categories `[Protected]`.

---

## 📂 Project Directory Structure

```
Expense Tracker/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── expense.controllers.js   # CRUD & Aggregation logic
│   │   │   └── user.controllers.js      # Auth & Profile logic
│   │   ├── db/
│   │   │   └── index.js                 # MongoDB connection handler
│   │   ├── middleware/
│   │   │   └── auth.middleware.js       # JWT extraction & verification
│   │   ├── models/
│   │   │   ├── expense.models.js        # Mongoose Expense Schema & Indexes
│   │   │   └── user.models.js           # Mongoose User Schema & Hooks
│   │   ├── routes/
│   │   │   ├── expense.routes.js        # Expense router
│   │   │   └── user.routes.js           # User router
│   │   ├── utils/
│   │   │   ├── apiError.js              # Standardized API Error wrapper
│   │   │   ├── apiResponse.js           # Standardized API Response format
│   │   │   ├── asyncHandler.js          # Async controller error catcher
│   │   │   └── errorHandler.js          # Global Express error middleware
│   │   ├── app.js                       # Express app configuration & middleware
│   │   ├── constant.js                  # Global constants (DB_NAME)
│   │   └── index.js                     # Server entry point
│   ├── .env                             # Server environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js                 # Axios instance & API method calls
│   │   ├── components/
│   │   │   ├── AppLayout.jsx            # Shell layout (Navbar + Sidebar)
│   │   │   ├── Navbar.jsx               # Sticky navigation header
│   │   │   ├── Sidebar.jsx              # Navigation sidebar & user session
│   │   │   └── TransactionModal.jsx     # Add/Edit modal dialog
│   │   ├── context/
│   │   │   ├── AuthContext.jsx          # Auth state provider
│   │   │   └── ExpenseContext.jsx       # Transaction state & actions provider
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx            # Analytical dashboard with Recharts
│   │   │   ├── Expenses.jsx             # Paginated & filtered transaction table
│   │   │   ├── Login.jsx                # Login view
│   │   │   └── Register.jsx             # User registration view
│   │   ├── App.jsx                      # App router & Route guards
│   │   ├── index.css                    # Design system tokens & utility styles
│   │   └── main.jsx                     # React root mount
│   ├── index.html
│   ├── vite.config.js                   # Vite config with /api reverse proxy
│   └── package.json
│
└── README.md
```

---

## 🚦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account or local MongoDB instance
- `git` installed

### Backend Setup
1. Open a terminal and navigate to `backend/`:
   ```bash
   cd backend
   npm install
   ```
2. Configure `.env` in the `backend/` directory:
   ```env
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   ACCESS_TOKEN_SECRET=your_jwt_secret_key_here
   ACCESS_TOKEN_EXPIRY=1d
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   ```
3. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will run on `http://localhost:8000`.*

### Frontend Setup
1. In a separate terminal, navigate to `frontend/`:
   ```bash
   cd frontend
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The client will launch on `http://localhost:5173`.*

---

## 💡 Design Decisions & Best Practices

1. **Pure JavaScript (No TypeScript)**: Kept cleanly written in modern ES modules and JSX per exact project specifications while maintaining clean code structure, defensive null checks, and clear prop semantics.
2. **Standardized Response Envelope**: Every HTTP response conforms to `{ statusCode, data, message, success }`, eliminating client-side response ambiguity.
3. **Compound Database Indexes**: Added compound indices to optimize query response times for common filter combinations.
4. **Resilient Token Management**: Dual-strategy token extraction (supports both cookie-based auth and `Authorization: Bearer` headers) for seamless API client support.
5. **Zero CSS Framework Bloat**: Styled using CSS custom properties with a comprehensive tokens system, enabling responsive layouts without bulky utility dependencies.

---

## 👨‍💻 Author

**Pranav Aggarwal**
- GitHub: [@PranavAggarwal28](https://github.com/PranavAggarwal28)
- Email: pranavaggarwal173@gmail.com
