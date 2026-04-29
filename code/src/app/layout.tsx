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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LazyToaster />
        {children}
      </body>
    </html>
  );
}
