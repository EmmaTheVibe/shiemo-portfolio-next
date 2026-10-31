"use client";

import Link, { useLinkStatus } from "next/link";
import type { ReactNode } from "react";
import styles from "./Monitor.module.css";

function Label({ children }: { children: ReactNode }) {
  const { pending } = useLinkStatus();
  return <span className={pending ? styles.linkPending : undefined}>{children}</span>;
}

export function PendingLink({ href, className, children, ...rest }: {
  href: string;
  className?: string;
  children: ReactNode;
  "aria-current"?: "page";
}) {
  return (
    <Link href={href} className={className} prefetch={false} {...rest}>
      <Label>{children}</Label>
    </Link>
  );
}
