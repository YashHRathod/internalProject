const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorkSpace",
    required: true,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  title: String,
  description: String,

  priority: {
    type: String,
    enum: ["low", "high","medium"],
    default:"low"
  },

  status: {
    type: String,
    enum: ["todo", "inprogress", "completed"],
    default:"todo"
  },
});

TaskSchema.set("timestamps", true);

module.exports = mongoose.model("Task", TaskSchema);