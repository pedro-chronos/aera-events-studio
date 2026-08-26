import { supabase } from "@/integrations/supabase/client";

/** Leitura pública das datas bloqueadas (policy TO anon). */
export async function listarDatasIndisponiveis(): Promise<string[]> {
  const { data, error } = await supabase
    .from("datas_indisponiveis")
    .select("data")
    .order("data", { ascending: true });
  if (error) return [];
  return (data ?? []).map((linha) => linha.data);
}
