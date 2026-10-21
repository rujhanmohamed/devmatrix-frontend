import type { ReactNode } from "react";

export type StatusKind = "candidate" | "published" | "warning" | "neutral";

export function StatusBadge({ kind, children }: { kind: StatusKind; children: ReactNode }) {
  return <span className={`status-badge status-badge--${kind}`}>{children}</span>;
}