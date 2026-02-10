import styles from "./Home.module.css";
import { ArrowRightIcon, CheckCircleFillIcon } from "@primer/octicons-react";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import CreateWorkspaceModal from "../../Functions/CreateWorkspaceModal/CreateWorkspaceModal";
import GotoDashboard from "../../Functions/GotoDashboard/GotoDashboard";
// import { FcCheckmark } from "react-icons/fc";
// import CheckIcon from "./checkIcon"
export default function Home() {
  const [openCreate, setOpenCreate] = useState(false);
  const [openGoto, setOpenGoto] = useState(false);

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
        <div className={styles.feature}>
        <span className={styles.check}> <FaCheck   color="#3b82f6" size={10}/></span> No signup required
          for team members
        </div>
        <div className={styles.feature}>
          <span className={styles.check}> <FaCheck   color="#3b82f6" size={10}/></span>  Share links, start working instantly
        </div>
        <div className={styles.feature}>
          <span className={styles.check}> <FaCheck   color="#3b82f6" size={10}/></span>  See everyone's progress in real-time
        </div>
      </div>

      <button onClick={() => setOpenCreate(true)} className={styles.cta}>
        Create Workspace – I'm a Team Lead{" "}
        <ArrowRightIcon size={16} />
      </button>

      <CreateWorkspaceModal
        isOpen={openCreate}
        onClose={() => setOpenCreate(false)}
      />
      <div className={styles.orgroup}>
      <span className={styles.orline}></span>
      <span className={styles.or}>OR</span>
      <span className={styles.orline}></span>
      </div>

      <p className={styles.linkText}>
        Already have a workspace?{" "}
        <button onClick={() => setOpenGoto(true)} className={styles.link}>
          Just click to access your board
        </button>
      </p>

      <GotoDashboard isOpen={openGoto} onClose={() => setOpenGoto(false)} />
    </section>
  );
}
