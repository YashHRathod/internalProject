import styles from "./Dashboarddev.module.css";
import React from "react";
import { BsCalendar3Event } from "react-icons/bs";
import Column from "../Column/Coloum";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
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
  const {user}=useContext(AuthContext)
  console.log(user);
  const today = new Date();
  const year = today.getFullYear();
  const month = today.toLocaleString("default", { month: "short" }); // getMonth() is zero-based (0-11)
  const day = today.getDate();

  return (
    <div>
         <div className={styles.horizontal}></div>
      <div className={styles.title}>
        <div>
          <h2>Project Alpha Team</h2>
          <span>
            <span className={styles.icon}>
              <BsCalendar3Event />{" "}
            </span>{" "}
            {month} {day},{year}
          </span>
        </div>
        <button className={styles.cta}>+ Add new Task</button>
      </div>
     
      <div className={styles.board}>
        <Column
          title="todo"
          tasks={[
            { title: "Update API docs", priority: "Medium" },
            { title: "Code review", priority: "Low" },
          ]}
        //   count={2}
        />

        <Column
          title="inprogress"
          tasks={[{ title: "Fix login bug", priority: "High" }]}
        />

        <Column
          title="completed"
          tasks={[
            { title: "Setup dev environment" },
            { title: "Write unit tests" },
            { title: "Fix CSS issues" },
          ]}
        />
      </div>
    </div>
  );
}
