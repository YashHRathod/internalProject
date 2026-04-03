const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");

/** Cache of calendar clients per user email (for domain-wide delegation) */
const calendarClientCache = new Map();

/**
 * Resolves the service account key path. If relative, resolves from Backend folder.
 */
function resolveKeyPath() {
  const backendDir = path.join(__dirname, "..");
  const envPath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH;

  if (envPath) {
    const resolved = path.isAbsolute(envPath) ? envPath : path.resolve(backendDir, envPath);
    if (fs.existsSync(resolved)) return resolved;
  }

  const candidates = [
    "google-service-account.json",
    "service-account-key.json",
  ];
  for (const name of candidates) {
    const p = path.join(backendDir, name);
    if (fs.existsSync(p)) return p;
  }

  return path.join(backendDir, "service-account-key.json");
}

/**
 * Domain-wide delegation only works for Google Workspace (e.g. user@company.com).
 * Personal Gmail (@gmail.com) cannot be impersonated.
 * When GOOGLE_CALENDAR_ID is set, we always use shared calendar (no impersonation)
 * to avoid "invalid_grant: Invalid email or User ID" - delegation requires Workspace Admin setup.
 */
function canImpersonateUser(email) {
  if (!email) return false;
  const domain = email.split("@")[1] || "";
  return domain.endsWith(".gmail.com") === false;
}

/**
 * Returns a calendar API client. When GOOGLE_CALENDAR_ID is set, uses shared calendar
 * (no impersonation). Otherwise attempts domain-wide delegation for Workspace emails.
 * @param {string} [userEmail] - Logged-in user's email
 */
function getCalendarClient(userEmail) {
  const useSharedCalendar = !!process.env.GOOGLE_CALENDAR_ID;
  const useImpersonation = !useSharedCalendar && canImpersonateUser(userEmail);
  const cacheKey = useImpersonation ? userEmail : "_shared_";
  if (calendarClientCache.has(cacheKey)) {
    return calendarClientCache.get(cacheKey);
  }

  const keyPath = resolveKeyPath();

  if (!fs.existsSync(keyPath)) {
    throw new Error(
      `Google Service Account key file not found at: ${keyPath}. ` +
        "Download the JSON key from Google Cloud Console and set GOOGLE_SERVICE_ACCOUNT_KEY_PATH in .env"
    );
  }

  const authConfig = {
    keyFile: keyPath,
    scopes: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
    ],
  };

  if (useImpersonation) {
    authConfig.clientOptions = { subject: userEmail };
  }

  const auth = new google.auth.GoogleAuth(authConfig);
  const calendar = google.calendar({ version: "v3", auth });
  calendarClientCache.set(cacheKey, calendar);
  return calendar;
}

/**
 * Syncs an array of Google Calendar event objects to a Google Calendar.
 * @param {Array<{summary: string, description: string, start: {dateTime: string, timeZone?: string}, end: {dateTime: string, timeZone?: string}}>} events - Array of event objects compatible with events.insert
 * @param {string} [calendarId] - Calendar ID ("primary" for user's main calendar when using userEmail)
 * @param {string} [userEmail] - Logged-in user's email; when set, events are added to this user's calendar (domain-wide delegation)
 * @returns {Promise<Array<{id: string, htmlLink?: string, error?: string}>>} - Array of results with created event IDs/links or errors
 */
async function syncToCalendar(events, calendarId, userEmail) {
  const useSharedCalendar = !!process.env.GOOGLE_CALENDAR_ID;
  const useImpersonation = !useSharedCalendar && canImpersonateUser(userEmail);
  const targetCalendarId =
    calendarId ||
    (useSharedCalendar ? process.env.GOOGLE_CALENDAR_ID : "primary");

  if (!useSharedCalendar && !useImpersonation) {
    throw new Error(
      "GOOGLE_CALENDAR_ID is required. Create a calendar, share it with your service account " +
        "(e.g. orcas-31@orcas-488313.iam.gserviceaccount.com), then add the calendar ID to .env"
    );
  }

  const calendar = getCalendarClient(userEmail);
  const results = [];

  for (const event of events) {
    try {
      const response = await calendar.events.insert({
        calendarId: targetCalendarId,
        requestBody: {
          summary: event.summary,
          description: event.description || "",
          start: {
            dateTime: event.start.dateTime,
            timeZone: event.start.timeZone || "UTC",
          },
          end: {
            dateTime: event.end.dateTime,
            timeZone: event.end.timeZone || "UTC",
          },
        },
        sendUpdates: "none",
      });

      results.push({
        id: response.data.id,
        htmlLink: response.data.htmlLink,
      });
    } catch (err) {
      results.push({
        error: err.message || String(err),
      });
    }
  }

  return results;
}

module.exports = { syncToCalendar };
