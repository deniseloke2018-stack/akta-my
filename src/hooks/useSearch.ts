import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import type { SearchResult } from "../types";

export function useSearch(initialQuery = "") {
  const [query, setQuery] = useState(initialQuery);

  const { data: results = [], isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      if (!query.trim() || query.length < 2) return [];

      const { data, error } = await supabase
        .rpc("search_sections", { query });

      if (error) throw error;

      return (data || []).map((d: any) => ({
        act_id: d.act_id,
        act_title: d.act_title_en,
        act_number: d.act_number,
        section_id: d.section_id,
        section_number: d.section_number,
        section_title: d.section_title,
        snippet: d.snippet,
        rank: d.rank
      })) as SearchResult[];
    },
    enabled: query.length >= 2,
  });

  return { query, setQuery, results, isLoading };
}
