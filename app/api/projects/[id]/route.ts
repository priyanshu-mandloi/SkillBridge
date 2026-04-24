import { NextRequest, NextResponse } from "next/server";

import { ObjectId } from "mongodb";
import { getAuthUser } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

function toObjectId(id: string) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = getAuthUser(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;

    const _id = toObjectId(id);
    if (!_id)
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const db = await getDb();
    const project = await db
      .collection("projects")
      .findOne({ _id, userId: user.userId });

    if (!project)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });

    return NextResponse.json({
      ...project,
      id: project._id.toString(),
      _id: undefined,
    });
  } catch (err) {
    console.error("[GET /api/projects/:id]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = getAuthUser(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;

    const _id = toObjectId(id);
    if (!_id)
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const { title, description, tags, status, githubUrl, liveUrl } =
      await req.json();

    const db = await getDb();

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : [];
    if (status !== undefined) updateData.status = status;
    if (githubUrl !== undefined) updateData.githubUrl = githubUrl;
    if (liveUrl !== undefined) updateData.liveUrl = liveUrl;

    const result = await db
      .collection("projects")
      .updateOne({ _id, userId: user.userId }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Project not found or unauthorized" },
        { status: 404 },
      );
    }

    const updatedProject = await db.collection("projects").findOne({ _id });

    return NextResponse.json({
      ...updatedProject,
      id: updatedProject!._id.toString(),
      _id: undefined,
    });
  } catch (err) {
    console.error("[PUT /api/projects/:id]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = getAuthUser(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;

    const _id = toObjectId(id);
    if (!_id)
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const db = await getDb();

    const result = await db
      .collection("projects")
      .deleteOne({ _id, userId: user.userId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/projects/:id]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
