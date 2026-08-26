import { leadSchema, normalizarWhatsapp, type LeadInput } from "./lead-schema";

export function validarLead(
  data: unknown,
): { ok: true; value: LeadInput } | { ok: false; value: null } {
  const parsed = leadSchema.safeParse(data);
  if (!parsed.success) return { ok: false, value: null };
  return { ok: true, value: parsed.data };
}

export async function hashIp(ip: string): Promise<string> {
  const bytes = new TextEncoder().encode(`aera:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function montarLeadRow(lead: LeadInput, ipHash: string) {
  return {
    nome: lead.nome,
    whatsapp: normalizarWhatsapp(lead.whatsapp),
    email: lead.email ? lead.email : null,
    tipo_evento: lead.tipo_evento,
    pacote_interesse: lead.pacote_interesse,
    numero_convidados: lead.numero_convidados ?? null,
    data_desejada: lead.data_desejada ? lead.data_desejada : null,
    mensagem: lead.mensagem ? lead.mensagem : null,
    origem_secao: lead.origem_secao ?? null,
    utm_source: lead.utm_source ?? null,
    utm_medium: lead.utm_medium ?? null,
    utm_campaign: lead.utm_campaign ?? null,
    ip_hash: ipHash,
  };
}
