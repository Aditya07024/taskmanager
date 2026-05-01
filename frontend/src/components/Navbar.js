import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ onLogout }) => {
  const { user } = useAuth();

  return (
    <header className="shell-header">
      <div className="brand-lockup">
        <div className="brand-badge">TT</div>
        <div>
          <p className="eyebrow">Team Task Manager</p>
          <h1>Execution cockpit</h1>
        </div>
      </div>

      <nav className="shell-nav">
        <NavLink to="/dashboard" className="shell-link">
          Dashboard
        </NavLink>
        <NavLink to="/projects" className="shell-link">
          Projects
        </NavLink>
        <NavLink to="/tasks" className="shell-link">
          Tasks
        </NavLink>
      </nav>

      <div className="shell-user">
        <div>
          <strong>{user?.name || "User"}</strong>
          <p>
            {user?.role || "member"} · {user?.email || "No email"}
          </p>
        </div>
        <button onClick={onLogout} className="ghost-button" type="button">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
