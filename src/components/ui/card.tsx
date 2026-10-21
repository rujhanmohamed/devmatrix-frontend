import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  as?: "article" | "section";
};

export function Card({ children, as = "section", className = "", ...props }: CardProps) {
  const Component = as;
  return <Component className={`surface-card ${className}`.trim()} {...props}>{children}</Component>;
}