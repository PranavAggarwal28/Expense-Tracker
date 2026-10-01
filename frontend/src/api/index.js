import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Attach token from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-redirect on 401 (only for protected routes, not on auth views or login attempts)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const url = err.config?.url || "";
      const isAuthRoute =
        url.includes("/users/login") ||
        url.includes("/users/register");
      const isAuthPage =
        window.location.pathname === "/login" ||
        window.location.pathname === "/register";

      if (!isAuthRoute && !isAuthPage) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

// ── Auth API ──────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post("/users/register", data),
  login: (data) => api.post("/users/login", data),
  logout: () => api.post("/users/logout"),
  getProfile: () => api.get("/users/profile"),
};

// ── Expense API ────────────────────────────────────────────
export const expenseAPI = {
  getAll: (params) => api.get("/expenses", { params }),
  getById: (id) => api.get(`/expenses/${id}`),
  create: (data) => api.post("/expenses", data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
  getSummary: (params) => api.get("/expenses/summary", { params }),
  getCategories: () => api.get("/expenses/categories"),
};

export default api;
