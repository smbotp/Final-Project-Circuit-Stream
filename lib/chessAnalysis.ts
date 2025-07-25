import { Chess } from "chess.js";

// Get evaluation from Lichess Cloud Analysis API
export async function getEval(fen: string): Promise<number | null> {
  const url = `https://lichess.org/api/cloud-eval?fen=${encodeURIComponent(fen)}&multiPv=1`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  // centipawn score: positive = white better, negative = black better
  return data.pvs?.[0]?.cp ?? null;
}

// Find blunder puzzles in a game
export async function findBlunderPuzzles(game: { pgn: string }): Promise<{ fen: string, blunderMove: string }[]> {
  const chess = new Chess();
  chess.loadPgn(game.pgn);
  const moves = chess.history({ verbose: true });
  const puzzles = [];

  for (let i = 0; i < moves.length - 1; i++) {
    chess.reset();
    chess.loadPgn(game.pgn, { sloppy: true });
    for (let j = 0; j < i; j++) chess.move(moves[j]);
    const fenBefore = chess.fen();
    const evalBefore = await getEval(fenBefore);

    chess.move(moves[i]);
    const fenAfter = chess.fen();
    const evalAfter = await getEval(fenAfter);

    // If evaluation drops by more than 200 centipawns (2 pawns)
    if (
      evalBefore !== null &&
      evalAfter !== null &&
      evalBefore - evalAfter > 200
    ) {
      puzzles.push({
        fen: fenBefore,
        blunderMove: moves[i].san,
      });
    }
  }
  return puzzles;
}

export function analyzeGames(games: any[]) {
  // Placeholder: just return the number of games for now
  return { totalGames: games.length };
}