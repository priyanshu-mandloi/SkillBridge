"use client";

import {
  ArrowRight,
  Brain,
  FolderKanban,
  Home,
  Plus,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

import Link from "next/link";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: string;
  matchScore?: number;
  createdAt: string;
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  delta,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  delta?: string;
}) => (
  <div className="bg-card border border-border rounded-xl p-5 card-hover">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs section-label mb-2">{label}</p>
        <p className="text-3xl font-display font-bold">{value}</p>
        {delta && <p className="text-xs text-primary mt-1">{delta}</p>}
      </div>
      <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Developer");

  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) setUserName(name);
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch("/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const recentProjects = projects.slice(0, 3);
  const avgScore = projects.length
    ? Math.round(
        projects.reduce((a, p) => a + (p.matchScore || 75), 0) /
          projects.length,
      )
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <p className="section-label mb-1">Dashboard</p>
        <h1 className="text-3xl font-display font-bold">
          Good{" "}
          {new Date().getHours() < 12
            ? "morning"
            : new Date().getHours() < 18
              ? "afternoon"
              : "evening"}
          , <span className="text-gradient">{userName}</span> 👋
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FolderKanban}
          label="Total Projects"
          value={String(projects.length)}
          delta="+2 this month"
        />
        <StatCard
          icon={Brain}
          label="AI Matches"
          value="12"
          delta="3 new today"
        />
        <StatCard
          icon={Star}
          label="Avg Match Score"
          value={projects.length ? `${avgScore}%` : "—"}
        />
        <StatCard
          icon={TrendingUp}
          label="Skills Tracked"
          value="8"
          delta="+1 this week"
        />
      </div>

      {/* Recent Projects + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold">Recent Projects</h2>
            <Link
              href="/dashboard/projects"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-secondary/50 rounded-lg shimmer"
                />
              ))}
            </div>
          ) : recentProjects.length === 0 ? (
            <div className="text-center py-10">
              <FolderKanban className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-sm text-muted-foreground">
                No projects yet. Create your first one!
              </p>
              <Link
                href="/dashboard/projects"
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary border border-primary/30 bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
              >
                <Plus className="w-3 h-3" /> New Project
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {project.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {project.description}
                    </p>
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="tag text-[10px] py-0">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  {project.matchScore && (
                    <div className="text-right shrink-0">
                      <span className="text-lg font-display font-bold text-primary">
                        {project.matchScore}
                      </span>
                      <p className="text-[10px] text-muted-foreground">match</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-display font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                {
                  href: "/dashboard/projects",
                  icon: Plus,
                  label: "Create Project",
                  desc: "Add a new project",
                },
                {
                  href: "/dashboard/ai-match",
                  icon: Brain,
                  label: "Find AI Matches",
                  desc: "Discover projects for you",
                },
                {
                  href: "/dashboard/profile",
                  icon: Star,
                  label: "Update Skills",
                  desc: "Keep your profile fresh",
                },
                {
                  href: "/",
                  icon: Home,
                  label: "Home",
                  desc: "Back to homepage",
                },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <action.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium group-hover:text-primary transition-colors">
                      {action.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {action.desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* AI tip */}
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-primary" />
              <span className="section-label text-[10px]">AI Tip</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Add more skills to your profile to improve your AI match score.
              Projects with 5+ skills get 40% better matches.
            </p>
            <Link
              href="/dashboard/profile"
              className="mt-2 text-xs text-primary hover:underline flex items-center gap-1"
            >
              Update profile <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
