const express = require("express");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Designer = require("../models/Designer");

const router = express.Router();

/* ── Helpers ────────────────────────────────────────────────────────────── */
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

const respondWithUser = (user, token, res, status = 200) => {
  res.status(status).json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    },
  });
};

/* ── Login (role-checked) ──────────────────────────────────────────────── */
const roleLogin = (expectedRole) =>
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    // Enforce role , customer can't login through designer portal, etc.
    if (user.role !== expectedRole) {
      res.status(403);
      throw new Error(
        `This account is registered as a ${user.role}. Please use the ${user.role} portal.`
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    const token = generateToken(user._id);
    respondWithUser(user, token, res);
  });

/* ── Register (role-forced) ────────────────────────────────────────────── */
const roleRegister = (forcedRole) =>
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("All fields are required");
    }

    if (password.length < 8) {
      res.status(400);
      throw new Error("Password must be at least 8 characters");
    }

    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400);
      throw new Error("An account with this email already exists");
    }

    const user = await User.create({ name, email, password, role: forcedRole });

    // Auto-create Designer profile for sellers
    if (forcedRole === "seller") {
      await Designer.create({
        userId: user._id,
        name,
        email,
        password,
        role: "seller",
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, ""),
        onboardingComplete: false,
      });
    }

    const token = generateToken(user._id);
    respondWithUser(user, token, res, 201);
  });

/* ══════════════════════════════════════════════════════════════════════════
   CUSTOMER ROUTES  ,  /api/auth/customer/*
══════════════════════════════════════════════════════════════════════════ */
router.post("/customer/login", roleLogin("buyer"));
router.post("/customer/register", roleRegister("buyer"));

/* ══════════════════════════════════════════════════════════════════════════
   DESIGNER ROUTES  ,  /api/auth/designer/*
══════════════════════════════════════════════════════════════════════════ */
router.post("/designer/login", roleLogin("seller"));
router.post("/designer/register", roleRegister("seller"));

/* ══════════════════════════════════════════════════════════════════════════
   ADMIN ROUTES  ,  /api/auth/admin/*
   (login only , admins are created internally, never self-register)
══════════════════════════════════════════════════════════════════════════ */
router.post("/admin/login", roleLogin("admin"));

module.exports = router;
