import { Outfit } from "next/font/google";
import "./globals.css";

import LazyToaster from "@/providers/LazyToaster";

export const metadata = {
  title: {
    default: "IRIS",
    template: "%s | IRIS",
  },
  description:
    "IRIS is a web-based intellectual property application management system.",
};

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <LazyToaster />
        {children}
      </body>
    </html>
  );
}
