import type { Metadata } from "next";
import "../src/index.css";

export const metadata: Metadata = {
  title: "Aroha",
  description: "Serenity App",
};

import { Header } from "../components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Albert+Sans:ital,wght@0,100..900;1,100..900&family=Lora:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
      </head>
      <body>
        <Header />
        <div className="pt-20 min-h-[calc(100vh-5rem)] flex flex-col items-stretch">
          {children}
        </div>
      </body>
    </html>
  );
}
