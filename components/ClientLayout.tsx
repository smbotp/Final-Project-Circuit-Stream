"use client";
import { useState, useEffect } from "react";
import { ModalContext } from "./ModalContext";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import FinishSetupModal from "./FinishSetupModal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);
  const [showFinishSetup, setShowFinishSetup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("loggedInUser"));
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  return (
    <ModalContext.Provider value={{
      showLogin, setShowLogin,
      showSignup, setShowSignup,
      showPassword, setShowPassword,
      showSignupPassword, setShowSignupPassword,
      showSignupConfirm, setShowSignupConfirm,
      showFinishSetup, setShowFinishSetup,
    }}>
      {/* Full Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 shadow">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-700">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="7" r="4" fill="#2563eb" />
              <rect x="8" y="11" width="8" height="7" rx="3" fill="#2563eb" />
              <rect x="6" y="18" width="12" height="3" rx="1.5" fill="#1e293b" />
            </svg>
            Chess Portfolio
          </Link>
          {isLoggedIn && (
            <div className="flex gap-6">
              <Link href="/dashboard" className="text-gray-700 dark:text-gray-200 hover:text-blue-700 font-medium">
                Dashboard
              </Link>
              <Link href="/upload" className="text-gray-700 dark:text-gray-200 hover:text-blue-700 font-medium">
                Upload
              </Link>
              <Link href="/friends" className="text-gray-700 dark:text-gray-200 hover:text-blue-700 font-medium">
                Friends
              </Link>
              <Link href="/notifications" className="text-gray-700 dark:text-gray-200 hover:text-blue-700 font-medium">
                Notifications
              </Link>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <button
                className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded transition"
                onClick={() => {
                  localStorage.removeItem("loggedInUser");
                  setIsLoggedIn(false);
                  router.push("/");
                }}
              >
                Log Out
              </button>
              <button
                className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-gray-800 transition"
                aria-label="Notifications"
                onClick={() => router.push("/notifications")}
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2Zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z"
                    stroke="#2563eb"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </button>
            </>
          ) : (
            <>
              <button
                className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded transition"
                onClick={() => setShowLogin(true)}
              >
                Login
              </button>
              <button
                className="bg-white hover:bg-blue-100 text-blue-700 font-bold py-2 px-6 rounded transition border border-blue-700"
                onClick={() => setShowSignup(true)}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>
      <LoginForm setIsLoggedIn={setIsLoggedIn} />
      <SignupForm />
      <FinishSetupModal />
      <main>{children}</main>
    </ModalContext.Provider>
  );
}