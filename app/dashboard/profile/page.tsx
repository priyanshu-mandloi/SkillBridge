"use client";

import { Globe, Loader2, MapPin, Plus, Save, User, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Profile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  location?: string;
  github?: string;
  linkedin?: string;
  website?: string;
  skills: string[];
  avatar?: string;
}

const SKILL_SUGGESTIONS = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "MongoDB",
  "PostgreSQL",
  "TailwindCSS",
  "Docker",
  "AWS",
  "GraphQL",
  "Redis",
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [saved, setSaved] = useState(false);

  const getToken = () => localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();

        setProfile({
          id: data.id || "",
          name: data.name || "",
          email: data.email || "",
          bio: data.bio || "",
          location: data.location || "",
          github: data.github || "",
          linkedin: data.linkedin || "",
          website: data.website || "",
          skills: data.skills || [],
          avatar: data.avatar || "",
        });
      } catch (err) {
        console.error(err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const update = (key: keyof Profile, val: string) => {
    setProfile((p) => (p ? { ...p, [key]: val } : p));
  };

  const addSkill = (skill: string) => {
    const s = skill.trim();
    if (!s || profile?.skills.includes(s)) return;
    setProfile((p) => (p ? { ...p, skills: [...p.skills, s] } : p));
    setNewSkill("");
  };

  const removeSkill = (skill: string) => {
    setProfile((p) =>
      p ? { ...p, skills: p.skills.filter((s) => s !== skill) } : p,
    );
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(profile),
      });

      if (!res.ok) throw new Error("Save failed");

      setSaved(true);
      localStorage.setItem("userName", profile.name || "");
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center text-muted-foreground py-16">
        Failed to load profile.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="section-label mb-1">Profile</p>
          <h1 className="text-3xl font-display font-bold">Skill Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your developer identity and skills
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-2xl font-bold text-primary">
            {profile.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div>
            <p className="font-bold text-lg">
              {profile.name || "Unnamed User"}
            </p>
            <p className="text-sm text-muted-foreground">
              {profile.email || "No email"}
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              label: "Full Name",
              key: "name",
              icon: User,
              placeholder: "Your name",
            },
            {
              label: "Location",
              key: "location",
              icon: MapPin,
              placeholder: "City, Country",
            },
            {
              label: "Website",
              key: "website",
              icon: Globe,
              placeholder: "https://yoursite.com",
            },
          ].map(({ label, key, icon: Icon, placeholder }) => (
            <div key={key}>
              <label className="text-xs text-muted-foreground mb-1.5 block">
                {label}
              </label>

              <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                <input
                  value={(profile[key as keyof Profile] as string) || ""}
                  onChange={(e) => update(key as keyof Profile, e.target.value)}
                  placeholder={placeholder}
                  className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <label className="text-xs text-muted-foreground mb-1.5 block">
            Bio
          </label>

          <textarea
            value={profile.bio || ""}
            onChange={(e) => update("bio", e.target.value)}
            placeholder="Tell the world about yourself..."
            rows={3}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-semibold mb-4">Skills</h2>

        <div className="flex flex-wrap gap-2 mb-4 min-h-[2.5rem]">
          {profile.skills.map((skill) => (
            <span
              key={skill}
              className="flex items-center gap-1.5 px-2 py-1 border rounded"
            >
              {skill}
              <button onClick={() => removeSkill(skill)}>
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2 mb-4">
          <input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSkill(newSkill)}
            placeholder="Add a skill..."
            className="flex-1 px-3 py-2 border rounded text-sm"
          />

          <button
            onClick={() => addSkill(newSkill)}
            className="px-3 py-2 bg-primary text-white rounded"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {SKILL_SUGGESTIONS.filter((s) => !profile.skills.includes(s)).map(
            (s) => (
              <button
                key={s}
                onClick={() => addSkill(s)}
                className="text-xs px-2 py-1 border rounded"
              >
                + {s}
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
