import mongoose, { Schema } from "mongoose";

const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Health & Medical",
  "Housing & Utilities",
  "Education",
  "Travel",
  "Personal Care",
  "Salary",
  "Freelance",
  "Investment",
  "Gift",
  "Other",
];

const expenseSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: [true, "Type (income/expense) is required"],
    },
    category: {
      type: String,
      enum: CATEGORIES,
      required: [true, "Category is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
      maxlength: [500, "Note cannot exceed 500 characters"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
  },
  { timestamps: true }
);

// Index for faster queries by user and date
expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, type: 1 });
expenseSchema.index({ user: 1, category: 1 });

export const Expense = mongoose.model("Expense", expenseSchema);
export { CATEGORIES };