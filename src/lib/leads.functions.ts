import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { validarLead, hashIp, montarLeadRow } from "./leads.server-utils";

/**
 * Envio público do formulário de reserva.
 * Valida no servidor, aplica honeypot e limite por IP, e grava com credencial
 * privilegiada — a tabela de leads nunca é escrita direto do navegador.
 */
export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data)
  .handler(async ({ data }) => {
    const parsed = validarLead(data);
    if (!parsed.ok) {
      return { ok: false as const, error: "Dados inválidos. Confira os campos e tente de novo." };
    }

    // Honeypot preenchido: resposta positiva falsa, nada é gravado.
    if (parsed.value.website) {
      return { ok: true as const, id: null };
    }

    try {
      const request = getRequest();
      const ip =
        request.headers.get("cf-connecting-ip") ??
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        "desconhecido";
      const ipHash = await hashIp(ip);

      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

      const umaHoraAtras = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { count } = await supabaseAdmin
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("ip_hash", ipHash)
        .gte("created_at", umaHoraAtras);

      if ((count ?? 0) >= 5) {
        return {
          ok: false as const,
          error: "Recebemos vários envios do seu dispositivo. Fale direto no WhatsApp.",
          rateLimited: true as const,
        };
      }

      const { data: inserted, error } = await supabaseAdmin
        .from("leads")
        .insert(montarLeadRow(parsed.value, ipHash))
        .select("id")
        .single();

      if (error || !inserted) {
        console.error("submit-lead insert error", error?.message);
        return { ok: false as const, error: "Não conseguimos registrar agora." };
      }

      return { ok: true as const, id: inserted.id };
    } catch (erro) {
      console.error("submit-lead falhou", erro);
      return { ok: false as const, error: "Não conseguimos registrar agora." };
    }
  });
