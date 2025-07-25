import { NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import path from "path";

const USERS_FILE = path.join(process.cwd(), "users.json");

export async function POST(request: Request) {
  const { username, password, email, passwordConfirm } = await request.json();

  // Check password confirmation
  if (password !== passwordConfirm) {
    return NextResponse.json(
      { success: false, error: "Passwords do not match." },
      { status: 400 }
    );
  }

  // Read existing users
  let users: any[] = [];
  try {
    const data = await readFile(USERS_FILE, "utf8");
    users = JSON.parse(data);
  } catch {
    users = [];
  }

  // Add new user
  users.push({ username, password, email });

  // Save to file
  await writeFile(USERS_FILE, JSON.stringify(users, null, 2));

  return NextResponse.json({ success: true });
}

export async function GET() {
  try {
    const data = await readFile(USERS_FILE, "utf8");
    const users = JSON.parse(data);
    return NextResponse.json({ users });
  } catch {
    return NextResponse.json({ users: [] });
  }
}