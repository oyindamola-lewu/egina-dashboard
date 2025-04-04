import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google"; // Replace Geist with Roboto
import "./globals.css";

// Define Roboto for sans-serif (replacing Geist)
const robotoSans = Roboto({
  variable: "--font-roboto-sans", // Custom CSS variable (optional)
  subsets: ["latin"],
  weight: ["400", "700"], // Add weights you need (e.g., regular and bold)
});

// Define Roboto Mono for monospace (replacing Geist_Mono)
const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono", // Custom CSS variable (optional)
  subsets: ["latin"],
  weight: ["400"], // Monospace typically uses fewer weights
});

export const metadata: Metadata = {
  title: "Egina Wells Dashboard",
  description: "Dashboard for Egina wells",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${robotoSans.variable} ${robotoMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}