import styles from "./Dashboard.module.css";
import React from "react";
import { BsCalendar3Event } from "react-icons/bs";
import Column from "../Column/Coloum";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { GoPlus } from "react-icons/go";
// const tempTasks = [
//   {
//     workspace: "65cfa12e9b23a123456789ab",
//     title: "Setup JWT Authentication",
//     description: "Implement login, register, and protect routes using JWT",
//     priority: "high",
//     status: "pending",
//   },
//   {
//     workspace: "65cfa12e9b23a123456789ab",
//     title: "Design Workspace Schema",
//     description: "Finalize workspace and task relationship in MongoDB",
//     priority: "low",
//     status: "inprogress",
//   },
//   {
//     workspace: "65cfa12e9b23a123456789ab",
//     title: "Fix Task Priority Update Bug",
//     description: "Resolve logical condition issue in priority validation",
//     priority: "high",
//     status: "completed",
//   },
//   {
//     workspace: "65cfa12e9b23a123456789ab",
//     title: "Cleanup Controllers",
//     description:
//       "Refactor task and workspace controllers for better readability",
//     // priority omitted → default: "low"
//     // status omitted → default: "pending"
//   },
// ];

export default function Dashboard() {
  const { workspaceId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [workspace,setWorkspace]=useState("");
  const today = new Date();
  const year = today.getFullYear();
  const month = today.toLocaleString("default", { month: "short" }); // getMonth() is zero-based (0-11)
  const day = today.getDate();
  const { workspaceName } = useSelector((state) => state.workspace);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:3000/task/${workspaceId}/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();
        setTasks(data);
        console.log(data);
        // setWorkspace(data[0].workspace.workspace);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [workspaceId]);

  const normalizeStatus = (status) => {
    if (status === "pending") return "todo";
    return status;
  };

  const groupedTasks = {
    todo: [],
    inprogress: [],
    completed: [],
  };

  tasks.forEach((task) => {
    const status = normalizeStatus(task.status);
    groupedTasks[status]?.push(task);
  });
  if (loading) return <p>Loading tasks...</p>;
  return (
    <div>
      {/* <div className={styles.horizontal}></div> */}

      <div className={styles.title}>
        <div>
          <div className={styles.heading}>{workspaceName || "Workspace"}</div>

          <span>
            <span className={styles.icon}>
              <BsCalendar3Event size={10} />
            </span>
            <span className={styles.dts}>
              {month} {day}, {year}
            </span>
          </span>
        </div>
        <button className={styles.cta}>
          <GoPlus size={20} className={styles.plus} />
          Add New Developer
        </button>
      </div>

      <div className={styles.board}>
        <Column title="todo" tasks={groupedTasks.todo} setTasks={setTasks} />

        <Column
          title="inprogress"
          tasks={groupedTasks.inprogress}
          setTasks={setTasks}
        />
  
        <Column
          title="completed"
          tasks={groupedTasks.completed}
          setTasks={setTasks}
        />
      </div>
    </div>
  );
}
