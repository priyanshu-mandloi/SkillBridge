import { NextRequest, NextResponse } from "next/server";
import { UserDocument, toSafeUser } from "@/lib/models";
import { setCookieOptions, signToken } from "@/lib/auth";

import bcrypt from "bcryptjs";
import { getUsersCollection } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, skills, role, level, github } = body;

    // --- Validation ---
    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    const users = await getUsersCollection();

    // --- Check duplicate ---
    const existing = await users.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    // --- Hash password ---
    const hashedPassword = await bcrypt.hash(password, 12);

    const now = new Date();
    const newUser: UserDocument = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      bio: "",
      location: "",
      github: github || "",
      linkedin: "",
      website: "",
      skills: Array.isArray(skills) ? skills : [],
      avatar: "",
      role: role || "",
      level: level || "",
      createdAt: now,
      updatedAt: now,
    };

    const result = await users.insertOne(newUser);
    newUser._id = result.insertedId;

    const safeUser = toSafeUser(newUser);
    const token = signToken({ userId: safeUser.id, email: safeUser.email });

    const res = NextResponse.json({ user: safeUser, token }, { status: 201 });
    res.cookies.set("token", token, setCookieOptions());
    return res;
  } catch (err) {
    console.error("[POST /api/auth/register]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
