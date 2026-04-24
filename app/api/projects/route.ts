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
    const projects = await db
      .collection("projects")
      .find({ userId: user.userId })
      .sort({ createdAt: -1 })
      .toArray();

    const serialized = projects.map((p) => ({
      ...p,
      id: p._id.toString(),
      _id: undefined,
    }));

    return NextResponse.json(serialized);
  } catch (err) {
    console.error("[GET /api/projects]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, description, tags, status, githubUrl, liveUrl } =
      await req.json();

    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const result = await db.collection("projects").insertOne({
      title: title.trim(),
      description: description.trim(),
      tags: Array.isArray(tags) ? tags : [],
      status: status || "active",
      githubUrl: githubUrl || "",
      liveUrl: liveUrl || "",
      matchScore: null,
      userId: user.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const project = await db
      .collection("projects")
      .findOne({ _id: result.insertedId });

    return NextResponse.json(
      { ...project, id: project!._id.toString(), _id: undefined },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/projects]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
