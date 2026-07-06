"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Sliders, 
  BarChart3,
  Settings,
  LogOut,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/lib/auth";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/sessions", label: "Sessions", icon: Users },
  { href: "/rules", label: "Rules", icon: Sliders },
  { href: "/insights", label: "Insights", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface border-r border-border flex flex-col">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <div>
            <h1 className="text-lg font-semibold text-text-primary">PersonaFlow</h1>
            <p className="text-2xs text-text-secondary">Shopper Intelligence</p>
          </div>
        </div>
        <kbd className="text-2xs text-text-tertiary bg-surface-hover px-1.5 py-0.5 rounded border border-border">
          ⌘K
        </kbd>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                active
                  ? "bg-accent/10 text-accent"
                  : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border space-y-1">
        {user && (
          <div className="text-xs text-text-secondary px-2.5 py-1 truncate">
            {user.email}
          </div>
        )}
        <Link
          href="/settings"
          className={cn(
            "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
            pathname === "/settings"
              ? "bg-accent/10 text-accent"
              : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
          )}
        >
          <Settings size={18} />
          Settings
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-red-400 hover:bg-surface-hover hover:text-red-300 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
