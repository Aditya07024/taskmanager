const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

router.post("/", protect, createTask);
router.get("/", protect, getAllTasks);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);

module.exports = router;
