import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
})


export const metadata: Metadata = {
  title: "Scrap Dai",
  description: "Sell your scrap online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} `}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
