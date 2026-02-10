import styles from "./DashboardDev.module.css";
import React, { useEffect, useState, useContext } from "react";
import { BsCalendar3Event } from "react-icons/bs";
import { GoPlus } from "react-icons/go";
import Column from "../../Functions/Column/Coloum";
import { AuthContext } from "../../../context/AuthContext";
import AddTaskModal from "../../Functions/AddtaskModel/AddTaskModel";

export default function DashboardDev() {
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.toLocaleString("default", { month: "short" });
  const day = today.getDate();

  const createTask = async (taskData) => {
    try {
      const token = localStorage.getItem("token");
      const workspaceId = localStorage.getItem("workspace");

      if (!workspaceId) {
        console.error("Workspace ID missing in localStorage");
        return;
      }

      const res = await fetch(
        `http://localhost:3000/task/${workspaceId}/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(taskData),
        },
      );

      const newres = await res.json();
      const newTask = newres.data;
      console.log("Created task", newTask);
      setTasks((prev) => [...prev, newTask]);
    } catch (err) {
      console.error("Failed to create task", err);
    }
  };

  useEffect(() => {
    if (!user?._id) return;

    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:3000/task/getalldevtask`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("DEV TASK RESPONSE:", data.data);

        setTasks(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        console.error("Failed to fetch developer tasks", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  const normalizeStatus = (status) => {
    if (status === "pending") return "todo";
    return status;
  };

  const groupedTasks = {
    todo: [],
    inprogress: [],
    completed: [],
  };

  if (Array.isArray(tasks)) {
    tasks.forEach((task) => {
      console.log(task);
      const status = normalizeStatus(task.status);
      groupedTasks[status]?.push(task);
    });
  }
  if (loading) return <p>Loading tasks...</p>;

  return (
    <div>
      <div className={styles.horizontal}></div>

      <div className={styles.title}>
        <div>
          <h2>{user?.name || "Developer Dashboard"}</h2>
          <span>
            <span className={styles.icon}>
              <BsCalendar3Event size={12} />
            </span>
            <span>
              {month} {day}, {year}
            </span>
          </span>
        </div>

        <button onClick={() => setShowModal(true)} className={styles.cta}>
          <GoPlus size={20} className={styles.plus} />
          Add new Task
        </button>
      </div>
      {showModal && (
        <AddTaskModal
          onClose={() => setShowModal(false)}
          onCreate={(task) => {
            createTask(task);
            console.log(task);
          }}
        />
      )}

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
