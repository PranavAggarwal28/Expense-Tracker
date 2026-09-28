import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  FiGrid,
  FiList,
  FiTrendingUp,
  FiLogOut,
  FiUser,
} from "react-icons/fi";

const navItems = [
  { to: "/dashboard", icon: FiGrid, label: "Dashboard" },
  { to: "/expenses", icon: FiList, label: "Transactions" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <aside
      style={{
        width: "var(--sidebar-w)",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        background: "#fff",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
        boxShadow: "2px 0 20px rgba(108,99,255,0.06)",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "24px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            background: "linear-gradient(135deg, var(--primary), #764ba2)",
            borderRadius: "var(--radius-sm)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "1rem",
          }}
        >
          <FiTrendingUp />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.2 }}>
            Expense
          </div>
          <div
            style={{
              fontWeight: 700,
              fontSize: "0.95rem",
              lineHeight: 1.2,
              color: "var(--primary)",
            }}
          >
            Tracker
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 14px",
              borderRadius: "var(--radius-sm)",
              fontWeight: isActive ? 600 : 500,
              fontSize: "0.9rem",
              color: isActive ? "var(--primary)" : "var(--text-secondary)",
              background: isActive ? "var(--primary-light)" : "transparent",
              transition: "var(--transition)",
              textDecoration: "none",
            })}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div
        style={{
          padding: "16px 12px",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            borderRadius: "var(--radius-sm)",
            marginBottom: 8,
            background: "var(--surface-2)",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--primary), #764ba2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "0.8rem",
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {user?.fullname?.charAt(0).toUpperCase() || <FiUser />}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                fontWeight: 600,
                fontSize: "0.85rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.fullname}
            </div>
            <div
              style={{
                fontSize: "0.72rem",
                color: "var(--text-muted)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              @{user?.username}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-secondary"
          style={{ width: "100%", gap: 8 }}
        >
          <FiLogOut size={15} />
          Logout
        </button>
      </div>
    </aside>
  );
}
