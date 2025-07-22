import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chess Tournament Recorder",
  description: "Record, validate, and share your chess games with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 min-h-screen`}
      >
        {/* Nav Bar */}
        <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur shadow flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="7" r="4" fill="#2563eb" />
                <rect x="8" y="11" width="8" height="7" rx="3" fill="#2563eb" />
                <rect x="6" y="18" width="12" height="3" rx="1.5" fill="#1e293b" />
              </svg>
              <span className="font-bold text-lg text-blue-700 dark:text-blue-300">
                ChessCompanion
              </span>
            </Link>
            {/* Nav Links */}
            <div className="hidden md:flex gap-6 ml-8">
              <Link
                href="/"
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
              >
                Home
              </Link>
              <Link
                href="/upload"
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
              >
                Upload
              </Link>
              <Link
                href="/my-games"
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
              >
                My Games
              </Link>
              <Link
                href="/friends"
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
              >
                Friends
              </Link>
            </div>
          </div>
          {/* Auth Buttons + Notification Bell */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900 transition"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-lg font-semibold bg-blue-700 text-white hover:bg-blue-800 transition"
            >
              Sign Up
            </Link>
            <Link
              href="/notifications"
              className="relative ml-2 p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition"
              aria-label="Notifications"
            >
              {/* Bell Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-7 h-7 text-blue-700 dark:text-blue-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a2.001 2.001 0 01-3.714 0M21 19H3m16-6a8 8 0 10-16 0c0 3.866 2.239 7.5 8 7.5s8-3.634 8-7.5z"
                />
              </svg>
              {/* Notification Dot */}
              <span className="absolute top-1 right-1 block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </Link>
          </div>
        </nav>
        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
