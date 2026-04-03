import { useState } from "react";
import { toast } from "react-toastify";
import styles from "./AddDeveloper.module.css";

function AddDeveloper({ isOpen, onClose, workspaceId }) {
  const [name, setName] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!name.trim()) {
      toast.error("Developer name is required");
      return;
    }
    if (!workspaceId) {
      toast.error("Workspace not found");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/workspace/${workspaceId}/generate-link`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: name.trim() }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to generate link");
      }

      setInviteLink(data.inviteLink);
      setShowLinkDialog(true);
      toast.success("Link generated successfully");
    } catch (err) {
      toast.error(err.message || "Unable to generate link");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink).then(() => {
      toast.success("Link copied to clipboard");
    });
  };

  const handleCloseLinkDialog = () => {
    setShowLinkDialog(false);
    setInviteLink("");
    setName("");
    onClose();
  };

  const handleBackToForm = () => {
    setShowLinkDialog(false);
    setInviteLink("");
    setName("");
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
      >
        {!showLinkDialog ? (
          <>
            <div className={styles.header}>
              <div>Add Team Member</div>
              <button className={styles.close} onClick={onClose}>
                ×
              </button>
            </div>

            <div className={styles.underline} />

            <div className={styles.body}>
              <label className={styles.labl}>
                Developer Name <span>*</span>
              </label>

              <div className={styles.gen}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter developer name"
                  disabled={loading}
                />
              </div>
            </div>

            <div className={styles.footer}>
              <button className={styles.cancel} onClick={onClose} disabled={loading}>
                Cancel
              </button>

              <button
                onClick={handleGenerate}
                className={styles.primary}
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate Link"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={styles.header}>
              <div>Invite Link</div>
              <button className={styles.close} onClick={handleCloseLinkDialog}>
                ×
              </button>
            </div>

            <div className={styles.underline} />

            <div className={styles.body}>
              <label className={styles.labl}>Share this link with the developer</label>
              <div className={styles.linkContainer}>
                <input
                  type="text"
                  readOnly
                  value={inviteLink}
                  className={styles.linkInput}
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={styles.copyBtn}
                >
                  Copy
                </button>
              </div>
            </div>

            <div className={styles.footer}>
              <button className={styles.cancel} onClick={handleBackToForm}>
                Generate Another
              </button>
              <button className={styles.primary} onClick={handleCloseLinkDialog}>
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AddDeveloper;
