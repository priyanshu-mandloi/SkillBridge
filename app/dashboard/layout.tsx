"use client";

import {
  Brain,
  ChevronRight,
  FolderKanban,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import Link from "next/link";
import { ModeToggle } from "@/components/ModeToggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/ai-match", label: "AI Match", icon: Brain },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/", label: "Home", icon: Home },
];

function SidebarContent({
  userName,
  isActive,
  handleLogout,
  setSidebarOpen,
}: {
  userName: string;
  isActive: (item: (typeof navItems)[0]) => boolean;
  handleLogout: () => void;
  setSidebarOpen: (open: boolean) => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-bold text-lg text-gradient">
            SkillBridge
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                active
                  ? "bg-primary/15 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary",
              )}
            >
              <item.icon
                className={cn(
                  "w-4 h-4 shrink-0",
                  active ? "text-primary" : "group-hover:text-foreground",
                )}
              />
              {item.label}
              {active && (
                <ChevronRight className="w-3 h-3 ml-auto text-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-border space-y-1">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-secondary/50">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-muted-foreground">Developer</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("Developer");
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    } else {
      const name = localStorage.getItem("userName");
      if (name) setUserName(name);
      setAuthChecked(true);
    }
  }, [router]);

  const isActive = (item: (typeof navItems)[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const handleLogout = () => {
    document.cookie = "token=; Max-Age=0; path=/";
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    router.push("/login");
  };

  // Don't render dashboard until auth is confirmed
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background cyber-grid">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 flex-col bg-sidebar border-r border-sidebar-border z-30">
        <SidebarContent
          userName={userName}
          isActive={isActive}
          handleLogout={handleLogout}
          setSidebarOpen={setSidebarOpen}
        />
      </aside>

      {/* Sidebar - mobile */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 flex-col bg-sidebar border-r border-sidebar-border z-50 transition-transform duration-300 flex lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent
          userName={userName}
          isActive={isActive}
          handleLogout={handleLogout}
          setSidebarOpen={setSidebarOpen}
        />
      </aside>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-20 h-16 bg-background/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-4 lg:px-6">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <div className="hidden lg:block">
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <ModeToggle />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
