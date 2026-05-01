import React, { useEffect, useState } from "react";
import { projectService, taskService, userService } from "../services";

const initialForm = {
  title: "",
  description: "",
  project: "",
  assignedTo: "",
  priority: "medium",
  dueDate: "",
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const [taskResponse, projectResponse, userResponse] = await Promise.all([
        taskService.getAll(),
        projectService.getAll(),
        userService.getAll(),
      ]);

      const visibleProjects = projectResponse.data.data || [];
      setTasks(taskResponse.data.data || []);
      setProjects(visibleProjects);
      setUsers(userResponse.data.data || []);
      setFormData((previous) => ({
        ...previous,
        project: previous.project || visibleProjects[0]?._id || "",
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await taskService.create({
        ...formData,
        assignedTo: formData.assignedTo || undefined,
      });
      setFormData({
        ...initialForm,
        project: projects[0]?._id || "",
      });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await taskService.update(taskId, { status });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await taskService.delete(taskId);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  return (
    <main className="page">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Tasks</p>
          <h2>Assign work and move it visibly.</h2>
        </div>
      </section>

      {error && <div className="error-message">{error}</div>}

      <section className="content-grid">
        <form className="panel form-panel" onSubmit={handleSubmit}>
          <div className="panel-header">
            <h3>Create Task</h3>
            <span>Execution unit</span>
          </div>
          <label>
            Task title
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ship landing page copy"
              required
            />
          </label>
          <label>
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Context, blockers, acceptance criteria"
              rows="4"
            />
          </label>
          <label>
            Project
            <select
              name="project"
              value={formData.project}
              onChange={handleChange}
              required
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option value={project._id} key={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Assignee
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option value={user._id} key={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </label>
          <div className="split-fields">
            <label>
              Priority
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </label>
            <label>
              Due date
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </label>
          </div>
          <button type="submit" className="primary-button" disabled={submitting}>
            {submitting ? "Creating..." : "Create Task"}
          </button>
        </form>

        <section className="panel">
          <div className="panel-header">
            <h3>Task Board</h3>
            <span>{loading ? "Loading..." : `${tasks.length} tasks`}</span>
          </div>
          {tasks.length ? (
            <div className="stack-list">
              {tasks.map((task) => (
                <div className="task-card" key={task._id}>
                  <div className="project-topline">
                    <div>
                      <strong>{task.title}</strong>
                      <p>{task.description || "No description added"}</p>
                    </div>
                    <span className={`status-pill ${task.status}`}>{task.status}</span>
                  </div>
                  <div className="project-meta">
                    <span>Project: {task.project?.name || "Unknown"}</span>
                    <span>Assignee: {task.assignedTo?.name || "Unassigned"}</span>
                    <span>Priority: {task.priority}</span>
                  </div>
                  <div className="task-actions">
                    <select
                      value={task.status}
                      onChange={(event) =>
                        handleStatusChange(task._id, event.target.value)
                      }
                    >
                      <option value="todo">Todo</option>
                      <option value="in-progress">In progress</option>
                      <option value="completed">Completed</option>
                      <option value="blocked">Blocked</option>
                    </select>
                    <button
                      type="button"
                      className="danger-link"
                      onClick={() => handleDelete(task._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No tasks yet. Create the first task from the form.</p>
          )}
        </section>
      </section>
    </main>
  );
};

export default Tasks;
