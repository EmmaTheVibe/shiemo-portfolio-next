import { discoverNow, logout } from "@/app/monitor/actions";
import { StackButton } from "./StackButton";
import styles from "./Monitor.module.css";

export function MonitorHeader() {
  return (
    <header className={styles.header}>
      <div>
        <p className="section-label">Private</p>
        <h1 className={styles.title}>
          Monitor<span className="accent-dot">.</span>
        </h1>
      </div>
      <div className={styles.headerActions}>
        <form action={discoverNow}>
          <StackButton label="Run" pendingLabel="Running…" />
        </form>
        <form action={logout}>
          <StackButton label="Log out" pendingLabel="Logging out…" light />
        </form>
      </div>
    </header>
  );
}
