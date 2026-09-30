import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useExpense } from "../context/ExpenseContext";
import TransactionModal from "../components/TransactionModal";
import toast from "react-hot-toast";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiFilter,
  FiX,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiAlertTriangle,
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

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

function DeleteConfirmModal({ expense, onConfirm, onClose }) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(expense._id);
      onClose();
    } catch {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal" style={{ maxWidth: 400 }}>
        <div className="confirm-dialog">
          <div className="icon" style={{ color: "var(--expense-color)" }}>
            <FiAlertTriangle />
          </div>
          <h3>Delete Transaction?</h3>
          <p style={{ marginTop: 8, marginBottom: 24 }}>
            Are you sure you want to delete{" "}
            <strong>&ldquo;{expense.title}&rdquo;</strong>? This action cannot
            be undone.
          </p>
          <div className="actions">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Expenses() {
  const {
    expenses,
    categories,
    pagination,
    filters,
    loading,
    deleteExpense,
    applyFilters,
    changePage,
  } = useExpense();

  const location = useLocation();

  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingExpense, setDeletingExpense] = useState(null);
  const [localFilters, setLocalFilters] = useState({
    type: "",
    category: "",
    startDate: "",
    endDate: "",
  });

  // Open modal if navigated with state
  useEffect(() => {
    if (location.state?.openModal) {
      setShowModal(true);
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((p) => ({ ...p, [name]: value }));
  };

  const handleApplyFilters = () => {
    applyFilters(localFilters);
  };

  const handleClearFilters = () => {
    const empty = { type: "", category: "", startDate: "", endDate: "" };
    setLocalFilters(empty);
    applyFilters(empty);
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingExpense(null);
  };

  const handleDelete = async (id) => {
    await deleteExpense(id);
  };

  const hasActiveFilters = Object.values(localFilters).some((v) => v !== "");

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Transactions</h2>
          <p style={{ fontSize: "0.875rem" }}>
            {pagination.total} total transaction{pagination.total !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => { setEditingExpense(null); setShowModal(true); }}
        >
          <FiPlus size={16} />
          Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 14,
          }}
        >
          <FiFilter size={15} color="var(--primary)" />
          <h4 style={{ margin: 0 }}>Filter Transactions</h4>
          {hasActiveFilters && (
            <span className="badge" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
              Active
            </span>
          )}
        </div>

        <div className="filters-row">
          <div className="form-group">
            <label className="form-label">Type</label>
            <select
              name="type"
              className="form-control"
              value={localFilters.type}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              name="category"
              className="form-control"
              value={localFilters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {categoryEmoji[cat]} {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">From Date</label>
            <input
              type="date"
              name="startDate"
              className="form-control"
              value={localFilters.startDate}
              onChange={handleFilterChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">To Date</label>
            <input
              type="date"
              name="endDate"
              className="form-control"
              value={localFilters.endDate}
              onChange={handleFilterChange}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "flex-end",
              marginBottom: 0,
              paddingBottom: 0,
            }}
          >
            <button
              className="btn btn-primary"
              onClick={handleApplyFilters}
              style={{ height: 42 }}
            >
              <FiSearch size={15} />
              Apply
            </button>
            {hasActiveFilters && (
              <button
                className="btn btn-secondary"
                onClick={handleClearFilters}
                style={{ height: 42 }}
              >
                <FiX size={15} />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="card">
        {loading ? (
          <div className="loading-center">
            <div className="spinner"></div>
          </div>
        ) : expenses.length === 0 ? (
          <div className="empty-state">
            <FiSearch size={40} />
            <h3>No transactions found</h3>
            <p>
              {hasActiveFilters
                ? "Try adjusting your filters"
                : "Add your first transaction to get started"}
            </p>
            {!hasActiveFilters && (
              <button
                className="btn btn-primary btn-sm"
                style={{ marginTop: 12 }}
                onClick={() => setShowModal(true)}
              >
                <FiPlus size={14} />
                Add Transaction
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="transaction-list">
              {expenses.map((expense) => (
                <div key={expense._id} className="transaction-item">
                  <div className={`transaction-icon ${expense.type}`}>
                    {categoryEmoji[expense.category] || "💰"}
                  </div>

                  <div className="transaction-info">
                    <div className="transaction-title">{expense.title}</div>
                    <div className="transaction-meta">
                      <span className="category-chip">
                        {expense.category}
                      </span>
                      {" · "}
                      {formatDate(expense.date)}
                      {expense.note && ` · ${expense.note}`}
                    </div>
                  </div>

                  <span
                    className={`badge ${expense.type === "income" ? "badge-income" : "badge-expense"}`}
                    style={{ marginRight: 12 }}
                  >
                    {expense.type === "income" ? "+" : "-"}
                    {formatCurrency(expense.amount)}
                  </span>

                  <div className="transaction-actions">
                    <button
                      className="btn btn-icon"
                      onClick={() => handleEdit(expense)}
                      title="Edit"
                    >
                      <FiEdit2 size={15} />
                    </button>
                    <button
                      className="btn btn-icon"
                      onClick={() => setDeletingExpense(expense)}
                      title="Delete"
                      style={{ color: "var(--expense-color)" }}
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => changePage(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  <FiChevronLeft size={16} />
                </button>

                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let page;
                  if (pagination.totalPages <= 5) {
                    page = i + 1;
                  } else if (pagination.page <= 3) {
                    page = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    page = pagination.totalPages - 4 + i;
                  } else {
                    page = pagination.page - 2 + i;
                  }
                  return (
                    <button
                      key={page}
                      className={`pagination-btn ${pagination.page === page ? "active" : ""}`}
                      onClick={() => changePage(page)}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  className="pagination-btn"
                  onClick={() => changePage(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            )}

            <div
              style={{
                textAlign: "center",
                marginTop: 16,
                fontSize: "0.8rem",
                color: "var(--text-muted)",
              }}
            >
              Showing {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)}–
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <TransactionModal
          expense={editingExpense}
          onClose={handleCloseModal}
        />
      )}
      {deletingExpense && (
        <DeleteConfirmModal
          expense={deletingExpense}
          onConfirm={handleDelete}
          onClose={() => setDeletingExpense(null)}
        />
      )}
    </div>
  );
}
