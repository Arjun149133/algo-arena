import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@providers/AuthProvider";
import { Toaster } from "@components/components/ui/sonner";

export const metadata: Metadata = {
  title: "Algo-arena",
  description: "Prepare for Your Next Coding Interview",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
