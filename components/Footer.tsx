"use client";

import { FolderGit2, Globe, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import Link from "next/link";

const Footer = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

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

  if (pathname.startsWith("/dashboard")) return null;

  return (
    <footer className="border-t border-border bg-background/50">
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Zap
                  size={14}
                  className="text-primary-foreground fill-current"
                />
              </div>
              <span className="font-display font-bold text-base">
                Skill<span className="text-primary">Bridge</span>
              </span>
            </Link>

            <p className="text-sm text-muted-foreground font-body max-w-xs leading-relaxed">
              AI-powered platform that connects developers with the right
              projects based on their skills and experience.
            </p>

            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://github.com/priyanshu-mandloi"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-all duration-200"
              >
                <FolderGit2 size={15} />
              </a>

              <a
                href="https://www.linkedin.com/in/priyanshu-mandloi/"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-all duration-200"
              >
                <Globe size={15} />
              </a>
            </div>
          </div>

          <div>
            <p className="section-label mb-4">Account</p>
            <ul className="space-y-3">
              {isLoggedIn ? (
                <>
                  <li>
                    <Link
                      href="/dashboard"
                      className="text-sm text-muted-foreground hover:text-foreground font-body transition-colors"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/profile"
                      className="text-sm text-muted-foreground hover:text-foreground font-body transition-colors"
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/settings"
                      className="text-sm text-muted-foreground hover:text-foreground font-body transition-colors"
                    >
                      Settings
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-destructive hover:text-destructive/80 font-body transition-colors"
                    >
                      Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      href="/login"
                      className="text-sm text-muted-foreground hover:text-foreground font-body transition-colors"
                    >
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      className="text-sm text-muted-foreground hover:text-foreground font-body transition-colors"
                    >
                      Register
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard"
                      className="text-sm text-muted-foreground hover:text-foreground font-body transition-colors"
                    >
                      Dashboard
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-body">
            © {new Date().getFullYear()} SkillBridge AI. All rights reserved.
          </p>

          <div className="flex items-center gap-1 text-xs text-muted-foreground font-body">
            <span>Built by</span>

            <a
              href="https://github.com/priyanshu-mandloi"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Priyanshu Mandloi
            </a>

            <span>·</span>

            <a
              href="https://www.linkedin.com/in/priyanshu-mandloi/"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline font-medium"
            >
              LinkedIn
            </a>

            <span>·</span>

            <a
              href="https://github.com/priyanshu-mandloi"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline font-medium"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
