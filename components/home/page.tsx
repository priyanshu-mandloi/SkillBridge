"use client";

import { ArrowRight, Code2, GitBranch, Sparkles } from "lucide-react";

import Link from "next/link";
import { motion } from "framer-motion";

const floatingCards = [
  {
    icon: Code2,
    label: "React Developer",
    sub: "5 projects matched",
    delay: 0,
  },
  {
    icon: GitBranch,
    label: "Open Source",
    sub: "324 contributors",
    delay: 0.2,
  },
  { icon: Sparkles, label: "AI-Matched", sub: "98% accuracy", delay: 0.4 },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden cyber-grid pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-72 h-72 rounded-full bg-primary/8 blur-3xl pointer-events-none" />

      <div className="max-w-screen-xl mx-auto px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/8 mb-6">
              <Sparkles size={12} className="text-primary" />
              <span className="text-xs font-medium text-primary font-body tracking-wide">
                AI-Powered Skill Matching
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-800 leading-[1.05] tracking-tight mb-6">
              Bridge Your <span className="text-gradient">Skills</span> to Real{" "}
              <span className="relative">
                Projects
                <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-primary rounded-full" />
              </span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground font-body leading-relaxed mb-8 max-w-lg">
              SkillBridge AI intelligently matches developers with open-source
              and freelance projects that align with their expertise — helping
              you grow, contribute, and build a standout portfolio.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium font-body text-sm hover:opacity-90 transition-opacity glow-cyan"
              >
                Start Matching Free
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/#projects"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-border text-foreground font-medium font-body text-sm hover:bg-secondary transition-colors"
              >
                Browse Projects
              </Link>
            </div>

            <div className="flex items-center gap-6 mt-8">
              {[
                { value: "2.4K+", label: "Developers" },
                { value: "890+", label: "Projects" },
                { value: "94%", label: "Match Rate" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display font-bold text-xl text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="relative hidden lg:flex flex-col gap-4 items-end"
          >
            <div className="w-full max-w-sm bg-card rounded-2xl border border-border p-5 glow-cyan-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="section-label">AI Match Score</span>
                <span className="tag">Live</span>
              </div>
              <div className="space-y-3">
                {[
                  { skill: "TypeScript", match: 97, color: "bg-primary" },
                  { skill: "React.js", match: 92, color: "bg-primary" },
                  { skill: "Node.js", match: 85, color: "bg-primary/70" },
                  { skill: "PostgreSQL", match: 78, color: "bg-primary/50" },
                ].map((item) => (
                  <div key={item.skill}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-body text-muted-foreground">
                        {item.skill}
                      </span>
                      <span className="text-xs font-display font-semibold text-primary">
                        {item.match}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${item.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.match}%` }}
                        transition={{ duration: 1, delay: 0.8 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {floatingCards.map((card) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + card.delay }}
                className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 w-fit"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <card.icon size={15} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs font-display font-semibold leading-tight">
                    {card.label}
                  </p>
                  <p className="text-xs text-muted-foreground font-body">
                    {card.sub}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
