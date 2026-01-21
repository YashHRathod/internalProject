import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <span className={styles.logo}>🔗</span>
        <span className={styles.brand}>QuickTask Link</span>
      </div>

      <button className={styles.loginBtn}>Login</button>
    </header>
  );
}
