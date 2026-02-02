const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkSpace",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

  
    priority: {
      type: String,
      enum: ["low", "high"],
      default: "low",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "inprogress", "completed"],
      default: "pending",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
