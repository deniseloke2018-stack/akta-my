import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CategoryInfo } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function highlight(text: string, query: string): string {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(
    new RegExp(`(${escaped})`, "gi"),
    '<mark class="bg-primary text-primary rounded px-0.5">$1</mark>'
  );
}

export function getSnippet(content: string, query: string, radius = 150): string {
  if (!query.trim()) return content.slice(0, radius * 2) + "…";
  const idx = content.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return content.slice(0, radius * 2) + "…";
  const start = Math.max(0, idx - radius);
  const end = Math.min(content.length, idx + query.length + radius);
  return (start > 0 ? "…" : "") + content.slice(start, end) + (end < content.length ? "…" : "");
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: "constitution",
    label: "Constitution",
    label_ms: "Perlembagaan",
    icon: "⚖️",
    description: "The supreme law of Malaysia",
    color: "bg-[#ffffff] text-foreground border-border",
  },
  {
    id: "criminal",
    label: "Criminal Law",
    label_ms: "Undang-undang Jenayah",
    icon: "🔒",
    description: "Penal code and criminal procedure",
    color: "bg-[#ffffff] text-foreground border-border",
  },
  {
    id: "civil",
    label: "Civil Law",
    label_ms: "Undang-undang Sivil",
    icon: "📜",
    description: "Contracts, torts, and civil procedure",
    color: "bg-[#ffffff] text-foreground border-border",
  },
  {
    id: "employment",
    label: "Employment",
    label_ms: "Pekerjaan",
    icon: "👷",
    description: "Labour rights and workplace law",
    color: "bg-[#ffffff] text-foreground border-border",
  },
  {
    id: "commercial",
    label: "Commercial",
    label_ms: "Komersil",
    icon: "🏢",
    description: "Companies, banking, and trade",
    color: "bg-[#ffffff] text-foreground border-border",
  },
  {
    id: "data-privacy",
    label: "Data & Privacy",
    label_ms: "Data & Privasi",
    icon: "🔐",
    description: "Personal data and cybersecurity",
    color: "bg-[#ffffff] text-foreground border-border",
  },
  {
    id: "administrative",
    label: "Administrative",
    label_ms: "Pentadbiran",
    icon: "🏛️",
    description: "Government and public law",
    color: "bg-[#ffffff] text-foreground border-border",
  },
  {
    id: "family",
    label: "Family Law",
    label_ms: "Undang-undang Keluarga",
    icon: "👨‍👩‍👧",
    description: "Marriage, divorce, and custody",
    color: "bg-[#ffffff] text-foreground border-border",
  },
];

export function getCategoryInfo(id: string): CategoryInfo {
  return (
    CATEGORIES.find((c) => c.id === id) ?? {
      id: "other",
      label: "Other",
      label_ms: "Lain-lain",
      icon: "📄",
      description: "Other legislation",
      color: "bg-[#ffffff] text-foreground border-border",
    }
  );
}
