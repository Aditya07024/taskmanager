const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

// Placeholder for team routes
router.get("/", protect, (req, res) => {
  res.json({ message: "Teams route" });
});

module.exports = router;
