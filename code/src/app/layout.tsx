import { Outfit } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

import { SidebarProvider } from "@/context/SidebarContext";
import TanStackProvider from "@/providers/TanstackProvider";

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
      <body className={`${outfit.className}`}>
        <Toaster />
        <TanStackProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
