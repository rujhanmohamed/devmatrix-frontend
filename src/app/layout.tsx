import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevMatrix | Smart Production Planning",
  description: "Production planning and schedule optimization workspace.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
