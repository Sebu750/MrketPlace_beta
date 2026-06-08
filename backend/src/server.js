require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// ── Database ────────────────────────────────────────────────────────────────
connectDB();

// ── App ─────────────────────────────────────────────────────────────────────
const app = express();

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/users", require("./routes/userRoutes"));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Adorzia Marketplace API is live" });
});

// ── Error handling ──────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
