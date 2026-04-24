import { NextRequest, NextResponse } from "next/server";

import { ObjectId } from "mongodb";
import { getAuthUser } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { skills: extraSkills, preferences } = await req.json();

    const db = await getDb();

    const profile = await db
      .collection("users")
      .findOne(
        { _id: new ObjectId(user.userId) },
        { projection: { password: 0 } },
      );

    const projects = await db
      .collection("projects")
      .find({ userId: user.userId })
      .toArray();

    const allSkills = [
      ...(profile?.skills || []),
      ...(Array.isArray(extraSkills) ? extraSkills : []),
    ].filter(Boolean);

    if (allSkills.length === 0) {
      return NextResponse.json(
        {
          error:
            "Please add at least one skill to your profile before running AI match.",
        },
        { status: 400 },
      );
    }

    const existingTitles = projects.map((p) => p.title).join(", ") || "none";

    const prompt = `You are an expert AI project-matching engine for software developers.

Developer Profile:
- Skills: ${allSkills.join(", ")}
- Existing projects: ${existingTitles}
- Preferences: ${preferences?.trim() || "open to any impactful project type"}

Your job: Suggest 5 highly relevant, non-trivial project ideas this developer should build.

Rules:
- Each project must genuinely match their skill set
- Avoid suggesting projects similar to their existing ones
- Projects should be challenging enough to grow their portfolio
- matchScore should reflect how well their skills align (range: 62–98)

Respond ONLY with a valid JSON array. No markdown, no explanation, no code fences.
Each object must have exactly these fields:
[
  {
    "title": "string",
    "description": "string (2 clear sentences about what it does and why it matters)",
    "matchScore": number,
    "tags": ["string", "string", "string"],
    "difficulty": "beginner" | "intermediate" | "advanced",
    "reason": "string (one sentence: why this matches their specific skills)"
  }
]`;

    // ✅ FIX 1: Correct Groq API endpoint (OpenAI-compatible, not /messages)
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY || ""}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 1500,
          messages: [{ role: "user", content: prompt }],
        }),
      },
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("[AI match API error]", err);
      return NextResponse.json(
        { error: "AI service unavailable" },
        { status: 502 },
      );
    }

    const data = await response.json();

    const rawText = data.choices?.[0]?.message?.content || "[]";

    let matches;
    try {
      const cleaned = rawText.replace(/```json|```/g, "").trim();
      matches = JSON.parse(cleaned);
    } catch {
      console.error("[AI match parse error]", rawText);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 },
      );
    }

    return NextResponse.json({ matches });
  } catch (err) {
    console.error("[POST /api/ai/match]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
