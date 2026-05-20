import type { Metadata } from "next";
import { siteConfig } from "@/data/site";
import "./globals.css";

export const metadata: Metadata = {
  title: siteConfig.site.title,
  description: siteConfig.site.description,
  icons: {
    icon: "/images/icon_image.jpeg",
    apple: "/images/icon_image.jpeg"
  }
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
