"use client";

import { FC, useEffect, useRef, useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
};

const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
];

const HIDDEN_ROUTES = ["/dashboard", "/login", "/register"];

const Navbar: FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const shouldHide = HIDDEN_ROUTES.some((route) => pathname.startsWith(route));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [pathname]);

  const handleLogout = () => {
    document.cookie = "token=; Max-Age=0; path=/";
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    router.push("/");
  };

  if (shouldHide) return null;

  return (
    <header
      ref={headerRef}
      className={cn(
        "w-full z-50 fixed top-0 left-0 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border"
          : "bg-transparent",
      )}
    >
      <nav className="flex items-center justify-between px-6 py-4 max-w-screen-xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-cyan-sm">
            <Zap size={16} className="text-primary-foreground fill-current" />
          </div>
          <span className="font-display font-800 text-lg tracking-tight">
            Skill<span className="text-primary">Bridge</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium font-body transition-all duration-200",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <ModeToggle />
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium font-body rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium font-body text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium font-body rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity glow-cyan-sm"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <ModeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-6 py-4">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-lg text-sm font-medium font-body transition-all",
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-3 border-t border-border mt-2 flex flex-col gap-2">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="block px-4 py-3 rounded-lg text-sm font-medium font-body text-center border border-border text-destructive hover:bg-destructive/10 transition-colors"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-lg text-sm font-medium font-body text-center border border-border hover:bg-secondary transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-lg text-sm font-medium font-body text-center bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
