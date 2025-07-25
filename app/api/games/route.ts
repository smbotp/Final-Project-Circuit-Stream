import { NextRequest, NextResponse } from "next/server";
import { fetchChesscomGames } from "../../../lib/chesscom";
import { fetchLichessGames } from "../../../lib/lichess";
import users from "../../../lib/users.json";

type Game = {
  pgn: string;
  [key: string]: any; // Add other properties as needed
};

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    console.log("Received userId:", userId);

    // Fix user lookup!
    const user = users.find((u: any) => u.username === userId);
    console.log("Found user:", user);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const chesscomGames: Game[] = user.chesscom
      ? (await fetchChesscomGames(user.chesscom)).map((g: Game) => ({ ...g, site: "chesscom" }))
      : [];
    const lichessGames: Game[] = user.lichess
      ? (await fetchLichessGames(user.lichess)).map((g: Game) => ({ ...g, site: "lichess" }))
      : [];
    const allGames = [...chesscomGames, ...lichessGames];

    // Just return the games, do NOT analyze here!
    return NextResponse.json({ games: allGames });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}