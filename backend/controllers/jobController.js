const Job = require("../models/Job");

// GET USER JOBS ONLY
const getJobs = async (req, res) => {
  const jobs = await Job.find({ userId: req.user.id });
  res.json(jobs);
};

// CREATE JOB (ATTACH USER ID)
const createJob = async (req, res) => {
  const job = await Job.create({
    ...req.body,
    userId: req.user.id,
  });

  res.status(201).json(job);
};

// UPDATE JOB (ONLY OWNER)
const updateJob = async (req, res) => {
  const job = await Job.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  );

  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  res.json(job);
};

// DELETE JOB (ONLY OWNER)
const deleteJob = async (req, res) => {
  const job = await Job.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id,
  });

  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  res.json({ message: "Job deleted" });
};

module.exports = {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
};