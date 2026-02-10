import { useState } from "react";
import styles from "./CreateWorkspaceModal.module.css";


export default function CreateWorkspaceModal({ isOpen, onClose }) {


  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/workspace/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          workspace: name,
        }),
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        throw new Error(data.message || "Failed to create workspace");
      }
      

      setName("");
      onClose();
    } catch (error) {
      alert(error.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Create Workspace</h2>
          <button className={styles.close} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.body}>
          <label>
           <div className={styles.labl}> Workspace Name <span>*</span></div>
          </label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className={styles.footer}>
          <button className={styles.cancel} onClick={onClose}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={styles.primary}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Workspace"}
          </button>
        </div>
      </div>
    </div>
  );
}
