import { useState } from "react";
import styles from "./AddDeveloper.module.css";
import GotoDashboard from "../GotoDashboard/GotoDashboard"; // adjust path if needed

function AddDeveloper({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [openGen, setOpenGen] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    if (!name.trim()) {
      alert("Developer name is required");
      return;
    }

    onClose();
    setOpenGen(true);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <div>Add Team Member</div>
          <button className={styles.close} onClick={onClose}>
            x
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
            />
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancel} onClick={onClose}>
            Cancel
          </button>

          <button
            onClick={handleGenerate}
            className={styles.primary}
          >
            Generate Link
          </button>
        </div>
      </div>
      {openGen && (
        <GotoDashboard
          isOpen={openGen}
          onClose={() => setOpenGen(false)}
          developerName={name}
        />
      )}
    </div>
  );
}

export default AddDeveloper;
