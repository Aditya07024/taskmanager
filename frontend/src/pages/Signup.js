import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services";

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
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
      const response = await authService.signup(
        formData.name,
        formData.email,
        formData.password,
      );
      login(response.data.user, response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-layout">
      <div className="auth-copy">
        <p className="eyebrow">New workspace</p>
        <h1>Build a focused team operating system.</h1>
        <p className="lead">
          Create projects, organize delivery, and keep execution visible without
          the usual clutter.
        </p>
        <div className="auth-highlights">
          <span>Fast onboarding</span>
          <span>Shared accountability</span>
          <span>Real progress signals</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="auth-card">
        <h2>Create account</h2>
        <p>Set up your admin or member profile.</p>
        {error && <div className="error-message">{error}</div>}
        <label>
          Full name
          <input
            type="text"
            name="name"
            placeholder="Aditya Sharma"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
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
            placeholder="Minimum 6 characters"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" disabled={loading} className="primary-button">
          {loading ? "Creating account..." : "Sign Up"}
        </button>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
};

export default Signup;
