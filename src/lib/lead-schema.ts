import { z } from "zod";

export const TIPOS_EVENTO = ["aniversario", "marca", "outro"] as const;
export const PACOTES = ["sala_exclusiva", "lounge", "indeciso"] as const;
export const STATUS_LEAD = ["novo", "em_contato", "fechado", "perdido"] as const;

export type TipoEvento = (typeof TIPOS_EVENTO)[number];
export type PacoteInteresse = (typeof PACOTES)[number];
export type StatusLead = (typeof STATUS_LEAD)[number];

export const LABEL_TIPO_EVENTO: Record<TipoEvento, string> = {
  aniversario: "Aniversário",
  marca: "Evento de marca",
  outro: "Outro",
};

export const LABEL_PACOTE: Record<PacoteInteresse, string> = {
  sala_exclusiva: "A sala, só sua",
  lounge: "Comemore no lounge",
  indeciso: "Ainda estou decidindo",
};

export const LABEL_STATUS: Record<StatusLead, string> = {
  novo: "Novo",
  em_contato: "Em contato",
  fechado: "Fechado",
  perdido: "Perdido",
};

/** Mantém apenas dígitos e garante o DDI 55. */
export function normalizarWhatsapp(valor: string): string {
  const digitos = valor.replace(/\D/g, "");
  const sem55 = digitos.startsWith("55") ? digitos.slice(2) : digitos;
  return `55${sem55}`;
}

export function mascararWhatsapp(valor: string): string {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Schema usado no formulário (cliente) e revalidado no servidor. */
export const leadSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "Conte pelo menos o primeiro nome.")
    .max(120, "Nome muito longo."),
  whatsapp: z
    .string()
    .trim()
    .refine((v) => {
      const d = v.replace(/\D/g, "");
      const sem55 = d.startsWith("55") ? d.slice(2) : d;
      return sem55.length >= 10 && sem55.length <= 11;
    }, "Informe um WhatsApp com DDD."),
  email: z
    .string()
    .trim()
    .max(255, "E-mail muito longo.")
    .email("E-mail inválido.")
    .optional()
    .or(z.literal("")),
  tipo_evento: z.enum(TIPOS_EVENTO),
  pacote_interesse: z.enum(PACOTES),
  numero_convidados: z
    .number({ invalid_type_error: "Informe um número." })
    .int()
    .min(1, "Mínimo de 1 convidado.")
    .max(30, "Máximo de 30 convidados.")
    .optional(),
  data_desejada: z.string().trim().optional().or(z.literal("")),
  mensagem: z.string().trim().max(800, "Máximo de 800 caracteres.").optional().or(z.literal("")),
  origem_secao: z.string().trim().max(60).optional(),
  utm_source: z.string().trim().max(120).optional(),
  utm_medium: z.string().trim().max(120).optional(),
  utm_campaign: z.string().trim().max(120).optional(),
  /** Honeypot: precisa chegar vazio. */
  website: z.string().max(200).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
