const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    company: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    status: {
      type: String,
      enum: [
        "Applied",
        "Interview",
        "Offer",
        "Rejected",
      ],
      default: "Applied",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.index({
  user: 1,
  createdAt: -1,
});

module.exports = mongoose.model("Job", jobSchema);
