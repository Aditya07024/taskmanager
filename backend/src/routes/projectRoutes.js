const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  createProject,
  getAllProjects,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

router.post("/", protect, createProject);
router.get("/", protect, getAllProjects);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

module.exports = router;
