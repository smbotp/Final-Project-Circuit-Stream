import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const USERS_FILE = path.join(process.cwd(), "users.json");

export async function POST(request: Request) {
  const { chesscom, lichess, fide, uscf } = await request.json();

  let users: any[] = [];
  try {
    const data = await readFile(USERS_FILE, "utf8");
    users = JSON.parse(data);
  } catch {
    return NextResponse.json({ success: false, error: "No users found." }, { status: 400 });
  }

  if (users.length === 0) {
    return NextResponse.json({ success: false, error: "No users found." }, { status: 400 });
  }

  // Update the last registered user
  users[users.length - 1] = {
    ...users[users.length - 1],
    chesscom,
    lichess,
    fide,
    uscf,
  };

  await writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  return NextResponse.json({ success: true });
}