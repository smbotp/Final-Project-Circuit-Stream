import { Dispatch, SetStateAction, useContext, useState } from "react";
import { ModalContext } from "./ModalContext";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  setIsLoggedIn?: Dispatch<SetStateAction<boolean>>;
}

export default function LoginForm({ setIsLoggedIn = () => {} }: LoginFormProps) {
  const modal = useContext(ModalContext);
  const router = useRouter();
  if (!modal) return null;
  const { showLogin, setShowLogin, setShowSignup } = modal;

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const username = usernameValue;
    const password = passwordValue;

    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      localStorage.setItem("loggedInUser", username);
      setIsLoggedIn(true); // update navbar state
      setShowLogin(false);
      router.push("/dashboard");
    } else {
      setError(data.error || "Login failed.");
      setInputError(true);
      setShake(true);
      setUsernameValue("");
      setPasswordValue("");
      setTimeout(() => setShake(false), 500); // Remove shake after animation
    }
  };

  if (!showLogin) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300"
        onClick={() => {
          setShowLogin(false);
          setError(null);
          setInputError(false);
          setShake(false);
          setUsernameValue("");
          setPasswordValue("");
        }}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className={`bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 w-full max-w-md relative transition-all duration-300 animate-fadeIn ${
            shake ? "animate-shake" : ""
          }`}
        >
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl"
            onClick={() => {
              setShowLogin(false);
              setError(null);
              setInputError(false);
              setShake(false);
              setUsernameValue("");
              setPasswordValue("");
            }}
            aria-label="Close"
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
            Login to Your Account
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
                value={usernameValue}
                onChange={(e) => setUsernameValue(e.target.value)}
                className={`w-full px-4 py-2 rounded border ${
                  inputError
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-700"
                } bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your username"
                onFocus={() => setInputError(false)}
              />
            </label>
            <label className="block mb-2">
              <span className="block text-gray-700 dark:text-gray-200 mb-1">
                Password
              </span>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                className={`w-full px-4 py-2 rounded border ${
                  inputError
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-700"
                } bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your password"
                onFocus={() => setInputError(false)}
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
            {error && (
              <div className="text-red-500 mb-4 text-center">{error}</div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition"
              disabled={loading || shake}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <div className="mt-4 text-center">
            <button
              className="text-blue-700 dark:text-blue-400 underline"
              onClick={() => {
                setShowLogin(false);
                setError(null);
                setInputError(false);
                setShake(false);
                setUsernameValue("");
                setPasswordValue("");
                setShowSignup(true);
              }}
            >
              Don't have an account? Sign Up
            </button>
          </div>
        </div>
      </div>
    </>
  );
}