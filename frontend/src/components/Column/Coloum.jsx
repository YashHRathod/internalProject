import { useState } from "react";
import styles from "./Column.module.css";
import { FaCheck } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";

export default function Column({ title, tasks,setTasks }) {
  const [openMenuId, setOpenMenuId] = useState(null);

const toggleMenu = (taskId) => {
  setOpenMenuId((prev) => (prev === taskId ? null : taskId));
};

const getMoveOptions = (current) => {
  const all = ["todo", "inprogress", "completed"];
  return all.filter((s) => s !== current);
};
const moveTask = async (taskId, newStatus) => {
  try {
    const token = localStorage.getItem("token");

    await fetch(
      `http://localhost:3000/task/${taskId}/${newStatus}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    
    setTasks((prev) =>
      prev.map((task) =>
        task._id === taskId
          ? {
              ...task,
              status: newStatus,
            }
          : task
      )
    );
    setOpenMenuId(null);
  } catch (err) {
    console.error("Failed to move task", err);
  }
};


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
          <div key={i} className={`${styles.card} ${
    task.priority === "high" ? styles.highPriority : ""
  }`}>
  <div className={styles.topRow}>

  <div className={styles.left}>
    {title === "todo" && <img src="https://d1nhio0ox7pgb.cloudfront.net/_img/v_collection_png/16x16/plain/pin2_red.png" alt="todo"/>}
    {title === "inprogress" && <img src="https://cdn-icons-png.flaticon.com/512/10760/10760660.png" alt="inprogress" className={styles.fire}/>}
    {title === "completed" && ( <span className={styles.check}> <FaCheck color="#f6f7f6" size={7} /> </span> )}

    <span className={`${styles.tasktitle} ${styles[`text_${title}`]}`}>
      {task.title}
    </span>
  </div>

  <div className={styles.menuWrapper}>
    <button
      className={styles.menuBtn}
      onClick={() => toggleMenu(task._id)}
    >
      <SlOptionsVertical size={10}/>
    </button>

    {openMenuId === task._id && (
      <div className={styles.menu}>
        {getMoveOptions(title).map((status) => (
          <button
            key={status}
            onClick={() => moveTask(task._id, status)}
          >
               {status}
          </button>
        ))}
      </div>
    )}
  </div>
</div>


  {title!="completed" && task.priority && (
    <div className={styles.bottomRow}>
      <span
        className={`${styles.badge} ${styles[task.priority.toLowerCase()]}`}
      >
        {task.priority}
      </span>
    </div>
  )}
</div>

        ))}
      </div>
    </div>
  );
}
