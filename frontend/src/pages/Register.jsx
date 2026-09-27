import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiTrendingUp,
  FiType,
} from "react-icons/fi";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.username.trim()) errs.username = "Username is required";
    else if (!/^[a-z0-9_]{3,20}$/.test(form.username))
      errs.username = "3-20 chars: lowercase letters, numbers, underscore only";
    if (!form.fullname.trim()) errs.fullname = "Full name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: name === "username" ? value.toLowerCase() : value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    try {
      await register({
        username: form.username,
        fullname: form.fullname,
        email: form.email,
        password: form.password,
      });
      toast.success("Account created! Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ name, label, type = "text", icon: Icon, placeholder }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div style={{ position: "relative" }}>
        <Icon
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-muted)",
          }}
        />
        <input
          type={name === "password" || name === "confirmPassword" ? (showPassword ? "text" : "password") : type}
          name={name}
          className={`form-control ${errors[name] ? "error" : ""}`}
          style={{ paddingLeft: 38, paddingRight: name === "password" ? 44 : undefined }}
          placeholder={placeholder}
          value={form[name]}
          onChange={handleChange}
          autoComplete={name === "password" || name === "confirmPassword" ? "new-password" : name}
        />
        {name === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              display: "flex",
            }}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>
      {errors[name] && <span className="form-error">{errors[name]}</span>}
    </div>
  );

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <FiTrendingUp />
          </div>
          <div>
            <h2 style={{ fontSize: "1.1rem", marginBottom: 0 }}>ExpenseTracker</h2>
            <p style={{ fontSize: "0.75rem", margin: 0 }}>Manage your finances</p>
          </div>
        </div>

        <h2 className="auth-title">Create an account</h2>
        <p className="auth-subtitle">Start tracking your expenses today</p>

        <form onSubmit={handleSubmit} noValidate>
          <Field
            name="username"
            label="Username"
            icon={FiUser}
            placeholder="johndoe"
          />
          <Field
            name="fullname"
            label="Full Name"
            icon={FiType}
            placeholder="John Doe"
          />
          <Field
            name="email"
            label="Email Address"
            type="email"
            icon={FiMail}
            placeholder="you@example.com"
          />
          <Field
            name="password"
            label="Password"
            type="password"
            icon={FiLock}
            placeholder="Min 6 characters"
          />
          <Field
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            icon={FiLock}
            placeholder="Repeat your password"
          />

          <button
            type="submit"
            className="btn btn-primary btn-lg btn-block"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
