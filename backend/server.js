const dotenv = require("dotenv");
dotenv.config(); // ← move to top, before everything else

const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

// Connect to PostgreSQL
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API is running", timestamp: new Date() });
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});