"use client";
import { useContext } from "react";
import { ModalContext } from "../components/ModalContext";
import FadeInSection from "../components/FadeInSection";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const modal = useContext(ModalContext);
  if (!modal) throw new Error("ModalContext not found");
  const { setShowLogin, setShowSignup } = modal;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 relative">
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



