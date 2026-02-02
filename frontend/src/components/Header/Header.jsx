import styles from "./Header.module.css";
// import { NavLink } from "react-router-dom";
export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <span className={styles.logo}>🔗</span>
        <span className={styles.brand}>QuickTask Link</span>
      </div>

       {/* <NavLink to="/login" className={styles.loginBtn}>
          login
        </NavLink> */}
    </header>
  );
}
