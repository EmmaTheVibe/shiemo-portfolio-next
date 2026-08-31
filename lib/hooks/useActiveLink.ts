"use client";

import { usePathname } from "next/navigation";

export function useActiveLink() {
  const pathname = usePathname();

  return (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };
}
