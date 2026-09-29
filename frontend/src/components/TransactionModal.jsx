import { useState, useEffect } from "react";
import { useExpense } from "../context/ExpenseContext";
import toast from "react-hot-toast";
import {
  FiX,
  FiSave,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";

const categoryEmoji = {
  "Food & Dining": "🍔",
  Transportation: "🚗",
  Shopping: "🛍️",
  Entertainment: "🎬",
  "Health & Medical": "💊",
  "Housing & Utilities": "🏠",
  Education: "📚",
  Travel: "✈️",
  "Personal Care": "💅",
  Salary: "💼",
  Freelance: "💻",
  Investment: "📈",
  Gift: "🎁",
  Other: "💰",
};

const incomeCategories = ["Salary", "Freelance", "Investment", "Gift", "Other"];
const expenseCategories = [
  "Food & Dining", "Transportation", "Shopping", "Entertainment",
  "Health & Medical", "Housing & Utilities", "Education", "Travel",
  "Personal Care", "Other",
];

const EMPTY_FORM = {
  title: "",
  amount: "",
  type: "expense",
  category: "",
  date: new Date().toISOString().split("T")[0],
  note: "",
};

export default function TransactionModal({ expense, onClose }) {
  const { createExpense, updateExpense } = useExpense();
  const isEdit = Boolean(expense);

  const [form, setForm] = useState(
    isEdit
      ? {
          title: expense.title,
          amount: expense.amount,
          type: expense.type,
          category: expense.category,
          date: new Date(expense.date).toISOString().split("T")[0],
          note: expense.note || "",
        }
      : EMPTY_FORM
  );
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const categories = form.type === "income" ? incomeCategories : expenseCategories;

  // Reset category when type changes
  useEffect(() => {
    if (!isEdit) {
      setForm((p) => ({ ...p, category: "" }));
    }
  }, [form.type, isEdit]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0)
      errs.amount = "Enter a valid amount greater than 0";
    if (!form.category) errs.category = "Select a category";
    if (!form.date) errs.date = "Select a date";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleTypeToggle = (type) => {
    setForm((p) => ({ ...p, type }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    try {
      if (isEdit) {
        await updateExpense(expense._id, form);
      } else {
        await createExpense(form);
      }
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>{isEdit ? "Edit Transaction" : "Add Transaction"}</h3>
          <button className="modal-close" onClick={onClose} title="Close">
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Type Toggle */}
          <div className="form-group">
            <label className="form-label">Type</label>
            <div className="type-toggle">
              <button
                type="button"
                className={`type-toggle-btn income ${form.type === "income" ? "active" : ""}`}
                onClick={() => handleTypeToggle("income")}
              >
                <FiTrendingUp size={15} />
                Income
              </button>
              <button
                type="button"
                className={`type-toggle-btn expense ${form.type === "expense" ? "active" : ""}`}
                onClick={() => handleTypeToggle("expense")}
              >
                <FiTrendingDown size={15} />
                Expense
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              className={`form-control ${errors.title ? "error" : ""}`}
              placeholder="e.g. Lunch at restaurant"
              value={form.title}
              onChange={handleChange}
              autoFocus
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          {/* Amount */}
          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <div className="amount-input-wrapper">
              <span className="currency-symbol">₹</span>
              <input
                type="number"
                name="amount"
                className={`form-control ${errors.amount ? "error" : ""}`}
                placeholder="0.00"
                value={form.amount}
                onChange={handleChange}
                min="0.01"
                step="0.01"
              />
            </div>
            {errors.amount && <span className="form-error">{errors.amount}</span>}
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              name="category"
              className={`form-control ${errors.category ? "error" : ""}`}
              value={form.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {categoryEmoji[cat]} {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="form-error">{errors.category}</span>
            )}
          </div>

          {/* Date */}
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              name="date"
              className={`form-control ${errors.date ? "error" : ""}`}
              value={form.date}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
            />
            {errors.date && <span className="form-error">{errors.date}</span>}
          </div>

          {/* Note */}
          <div className="form-group">
            <label className="form-label">
              Note <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea
              name="note"
              className="form-control"
              placeholder="Add a note..."
              value={form.note}
              onChange={handleChange}
              rows={2}
              style={{ resize: "vertical" }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={loading}
            >
              <FiSave size={15} />
              {loading ? "Saving..." : isEdit ? "Update" : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
