const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  signup,
  login,
  logout,
  getCurrentUser,
} = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getCurrentUser);

module.exports = router;
