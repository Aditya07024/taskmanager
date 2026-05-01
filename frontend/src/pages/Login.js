import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.login(formData.email, formData.password);
      login(response.data.user, response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-layout">
      <div className="auth-copy">
        <p className="eyebrow">Full-stack workspace</p>
        <h1>Run projects, assign work, track delivery.</h1>
        <p className="lead">
          Clean role-based task management with live project visibility and a
          sharper interface.
        </p>
        <div className="auth-highlights">
          <span>Project control</span>
          <span>Role-aware access</span>
          <span>Status tracking</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="auth-card">
        <h2>Welcome back</h2>
        <p>Sign in to continue to your workspace.</p>
        {error && <div className="error-message">{error}</div>}
        <label>
          Email
          <input
            type="email"
            name="email"
            placeholder="you@company.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" disabled={loading} className="primary-button">
          {loading ? "Signing in..." : "Login"}
        </button>
        <p className="auth-switch">
          Need an account? <Link to="/signup">Create one</Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
