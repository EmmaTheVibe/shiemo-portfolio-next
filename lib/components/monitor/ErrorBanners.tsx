import type { RunError } from "@/lib/monitor/types";
import styles from "./Monitor.module.css";

type Props = { dbError: string | null; runErrors: RunError[] };

export function ErrorBanners({ dbError, runErrors }: Props) {
  return (
    <>
      {dbError && <p className={styles.errorBanner}>Database: {dbError}</p>}
      {runErrors.length > 0 && (
        <div className={styles.errorBanner}>
          Last discovery run had errors:
          {runErrors.map((e, i) => (
            <p key={i}>
              {e.source}: {e.message}
            </p>
          ))}
        </div>
      )}
    </>
  );
}
