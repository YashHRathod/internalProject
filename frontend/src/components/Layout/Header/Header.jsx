import styles from "./Header.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { IoMdLink } from "react-icons/io";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { clearWorkspace } from "../../../store/workspaceSlice";
import { useDispatch } from "react-redux";
export default function Header() {
  const dispatch =useDispatch()
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const fun = () => {
    if (!user) navigate("/login");
    if (user) {
      setUser("");
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      dispatch(clearWorkspace());
    }
  };
  return (
    <div>
      <header className={styles.header}>
        <div className={styles.left}>
          <span className={styles.logo}>
            <IoMdLink color={"blue"} size={25} />
          </span>
          <span className={styles.brand}>Orcas</span>
        </div>

        <button onClick={fun} className={styles.loginBtn}>
          {user ? "Logout" : "Login"}
        </button>
      </header>
      <div className={styles.line} />
    </div>
  );
}
