import { useState } from "react";

interface HeaderProps {
  title?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  showSearch?: boolean;
}

export default function Header({ title = "Dashboard", searchQuery = "", onSearchChange, showSearch = false }: HeaderProps) {
  return (
    <header className="border-b border-border bg-surface px-6 py-4 flex items-center justify-between flex-shrink-0">
      <h1 className="text-xl font-semibold text-text-primary">{title}</h1>
      {showSearch && onSearchChange && (
        <input
          type="text"
          placeholder="Search sessions…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-surface-hover border border-border rounded-lg px-4 py-2 text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent w-64"
        />
      )}
    </header>
  );
}
