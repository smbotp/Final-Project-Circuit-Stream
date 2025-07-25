import { NextRequest, NextResponse } from "next/server";
import { fetchChesscomGames } from "../../../lib/chesscom";
import { fetchLichessGames } from "../../../lib/lichess";
import { analyzeGames } from "../../../lib/chessAnalysis";
import users from "../../../lib/users.json"; // Import your users.json

export async function POST(req: NextRequest) {
  // Get user ID from request body (or session in the future)
  const { userId } = await req.json();

  // Find user in users.json
  const user = users.find((u: any) => u.id === userId);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Only fetch if usernames exist
  const chesscomGames = user.chesscom ? await fetchChesscomGames(user.chesscom) : [];
  const lichessGames = user.lichess ? await fetchLichessGames(user.lichess) : [];
  const analysis = analyzeGames([...chesscomGames, ...lichessGames]);
  return NextResponse.json({ chesscomGames, lichessGames, analysis });
}