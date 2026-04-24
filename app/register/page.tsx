"use client";

import { ArrowRight, Check, Eye, EyeOff, Zap } from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const perks = [
  "AI-matched projects in seconds",
  "Verified skill badge system",
  "GitHub integration",
  "Free forever on basic plan",
];

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<1 | 2>(1);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    level: "",
    github: "",
  });

  const updateForm = (key: keyof typeof form, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (step === 1) {
      if (form.password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
      setStep(2);
      return;
    }

    // Step 2 — submit to API
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${form.firstName.trim()} ${form.lastName.trim()}`,
          email: form.email,
          password: form.password,
          role: form.role,
          level: form.level,
          github: form.github,
          skills: [],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userId", data.user.id);

      router.push("/dashboard");
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex cyber-grid">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary/15 via-background to-background items-center justify-center p-12">
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="relative max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap size={16} className="text-primary-foreground fill-current" />
            </div>
            <span className="font-display font-bold text-lg">
              Skill<span className="text-primary">Bridge</span>
            </span>
          </Link>
          <h2 className="font-display text-4xl font-bold tracking-tight mb-4">
            Start building your
            <br />
            developer story.
          </h2>
          <p className="text-muted-foreground font-body leading-relaxed mb-10">
            Create your profile once, and let AI match you with projects that
            actually fit your skill level and interests.
          </p>
          <ul className="space-y-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0">
                  <Check size={11} className="text-primary" />
                </div>
                <span className="text-sm font-body text-muted-foreground">
                  {perk}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 py-24">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Zap size={14} className="text-primary-foreground fill-current" />
            </div>
            <span className="font-display font-bold text-base">
              Skill<span className="text-primary">Bridge</span>
            </span>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-display font-bold transition-all ${
                    step >= s
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {step > s ? <Check size={12} /> : s}
                </div>
                {s < 2 && (
                  <div
                    className={`w-8 h-px transition-colors ${
                      step > s ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
            <span className="ml-2 text-xs text-muted-foreground font-body">
              Step {step} of 2
            </span>
          </div>

          <h1 className="font-display text-2xl font-bold tracking-tight mb-1">
            {step === 1 ? "Create your account" : "Your skills & role"}
          </h1>
          <p className="text-sm text-muted-foreground font-body mb-8">
            {step === 1 ? (
              <>
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:underline underline-offset-4"
                >
                  Sign in
                </Link>
              </>
            ) : (
              "Tell us what you work with so we can match you better."
            )}
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium font-body mb-1.5">
                      First name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.firstName}
                      onChange={(e) => updateForm("firstName", e.target.value)}
                      placeholder="Alex"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-body mb-1.5">
                      Last name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.lastName}
                      onChange={(e) => updateForm("lastName", e.target.value)}
                      placeholder="Rivera"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium font-body mb-1.5">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium font-body mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      value={form.password}
                      onChange={(e) => updateForm("password", e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full px-4 py-3 pr-11 rounded-xl border border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium font-body mb-1.5">
                    Primary role
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) => updateForm("role", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/50 text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none"
                  >
                    <option value="">Select your role</option>
                    <option>Frontend Developer</option>
                    <option>Backend Developer</option>
                    <option>Full-Stack Developer</option>
                    <option>Mobile Developer</option>
                    <option>DevOps Engineer</option>
                    <option>Data Engineer</option>
                    <option>ML Engineer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium font-body mb-1.5">
                    Experience level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Junior", "Mid", "Senior"].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => updateForm("level", level)}
                        className={`flex items-center justify-center py-2.5 rounded-xl border text-sm font-body transition-all ${
                          form.level === level
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium font-body mb-1.5">
                    GitHub username{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={form.github}
                    onChange={(e) => updateForm("github", e.target.value)}
                    placeholder="yourusername"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium font-body text-sm hover:opacity-90 disabled:opacity-60 transition-all glow-cyan-sm mt-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  {step === 1 ? "Continue" : "Create Account"}
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {step === 1 && (
            <p className="text-xs text-center text-muted-foreground mt-6">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
