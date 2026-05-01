require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const frontendBuildPath = path.join(__dirname, "../frontend/build");
const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || !allowedOrigins.length || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("CORS origin not allowed"));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Routes
app.use("/api/v1/auth", require("./src/routes/authRoutes"));
app.use("/api/v1/users", require("./src/routes/userRoutes"));
app.use("/api/v1/projects", require("./src/routes/projectRoutes"));
app.use("/api/v1/teams", require("./src/routes/teamRoutes"));
app.use("/api/v1/tasks", require("./src/routes/taskRoutes"));

// Health Check
app.get("/api/v1/health", (req, res) => {
  res.json({ status: "Server is running" });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(frontendBuildPath));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      next();
      return;
    }

    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
}

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
