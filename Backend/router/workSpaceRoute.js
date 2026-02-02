const express = require("express");
const {
  createWorkspace,
  deleteWorkspace,
} = require("../controller/wrokSpaceController");
const protect=require("../middleware/authMiddleware")

const router = express.Router();
router.post("/create", protect ,createWorkspace);
router.delete("/:workspaceId", deleteWorkspace);

module.exports = router;
