"use client";

import {
  Brain,
  ChevronRight,
  Code,
  Loader2,
  Plus,
  Sparkles,
  Star,
  X,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface Match {
  title: string;
  description: string;
  matchScore: number;
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  reason: string;
}

const difficultyColors: Record<string, string> = {
  beginner: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  intermediate: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  advanced: "text-rose-500 bg-rose-500/10 border-rose-500/20",
};

export default function AIMatchPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [extraSkills, setExtraSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [preferences, setPreferences] = useState("");
  const [error, setError] = useState("");
  const [ran, setRan] = useState(false);

  const getToken = () => localStorage.getItem("token") || "";

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !extraSkills.includes(s)) setExtraSkills((prev) => [...prev, s]);
    setSkillInput("");
  };

  const runMatch = async () => {
    setLoading(true);
    setError("");
    setRan(true);
    try {
      const res = await fetch("/api/ai/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ skills: extraSkills, preferences }),
      });
      const data = await res.json();
      if (res.ok) setMatches(data.matches || []);
      else setError(data.error || "Failed to get matches.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score: number) =>
    score >= 90
      ? "text-emerald-500"
      : score >= 75
        ? "text-primary"
        : "text-amber-500";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <p className="section-label mb-1">AI Engine</p>
        <h1 className="text-3xl font-display font-bold flex items-center gap-3">
          <Brain className="w-8 h-8 text-primary" />
          AI Match Engine
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Discover projects perfectly tailored to your skills using AI
        </p>
      </div>

      {/* Config panel */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        <h2 className="font-display font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" /> Configure Match
        </h2>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            Additional Skills (optional)
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {extraSkills.map((s) => (
              <span
                key={s}
                className="flex items-center gap-1 tag pr-2 text-[11px]"
              >
                {s}{" "}
                <button
                  onClick={() =>
                    setExtraSkills((prev) => prev.filter((x) => x !== s))
                  }
                >
                  <X className="w-2.5 h-2.5 hover:text-destructive" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSkill()}
              placeholder="e.g. Rust, WebAssembly..."
              className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
            <button
              onClick={addSkill}
              className="px-3 py-2 border border-primary/30 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            Project Preferences (optional)
          </label>
          <textarea
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="e.g. I want to build SaaS tools, interested in AI/ML projects, prefer backend-heavy work..."
            rows={2}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none"
          />
        </div>

        <button
          onClick={runMatch}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 glow-cyan"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Analyzing your
              profile...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4" /> Find My Matches
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Results */}
      {!loading && ran && matches.length === 0 && !error && (
        <div className="text-center py-12 text-muted-foreground">
          <Brain className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>
            No matches returned. Try adding more skills or updating your
            profile.
          </p>
        </div>
      )}

      {matches.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <h2 className="font-display font-semibold">
              {matches.length} Project Matches Found
            </h2>
          </div>

          {matches.map((match, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-5 card-hover group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Code className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <h3 className="font-display font-semibold">
                      {match.title}
                    </h3>
                    <span
                      className={cn(
                        "text-[10px] font-medium px-2 py-0.5 rounded-full border capitalize",
                        difficultyColors[match.difficulty],
                      )}
                    >
                      {match.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {match.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {match.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2">
                    <Star className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{match.reason}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={cn(
                      "text-2xl font-display font-bold",
                      scoreColor(match.matchScore),
                    )}
                  >
                    {match.matchScore}%
                  </span>
                  <p className="text-[10px] text-muted-foreground">
                    match score
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state before running */}
      {!ran && (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30 animate-float" />
          <p className="font-display font-semibold text-muted-foreground">
            Ready to find your perfect projects
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Hit "Find My Matches" to let AI analyze your skills
          </p>
          <div className="flex items-center justify-center gap-1 mt-3 text-xs text-primary">
            <ChevronRight className="w-3 h-3" /> Powered by Claude AI
          </div>
        </div>
      )}
    </div>
  );
}
