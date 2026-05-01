import apiClient from "./api";

export const authService = {
  signup: (name, email, password) =>
    apiClient.post("/auth/signup", { name, email, password }),

  login: (email, password) =>
    apiClient.post("/auth/login", { email, password }),

  logout: () => apiClient.post("/auth/logout"),

  getCurrentUser: () => apiClient.get("/auth/me"),
};

export const userService = {
  getAll: () => apiClient.get("/users"),

  getById: (id) => apiClient.get(`/users/${id}`),

  update: (id, userData) => apiClient.put(`/users/${id}`, userData),

  delete: (id) => apiClient.delete(`/users/${id}`),
};

export const projectService = {
  getAll: () => apiClient.get("/projects"),

  create: (projectData) => apiClient.post("/projects", projectData),

  update: (id, projectData) => apiClient.put(`/projects/${id}`, projectData),

  delete: (id) => apiClient.delete(`/projects/${id}`),
};

export const taskService = {
  getAll: (filters) => apiClient.get("/tasks", { params: filters }),

  create: (taskData) => apiClient.post("/tasks", taskData),

  update: (id, taskData) => apiClient.put(`/tasks/${id}`, taskData),

  delete: (id) => apiClient.delete(`/tasks/${id}`),
};
