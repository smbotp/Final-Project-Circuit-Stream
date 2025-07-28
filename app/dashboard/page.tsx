"use client";
import { useEffect, useState } from "react";
import ChessPuzzleBoard from "../../components/ChessPuzzleBoard";
import { processRecentGames, savePuzzlesToLocal, loadPuzzlesFromLocal, getOpeningsStats } from "../../lib/chessAnalysis";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

type Game = { pgn: string; [key: string]: any };

function getLossCategories(games: any[], username: string) {
  let lower = 0, similar = 0, higher = 0;
  games.forEach(game => {
    // Defensive: fallback to 0 if ratings/results missing
    const userIsWhite = game.pgn?.includes(`[White "${username}"]`);
    const userRating = userIsWhite ? game.whiteRating ?? 0 : game.blackRating ?? 0;
    const oppRating = userIsWhite ? game.blackRating ?? 0 : game.whiteRating ?? 0;
    // Try to infer result from PGN if not present
    let result = userIsWhite ? game.resultWhite : game.resultBlack;
    if (!result && game.pgn) {
      if (userIsWhite && game.pgn.includes("1-0")) result = "win";
      else if (!userIsWhite && game.pgn.includes("0-1")) result = "win";
      else if (game.pgn.includes("1/2-1/2")) result = "draw";
      else result = "loss";
    }
    if (result === "loss") {
      const diff = oppRating - userRating;
      if (diff <= -75) lower++;
      else if (diff >= 75) higher++;
      else similar++;
    }
  });
  return { lower, similar, higher };
}

export function LossDonutChart({ games, username }: { games: any[], username: string }) {
  const { lower, similar, higher } = getLossCategories(games, username);

  const hasData = lower + similar + higher > 0;
  const data = {
    labels: ["Lower-rated", "Similarly-rated", "Higher-rated"],
    datasets: [
      {
        data: hasData ? [lower, similar, higher] : [1, 1, 1], // fallback to show chart
        backgroundColor: ["#eab308", "#a3a3a3", "#7dd3fc"],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div style={{ width: "300px", height: "300px" }}>
      <Doughnut data={data} />
      {!hasData && (
        <div className="text-center text-gray-400 mt-2">No losses data found.</div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [puzzles, setPuzzles] = useState<any[]>([]);
  const [openingsStatsWhite, setOpeningsStatsWhite] = useState<any[]>([]);
  const [openingsStatsBlack, setOpeningsStatsBlack] = useState<any[]>([]);
  const [suggestedWhite, setSuggestedWhite] = useState<string[]>([]);
  const [suggestedBlack, setSuggestedBlack] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [allGames, setAllGames] = useState<any[]>([]); // Added state for all games

  useEffect(() => {
    const username = localStorage.getItem("loggedInUser");
    if (!username) return;

    fetch("/api/user", {
      method: "POST",
      body: JSON.stringify({ username }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);

        // Fetch games from both sites
        fetch("/api/games", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: data.user.username }),
        })
          .then((res) => res.json())
          .then(async (pdata) => {
            const username = data.user.username;
            // Filter games by color
            const whiteGames = (pdata.games as Game[])
              ?.filter((g) => typeof g.pgn === "string" && g.pgn.includes(`[White "${username}"]`))
              .slice(0, 200) ?? [];
            const blackGames = (pdata.games as Game[])
              ?.filter((g) => typeof g.pgn === "string" && g.pgn.includes(`[Black "${username}"]`))
              .slice(0, 200) ?? [];

            setOpeningsStatsWhite(getOpeningsStats(whiteGames));
            setOpeningsStatsBlack(getOpeningsStats(blackGames));
            setAllGames(pdata.games); // Set all games data
          });
      });
  }, []);

  async function fetchSuggestedOpenings(style: string = "aggressive") {
    if (!openingsStatsWhite.length || !openingsStatsBlack.length) return;

    const topWhite = openingsStatsWhite.slice(0, 5).map(o => o.name).join("\n- ");
    const topBlack = openingsStatsBlack.slice(0, 5).map(o => o.name).join("\n- ");
    const prompt = `
Here are my top 5 openings as White:
- ${topWhite}

Here are my top 5 openings as Black:
- ${topBlack}

I prefer ${style} openings.
Can you recommend 3 new openings for White and 3 for Black that fit my style? Please format your answer as:

White:
1. Opening Name
2. Opening Name
3. Opening Name

Black:
1. Opening Name
2. Opening Name
3. Opening Name
  `.trim();

    // Log what is being sent to the LLM
    console.log("Prompt sent to LLM:", prompt);

    setLoadingSuggestions(true);
    try {
      const res = await fetch("/api/llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();

      console.log("LLM response:", data.text);

      // Parse LLM response for suggestions
      const whiteMatches = data.text.match(/White:\\s*([\\s\\S]*?)\\n\\n/i);
      const blackMatches = data.text.match(/Black:\\s*([\\s\\S]*)/i);

      setSuggestedWhite(
        whiteMatches
          ? whiteMatches[1]
              .split("\n")
              .map((l: string) => l.replace(/^\d+\.\s*/, "").trim())
              .filter(Boolean)
          : []
      );
      setSuggestedBlack(
        blackMatches
          ? blackMatches[1]
              .split("\n")
              .map((l: string) => l.replace(/^\d+\.\s*/, "").trim())
              .filter(Boolean)
          : []
      );
    } catch (e) {
      console.error("Error fetching or parsing LLM suggestions:", e);
      setSuggestedWhite([]);
      setSuggestedBlack([]);
    }
    setLoadingSuggestions(false);
  }

  useEffect(() => {
    if (openingsStatsWhite.length && openingsStatsBlack.length) {
      fetchSuggestedOpenings("aggressive"); // you can change "aggressive" to any style
    }
  }, [openingsStatsWhite, openingsStatsBlack]);

  return (
    <div className="min-h-screen bg-[#f7f3eb] dark:bg-gray-900 py-4 px-2 md:py-8 md:px-4">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-6 md:mb-8">
          Hello, <span className="text-blue-700">{user?.username || "User"}</span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-stretch w-full">
          {/* Chessboard + XP */}
          <div className="flex flex-col items-center min-w-0">
            {/* Chessboard with border radius and shadow */}
            <div className="relative mb-4 flex items-center justify-center" style={{
              borderRadius: "1rem",
              overflow: "hidden",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              width: 350,
              height: 350,
              background: "white",
            }}>
              <ChessPuzzleBoard fen={puzzles[0]?.fen || "start"} />
              {/* Coming Soon Overlay */}
              <div
                className="absolute inset-0 flex items-center justify-center text-center"
                style={{
                  background: "rgba(255,255,255,0.7)",
                  zIndex: 10,
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#374151",
                  letterSpacing: "0.05em",
                  pointerEvents: "none"
                }}
              >
                Custom Puzzles Coming Soon!
              </div>
            </div>
            <div className="w-full bg-green-700 text-white rounded-lg py-3 px-4 text-center font-semibold text-lg">
              XP until LVL [ ]
            </div>
            <div className="mt-2 text-center text-gray-700">
              Chess.com: {user?.chesscom}
            </div>
            {/* Show "No puzzles found" only once under the board */}
            {(!puzzles || puzzles.length === 0) && (
              <div className="mt-4 text-red-500">No puzzles found.</div>
            )}
          </div>
          {/* Rating Over Time */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6 flex flex-col h-full min-w-0">
            <h2 className="font-bold text-lg mb-2">Rating Over Time</h2>
            <div className="flex-1 flex items-center justify-center">
              <span className="text-gray-400">[Chart]</span>
            </div>
          </div>
          {/* Suggested Openings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6 flex flex-col h-full min-w-0">
            <h2 className="font-bold text-lg mb-2">Suggested Openings</h2>
            <div className="flex flex-col gap-4 flex-1">
              <div>
                <h3 className="font-semibold text-md mb-2 text-gray-700">White</h3>
                <div className="flex-1 flex flex-col items-start justify-center">
                  {loadingSuggestions ? (
                    <span className="text-gray-400">Loading suggestions...</span>
                  ) : suggestedWhite.length ? (
                    <ul className="list-decimal list-inside text-gray-800">
                      {suggestedWhite.map((opening, idx) => (
                        <li key={idx}>{opening}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400">No suggestions found.</span>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-md mb-2 text-gray-700">Black</h3>
                <div className="flex-1 flex flex-col items-start justify-center">
                  {loadingSuggestions ? (
                    <span className="text-gray-400">Loading suggestions...</span>
                  ) : suggestedBlack.length ? (
                    <ul className="list-decimal list-inside text-gray-800">
                      {suggestedBlack.map((opening, idx) => (
                        <li key={idx}>{opening}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400">No suggestions found.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Stats, Losses, Openings Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6 w-full">
          {/* Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6 flex flex-col min-w-0">
            <h2 className="font-bold text-lg mb-2">Stats</h2>
            <div className="mb-2">
              <div className="font-semibold">Chess.com Ratings:</div>
              {user?.chesscom ? (
                <div className="text-gray-700 text-sm">
                  Blitz: {user.chesscom.blitz ?? "—"} | Rapid: {user.chesscom.rapid ?? "—"} | Bullet: {user.chesscom.bullet ?? "—"}
                </div>
              ) : (
                <div className="text-gray-400 text-sm">No Chess.com ratings found.</div>
              )}
            </div>

            {user?.lichess && (
              <div className="mb-2">
                <div className="font-semibold">Lichess Ratings:</div>
                <div className="text-gray-700 text-sm">
                  Blitz: {user.lichess.blitz ?? "—"} | Rapid: {user.lichess.rapid ?? "—"} | Bullet: {user.lichess.bullet ?? "—"}
                </div>
              </div>
            )}
            <div className="mb-2">
              <div className="font-semibold">Total Games:</div>
              <div className="text-gray-700 text-sm">
                {((user?.chesscom?.games ?? 0) + (user?.lichess?.games ?? 0))}
              </div>
            </div>
            <div>
              <div className="font-semibold">Win Rate:</div>
              <div className="text-gray-700 text-sm">
                {user?.chesscom && user?.lichess
                  ? Math.round(
                      (
                        ((user.chesscom.winrate ?? 0) * (user.chesscom.games ?? 0) +
                          (user.lichess.winrate ?? 0) * (user.lichess.games ?? 0)) /
                        ((user.chesscom.games ?? 0) + (user.lichess.games ?? 0))
                      )
                    ) + "%"
                  : user?.chesscom?.winrate
                  ? user.chesscom.winrate + "%"
                  : user?.lichess?.winrate
                  ? user.lichess.winrate + "%"
                  : "—"}
              </div>
            </div>
          </div>
          {/* Losses */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6 flex flex-col min-w-0">
            <h2 className="font-bold text-lg mb-2">Your Losses</h2>
            <div className="flex-1 flex items-center justify-center">
              <LossDonutChart games={allGames} username={user?.username} />
            </div>
            <div className="mt-2 text-sm">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#7c5e3c] inline-block"></span> Higher-rated</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#bfa77a] inline-block"></span> Similarly-rated</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#f7e6c7] inline-block"></span> Lower-rated</div>
            </div>
          </div>
          {/* Openings Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6 mt-4 md:mt-0 flex flex-col min-w-0">
            <h2 className="font-bold text-lg mb-4">Top 5 Openings Stats</h2>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full">
              {/* White Openings */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-md mb-2 text-gray-700">White</h3>
                {openingsStatsWhite && openingsStatsWhite.length > 0 ? (
                  openingsStatsWhite.slice(0, 5).map((o, idx) => (
                    <div key={`white-${o.eco || "unknown"}-${o.name || "unknown"}-${idx}`} className="mb-4">
                      <strong>{o.name && o.name !== o.eco ? o.name : o.eco || "Unknown Opening"}</strong> ({o.count} games)
                      <div
                        className="flex overflow-hidden mt-2 w-1/2"
                        style={{
                          height: "16px",
                          borderRadius: "8px",
                          background: "#eee",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                        }}
                      >
                        <div
                          style={{
                            width: `${o.winPct}%`,
                            background: "#22c55e",
                            borderTopLeftRadius: "8px",
                            borderBottomLeftRadius: "8px",
                            transition: "width 0.3s"
                          }}
                          title={`Win: ${o.winPct}%`}
                        />
                        <div
                          style={{
                            width: `${o.drawPct}%`,
                            background: "#a3a3a3",
                            transition: "width 0.3s"
                          }}
                          title={`Draw: ${o.drawPct}%`}
                        />
                        <div
                          style={{
                            width: `${o.lossPct}%`,
                            background: "#ef4444",
                            borderTopRightRadius: "8px",
                            borderBottomRightRadius: "8px",
                            transition: "width 0.3s"
                          }}
                          title={`Loss: ${o.lossPct}%`}
                        />
                      </div>
                      <div className="flex text-xs mt-1 gap-2">
                        <span className="text-green-600">Win: {o.winPct}%</span>
                        <span className="text-gray-600">Draw: {o.drawPct}%</span>
                        <span className="text-red-600">Loss: {o.lossPct}%</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400">No opening data found.</div>
                )}
              </div>
              {/* Black Openings */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-md mb-2 text-gray-700">Black</h3>
                {openingsStatsBlack && openingsStatsBlack.length > 0 ? (
                  openingsStatsBlack.slice(0, 5).map((o, idx) => (
                    <div key={`black-${o.eco || "unknown"}-${o.name || "unknown"}-${idx}`} className="mb-4">
                      <strong>{o.name && o.name !== o.eco ? o.name : o.eco || "Unknown Opening"}</strong> ({o.count} games)
                      <div
                        className="flex overflow-hidden mt-2 w-1/2"
                        style={{
                          height: "16px",
                          borderRadius: "8px",
                          background: "#eee",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                        }}
                      >
                        <div
                          style={{
                            width: `${o.winPct}%`,
                            background: "#22c55e",
                            borderTopLeftRadius: "8px",
                            borderBottomLeftRadius: "8px",
                            transition: "width 0.3s"
                          }}
                          title={`Win: ${o.winPct}%`}
                        />
                        <div
                          style={{
                            width: `${o.drawPct}%`,
                            background: "#a3a3a3",
                            transition: "width 0.3s"
                          }}
                          title={`Draw: ${o.drawPct}%`}
                        />
                        <div
                          style={{
                            width: `${o.lossPct}%`,
                            background: "#ef4444",
                            borderTopRightRadius: "8px",
                            borderBottomRightRadius: "8px",
                            transition: "width 0.3s"
                          }}
                          title={`Loss: ${o.lossPct}%`}
                        />
                      </div>
                      <div className="flex text-xs mt-1 gap-2">
                        <span className="text-green-600">Win: {o.winPct}%</span>
                        <span className="text-gray-600">Draw: {o.drawPct}%</span>
                        <span className="text-red-600">Loss: {o.lossPct}%</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400">No opening data found.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}