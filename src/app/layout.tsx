import type { Metadata } from "next";
import { siteConfig } from "@/data/site";
import "./globals.css";

export const metadata: Metadata = {
  title: siteConfig.site.title,
  description: siteConfig.site.description,
  verification: {
    google: "y60SY33y7DfByknC6dPX685emqv1i1eLJf75wzmrn5E"
  },
  icons: {
    icon: "/images/site-icon.png",
    apple: "/images/site-icon.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
