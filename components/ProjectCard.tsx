import { ArrowUpRight, GitFork, Star } from "lucide-react";

import Link from "next/link";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  stars: number;
  forks: number;
  matchScore: number;
  status: "open" | "closed" | "in-progress";
  postedAt: string;
};

const statusStyles = {
  open: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
  closed: "bg-red-500/10 text-red-500 border-red-500/30",
  "in-progress": "bg-amber-500/10 text-amber-500 border-amber-500/30",
};

const statusLabels = {
  open: "Open",
  closed: "Closed",
  "in-progress": "In Progress",
};

export default function ProjectCard({
  id,
  title,
  description,
  tags,
  stars,
  forks,
  matchScore,
  status,
  postedAt,
}: ProjectCardProps) {
  return (
    <div className="group flex flex-col p-5 rounded-2xl border border-border bg-card card-hover">
      <div className="flex items-start justify-between mb-3">
        <span
          className={cn(
            "text-xs font-medium px-2.5 py-1 rounded-full border",
            statusStyles[status],
          )}
        >
          {statusLabels[status]}
        </span>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
          <span className="text-xs font-display font-bold text-primary">
            {matchScore}%
          </span>
          <span className="text-xs text-muted-foreground font-body">match</span>
        </div>
      </div>

      <h3 className="font-display font-semibold text-base leading-snug mb-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground font-body leading-relaxed flex-1 mb-4">
        {description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-xs text-muted-foreground font-body">
            <Star size={12} /> {stars.toLocaleString()}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground font-body">
            <GitFork size={12} /> {forks}
          </span>
          <span className="text-xs text-muted-foreground font-body">
            {postedAt}
          </span>
        </div>
        <Link
          href={`/dashboard/projects/${id}`}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline underline-offset-4 font-body"
        >
          View <ArrowUpRight size={12} />
        </Link>
      </div>
    </div>
  );
}
