const Job = require("../models/Job");

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(jobs);
  } catch (error) {
    console.error("GET JOBS ERROR:", error);

    res.status(500).json({
      message: "Unable to load job applications",
    });
  }
};

const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      status,
    } = req.body;

    if (!title || !company || !location) {
      return res.status(400).json({
        message: "Title, company and location are required",
      });
    }

    const job = await Job.create({
      user: req.user.id,
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      status: status || "Applied",
    });

    res.status(201).json(job);
  } catch (error) {
    console.error("CREATE JOB ERROR:", error);

    res.status(500).json({
      message: "Unable to create job application",
    });
  }
};

const updateJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      status,
    } = req.body;

    const job = await Job.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      {
        ...(title !== undefined && {
          title: title.trim(),
        }),
        ...(company !== undefined && {
          company: company.trim(),
        }),
        ...(location !== undefined && {
          location: location.trim(),
        }),
        ...(status !== undefined && {
          status,
        }),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!job) {
      return res.status(404).json({
        message: "Job application not found",
      });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error("UPDATE JOB ERROR:", error);

    res.status(500).json({
      message: "Unable to update job application",
    });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!job) {
      return res.status(404).json({
        message: "Job application not found",
      });
    }

    res.status(200).json({
      message: "Job application deleted successfully",
    });
  } catch (error) {
    console.error("DELETE JOB ERROR:", error);

    res.status(500).json({
      message: "Unable to delete job application",
    });
  }
};

module.exports = {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
};
