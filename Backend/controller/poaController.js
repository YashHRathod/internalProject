const Task = require("../Models/TaskModel");
const { generatePOA } = require("../services/poaService");
const { syncToCalendar } = require("../services/calendarService");
const { sendPOAEmail } = require("../services/emailService");

/**
 * Generates a Plan of Action from workspace tasks using the LLM.
 * Fetches incomplete tasks (todo, inprogress) for the workspace.
 */
const generatePOAHandler = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    if (!workspaceId) {
      return res.status(400).json({
        message: "Workspace ID is required",
      });
    }

    const tasks = await Task.find({
      workspace: workspaceId,
      status: { $in: ["todo", "inprogress"] },
    }).lean();

    if (!tasks.length) {
      return res.status(200).json({
        data: [],
        message: "No incomplete tasks to schedule",
      });
    }

    const scheduledEvents = await generatePOA(tasks);

    return res.status(200).json({
      data: scheduledEvents,
      message: "POA generated successfully",
    });
  } catch (error) {
    console.error("POA generation error:", error);
    return res.status(500).json({
      error: error.message,
      message: "Unable to generate POA",
    });
  }
};

/**
 * Syncs pre-generated events to the logged-in user's Google Calendar.
 * Expects body: { events: [...], calendarId?: string }
 */
const syncToCalendarHandler = async (req, res) => {
  try {
    const { events, calendarId } = req.body;
    const userEmail = req.user?.email;

    if (!events || !Array.isArray(events)) {
      return res.status(400).json({
        message: "Events array is required in request body",
      });
    }

    const results = await syncToCalendar(events, calendarId, userEmail);

    return res.status(200).json({
      data: results,
      message: "Calendar sync completed",
    });
  } catch (error) {
    console.error("Calendar sync error:", error);
    return res.status(500).json({
      error: error.message,
      message: "Unable to sync to calendar",
    });
  }
};

/**
 * Generates POA and syncs to Google Calendar in one call.
 */
const generateAndSyncHandler = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { calendarId } = req.body || {};

    if (!workspaceId) {
      return res.status(400).json({
        message: "Workspace ID is required",
      });
    }

    const tasks = await Task.find({
      workspace: workspaceId,
      status: { $in: ["todo", "inprogress"] },
    }).lean();

    if (!tasks.length) {
      return res.status(200).json({
        data: { events: [], syncResults: [] },
        message: "No incomplete tasks to schedule",
      });
    }

    const scheduledEvents = await generatePOA(tasks);
    const userEmail = req.user?.email;
    const syncResults = await syncToCalendar(scheduledEvents, calendarId, userEmail);

    // Send POA email to logged-in user (title | starttime | endtime | timerequired)
    const emailResult = userEmail
      ? await sendPOAEmail(userEmail, scheduledEvents)
      : { sent: false, error: "No user email" };

    return res.status(200).json({
      data: {
        events: scheduledEvents,
        syncResults,
        emailSent: emailResult.sent,
        emailError: emailResult.error,
      },
      message: "POA generated and synced to calendar",
    });
  } catch (error) {
    console.error("Generate and sync error:", error);
    return res.status(500).json({
      error: error.message,
      message: "Unable to generate and sync POA",
    });
  }
};

module.exports = {
  generatePOAHandler,
  syncToCalendarHandler,
  generateAndSyncHandler,
};
