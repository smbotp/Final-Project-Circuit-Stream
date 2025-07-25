import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const USERS_FILE = path.join(process.cwd(), "users.json");

export async function POST(request: Request) {
  const { username } = await request.json();
  try {
    const data = await readFile(USERS_FILE, "utf8");
    const users = JSON.parse(data);
    const user = users.find((u: any) => u.username === username);
    if (user) {
      return NextResponse.json({ user });
    } else {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}