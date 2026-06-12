require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const connectDB = require("./config/db");
const { initSocket } = require("./config/socket");
const errorHandler = require("./middleware/errorHandler");

// ── Database ────────────────────────────────────────────────────────────────
connectDB();

// ── App ─────────────────────────────────────────────────────────────────────
const app = express();
const server = http.createServer(app);

// ── Socket.io ────────────────────────────────────────────────────────────────
initSocket(server);

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ── Static files — serve local uploads in dev ──────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// ── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/collections", require("./routes/collectionRoutes"));
app.use("/api/designers", require("./routes/designerRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/payouts", require("./routes/payoutRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/crafts", require("./routes/craftHeritageRoutes"));
app.use("/api/editorial", require("./routes/articleRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/customer", require("./routes/customerRoutes"));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Adorzia Marketplace API is live" });
});

// ── Error handling ──────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
