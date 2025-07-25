import { useEffect, useState } from "react";
import ChessPuzzleBoard from "./ChessPuzzleBoard";

export default function PuzzleDashboard({ userId }: { userId: string }) {
  const [puzzles, setPuzzles] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    })
      .then(res => res.json())
      .then(data => setPuzzles(data.puzzles || []));
  }, [userId]);

  return (
    <div>
      {(puzzles && puzzles.length > 0) ? (
        puzzles.map((puzzle, idx) => (
          <ChessPuzzleBoard key={idx} fen={puzzle.fen} />
        ))
      ) : (
        <div>No puzzles found.</div>
      )}
    </div>
  );
}