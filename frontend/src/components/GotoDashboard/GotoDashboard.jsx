import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./GotoDashboard.module.css";

function GotoDashboard({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWs, setSelectedWs] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;

    const fetchWorkspaces = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:3000/workspace/all", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch workspaces");
        }

        setWorkspaces(data);
      } catch (error) {
        console.log(error)
        toast.error("Unable to get dashboards");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, [isOpen]);

  const handleGo = () => {
    if (!selectedWs) {
      toast.error("Please select a workspace");
      return;
    }

    navigate(`/lead/dashboard/${selectedWs}`);
    console.log("request",{selectedWs})
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.header}>
          <h2>Go to Dashboard</h2>
          <button className={styles.close} onClick={onClose}>×</button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <label>Select Workspace</label>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <select
              value={selectedWs}
              onChange={(e) => setSelectedWs(e.target.value)}
            >
              <option value="">-- Select workspace --</option>
              {workspaces.map((ws) => (
                <option key={ws._id} value={ws._id}>
                  {ws.workspace}
                </option>
              ))}
            </select>
          )}
        </div>

       
        <div className={styles.footer}>
          <button className={styles.cancel} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.primary} onClick={handleGo}>
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default GotoDashboard;
