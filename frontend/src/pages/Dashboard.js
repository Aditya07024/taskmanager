import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { projectService, taskService } from "../services";

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [projectResponse, taskResponse] = await Promise.all([
          projectService.getAll(),
          taskService.getAll(),
        ]);
        setProjects(projectResponse.data.data || []);
        setTasks(taskResponse.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const overdueTasks = tasks.filter(
    (task) =>
      task.dueDate &&
      new Date(task.dueDate) < new Date() &&
      task.status !== "completed",
  ).length;
  const activeProjects = projects.filter((project) => project.status === "active").length;
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length;
  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const recentTasks = tasks.slice(0, 5);

  return (
    <main className="page">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>{loading ? "Loading..." : `Welcome back, ${user?.name || "there"}`}</h2>
          <p className="lead">
            Track delivery across projects, identify blockers quickly, and keep
            assignments visible for the whole team.
          </p>
        </div>
        <div className="hero-chip">
          <span>Role</span>
          <strong>{user?.role || "member"}</strong>
        </div>
      </section>

      {error && <div className="error-message">{error}</div>}

      <section className="stats-grid">
        <article className="stat-card accent-amber">
          <h3>Active Projects</h3>
          <p>{activeProjects}</p>
        </article>
        <article className="stat-card accent-blue">
          <h3>Total Tasks</h3>
          <p>{tasks.length}</p>
        </article>
        <article className="stat-card accent-red">
          <h3>Overdue</h3>
          <p>{overdueTasks}</p>
        </article>
        <article className="stat-card accent-green">
          <h3>Completed</h3>
          <p>{completedTasks}</p>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-header">
            <h3>Recent Tasks</h3>
            <span>{inProgressTasks} in progress</span>
          </div>
          {recentTasks.length ? (
            <div className="stack-list">
              {recentTasks.map((task) => (
                <div className="list-row" key={task._id}>
                  <div>
                    <strong>{task.title}</strong>
                    <p>{task.project?.name || "No project"}</p>
                  </div>
                  <span className={`status-pill ${task.status}`}>{task.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No tasks yet. Create one from the tasks page.</p>
          )}
        </article>

        <article className="panel">
          <div className="panel-header">
            <h3>Project Snapshot</h3>
            <span>{projects.length} visible projects</span>
          </div>
          {projects.length ? (
            <div className="stack-list">
              {projects.slice(0, 5).map((project) => (
                <div className="list-row" key={project._id}>
                  <div>
                    <strong>{project.name}</strong>
                    <p>{project.description || "No description"}</p>
                  </div>
                  <span className={`status-pill ${project.status}`}>{project.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No projects yet. Start by creating your first one.</p>
          )}
        </article>
      </section>
    </main>
  );
};

export default Dashboard;
