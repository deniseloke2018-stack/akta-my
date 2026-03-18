import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import type { Act } from "../types";

export function useActs() {
  return useQuery({
    queryKey: ["acts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("acts")
        .select("*")
        .order("year", { ascending: false });

      if (error) throw error;
      return data as Act[];
    },
  });
}

export function useAct(actId: string) {
  return useQuery({
    queryKey: ["acts", actId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("acts")
        .select("*")
        .eq("id", actId)
        .single();

      if (error) throw error;
      return data as Act;
    },
    enabled: !!actId,
  });
}

export function useFeaturedActs() {
  return useQuery({
    queryKey: ["acts", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("acts")
        .select("*")
        .eq("is_featured", true)
        .order("year", { ascending: false });

      if (error) throw error;
      return data as Act[];
    },
  });
}
