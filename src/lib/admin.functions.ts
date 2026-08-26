import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

import { STATUS_LEAD } from "./lead-schema";

export const listarLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("leads")
      .select(
        "id, created_at, nome, whatsapp, email, tipo_evento, pacote_interesse, numero_convidados, data_desejada, mensagem, origem_secao, utm_source, status",
      )
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error("Não conseguimos carregar os leads.");
    return data ?? [];
  });

export const atualizarStatusLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(STATUS_LEAD) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("leads")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error("Não conseguimos atualizar o status.");
    return { ok: true };
  });

export const listarDatasAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("datas_indisponiveis")
      .select("id, data, motivo")
      .order("data", { ascending: true });
    if (error) throw new Error("Não conseguimos carregar as datas.");
    return data ?? [];
  });

export const adicionarDataIndisponivel = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
        motivo: z.string().trim().max(200).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("datas_indisponiveis")
      .insert({ data: data.data, motivo: data.motivo || null });
    if (error) throw new Error("Essa data já está bloqueada ou não pôde ser salva.");
    return { ok: true };
  });

export const removerDataIndisponivel = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("datas_indisponiveis")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error("Não conseguimos remover a data.");
    return { ok: true };
  });
