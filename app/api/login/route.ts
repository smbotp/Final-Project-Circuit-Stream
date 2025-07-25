import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

// Correct path to users.json inside lib
const USERS_FILE = path.join(process.cwd(), "lib", "users.json");

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    const data = await readFile(USERS_FILE, "utf8");
    const users = JSON.parse(data);
    const user = users.find(
      (u: any) => u.username === username && u.password === password
    );
    if (user) {
      return NextResponse.json({ success: true, userId: user.username });
    } else {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}