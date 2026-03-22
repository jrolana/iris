import { Outfit } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

import { SidebarProvider } from "@/context/SidebarContext";
import TanStackProvider from "../providers/TanStackProvider";
import UserProvider from "@/providers/UserProvider";

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
          <UserProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </UserProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
