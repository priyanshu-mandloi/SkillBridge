"use client";

import { Bell, Check, Eye, EyeOff, Loader2, Shield } from "lucide-react";

import { cn } from "@/lib/utils";
import { useState } from "react";

const Toggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => (
  <button
    onClick={onChange}
    className={cn(
      "relative w-10 h-5.5 rounded-full transition-colors duration-200",
      checked ? "bg-primary" : "bg-border",
    )}
    style={{ height: "22px" }}
  >
    <span
      className={cn(
        "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200",
        checked ? "translate-x-[18px]" : "translate-x-0",
      )}
    />
  </button>
);

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    browser: false,
    weekly: true,
    matches: true,
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  const toggleNotif = (key: keyof typeof notifications) =>
    setNotifications((n) => ({ ...n, [key]: !n[key] }));

  const handleSaveNotifications = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChangePassword = async () => {
    setPwError("");
    setPwSuccess(false);
    if (!passwords.current || !passwords.newPass) {
      setPwError("All fields are required.");
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      setPwError("Passwords do not match.");
      return;
    }
    if (passwords.newPass.length < 8) {
      setPwError("Password must be at least 8 characters.");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setPwSuccess(true);
    setPasswords({ current: "", newPass: "", confirm: "" });
    setTimeout(() => setPwSuccess(false), 3000);
  };

  const notifSettings = [
    {
      key: "email" as const,
      label: "Email Notifications",
      desc: "Receive important updates via email",
    },
    {
      key: "browser" as const,
      label: "Browser Notifications",
      desc: "Get push notifications in your browser",
    },
    {
      key: "weekly" as const,
      label: "Weekly Digest",
      desc: "Weekly summary of your activity and matches",
    },
    {
      key: "matches" as const,
      label: "New AI Matches",
      desc: "Notify when new project matches are available",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <p className="section-label mb-1">Settings</p>
        <h1 className="text-3xl font-display font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your notifications and security preferences
        </p>
      </div>

      {/* Notifications */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="font-display font-semibold">Notifications</h2>
        </div>
        <div className="space-y-4">
          {notifSettings.map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <Toggle
                checked={notifications[key]}
                onChange={() => toggleNotif(key)}
              />
            </div>
          ))}
        </div>
        <div className="mt-5 pt-4 border-t border-border">
          <button
            onClick={handleSaveNotifications}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <Check className="w-4 h-4" />
            ) : null}
            {saved ? "Saved!" : "Save Preferences"}
          </button>
        </div>
      </div>

      {/* Security */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="font-display font-semibold">Security</h2>
        </div>

        <div className="space-y-4">
          {pwError && (
            <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 px-3 py-2 rounded-lg">
              {pwError}
            </p>
          )}
          {pwSuccess && (
            <p className="text-sm text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg flex items-center gap-2">
              <Check className="w-4 h-4" /> Password changed successfully!
            </p>
          )}

          {[
            {
              label: "Current Password",
              key: "current",
              show: showCurrent,
              toggle: () => setShowCurrent((v) => !v),
            },
            {
              label: "New Password",
              key: "newPass",
              show: showNew,
              toggle: () => setShowNew((v) => !v),
            },
            {
              label: "Confirm New Password",
              key: "confirm",
              show: showNew,
              toggle: () => setShowNew((v) => !v),
            },
          ].map(({ label, key, show, toggle }) => (
            <div key={key}>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                {label}
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={passwords[key as keyof typeof passwords]}
                  onChange={(e) =>
                    setPasswords((p) => ({ ...p, [key]: e.target.value }))
                  }
                  placeholder="••••••••"
                  className="w-full px-3 pr-10 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
                <button
                  onClick={toggle}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {show ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-border">
          <button
            onClick={handleChangePassword}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Change Password
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-card border border-destructive/20 rounded-xl p-6">
        <h2 className="font-display font-semibold text-destructive mb-2">
          Danger Zone
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          These actions are irreversible. Proceed with caution.
        </p>
        <button className="px-4 py-2 border border-destructive/30 text-destructive rounded-lg text-sm font-medium hover:bg-destructive/10 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  );
}
