import { useContext, useState } from "react";
import { ModalContext } from "./ModalContext";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const modal = useContext(ModalContext);
  const router = useRouter();
  if (!modal) return null;
  const {
    showSignup,
    setShowSignup,
    setShowLogin,
    showSignupPassword,
    setShowSignupPassword,
    showSignupConfirm,
    setShowSignupConfirm,
    setShowFinishSetup,
  } = modal;

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Local state for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!showSignup) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const password = (form.password as HTMLInputElement).value;
    const passwordConfirm = (form.passwordConfirm as HTMLInputElement).value;

    // Frontend password confirmation check
    if (password !== passwordConfirm) {
      setError("Passwords do not match!");
      return;
    }

    setError(null);
    setLoading(true);

    const username = (form.username as HTMLInputElement).value;
    const email = (form.email as HTMLInputElement).value;

    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password, passwordConfirm }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setLoading(false);
    if (!data.success) {
      setError(data.error || "Registration failed.");
    } else {
      setError(null);
      setShowSignup(false);
      if (setShowFinishSetup) setShowFinishSetup(true);
      router.push("/dashboard");
    }
  };

  return (
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
          <form onSubmit={handleSubmit}>
            <label className="block mb-4">
              <span className="block text-gray-700 dark:text-gray-200 mb-1">
                Username
              </span>
              <input
                name="username"
                type="text"
                required
                className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Choose a username"
              />
            </label>
            <label className="block mb-4">
              <span className="block text-gray-700 dark:text-gray-200 mb-1">
                Email
              </span>
              <input
                name="email"
                type="email"
                required
                className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </label>
            <label className="block mb-4">
              <span className="block text-gray-700 dark:text-gray-200 mb-1">
                Password
              </span>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Create a password"
              />
            </label>
            <label className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword((v) => !v)}
                className="mr-2"
              />
              <span className="text-gray-700 dark:text-gray-200 text-sm">
                Show Password
              </span>
            </label>
            <label className="block mb-4">
              <span className="block text-gray-700 dark:text-gray-200 mb-1">
                Confirm Password
              </span>
              <input
                name="passwordConfirm"
                type={showConfirm ? "text" : "password"}
                required
                className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your password"
              />
            </label>
            <label className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={showConfirm}
                onChange={() => setShowConfirm((v) => !v)}
                className="mr-2"
              />
              <span className="text-gray-700 dark:text-gray-200 text-sm">
                Show Confirm Password
              </span>
            </label>
            {error && (
              <div className="text-red-500 mb-4 text-center">{error}</div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
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
  );
}