"use client";

import { ArrowRight, Eye, EyeOff, Zap } from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed. Please try again.");
        return;
      }

      // Store token + name for dashboard use
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
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
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
            Your next great
            <br />
            project is waiting.
          </h2>
          <p className="text-muted-foreground font-body leading-relaxed mb-10">
            Sign in to see AI-matched projects tailored to your exact skill set
            and experience level.
          </p>
          <div className="space-y-4">
            {[
              { value: "2.4K+", label: "Active developers" },
              { value: "890+", label: "Open projects" },
              { value: "94%", label: "Avg. match accuracy" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-1 h-6 rounded-full bg-primary" />
                <span className="font-display font-bold text-foreground">
                  {stat.value}
                </span>
                <span className="text-sm text-muted-foreground font-body">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
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

          <h1 className="font-display text-2xl font-bold tracking-tight mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground font-body mb-8">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-primary hover:underline underline-offset-4"
            >
              Sign up free
            </Link>
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium font-body mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium font-body">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline underline-offset-4 font-body"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  placeholder="••••••••"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium font-body text-sm hover:opacity-90 disabled:opacity-60 transition-all glow-cyan-sm mt-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
