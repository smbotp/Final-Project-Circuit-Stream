import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { ModalContext } from "./ModalContext"; // <-- FIXED IMPORT

export default function FinishSetupModal() {
  const modal = useContext(ModalContext);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  if (!modal || !modal.showFinishSetup) return null;
  const { setShowFinishSetup } = modal;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const chesscom = (form.chesscom as HTMLInputElement).value;
    const lichess = (form.lichess as HTMLInputElement).value;
    const fide = (form.fide as HTMLInputElement).value;
    const uscf = (form.uscf as HTMLInputElement).value;

    const res = await fetch("/api/finish-setup", {
      method: "POST",
      body: JSON.stringify({ chesscom, lichess, fide, uscf }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (!data.success) {
      setError(data.error || "Failed to save details.");
    } else {
      setShowFinishSetup(false);
      router.push("/dashboard");
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300"
        onClick={() => setShowFinishSetup(false)}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 w-full max-w-md relative transition-all duration-300 animate-slideIn">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl"
            onClick={() => setShowFinishSetup(false)}
            aria-label="Close"
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
            Finish Setting Up Your Account
          </h2>
          <form onSubmit={handleSubmit}>
            <label className="block mb-4">
              <span className="block text-gray-700 dark:text-gray-200 mb-1">
                Chess.com Username (optional)
              </span>
              <input name="chesscom" type="text" className="w-full px-4 py-2 rounded border" />
            </label>
            <label className="block mb-4">
              <span className="block text-gray-700 dark:text-gray-200 mb-1">
                Lichess Username (optional)
              </span>
              <input name="lichess" type="text" className="w-full px-4 py-2 rounded border" />
            </label>
            <label className="block mb-4">
              <span className="block text-gray-700 dark:text-gray-200 mb-1">
                FIDE ID (optional)
              </span>
              <input name="fide" type="text" className="w-full px-4 py-2 rounded border" />
            </label>
            <label className="block mb-6">
              <span className="block text-gray-700 dark:text-gray-200 mb-1">
                USCF ID (optional)
              </span>
              <input name="uscf" type="text" className="w-full px-4 py-2 rounded border" />
            </label>
            {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition"
            >
              Save Details
            </button>
          </form>
        </div>
      </div>
    </>
  );
}