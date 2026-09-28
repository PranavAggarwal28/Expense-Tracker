import { useExpense } from "../context/ExpenseContext";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiActivity,
  FiArrowUpRight,
  FiArrowDownRight,
  FiPlus,
} from "react-icons/fi";

const PIE_COLORS = [
  "#6c63ff", "#ff6584", "#43e97b", "#f59e0b", "#3b82f6",
  "#ec4899", "#14b8a6", "#a855f7", "#ef4444", "#22c55e",
  "#f97316", "#06b6d4",
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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

// Category to emoji map
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

function StatCard({ label, value, icon: Icon, className, sub }) {
  return (
    <div className={`stat-card ${className}`}>
      <div className="stat-card-header">
        <span className="stat-card-label">{label}</span>
        <div className="stat-card-icon">
          <Icon size={17} />
        </div>
      </div>
      <div className="stat-card-value">{value}</div>
      {sub && <div className="stat-card-sub">{sub}</div>}
    </div>
  );
}

function TransactionItem({ expense }) {
  const emoji = categoryEmoji[expense.category] || "💰";
  const isIncome = expense.type === "income";

  return (
    <div className="transaction-item">
      <div className={`transaction-icon ${expense.type}`}>{emoji}</div>
      <div className="transaction-info">
        <div className="transaction-title">{expense.title}</div>
        <div className="transaction-meta">
          <span className="category-chip">{expense.category}</span>
          {" · "}
          {formatDate(expense.date)}
        </div>
      </div>
      <div className={`transaction-amount ${expense.type}`}>
        {isIncome ? "+" : "-"}
        {formatCurrency(expense.amount)}
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <div
        style={{
          background: "#fff",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          padding: "10px 14px",
          boxShadow: "var(--shadow-md)",
          fontSize: "0.85rem",
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 4 }}>{name}</div>
        <div style={{ color: "var(--primary)" }}>{formatCurrency(value)}</div>
      </div>
    );
  }
  return null;
}

export default function Dashboard() {
  const { summary, summaryLoading, expenses, loading } = useExpense();

  // Build pie chart data from category breakdown (expenses only)
  const pieData = summary.categoryBreakdown
    .filter((c) => c._id.type === "expense")
    .map((c) => ({ name: c._id.category, value: c.total }))
    .slice(0, 8);

  // Build monthly bar chart data
  const monthlyMap = {};
  summary.monthlyTrend.forEach((m) => {
    const key = `${MONTHS[m._id.month - 1]}`;
    if (!monthlyMap[key]) monthlyMap[key] = { month: key, income: 0, expense: 0 };
    monthlyMap[key][m._id.type] = m.total;
  });
  const monthlyData = Object.values(monthlyMap);

  const recentExpenses = expenses.slice(0, 5);

  if (summaryLoading && loading) {
    return (
      <div className="loading-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Stat Cards */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        <StatCard
          label="Total Balance"
          value={formatCurrency(summary.balance)}
          icon={FiDollarSign}
          className="balance"
          sub={summary.balance >= 0 ? "You're doing great!" : "Spending exceeds income"}
        />
        <StatCard
          label="Total Income"
          value={formatCurrency(summary.totalIncome)}
          icon={FiTrendingUp}
          className="income"
          sub="All time earnings"
        />
        <StatCard
          label="Total Expenses"
          value={formatCurrency(summary.totalExpense)}
          icon={FiTrendingDown}
          className="expense"
          sub="All time spending"
        />
        <StatCard
          label="Transactions"
          value={expenses.length > 0 ? expenses.length + "+" : "0"}
          icon={FiActivity}
          className="transactions"
          sub="Recorded entries"
        />
      </div>

      {/* Charts row */}
      <div className="grid-2" style={{ marginBottom: 28 }}>
        {/* Expense by Category Pie */}
        <div className="card">
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ marginBottom: 4 }}>Expense Breakdown</h3>
            <p style={{ fontSize: "0.82rem" }}>By category</p>
          </div>
          {pieData.length === 0 ? (
            <div className="empty-state" style={{ padding: "40px 0" }}>
              <FiTrendingDown size={36} />
              <p>No expense data yet</p>
            </div>
          ) : (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={105}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={PIE_COLORS[i % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    formatter={(value) => (
                      <span style={{ fontSize: "0.78rem" }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Monthly Bar Chart */}
        <div className="card">
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ marginBottom: 4 }}>Monthly Overview</h3>
            <p style={{ fontSize: "0.82rem" }}>Income vs Expenses (last 6 months)</p>
          </div>
          {monthlyData.length === 0 ? (
            <div className="empty-state" style={{ padding: "40px 0" }}>
              <FiActivity size={36} />
              <p>No monthly data yet</p>
            </div>
          ) : (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "var(--text-muted)" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                    tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + "k" : v}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    formatter={(value) => (
                      <span style={{ fontSize: "0.78rem", textTransform: "capitalize" }}>
                        {value}
                      </span>
                    )}
                  />
                  <Bar
                    dataKey="income"
                    fill="var(--income-color)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                  <Bar
                    dataKey="expense"
                    fill="var(--expense-color)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <div>
            <h3 style={{ marginBottom: 4 }}>Recent Transactions</h3>
            <p style={{ fontSize: "0.82rem" }}>Your last 5 entries</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link
              to="/expenses"
              className="btn btn-secondary btn-sm"
            >
              View All
              <FiArrowUpRight size={14} />
            </Link>
            <Link to="/expenses" state={{ openModal: true }} className="btn btn-primary btn-sm">
              <FiPlus size={14} />
              Add New
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="loading-center">
            <div className="spinner"></div>
          </div>
        ) : recentExpenses.length === 0 ? (
          <div className="empty-state">
            <FiActivity size={40} />
            <h3>No transactions yet</h3>
            <p>Add your first income or expense to get started</p>
            <Link to="/expenses" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>
              <FiPlus size={14} />
              Add Transaction
            </Link>
          </div>
        ) : (
          <div className="transaction-list">
            {recentExpenses.map((exp) => (
              <TransactionItem key={exp._id} expense={exp} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
