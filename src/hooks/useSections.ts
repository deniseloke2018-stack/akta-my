import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import type { Part, Section, Subsection } from "../types";

export function useParts(actId: string) {
  return useQuery({
    queryKey: ["parts", actId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("parts")
        .select("*")
        .eq("act_id", actId)
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data as Part[];
    },
    enabled: !!actId,
  });
}

export function useSections(actId: string) {
  return useQuery({
    queryKey: ["sections", actId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sections")
        .select("*")
        .eq("act_id", actId)
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data as Section[];
    },
    enabled: !!actId,
  });
}

export function useSubsections(actId: string) {
  return useQuery({
    queryKey: ["subsections", actId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subsections")
        .select("*")
        .like("id", `${actId}-%`)
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data as Subsection[];
    },
    enabled: !!actId,
  });
}
