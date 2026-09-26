import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { expenseAPI } from "../api";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

const ExpenseContext = createContext(null);

export function ExpenseProvider({ children }) {
  const { user } = useAuth();

  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    categoryBreakdown: [],
    monthlyTrend: [],
  });
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 10,
  });
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);

  // Fetch expenses list
  const fetchExpenses = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const merged = { ...filters, ...params };
      // Remove empty filters
      const cleaned = Object.fromEntries(
        Object.entries(merged).filter(([, v]) => v !== "")
      );
      const res = await expenseAPI.getAll(cleaned);
      setExpenses(res.data.data.expenses);
      setPagination(res.data.data.pagination);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch summary/stats
  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const res = await expenseAPI.getSummary();
      setSummary(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch summary");
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  // Fetch categories list
  const fetchCategories = useCallback(async () => {
    try {
      const res = await expenseAPI.getCategories();
      setCategories(res.data.data);
    } catch {
      // silently fail
    }
  }, []);

  // Create
  const createExpense = async (data) => {
    const res = await expenseAPI.create(data);
    toast.success("Transaction added!");
    await Promise.all([fetchExpenses(), fetchSummary()]);
    return res.data.data;
  };

  // Update
  const updateExpense = async (id, data) => {
    const res = await expenseAPI.update(id, data);
    toast.success("Transaction updated!");
    await Promise.all([fetchExpenses(), fetchSummary()]);
    return res.data.data;
  };

  // Delete
  const deleteExpense = async (id) => {
    await expenseAPI.delete(id);
    toast.success("Transaction deleted!");
    await Promise.all([fetchExpenses(), fetchSummary()]);
  };

  const applyFilters = (newFilters) => {
    const updated = { ...filters, ...newFilters, page: 1 };
    setFilters(updated);
  };

  const changePage = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  // Load initial data when user logs in
  useEffect(() => {
    if (user) {
      fetchExpenses();
      fetchSummary();
      fetchCategories();
    }
  }, [user]);

  // Re-fetch when filters change
  useEffect(() => {
    if (user) fetchExpenses();
  }, [filters, user]);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        summary,
        categories,
        pagination,
        filters,
        loading,
        summaryLoading,
        fetchExpenses,
        fetchSummary,
        createExpense,
        updateExpense,
        deleteExpense,
        applyFilters,
        changePage,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpense = () => {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error("useExpense must be used within ExpenseProvider");
  return ctx;
};
