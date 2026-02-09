import styles from "./TaskCard.module.css";

export default function TaskCard({ task }) {
  return (
    <div className={styles.card}>
      <p>{task.title}</p>

      {task.priority && (
        <span className={`${styles.badge} ${styles[task.priority.toLowerCase()]}`}>
          {task.priority}
        </span>
      )}
    </div>
  );
}
