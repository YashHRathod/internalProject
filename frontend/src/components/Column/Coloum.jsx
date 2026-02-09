import styles from "./Column.module.css";
import { TiPin } from "react-icons/ti";
import { ImFire } from "react-icons/im";
import { FaRegCheckCircle } from "react-icons/fa";

export default function Column({ title, tasks }) {
  return (
    <div className={styles.main}>
      <div className={styles.heading}>
        <div className={`${styles.dot} ${styles[title.toLowerCase()]}`}></div>

        <h3>
          {title} <span>({tasks.length})</span>
        </h3>
      </div>

      <div className={styles.column}>
        {tasks.map((task, i) => (
          <div key={i} className={`${styles.card} `}>
            {title == "todo" ? <TiPin /> : <span />}
            {title == "inprogress" ? <ImFire /> : <span />}
            {title == "completed" ? <FaRegCheckCircle /> : <span />}
            <span className={styles.tasktitle}>{task.title}</span>

           <div className={styles.hih}> {task.priority && (
              <span
                className={`${styles.badge} ${
                  styles[task.priority.toLowerCase()]
                }`}
              >
                {task.priority}
              </span>
            )}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
