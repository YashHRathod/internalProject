const express = require("express");
const {
  createWorkspace,
  deleteWorkspace,
  getall,
  generateDeveloperLink,
  joinLink,
} = require("../controller/workSpaceController");
const protect=require("../middleware/authMiddleware")

const router = express.Router();
router.post("/create", protect ,createWorkspace);
router.post("/:workspaceId/generate-link", protect ,generateDeveloperLink);
router.post("/join/:token",joinLink);
router.delete("/:workspaceId", deleteWorkspace);
router.get("/all",protect,getall)

module.exports = router;
