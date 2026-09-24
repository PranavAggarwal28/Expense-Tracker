import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Expense, CATEGORIES } from "../models/expense.models.js";

// Create a new expense/income
const createExpense = asyncHandler(async (req, res) => {
  const { title, amount, type, category, date, note } = req.body;

  if (!title || !amount || !type || !category) {
    throw new ApiError(400, "Title, amount, type, and category are required");
  }

  if (!["income", "expense"].includes(type)) {
    throw new ApiError(400, "Type must be 'income' or 'expense'");
  }

  if (!CATEGORIES.includes(category)) {
    throw new ApiError(400, "Invalid category");
  }

  const expense = await Expense.create({
    title,
    amount: parseFloat(amount),
    type,
    category,
    date: date ? new Date(date) : new Date(),
    note: note || "",
    user: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, expense, "Transaction created successfully"));
});

// Get all expenses for the logged-in user (with filtering)
const getExpenses = asyncHandler(async (req, res) => {
  const { type, category, startDate, endDate, page = 1, limit = 20 } = req.query;

  const filter = { user: req.user._id };

  if (type && ["income", "expense"].includes(type)) {
    filter.type = type;
  }
  if (category && CATEGORIES.includes(category)) {
    filter.category = category;
  }
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filter.date.$lte = end;
    }
  }

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [expenses, total] = await Promise.all([
    Expense.find(filter).sort({ date: -1 }).skip(skip).limit(limitNum),
    Expense.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        expenses,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      "Expenses fetched successfully"
    )
  );
});

// Get a single expense by ID
const getExpenseById = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!expense) {
    throw new ApiError(404, "Transaction not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, expense, "Transaction fetched successfully"));
});

// Update an expense
const updateExpense = asyncHandler(async (req, res) => {
  const { title, amount, type, category, date, note } = req.body;

  const expense = await Expense.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!expense) {
    throw new ApiError(404, "Transaction not found");
  }

  if (type && !["income", "expense"].includes(type)) {
    throw new ApiError(400, "Type must be 'income' or 'expense'");
  }
  if (category && !CATEGORIES.includes(category)) {
    throw new ApiError(400, "Invalid category");
  }

  if (title !== undefined) expense.title = title;
  if (amount !== undefined) expense.amount = parseFloat(amount);
  if (type !== undefined) expense.type = type;
  if (category !== undefined) expense.category = category;
  if (date !== undefined) expense.date = new Date(date);
  if (note !== undefined) expense.note = note;

  await expense.save();

  return res
    .status(200)
    .json(new ApiResponse(200, expense, "Transaction updated successfully"));
});

// Delete an expense
const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!expense) {
    throw new ApiError(404, "Transaction not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Transaction deleted successfully"));
});

// Get expense summary / stats
const getExpenseSummary = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const matchStage = { user: req.user._id };
  if (startDate || endDate) {
    matchStage.date = {};
    if (startDate) matchStage.date.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      matchStage.date.$lte = end;
    }
  }

  const [totals, categoryBreakdown, monthlyTrend] = await Promise.all([
    // Total income and expense
    Expense.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]),

    // Breakdown by category
    Expense.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { category: "$category", type: "$type" },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]),

    // Monthly trend (last 6 months)
    Expense.aggregate([
      {
        $match: {
          ...matchStage,
          date: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 5)),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]),
  ]);

  // Format totals
  let totalIncome = 0;
  let totalExpense = 0;
  totals.forEach((t) => {
    if (t._id === "income") totalIncome = t.total;
    if (t._id === "expense") totalExpense = t.total;
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        categoryBreakdown,
        monthlyTrend,
      },
      "Summary fetched successfully"
    )
  );
});

// Get list of available categories
const getCategories = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, CATEGORIES, "Categories fetched successfully"));
});

export {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
  getCategories,
};