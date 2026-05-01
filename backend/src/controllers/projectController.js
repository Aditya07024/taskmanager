const Project = require("../models/Project");
const Task = require("../models/Task");

// @route   POST /api/v1/projects
// @desc    Create a new project
exports.createProject = async (req, res) => {
  try {
    const { name, description, startDate, endDate } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const project = await Project.create({
      name,
      description,
      owner: req.user._id,
      team: [req.user._id],
      startDate,
      endDate,
    });

    await project.populate("owner");

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating project", error: err.message });
  }
};

// @route   GET /api/v1/projects
// @desc    Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const filter =
      req.user.role === "admin"
        ? {}
        : {
            $or: [{ owner: req.user._id }, { team: req.user._id }],
          };

    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .populate("owner")
      .populate("team");

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching projects", error: err.message });
  }
};

// @route   PUT /api/v1/projects/:id
// @desc    Update project
exports.updateProject = async (req, res) => {
  try {
    const existingProject = await Project.findById(req.params.id);

    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isOwner = existingProject.owner.toString() === req.user._id.toString();
    if (req.user.role !== "admin" && !isOwner) {
      return res.status(403).json({ message: "Not authorized to update this project" });
    }

    const allowedUpdates = {
      name: req.body.name,
      description: req.body.description,
      status: req.body.status,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    };

    if (Array.isArray(req.body.team) && req.user.role === "admin") {
      allowedUpdates.team = req.body.team;
    }

    const project = await Project.findByIdAndUpdate(req.params.id, allowedUpdates, {
      new: true,
      runValidators: true,
    }).populate("owner").populate("team");

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating project", error: err.message });
  }
};

// @route   DELETE /api/v1/projects/:id
// @desc    Delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isOwner = project.owner.toString() === req.user._id.toString();
    if (req.user.role !== "admin" && !isOwner) {
      return res.status(403).json({ message: "Not authorized to delete this project" });
    }

    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting project", error: err.message });
  }
};
