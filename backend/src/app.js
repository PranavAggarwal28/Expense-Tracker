import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import expenseRouter from "./routes/expense.routes.js";
import { errorHandler } from "./utils/errorHandler.js";

const app = express();

// CORS — allow frontend dev server
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Cookie parsing (needed for httpOnly accessToken cookie)
app.use(cookieParser());

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/expenses", expenseRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Expense Tracker API is running" });
});

// Global error handler
app.use(errorHandler);

export default app;