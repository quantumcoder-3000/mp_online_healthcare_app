import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareFlow — Voice Intake",
  description: "CareFlow healthcare orchestration prototype — voice intake module.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
