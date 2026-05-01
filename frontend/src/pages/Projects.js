import React, { useEffect, useState } from "react";
import { projectService } from "../services";

const initialForm = {
  name: "",
  description: "",
  startDate: "",
  endDate: "",
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadProjects = async () => {
    try {
      const response = await projectService.getAll();
      setProjects(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
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
      await projectService.create(formData);
      setFormData(initialForm);
      await loadProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (projectId) => {
    try {
      await projectService.delete(projectId);
      await loadProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete project");
    }
  };

  return (
    <main className="page">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Projects</p>
          <h2>Plan work with clear ownership.</h2>
        </div>
      </section>

      {error && <div className="error-message">{error}</div>}

      <section className="content-grid">
        <form className="panel form-panel" onSubmit={handleSubmit}>
          <div className="panel-header">
            <h3>Create Project</h3>
            <span>New delivery stream</span>
          </div>
          <label>
            Project name
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Website redesign"
              required
            />
          </label>
          <label>
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Scope, goals, and success criteria"
              rows="4"
            />
          </label>
          <div className="split-fields">
            <label>
              Start date
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </label>
            <label>
              End date
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </label>
          </div>
          <button type="submit" className="primary-button" disabled={submitting}>
            {submitting ? "Creating..." : "Create Project"}
          </button>
        </form>

        <section className="panel">
          <div className="panel-header">
            <h3>All Projects</h3>
            <span>{loading ? "Loading..." : `${projects.length} total`}</span>
          </div>
          {projects.length ? (
            <div className="stack-list">
              {projects.map((project) => (
                <div className="project-card" key={project._id}>
                  <div className="project-topline">
                    <div>
                      <strong>{project.name}</strong>
                      <p>{project.description || "No description added"}</p>
                    </div>
                    <span className={`status-pill ${project.status}`}>{project.status}</span>
                  </div>
                  <div className="project-meta">
                    <span>Owner: {project.owner?.name || "Unknown"}</span>
                    <span>
                      Timeline:{" "}
                      {project.startDate
                        ? new Date(project.startDate).toLocaleDateString()
                        : "TBD"}{" "}
                      -{" "}
                      {project.endDate
                        ? new Date(project.endDate).toLocaleDateString()
                        : "TBD"}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="danger-link"
                    onClick={() => handleDelete(project._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No projects yet. Use the form to create the first one.</p>
          )}
        </section>
      </section>
    </main>
  );
};

export default Projects;
