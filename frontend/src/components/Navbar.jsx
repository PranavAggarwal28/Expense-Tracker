import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiBell } from "react-icons/fi";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/expenses": "Transactions",
};

export default function Navbar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const title = pageTitles[pathname] || "Expense Tracker";

  return (
    <header
      style={{
        height: "var(--navbar-h)",
        position: "fixed",
        top: 0,
        left: "var(--sidebar-w)",
        right: 0,
        background: "rgba(248, 247, 255, 0.9)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        zIndex: 99,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
      }}
    >
      <div>
        <h2 style={{ fontSize: "1.25rem", marginBottom: 0 }}>{title}</h2>
        <p style={{ fontSize: "0.78rem", margin: 0 }}>
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          className="btn btn-icon"
          style={{ position: "relative" }}
          title="Notifications"
        >
          <FiBell size={18} />
          <span
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--expense-color)",
              border: "2px solid var(--bg)",
            }}
          />
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 12px",
            background: "var(--surface)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--primary), #764ba2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "0.75rem",
              fontWeight: 700,
            }}
          >
            {user?.fullname?.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>
            Hi, {user?.fullname?.split(" ")[0]}!
          </span>
        </div>
      </div>
    </header>
  );
}
