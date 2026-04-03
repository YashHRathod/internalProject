import { useState } from "react";
import { toast } from "react-toastify";
import { BsCalendarWeek } from "react-icons/bs";
import styles from "./POASyncButton.module.css";

const API_BASE = "http://localhost:3000";

/**
 * Button to generate POA from tasks and sync to the logged-in user's Google Calendar.
 * @param {string} workspaceId - Workspace ID (required for API call)
 * @param {string} [className] - Additional CSS class for the button
 */
export default function POASyncButton({ workspaceId, className = "" }) {
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    if (!workspaceId) {
      toast.error("Workspace not found. Join or select a workspace first.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/poa/${workspaceId}/generate-and-sync`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to sync POA");
      }

      if (data.data?.syncResults?.some((r) => r.error)) {
        const failed = data.data.syncResults.filter((r) => r.error);
        toast.warning(
          `Synced ${data.data.events?.length - failed.length} events. ${failed.length} failed: ${failed[0]?.error}`
        );
      } else if (data.data?.events?.length > 0) {
        const msg = data.data.emailSent
          ? `POA synced! ${data.data.events.length} event(s) added. Email sent to your inbox.`
          : `POA synced to your calendar! ${data.data.events.length} event(s) added.`;
        toast.success(msg);
        if (data.data.emailError) {
          toast.info(`Email could not be sent: ${data.data.emailError}`);
        }
      } else {
        toast.info("No incomplete tasks to schedule.");
      }
    } catch (err) {
      toast.error(err.message || "Unable to sync to calendar");
    } finally {
      setLoading(false);
    }
  };

  const disabled = !workspaceId || loading;

  return (
    <button
      className={`${styles.btn} ${className}`}
      onClick={handleSync}
      disabled={disabled}
      title={
        !workspaceId
          ? "Join a workspace first to sync POA"
          : "Generate POA and sync to your Google Calendar"
      }
    >
      {loading ? (
        <span className={styles.spinner} />
      ) : (
        <BsCalendarWeek size={18} className={styles.icon} />
      )}
      {loading ? "Syncing..." : "Sync to Calendar"}
    </button>
  );
}
