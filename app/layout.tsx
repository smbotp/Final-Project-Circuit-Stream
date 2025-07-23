"use client";
import { useState, createContext } from "react";
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

export interface ModalContextType {
  showLogin: boolean;
  setShowLogin: (v: boolean) => void;
  showSignup: boolean;
  setShowSignup: (v: boolean) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  showSignupPassword: boolean;
  setShowSignupPassword: (v: boolean) => void;
  showSignupConfirm: boolean;
  setShowSignupConfirm: (v: boolean) => void;
}
export const ModalContext = createContext<ModalContextType | null>(null);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 min-h-screen`}
      >
        <ModalContext.Provider
          value={{
            showLogin,
            setShowLogin,
            showSignup,
            setShowSignup,
            showPassword,
            setShowPassword,
            showSignupPassword,
            setShowSignupPassword,
            showSignupConfirm,
            setShowSignupConfirm,
          }}
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
              <button
                onClick={() => setShowLogin(true)}
                className="px-4 py-2 rounded-lg font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900 transition"
              >
                Login
              </button>
              <button
                onClick={() => setShowSignup(true)}
                className="px-4 py-2 rounded-lg font-semibold bg-blue-700 text-white hover:bg-blue-800 transition"
              >
                Sign Up
              </button>
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

          {/* Login Modal */}
          {showLogin && (
            <>
              <div
                className="fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300"
                onClick={() => setShowLogin(false)}
              />
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 w-full max-w-md relative transition-all duration-300 animate-fadeIn">
                  <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl"
                    onClick={() => setShowLogin(false)}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                  <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
                    Login to Your Portfolio
                  </h2>
                  <form>
                    <label className="block mb-4">
                      <span className="block text-gray-700 dark:text-gray-200 mb-1">
                        Username
                      </span>
                      <input
                        type="text"
                        className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your username"
                      />
                    </label>
                    <label className="block mb-6 relative">
                      <span className="block text-gray-700 dark:text-gray-200 mb-1">
                        Password
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-8 text-gray-400 hover:text-blue-600"
                        onClick={() => setShowPassword((v) => !v)}
                        tabIndex={-1}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          // Eye-off SVG
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.364 6.364A9.956 9.956 0 0022 12c0-5.523-4.477-10-10-10-1.657 0-3.22.403-4.575 1.125M3 3l18 18" />
                          </svg>
                        ) : (
                          // Eye SVG
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" />
                          </svg>
                        )}
                      </button>
                    </label>
                    <button
                      type="submit"
                      className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition"
                    >
                      Login
                    </button>
                  </form>
                  <div className="mt-4 text-center">
                    <button
                      className="text-blue-700 dark:text-blue-400 underline"
                      onClick={() => {
                        setShowLogin(false);
                        setShowSignup(true);
                      }}
                    >
                      Don&apos;t have an account? Sign up
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Signup Modal */}
          {showSignup && (
            <>
              <div
                className="fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300"
                onClick={() => setShowSignup(false)}
              />
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 w-full max-w-md relative transition-all duration-300 animate-fadeIn">
                  <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl"
                    onClick={() => setShowSignup(false)}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                  <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
                    Sign Up for Your Portfolio
                  </h2>
                  <form>
                    <label className="block mb-4">
                      <span className="block text-gray-700 dark:text-gray-200 mb-1">
                        Username
                      </span>
                      <input
                        type="text"
                        className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Choose a username"
                      />
                    </label>
                    <label className="block mb-4">
                      <span className="block text-gray-700 dark:text-gray-200 mb-1">
                        Email
                      </span>
                      <input
                        type="email"
                        className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email"
                      />
                    </label>
                    <label className="block mb-4 relative">
                      <span className="block text-gray-700 dark:text-gray-200 mb-1">
                        Password
                      </span>
                      <input
                        type={showSignupPassword ? "text" : "password"}
                        className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-8 text-gray-400 hover:text-blue-600"
                        onClick={() => setShowSignupPassword((v) => !v)}
                        tabIndex={-1}
                        aria-label={showSignupPassword ? "Hide password" : "Show password"}
                      >
                        {showSignupPassword ? (
                          // Eye-off SVG
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.364 6.364A9.956 9.956 0 0022 12c0-5.523-4.477-10-10-10-1.657 0-3.22.403-4.575 1.125M3 3l18 18" />
                          </svg>
                        ) : (
                          // Eye SVG
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" />
                          </svg>
                        )}
                      </button>
                    </label>
                    <label className="block mb-6 relative">
                      <span className="block text-gray-700 dark:text-gray-200 mb-1">
                        Confirm Password
                      </span>
                      <input
                        type={showSignupConfirm ? "text" : "password"}
                        className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                        placeholder="Re-enter your password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-8 text-gray-400 hover:text-blue-600"
                        onClick={() => setShowSignupConfirm((v) => !v)}
                        tabIndex={-1}
                        aria-label={showSignupConfirm ? "Hide password" : "Show password"}
                      >
                        {showSignupConfirm ? (
                          // Eye-off SVG
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.364 6.364A9.956 9.956 0 0022 12c0-5.523-4.477-10-10-10-1.657 0-3.22.403-4.575 1.125M3 3l18 18" />
                          </svg>
                        ) : (
                          // Eye SVG
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" />
                          </svg>
                        )}
                      </button>
                    </label>
                    <button
                      type="submit"
                      className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition"
                    >
                      Sign Up
                    </button>
                  </form>
                  <div className="mt-4 text-center">
                    <button
                      className="text-blue-700 dark:text-blue-400 underline"
                      onClick={() => {
                        setShowSignup(false);
                        setShowLogin(true);
                      }}
                    >
                      Already have an account? Login
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </ModalContext.Provider>
      </body>
    </html>
  );
}
