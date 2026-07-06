"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Sliders,
  BarChart3,
  Settings,
  Search,
  Sparkles,
  User,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  action: () => void;
  category: "page" | "session" | "action";
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [items, setItems] = useState<CommandItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { sessions, setSelectedSessionId } = useStore();
  const { user, signOut } = useAuth();

  // Build command items
  const buildItems = useCallback(() => {
    const pageItems: CommandItem[] = [
      {
        id: "page-dashboard",
        label: "Dashboard",
        description: "View session overview",
        icon: <LayoutDashboard className="w-4 h-4" />,
        action: () => router.push("/dashboard"),
        category: "page",
      },
      {
        id: "page-sessions",
        label: "Sessions",
        description: "Browse all sessions",
        icon: <Users className="w-4 h-4" />,
        action: () => router.push("/sessions"),
        category: "page",
      },
      {
        id: "page-rules",
        label: "Rules",
        description: "Tune classification weights",
        icon: <Sliders className="w-4 h-4" />,
        action: () => router.push("/rules"),
        category: "page",
      },
      {
        id: "page-insights",
        label: "Insights",
        description: "Analytics & funnel",
        icon: <BarChart3 className="w-4 h-4" />,
        action: () => router.push("/insights"),
        category: "page",
      },
      {
        id: "page-settings",
        label: "Settings",
        description: "App preferences",
        icon: <Settings className="w-4 h-4" />,
        action: () => router.push("/settings"),
        category: "page",
      },
    ];

    const sessionItems: CommandItem[] = sessions.slice(0, 20).map((s) => ({
      id: `session-${s.id}`,
      label: s.visitorId || `Session ${s.id.slice(0, 8)}`,
      description: `${s.events.length} events · ${s.id.slice(0, 12)}`,
      icon: <User className="w-4 h-4" />,
      action: () => {
        setSelectedSessionId(s.id);
        router.push("/dashboard");
      },
      category: "session",
    }));

    const actionItems: CommandItem[] = [
      {
        id: "action-logout",
        label: "Logout",
        description: user?.email || "Sign out",
        icon: <LogOut className="w-4 h-4" />,
        action: () => {
          signOut();
          setIsOpen(false);
          router.push("/");
        },
        category: "action",
      },
    ];

    return [...pageItems, ...sessionItems, ...actionItems];
  }, [sessions, router, setSelectedSessionId, user, signOut]);

  // Filter items based on query
  const getFilteredItems = useCallback(() => {
    const allItems = buildItems();
    if (!query.trim()) return allItems;
    const q = query.toLowerCase();
    return allItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
    );
  }, [buildItems, query]);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        if (!isOpen) {
          setQuery("");
          setSelectedIndex(0);
        }
      }
      // Escape to close
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
      // Arrow keys
      if (isOpen) {
        const filtered = getFilteredItems();
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % filtered.length);
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
        }
        if (e.key === "Enter" && filtered.length > 0) {
          e.preventDefault();
          const item = filtered[selectedIndex];
          if (item) {
            item.action();
            setIsOpen(false);
          }
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, getFilteredItems, selectedIndex]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filteredItems = getFilteredItems();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Command palette */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="fixed left-1/2 top-[20%] z-50 w-full max-w-2xl -translate-x-1/2"
          >
            <div className="bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search className="w-5 h-5 text-text-tertiary" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  placeholder="Search pages, sessions, actions…"
                  className="flex-1 bg-transparent text-text-primary text-sm focus:outline-none placeholder-text-tertiary"
                />
                <kbd className="text-2xs text-text-tertiary bg-surface-hover px-2 py-1 rounded-md border border-border">
                  Esc
                </kbd>
              </div>

              {/* Results */}
              <div
                ref={listRef}
                className="max-h-80 overflow-y-auto p-2 space-y-0.5"
              >
                {filteredItems.length === 0 ? (
                  <div className="py-8 text-center text-text-secondary text-sm">
                    No results found for "{query}"
                  </div>
                ) : (
                  filteredItems.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        item.action();
                        setIsOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                        index === selectedIndex
                          ? "bg-accent/10 text-text-primary"
                          : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                      )}
                    >
                      <span className="text-accent">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm">{item.label}</div>
                        {item.description && (
                          <div className="text-2xs text-text-tertiary">
                            {item.description}
                          </div>
                        )}
                      </div>
                      <span className="text-2xs text-text-tertiary bg-surface-hover px-1.5 py-0.5 rounded">
                        {item.category}
                      </span>
                    </button>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-surface-raised">
                <div className="flex items-center gap-4 text-2xs text-text-tertiary">
                  <span>⌘K to open</span>
                  <span>↑↓ to navigate</span>
                  <span>↵ to select</span>
                </div>
                <span className="text-2xs text-text-tertiary">
                  {filteredItems.length} results
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
