import styles from "./AddTaskModel.module.css";
import { useState } from "react";

export default function AddTaskModal({ onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");

  const handleSubmit = () => {
    if (!title.trim()) return;

    onCreate({
      title,
      description,
      priority,
    });

    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className={styles.header}>
          <div>Add New Task</div>
          <button className={styles.close} onClick={onClose}>
            ×
          </button>
        </div>

       
        <div className={styles.body}>
          <label>
           <div className={styles.title}> Task Title <span>*</span></div>
            <input
              type="text"
              placeholder="e.g.,Fix API authentication bug"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label>
           <div className={styles.title}>  Description <span className={styles.optional}>(optional)</span></div>
            <input
            type="text"
            placeholder="Add details about the task.."
              value={description}
              className={styles.description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <div className={styles.priority}>
            <p>Priority</p>
            <div className={styles.priorityOptions}>
              {["high", "medium", "low"].map((p) => (
                <button
                  key={p}
                  className={`${styles.priorityBtn} ${
                    priority === p ? styles[p   ] : ""
                  }`}
                  onClick={() => setPriority(p)}
                >
                  <span className={styles.dot} />
                    {p}
                </button>
              ))}
            </div>
          </div>
        </div>


        <div className={styles.footer}>
          <button className={styles.cancel} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.create} onClick={handleSubmit}>
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}
