import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { UserProvider } from "@/context/UserContext";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InterBit - AI-Powered Interview Platform",
  description: "Book mock interviews with top mentors or practice with our AI interviewer. Get instant feedback, performance insights, and skill recommendations — all in one place.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <UserProvider>
          {children}
          <Toaster position="top-right" />
        </UserProvider>
      </body>
    </html>
  );
}
