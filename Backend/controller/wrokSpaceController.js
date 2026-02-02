const WorkSpace = require("../Models/WorkSpaceModel");
const Task = require("../Models/TaskModel");

const createWorkspace = async (req, res) => {
  try {
    // console.log(req.user._id);
    const userId  = req.user._id;
    // console.log(userId)
    const { workspace, assignerName, link } = req.body;

    if (!workspace || !assignerName || !link) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const newWorkspace = await WorkSpace.create({
      userId,
      workspace,
      assignerName,
      link,
    });

    return res.status(201).json({
      message: "Workspace created successfully",
      data: newWorkspace,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error creating workspace",
    });
  }
};


const deleteWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const exist = await WorkSpace.findById(workspaceId);
    if (!exist) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

   
    await Task.deleteMany({ workspace: workspaceId });

    await WorkSpace.findByIdAndDelete(workspaceId);

    return res.status(200).json({
      message: "Workspace and related tasks deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error deleting workspace",
    });
  }
};

module.exports = {
  createWorkspace,
  deleteWorkspace,
};
