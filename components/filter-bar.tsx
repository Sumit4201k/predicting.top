"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function FilterBar({
  children,
  stacked = false,
  className,
  style
}: {
  children: React.ReactNode;
  stacked?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return <div className={cn("filter-bar", stacked && "stacked", className)} style={style}>{children}</div>;
}

export function FilterGroup({
  label,
  children,
  className,
  style
}: {
  label?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={cn("filter-group", className)} style={style}>
      {label ? <span className="filter-label">{label}</span> : null}
      {children}
    </div>
  );
}

export function FilterChip({
  label,
  active = false,
  icon,
  onClick,
  style
}: {
  label: string;
  active?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <button type="button" className={cn("filter-chip", active && "active")} onClick={onClick} aria-pressed={active} style={style}>
      {icon ? <span className="filter-chip-icon">{icon}</span> : null}
      {label}
    </button>
  );
}

export function FilterSelect({
  label,
  onClick
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button type="button" className="filter-select" onClick={onClick}>
      {label}
      <span className="filter-caret">▾</span>
    </button>
  );
}

export function FilterDropdown({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const currentLabel = options.find((o) => o.value === value)?.label ?? value;

  return (
    <div className="filter-dropdown" ref={rootRef}>
      <span className="filter-dropdown-label">{label}</span>

      <button
        type="button"
        className={cn("filter-dropdown-select", value !== "Any" && "active")}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="filter-dropdown-value">{currentLabel}</span>
        <span className="filter-caret">▾</span>
      </button>

      {open && (
        <ul className="filter-dropdown-menu" role="listbox" aria-label={label}>
          {options.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              className={cn("filter-dropdown-item", option.value === value && "selected")}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
