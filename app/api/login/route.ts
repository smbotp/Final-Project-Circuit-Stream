import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const USERS_FILE = path.join(process.cwd(), "users.json");

export async function POST(request: Request) {
  const { username, password } = await request.json();

  try {
    const data = await readFile(USERS_FILE, "utf8");
    const users = JSON.parse(data);
    const user = users.find(
      (u: any) => u.username === username && u.password === password
    );
    if (user) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: "Invalid credentials." }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ success: false, error: "Server error." }, { status: 500 });
  }
}