const mongoose = require("mongoose");
const WorkSpaceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    workspace: {
      type: String,
      required: true,
    },

    developers: [
      {
        name: {
          type: String,
          required: true,
        },

        inviteToken: {
          type: String,
          required: true,
          unique: true,
        },

        joined: {
          type: Boolean,
          default: false,
        },

        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("WorkSpace", WorkSpaceSchema);