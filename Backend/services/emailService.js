const nodemailer = require("nodemailer");

/**
 * Creates a transporter. Uses env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.
 * If not configured, returns null (email sending will be skipped).
 */
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: port === "465",
    auth: { user, pass },
  });
}

/**
 * Formats event duration from start and end datetimes (ISO8601).
 */
function formatTimeRequired(startDateTime, endDateTime) {
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);
  const ms = end - start;
  const mins = Math.round(ms / 60000);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

/**
 * Sends POA to the logged-in user's email.
 * Format: title | starttime | endtime | timerequired (one line per event)
 * @param {string} toEmail - Recipient email
 * @param {Array<{summary: string, start: {dateTime: string}, end: {dateTime: string}}>} events - POA events
 * @returns {Promise<{sent: boolean, error?: string}>}
 */
async function sendPOAEmail(toEmail, events) {
  if (!toEmail || !events?.length) {
    return { sent: false, error: "No email or events" };
  }

  const transporter = getTransporter();
  if (!transporter) {
    return { sent: false, error: "Email not configured (SMTP_HOST, SMTP_USER, SMTP_PASS)" };
  }

  const rows = events.map((e) => {
    const title = e.summary || "";
    const startTime = e.start?.dateTime || "";
    const endTime = e.end?.dateTime || "";
    const timeRequired = formatTimeRequired(startTime, endTime);
    return `${title} | ${startTime} | ${endTime} | ${timeRequired}`;
  });

  const body = [
    "Here is your Plan of Action (POA):",
    "",
    "title | starttime | endtime | timerequired",
    "---",
    ...rows,
    "",
    "Synced to your calendar.",
  ].join("\n");

  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@example.com";

  try {
    await transporter.sendMail({
      from,
      to: toEmail,
      subject: "Your POA - Plan of Action",
      text: body,
      html: `<pre>${body.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>`,
    });
    return { sent: true };
  } catch (err) {
    console.error("POA email error:", err);
    return { sent: false, error: err.message };
  }
}

module.exports = { sendPOAEmail };
