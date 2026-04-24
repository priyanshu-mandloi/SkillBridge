import { NextRequest, NextResponse } from "next/server";

import { ObjectId } from "mongodb";
import { getAuthUser } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = await getDb();
    const profile = await db.collection("users").findOne(
      { _id: new ObjectId(user.userId) },
      {
        projection: {
          password: 0, // never expose password
        },
      },
    );

    if (!profile)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
      ...profile,
      id: profile._id.toString(),
      _id: undefined,
    });
  } catch (err) {
    console.error("[GET /api/profile]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, bio, location, github, linkedin, website, skills, avatar } =
      await req.json();

    const db = await getDb();

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (name !== undefined) updateData.name = name.trim();
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (github !== undefined) updateData.github = github;
    if (linkedin !== undefined) updateData.linkedin = linkedin;
    if (website !== undefined) updateData.website = website;
    if (skills !== undefined)
      updateData.skills = Array.isArray(skills) ? skills : [];
    if (avatar !== undefined) updateData.avatar = avatar;

    const result = await db
      .collection("users")
      .findOneAndUpdate(
        { _id: new ObjectId(user.userId) },
        { $set: updateData },
        { returnDocument: "after", projection: { password: 0 } },
      );

    if (!result)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
      ...result,
      id: result._id.toString(),
      _id: undefined,
    });
  } catch (err) {
    console.error("[PUT /api/profile]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
