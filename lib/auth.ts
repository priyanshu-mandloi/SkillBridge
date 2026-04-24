import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;
if (!SECRET) throw new Error("JWT_SECRET is missing from .env");

export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export function signToken(payload: Omit<JWTPayload, "iat" | "exp">): string {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export function getAuthUser(req: NextRequest): JWTPayload | null {
  // Check Authorization header first, then cookie
  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;
  const cookieToken = req.cookies.get("token")?.value;
  const token = bearerToken || cookieToken;

  if (!token) return null;
  return verifyToken(token);
}

export function setCookieOptions() {
  return {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}
