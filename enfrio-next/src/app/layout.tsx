import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Enfrio",
  description: "Engineering and manufacturing solutions for thermal performance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
