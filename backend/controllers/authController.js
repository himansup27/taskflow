const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { successResponse } = require("../utils/apiResponse");

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // Create user (password hashed inside model)
    const user = await User.create({ name, email, password });

    const token = generateToken(user.id);

    return successResponse(res, 201, "Account created successfully", { user, token });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Include password for comparison
    const user = await User.findByEmail(email, true);

    if (!user || !(await User.matchPassword(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user.id);

    // Strip password before sending
    const { password: _, ...safeUser } = user;

    return successResponse(res, 200, "Login successful", { user: safeUser, token });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    return successResponse(res, 200, "User fetched successfully", { user: req.user });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };