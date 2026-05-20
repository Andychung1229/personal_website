import type { Metadata } from "next";
import { siteConfig } from "@/data/site";
import "./globals.css";

export const metadata: Metadata = {
  title: siteConfig.site.title,
  description: siteConfig.site.description
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
