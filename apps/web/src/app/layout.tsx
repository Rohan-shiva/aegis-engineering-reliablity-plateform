import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aegis — AI Engineering Reliability & Operations Platform",
  description: "Continuous telemetry, automated anomaly detection, incident response, and AI root cause investigation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body className="h-full bg-background text-slate-100 antialiased selection:bg-brand/30 selection:text-brand-light">
        {children}
      </body>
    </html>
  );
}
