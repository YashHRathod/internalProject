// const crypto = require("crypto");
// const WorkSpace = require("../Models/WorkSpaceModel");
// const Task = require("../Models/TaskModel");
// const User = require("../Models/userModel");
import WorkSpace from "../Models/WorkSpaceModel.js"
import Task from "../Models/TaskModel.js"
import User from "../Models/userModel.js"
import { v4 as uuidv4 } from 'uuid';
import jwt from "jsonwebtoken"

const createWorkspace = async (req, res) => {
  try {
    // console.log(req.user._id);
    const userId = req.user._id;
    // console.log(userId)
    const { workspace } = req.body;

    if (!workspace ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const newWorkspace = await WorkSpace.create({
      userId,
      workspace,
     
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

const getall = async (req, res) => {
  try {
    const userId = req.user._id;
    const workspace = await WorkSpace.find({ userId: userId });
    return res.status(200).json(workspace);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      Error: error,
      message: "unable to get the workspace",
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

const generateDeveloperLink = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { name } = req.body;
    const userId = req.user._id;

    if (!name) {
      return res.status(400).json({ message: "Developer name required" });
    }

    const workspace = await WorkSpace.findOne({
      _id: workspaceId,
      userId: userId,
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    const token = uuidv4();    
    // const token = crypto.randomBytes(24).toString("hex");

    workspace.developers.push({
      name: name,
      inviteToken: token,
      joined: false,
    });

    await workspace.save();

    return res.status(200).json({
      inviteLink: `${process.env.FRONTEND_URL}/workspace/join/${token}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error generating developer link",
    });
  }
};
const joinLink = async (req, res) => {
  try {
    const { token } = req.params;

    const workspace = await WorkSpace.findOne({
      "developers.inviteToken": token,
    });
    // console.log(workspace);

    if (!workspace) {
      return res.status(400).json({ message: "Invalid link" });
    }

    const developer = workspace.developers.find((d) => d.inviteToken === token);
    console.log(developer);
    developer.joined=true;
    if (developer.userId) {
      // console.log("YASHMC!!")
      const authToken = jwt.sign(
        { id: developer.userId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );
    console.log(authToken)
    const user= await User.find(developer.userId)
    // console.log(developer)
    console.log(user)
    console.log(user[0].role)
    


      return res.status(200).json({
        user:user[0],
        message: "Welcome back message to already user",
        token: authToken,
        workspaceId: workspace._id,
        role:user[0].role,
      });
    }

    const user = await User.create({
      name: developer.name,
      email: `${Date.now()}@gmail.com`,
      password: "Pass@123",
      role:"developer"
    });

    developer.userId = user._id;
    await workspace.save();

    const authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
  

    res.status(200).json({
      User:user,
      message: "Joined successfully",
      token: authToken,
      workspaceId: workspace._id,
      role:user.role
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error:"Internal server error",message: "Join failed" });
  }
};

export {
  createWorkspace,
  deleteWorkspace,
  getall,
  generateDeveloperLink,
  joinLink,
};