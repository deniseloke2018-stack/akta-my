// ── Core legal hierarchy types ──────────────────────────────────────────────

export type ActCategory =
  | "constitution"
  | "criminal"
  | "civil"
  | "employment"
  | "commercial"
  | "administrative"
  | "family"
  | "data-privacy"
  | "other";

export interface Act {
  id: string;
  act_number: string;       // e.g. "265"
  title_en: string;         // e.g. "Employment Act 1955"
  title_ms: string;         // e.g. "Akta Pekerjaan 1955"
  year: number;
  category: ActCategory;
  description?: string;
  last_updated: string;     // ISO date string
  total_sections?: number;
  is_featured?: boolean;
}

export interface Part {
  id: string;
  act_id: string;
  part_number: string;      // e.g. "I", "II", "XII"
  title_en: string;
  title_ms?: string;
  order_index: number;
}

export interface Section {
  id: string;
  act_id: string;
  part_id: string | null;
  section_number: string;   // e.g. "60A", "374"
  title_en: string;
  content: string;          // full text content (may contain markdown-like structure)
  order_index: number;
}

export interface Subsection {
  id: string;
  section_id: string;
  label: string;            // e.g. "(1)", "(a)", "(i)"
  content: string;
  order_index: number;
}

// ── Search ──────────────────────────────────────────────────────────────────

export interface SearchResult {
  act_id: string;
  act_title: string;
  act_number: string;
  section_id: string;
  section_number: string;
  section_title: string;
  snippet: string;          // highlighted excerpt
}

// ── UI helpers ───────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

export interface CategoryInfo {
  id: ActCategory;
  label: string;
  label_ms: string;
  icon: string;
  description: string;
  color: string;
}
