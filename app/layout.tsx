import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lost & Found App",
  description: "App to post lost and found items",
  generator: "Developer",
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
