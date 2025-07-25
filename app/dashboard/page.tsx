"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const username = localStorage.getItem("loggedInUser");
    if (!username) return;
    fetch("/api/user", {
      method: "POST",
      body: JSON.stringify({ username }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => setUser(data.user));
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f3eb] dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8">
          Hello,{" "}
          <span className="text-blue-700">{user?.username || "User"}</span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chessboard + XP */}
          <div className="md:col-span-1 flex flex-col items-center">
            {/* Placeholder chessboard */}
            <div className="w-56 h-56 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-lg flex items-center justify-center mb-4">
              {/* Replace with chessboard SVG or component */}
              <span className="text-6xl">♜</span>
            </div>
            <div className="w-full bg-green-700 text-white rounded-lg py-3 px-4 text-center font-semibold text-lg">
              XP until LVL [ ]
            </div>
            {/* Show FIDE/USCF/Chess.com/Lichess if present */}
            <div className="mt-4 space-y-1 text-sm text-gray-700 dark:text-gray-200">
              {user?.fide && <div>FIDE ID: {user.fide}</div>}
              {user?.uscf && <div>USCF ID: {user.uscf}</div>}
              {user?.chesscom && <div>Chess.com: {user.chesscom}</div>}
              {user?.lichess && <div>Lichess: {user.lichess}</div>}
            </div>
          </div>
          {/* Rating Over Time */}
          <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col">
            <h2 className="font-bold text-lg mb-2">Rating Over Time</h2>
            {/* Placeholder chart */}
            <div className="flex-1 flex items-center justify-center">
              <span className="text-gray-400">[Chart]</span>
            </div>
          </div>
          {/* Suggested Openings */}
          <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col">
            <h2 className="font-bold text-lg mb-2">Suggested Openings</h2>
            <div className="flex-1 flex items-center justify-center">
              <span className="text-gray-400">[Openings]</span>
            </div>
          </div>
          {/* Stats */}
          <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col mt-6">
            <h2 className="font-bold text-lg mb-2">Stats</h2>
            <div className="text-3xl font-extrabold">{user?.rating || "1382"}</div>
            <div className="text-gray-500">Total games: {user?.games || "250"}</div>
            <div className="text-gray-500">Win rate: {user?.winrate || "61%"}</div>
          </div>
          {/* Losses */}
          <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col mt-6">
            <h2 className="font-bold text-lg mb-2">Your Losses</h2>
            <div className="flex-1 flex items-center justify-center">
              <span className="text-gray-400">[Donut Chart]</span>
            </div>
            <div className="mt-2 text-sm">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#7c5e3c] inline-block"></span> Higher-rated</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#bfa77a] inline-block"></span> Similarly-rated</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#f7e6c7] inline-block"></span> Lower-rated</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}