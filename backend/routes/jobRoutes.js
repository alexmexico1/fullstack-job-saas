const express = require("express");
const router = express.Router();

const {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

const protect = require("../middleware/authMiddleware");

// ALL ROUTES PROTECTED
router.get("/", protect, getJobs);
router.post("/", protect, createJob);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);
router.delete("/:id", deleteJob);

module.exports = router;