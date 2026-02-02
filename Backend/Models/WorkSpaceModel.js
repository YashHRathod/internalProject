const mongoose = require("mongoose");

const WorkSpaceSchema = new mongoose.Schema(
  {
   userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
       },
    workspace:{
    type:String,
        required:true,
    },
       assignerName:{
        type:String,
        required:true,
       },
       link:{
        type:String,
        required:true,
       }
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkSpace", WorkSpaceSchema);
