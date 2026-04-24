"use client";

import {
  ExternalLink,
  FolderKanban,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: string;
  matchScore?: number;
  githubUrl?: string;
  liveUrl?: string;
  createdAt: string;
}

interface ProjectForm {
  title: string;
  description: string;
  tags: string;
  status: string;
  githubUrl: string;
  liveUrl: string;
}

const EMPTY_FORM: ProjectForm = {
  title: "",
  description: "",
  tags: "",
  status: "active",
  githubUrl: "",
  liveUrl: "",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  const getToken = () => localStorage.getItem("token") || "";

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) setProjects(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError("");
    setModalOpen(true);
  };
  const openEdit = (p: Project) => {
    setForm({
      title: p.title,
      description: p.description,
      tags: p.tags.join(", "),
      status: p.status,
      githubUrl: p.githubUrl || "",
      liveUrl: p.liveUrl || "",
    });
    setEditingId(p.id);
    setError("");
    setModalOpen(true);
  };

  const normalizeUrl = (url: string) => {
    if (!url) return "";
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };
  const handleSubmit = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and description are required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        githubUrl: normalizeUrl(form.githubUrl),
        liveUrl: normalizeUrl(form.liveUrl),
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      const url = editingId ? `/api/projects/${editingId}` : "/api/projects";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setModalOpen(false);
        fetchProjects();
      } else {
        const d = await res.json();
        setError(d.error || "Something went wrong");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    fetchProjects();
  };

  const filtered = projects.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || p.status === filter;
    return matchSearch && matchFilter;
  });

  const statusColors: Record<string, string> = {
    active: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    completed: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    archived: "text-muted-foreground bg-muted/50 border-border",
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="section-label mb-1">Projects</p>
          <h1 className="text-3xl font-display font-bold">My Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {projects.length} project{projects.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors glow-cyan-sm"
        >
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {["all", "active", "completed", "archived"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "px-3 py-2 rounded-lg text-xs font-medium capitalize transition-colors",
                filter === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Projects grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-48 bg-card border border-border rounded-xl shimmer"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <FolderKanban className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="font-display font-semibold">No projects found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {search
              ? "Try a different search"
              : "Create your first project to get started"}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((project) => (
            <div
              key={project.id}
              className="bg-card border border-border rounded-xl p-5 card-hover group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={cn(
                        "text-[10px] font-medium px-2 py-0.5 rounded-full border capitalize",
                        statusColors[project.status],
                      )}
                    >
                      {project.status}
                    </span>
                    {project.matchScore && (
                      <span className="text-[10px] text-primary font-medium">
                        {project.matchScore}% match
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-semibold text-base leading-tight">
                    {project.title}
                  </h3>
                </div>
                <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(project)}
                    className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                {project.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-border">
                {project.liveUrl && (
                  <a
                    href={
                      project.liveUrl.startsWith("http")
                        ? project.liveUrl
                        : `https://${project.liveUrl}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Live
                  </a>
                )}
                <span className="ml-auto text-[10px] text-muted-foreground">
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-xl">
                {editingId ? "Edit Project" : "New Project"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {error && (
                <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}

              {[
                {
                  label: "Title *",
                  key: "title",
                  placeholder: "e.g. AI Resume Builder",
                },
                {
                  label: "GitHub URL",
                  key: "githubUrl",
                  placeholder: "https://github.com/...",
                },
                {
                  label: "Live URL",
                  key: "liveUrl",
                  placeholder: "https://...",
                },
                {
                  label: "Tags (comma separated)",
                  key: "tags",
                  placeholder: "React, Node.js, MongoDB",
                },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    {label}
                  </label>
                  <input
                    value={form[key as keyof ProjectForm]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    placeholder={placeholder}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  />
                </div>
              ))}

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Description *
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Describe your project..."
                  rows={3}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, status: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId ? "Save Changes" : "Create Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
