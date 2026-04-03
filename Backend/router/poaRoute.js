const express = require("express");
const {
  generatePOAHandler,
  syncToCalendarHandler,
  generateAndSyncHandler,
} = require("../controller/poaController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Specific routes must come before parametric routes
router.post("/sync-calendar", protect, syncToCalendarHandler);
router.post("/:workspaceId/generate", protect, generatePOAHandler);
router.post("/:workspaceId/generate-and-sync", protect, generateAndSyncHandler);

module.exports = router;
