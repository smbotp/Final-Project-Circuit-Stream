"use client";
import FadeInSection from "../components/FadeInSection";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);

  // Example: If you have nav/notification buttons, call these handlers:
  // <button onClick={() => setShowLogin(true)}>Login</button>
  // <button onClick={() => setShowSignup(true)}>Sign Up</button>

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 relative">
      {/* Login Modal Overlay */}
      {showLogin && (
        <>
          {/* Dark overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300"
            onClick={() => setShowLogin(false)}
          />
          {/* Modal with fade-in */}
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 w-full max-w-md relative transition-all duration-300 animate-fadeIn">
              {/* Close button */}
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.364 6.364A9.956 9.956 0 0022 12c0-5.523-4.477-10-10-10-1.657 0-3.22.403-4.575 1.125M3 3l18 18"
                        />
                      </svg>
                    ) : (
                      // Eye SVG
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"
                        />
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
                  Do not have an account? Sign up
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Signup Modal Overlay */}
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.364 6.364A9.956 9.956 0 0022 12c0-5.523-4.477-10-10-10-1.657 0-3.22.403-4.575 1.125M3 3l18 18"
                        />
                      </svg>
                    ) : (
                      // Eye SVG
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"
                        />
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.364 6.364A9.956 9.956 0 0022 12c0-5.523-4.477-10-10-10-1.657 0-3.22.403-4.575 1.125M3 3l18 18"
                        />
                      </svg>
                    ) : (
                      // Eye SVG
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"
                        />
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

      {/* Hero Section */}
      <FadeInSection>
        <section className="w-full flex flex-col items-center justify-center py-28 px-4">
          <div className="mb-8">
            {/* Chess Portfolio SVG or Icon */}
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="7" r="4" fill="#2563eb" />
              <rect x="8" y="11" width="8" height="7" rx="3" fill="#2563eb" />
              <rect x="6" y="18" width="12" height="3" rx="1.5" fill="#1e293b" />
            </svg>
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-white text-center mb-6 leading-tight">
            Your Chess Portfolio, <br />
            <span className="text-blue-700 dark:text-blue-400">
              Analyzed & Enhanced.
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 text-center max-w-2xl mb-10">
            Connect your chess.com and lichess accounts, add your OTB games, and
            get deep insights into your play. Discover critical moments, generate
            custom puzzles, and explore new opening ideas—all in one place.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setShowSignup(true)}
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 px-12 rounded-full shadow-lg text-lg transition"
            >
              Get Started
            </button>
            <button
              onClick={() => setShowLogin(true)}
              className="bg-white border border-blue-700 text-blue-700 font-bold py-4 px-12 rounded-full shadow-lg text-lg transition hover:bg-blue-50"
            >
              Login
            </button>
          </div>
        </section>
      </FadeInSection>

      {/* Features Section */}
      <FadeInSection>
        <section className="w-full flex flex-col items-center justify-center py-20 px-4 bg-white dark:bg-gray-900">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Everything You Need to Master Your Chess Journey
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl">
            <div className="flex flex-col items-center">
              <Image src="/connect.svg" alt="Connect" width={64} height={64} />
              <h3 className="text-xl font-semibold mt-4 mb-2 text-blue-700 dark:text-blue-400">
                Connect Accounts
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Instantly link your chess.com and lichess profiles. All your
                games, stats, and progress in one place.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/otb.svg" alt="OTB" width={64} height={64} />
              <h3 className="text-xl font-semibold mt-4 mb-2 text-blue-700 dark:text-blue-400">
                OTB Game Library
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Manually add your over-the-board games. Keep your real-world
                chess history organized and searchable.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/analysis.svg" alt="Analysis" width={64} height={64} />
              <h3 className="text-xl font-semibold mt-4 mb-2 text-blue-700 dark:text-blue-400">
                Deep Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Get instant feedback on your games. Spot critical moments,
                blunders, and missed opportunities with powerful analysis tools.
              </p>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Puzzles & Openings Section */}
      <FadeInSection>
        <section className="w-full flex flex-col items-center justify-center py-20 px-4 bg-gray-100 dark:bg-gray-800">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Unlock Your Potential
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl">
            <div className="flex flex-col items-center">
              <Image src="/puzzle.svg" alt="Puzzles" width={64} height={64} />
              <h3 className="text-xl font-semibold mt-4 mb-2 text-blue-700 dark:text-blue-400">
                Custom Puzzles
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Turn your own games into training puzzles. Practice tactics from
                your real mistakes and critical moments.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/openings.svg" alt="Openings" width={64} height={64} />
              <h3 className="text-xl font-semibold mt-4 mb-2 text-blue-700 dark:text-blue-400">
                Opening Explorer
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                See which openings bring you the most success. Get suggestions
                for new lines to try and track your improvement.
              </p>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Call to Action Section */}
      <FadeInSection>
        <section className="w-full flex flex-col items-center justify-center py-16 px-4 bg-blue-700">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">
            Ready to Level Up Your Chess?
          </h2>
          <p className="text-lg text-blue-100 text-center mb-8 max-w-2xl">
            Join now and start building your ultimate chess portfolio. Analyze
            your games, discover your strengths, and become the player you want
            to be.
          </p>
          <Link
            href="/dashboard"
            className="bg-white hover:bg-blue-100 text-blue-700 font-bold py-4 px-12 rounded-full shadow-lg text-lg transition"
          >
            Start Your Journey
          </Link>
        </section>
      </FadeInSection>
    </div>
  );
}


