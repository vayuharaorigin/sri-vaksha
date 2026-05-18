import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "PaintFlow | Premium Inventory Management",
  description: "High-end SaaS inventory management dashboard for paint shops.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className={cn(inter.variable, "font-sans min-h-screen bg-background text-foreground")}>
        {children}
      </body>
    </html>
  );
}
