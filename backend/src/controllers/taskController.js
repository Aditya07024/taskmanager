const Task = require("../models/Task");
const Project = require("../models/Project");

const canAccessProject = (project, userId, role) => {
  if (role === "admin") return true;

  return (
    project.owner.toString() === userId.toString() ||
    project.team.some((member) => member.toString() === userId.toString())
  );
};

// @route   POST /api/v1/tasks
// @desc    Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo, priority, dueDate } =
      req.body;

    if (!title || !project) {
      return res
        .status(400)
        .json({ message: "Title and project are required" });
    }

    const existingProject = await Project.findById(project);
    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!canAccessProject(existingProject, req.user._id, req.user.role)) {
      return res.status(403).json({ message: "Not authorized to add tasks to this project" });
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      priority,
      dueDate,
      createdBy: req.user._id,
    });

    await task.populate(["project", "assignedTo", "createdBy"]);

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating task", error: err.message });
  }
};

// @route   GET /api/v1/tasks
// @desc    Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const { project, status, priority } = req.query;
    const filter = {};

    if (project) filter.project = project;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    if (req.user.role !== "admin") {
      const visibleProjects = await Project.find({
        $or: [{ owner: req.user._id }, { team: req.user._id }],
      }).select("_id");

      filter.$or = [
        { assignedTo: req.user._id },
        { createdBy: req.user._id },
        { project: { $in: visibleProjects.map((item) => item._id) } },
      ];
    }

    const tasks = await Task.find(filter).populate([
      "project",
      "assignedTo",
      "createdBy",
    ]).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: err.message });
  }
};

// @route   PUT /api/v1/tasks/:id
// @desc    Update task
exports.updateTask = async (req, res) => {
  try {
    const existingTask = await Task.findById(req.params.id).populate("project");

    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const canEdit =
      req.user.role === "admin" ||
      existingTask.createdBy.toString() === req.user._id.toString() ||
      canAccessProject(existingTask.project, req.user._id, req.user.role);

    if (!canEdit) {
      return res.status(403).json({ message: "Not authorized to update this task" });
    }

    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate(["project", "assignedTo", "createdBy"]);

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating task", error: err.message });
  }
};

// @route   DELETE /api/v1/tasks/:id
// @desc    Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("project");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const canDelete =
      req.user.role === "admin" ||
      task.createdBy.toString() === req.user._id.toString() ||
      task.project.owner.toString() === req.user._id.toString();

    if (!canDelete) {
      return res.status(403).json({ message: "Not authorized to delete this task" });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting task", error: err.message });
  }
};
