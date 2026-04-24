import { NextRequest, NextResponse } from "next/server";
import { setCookieOptions, signToken } from "@/lib/auth";

import bcrypt from "bcryptjs";
import { getUsersCollection } from "@/lib/mongodb";
import { toSafeUser } from "@/lib/models";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email?.trim() || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const users = await getUsersCollection();
    const user = await users.findOne({ email: email.toLowerCase().trim() });

    // Use constant-time comparison to prevent timing attacks
    const dummyHash = "$2a$12$dummyhashfordummyuserthatdoesnotexistindb";
    const passwordToCheck = user ? user.password : dummyHash;
    const isValid = await bcrypt.compare(password, passwordToCheck);

    if (!user || !isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const safeUser = toSafeUser(user as any);
    const token = signToken({ userId: safeUser.id, email: safeUser.email });

    const res = NextResponse.json({ user: safeUser, token });
    res.cookies.set("token", token, setCookieOptions());
    return res;
  } catch (err) {
    console.error("[POST /api/auth/login]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
