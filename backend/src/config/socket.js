const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

let io;

/**
 * Initialise Socket.io on the given HTTP server
 * - /orders namespace  , real-time order status updates
 * - /notifications namespace , dashboard alerts
 */
const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  /* ── Auth middleware , verify JWT before allowing connection ───── */
  const authenticate = async (socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace("Bearer ", "");

    if (!token) return next(new Error("Authentication required"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return next(new Error("User not found"));
      socket.user = user;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  };

  /* ── /orders namespace ─────────────────────────────────────────── */
  const ordersNs = io.of("/orders");
  ordersNs.use(authenticate);

  ordersNs.on("connection", (socket) => {
    // Designers join their own room to receive only their orders
    if (socket.user.role === "seller") {
      socket.join(`designer:${socket.user._id}`);
    }
    // Customers join a personal room
    socket.join(`customer:${socket.user._id}`);

    socket.on("disconnect", () => {});
  });

  /* ── /notifications namespace ──────────────────────────────────── */
  const notifNs = io.of("/notifications");
  notifNs.use(authenticate);

  notifNs.on("connection", (socket) => {
    socket.join(`user:${socket.user._id}`);
  });

  return io;
};

/**
 * Get the io instance (null if not yet initialised)
 */
const getIO = () => {
  if (!io) throw new Error("Socket.io not initialised. Call initSocket(server) first.");
  return io;
};

/**
 * Emit an event to a specific designer room
 */
const emitToDesigner = (designerId, event, data) => {
  if (!io) return;
  io.of("/orders").to(`designer:${designerId}`).emit(event, data);
};

/**
 * Emit an event to a specific customer room
 */
const emitToCustomer = (customerId, event, data) => {
  if (!io) return;
  io.of("/orders").to(`customer:${customerId}`).emit(event, data);
};

/**
 * Emit a notification to a specific user
 */
const sendNotification = (userId, data) => {
  if (!io) return;
  io.of("/notifications").to(`user:${userId}`).emit("notification:new", data);
};

module.exports = { initSocket, getIO, emitToDesigner, emitToCustomer, sendNotification };
