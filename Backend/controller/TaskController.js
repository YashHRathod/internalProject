const Task = require("../Models/TaskModel");

const CreateTask = async (req, res) => {
  try {
    const { workspace } = req.params;
    const { title, description } = req.body;

    if (!workspace || !title || !description) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    console.log(workspace);
    const temp = {
      workspace,
      title,
      description,
    };

    if (req.body.status) temp.status = req.body.status;
    if (req.body.priority) temp.priority = req.body.priority;

    const task = await Task.create(temp);

    return res.status(201).json({
      data: task,
      message: "Task created successfully",
    });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({
      error: error,
      message: "unable to create the task",
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    await Task.findByIdAndDelete(taskId);
    return res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting task",
      error,
    });
  }
};

//mark as completed in status
const Markcomplete = async (req, res) => {
  const { taskId } = req.params;
  const task1= await Task.findById(taskId)
  
  // console.log("task1",task1)

  try {
    const task = await Task.findByIdAndUpdate(
      taskId,
      { status: "completed" },
      { new: true },
    );
    // console.log(task)
    if (!task) {
      return res.status(404).json({
        message: "unable to find the task of that id",
        error,
      });
    }
    return res.status(200).json({
      data:task,
      message: "task in progress now",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error in moving the task to completed",
      Error: error,
    });
  }
};

//mark as progress in status
const Markinprogress = async (req, res) => {
  const { taskId } = req.params;
  // const task= await Task.findById(id)
  try {
    const task = await Task.findByIdAndUpdate(
      taskId,
      { status: "in-progress" },
      { new: true },
    );
    if (!task) {
      return res.status(404).json({
        message: "unable to find the task of that id",
        error,
      });
    }
    return res.status(200).json({
      data:task,
      message: "task in progress now",
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      message: "Error in moving the task to in-progress",
      Error: error,
    });
  }
};
const changePriority = async (req, res) => {
  const { priority } = req.body;
const { taskId } = req.params;

try {
  const task = await Task.findByIdAndUpdate(
    taskId,
    { priority },
    { new: true, runValidators: true } 
  );

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  return res.status(200).json({
    data: task,
    message: "Task priority changed successfully",
  });
} catch (error) {
  return res.status(400).json({
    message: error.message, 
  });
}

};

module.exports = {
  CreateTask,
  deleteTask,
  Markcomplete,
  Markinprogress,
  changePriority,
};
