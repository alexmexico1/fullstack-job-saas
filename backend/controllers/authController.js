const User = require("../models/User");
const Job = require("../models/Job"); // Ensure this model is imported for deleteJob to work
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==========================================
// AUTHENTICATION CONTROLLERS
// ==========================================

// REGISTER USER
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// LOGIN USER
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { id: user._id }, 
        process.env.JWT_SECRET, 
        { expiresIn: "7d" }
      );

      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      res.status(401).json({
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// JOB DATA CONTROLLERS
// ==========================================

// DELETE JOB APPLICATION
const deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Job deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete job",
    });
  }
};

// ==========================================
// MODULE EXPORTS
// ==========================================
module.exports = {
  register,
  login,
  deleteJob,
};