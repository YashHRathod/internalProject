const express=require("express")
const { CreateTask, deleteTask, Markcomplete, Markinprogress, changePriority } = require("../controller/TaskController")
const router=express.Router()
router.post("/:workspace/create",CreateTask)
router.delete("/:taskId",deleteTask)
router.put("/:taskId/completed",Markcomplete)
router.put("/:taskId/inprogress",Markinprogress)
router.put("/:taskId/changePriority",changePriority)

module.exports = router;
