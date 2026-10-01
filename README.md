# 💰 Expense Tracker — MERN Stack

A full-featured personal finance tracker built with MongoDB, Express, React, and Node.js.

![Dashboard Preview](https://img.shields.io/badge/MERN-Stack-6c63ff?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb)

---

## ✨ Features

- **Authentication** — Register, login, and logout with JWT (stored in HttpOnly cookie + localStorage)
- **Dashboard** — Summary cards (balance, income, expenses), pie chart (by category), monthly bar chart (6-month trend), recent transactions
- **Transactions** — Full CRUD: add, edit, delete income & expense entries
- **Filters** — Filter by type (income/expense), category, and date range
- **Pagination** — 10 transactions per page with page navigation
- **14 Categories** — Food & Dining, Transport, Shopping, Salary, Investment, and more
- **Responsive UI** — Modern design with gradient accents, smooth animations, and CSS custom properties

---

## 🛠️ Tech Stack

| Layer    | Technology                                   |
|----------|----------------------------------------------|
| Frontend | React 18, Vite, React Router v6, Recharts    |
| Backend  | Node.js, Express 5                           |
| Database | MongoDB, Mongoose                            |
| Auth     | JWT (jsonwebtoken), bcrypt                   |
| State    | React Context API                            |
| HTTP     | Axios                                        |
| UI       | Custom CSS Design System, react-icons, react-hot-toast |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- Git

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd "Expense Tracker"
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net
PORT=8000
ACCESS_TOKEN_SECRET=your_secret_key_here
ACCESS_TOKEN_EXPIRY=1d
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

Backend runs on **http://localhost:8000**

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

---

## 📁 Project Structure

```
Expense Tracker/
├── backend/
│   └── src/
│       ├── controllers/   # user.controllers.js, expense.controllers.js
│       ├── models/        # User, Expense (Mongoose schemas)
│       ├── routes/        # user.routes.js, expense.routes.js
│       ├── middleware/    # auth.middleware.js (JWT verification)
│       ├── utils/         # ApiError, ApiResponse, asyncHandler, errorHandler
│       ├── db/            # MongoDB connection
│       ├── app.js         # Express app (CORS, cookie-parser, routes)
│       └── index.js       # Server entry point
│
└── frontend/
    └── src/
        ├── api/           # Axios instance + authAPI, expenseAPI helpers
        ├── context/       # AuthContext, ExpenseContext
        ├── components/    # AppLayout, Navbar, Sidebar, TransactionModal
        ├── pages/         # Login, Register, Dashboard, Expenses
        ├── App.jsx        # Router setup (protected/public routes)
        └── main.jsx       # App entry point
```

---

## 🔗 API Endpoints

### Users (`/api/v1/users`)

| Method | Endpoint    | Auth | Description         |
|--------|-------------|------|---------------------|
| POST   | /register   | ❌   | Register new user   |
| POST   | /login      | ❌   | Login user          |
| POST   | /logout     | ✅   | Logout user         |
| GET    | /profile    | ✅   | Get current user    |

### Expenses (`/api/v1/expenses`)

| Method | Endpoint    | Auth | Description                    |
|--------|-------------|------|--------------------------------|
| GET    | /           | ✅   | Get expenses (with filters)    |
| POST   | /           | ✅   | Create expense/income          |
| GET    | /:id        | ✅   | Get single transaction         |
| PUT    | /:id        | ✅   | Update transaction             |
| DELETE | /:id        | ✅   | Delete transaction             |
| GET    | /summary    | ✅   | Get stats & aggregations       |
| GET    | /categories | ✅   | Get list of categories         |

---

## 🎨 Screenshots

> Dashboard with summary cards and charts, transactions page with filters and modals.

---

## 👤 Author

**Pranav Aggarwal**

---

## 📄 License

ISC
