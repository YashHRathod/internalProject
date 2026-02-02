import { NavLink } from "react-router-dom";
import styles from "./Home.module.css";
import {ArrowRightIcon,CheckCircleFillIcon} from '@primer/octicons-react'
export default function Home() {
  return (
    <section className={styles.home}>
      <h1 className={styles.title}>
        Manage Your Team's Daily <br />
        Tasks <span>Without the Overhead</span>
      </h1>
      <p className={styles.subtitle}>
        The fastest way to sync on daily goals. No accounts, no clutter, just
        progress.
      </p>

      <div className={styles.features}>
        <div className={styles.feature}><CheckCircleFillIcon size={20} />  No signup required for team members</div>
        <div className={styles.feature}><CheckCircleFillIcon size={20} />  Share links, start working instantly</div>
        <div className={styles.feature}><CheckCircleFillIcon size={20} />  See everyone's progress in real-time</div>
      </div>


      <NavLink to="/create-workspace" className={styles.cta}>
        Create Workspace - I'm a Team Lead <ArrowRightIcon size={16} />
      </NavLink>

      <p className={styles.linkText}>
        Already have a link?{" "}
        <NavLink to="/board" className={styles.link}>
          Just click it to access your board
        </NavLink>
      </p>
    </section>
  );
}
