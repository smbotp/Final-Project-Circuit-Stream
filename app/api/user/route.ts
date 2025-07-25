import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

// Correct path to users.json inside lib
const USERS_FILE = path.join(process.cwd(), "lib", "users.json");

export async function POST(request: Request) {
  try {
    const { username } = await request.json();
    const data = await readFile(USERS_FILE, "utf8");
    const users = JSON.parse(data);
    const user = users.find((u: any) => u.username === username);
    if (user) {
      return NextResponse.json({ user });
    } else {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("User API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}