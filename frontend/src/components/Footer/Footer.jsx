import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <main className={styles.main}>
    <footer className={styles.footer}>
      <p className={styles.copy}>
        © 2023 QuickTask Link. All rights reserved.
      </p>

      <div className={styles.links}>
        <a href="#" className={styles.link}>Privacy</a>
        <a href="#" className={styles.link}>Terms</a>
        <a href="#" className={styles.link}>Contact</a>
      </div>
    </footer>
    </main>
  );
}
