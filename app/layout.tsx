import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@components/navbar";
import AuthSesssion from "@components/AuthSesssion";
import Notification from "@components/Notification";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Home Mart | Home",
  description: "Home Decor Related Services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthSesssion>
      <html lang="en">
        <body className={inter.className}>
          <Navbar />
          {children}
          <Notification />
        </body>
      </html>
    </AuthSesssion>
  );
}
