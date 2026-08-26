import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BotaoAera } from "./BotaoAera";
import { Destaque } from "./Section";
import { listarDatasIndisponiveis } from "@/lib/datas";
import { submitLead } from "@/lib/leads.functions";
import { whatsappLink } from "@/config/site";
import {
  LABEL_PACOTE,
  LABEL_TIPO_EVENTO,
  PACOTES,
  TIPOS_EVENTO,
  leadSchema,
  mascararWhatsapp,
  type LeadInput,
  type PacoteInteresse,
} from "@/lib/lead-schema";

type Estado = "idle" | "enviando" | "sucesso" | "erro";

function montarMensagemWhatsapp(valores: LeadInput): string {
  const linhas = [
    `Olá! Meu nome é ${valores.nome} e quero reservar um evento no Aera Pilates.`,
    `Tipo de evento: ${LABEL_TIPO_EVENTO[valores.tipo_evento]}`,
    `Pacote de interesse: ${LABEL_PACOTE[valores.pacote_interesse]}`,
  ];
  if (valores.numero_convidados) linhas.push(`Convidados: ${valores.numero_convidados}`);
  if (valores.data_desejada) {
    const [ano, mes, dia] = valores.data_desejada.split("-");
    linhas.push(`Data desejada: ${dia}/${mes}/${ano}`);
  }
  if (valores.mensagem) linhas.push(`Mensagem: ${valores.mensagem}`);
  return linhas.join("\n");
}

export function FormularioReserva({
  pacoteInicial,
  origem,
  aoConcluir,
}: {
  pacoteInicial: PacoteInteresse;
  origem: string;
  aoConcluir: () => void;
}) {
  const [estado, setEstado] = useState<Estado>("idle");
  const [datasBloqueadas, setDatasBloqueadas] = useState<string[]>([]);
  const enviando = useRef(false);
  const enviarLead = useServerFn(submitLead);

  const utms = useMemo(() => {
    if (typeof window === "undefined") return {};
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get("utm_source") ?? undefined,
      utm_medium: params.get("utm_medium") ?? undefined,
      utm_campaign: params.get("utm_campaign") ?? undefined,
    };
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      nome: "",
      whatsapp: "",
      email: "",
      tipo_evento: "aniversario",
      pacote_interesse: pacoteInicial,
      data_desejada: "",
      mensagem: "",
      website: "",
    },
  });

  useEffect(() => {
    setValue("pacote_interesse", pacoteInicial);
  }, [pacoteInicial, setValue]);

  useEffect(() => {
    let ativo = true;
    listarDatasIndisponiveis().then((datas) => {
      if (ativo) setDatasBloqueadas(datas);
    });
    return () => {
      ativo = false;
    };
  }, []);

  const dataEscolhida = watch("data_desejada");
  const dataBloqueada = Boolean(dataEscolhida && datasBloqueadas.includes(dataEscolhida));

  async function onSubmit(valores: LeadInput) {
    if (enviando.current) return;
    if (dataBloqueada) {
      toast.error("Essa data não está disponível. Escolha outra, por favor.");
      return;
    }
    enviando.current = true;
    setEstado("enviando");

    const destino = whatsappLink(montarMensagemWhatsapp(valores));

    try {
      const resposta = await enviarLead({
        data: {
          ...valores,
          ...utms,
          origem_secao: origem,
          numero_convidados: valores.numero_convidados ? Number(valores.numero_convidados) : undefined,
        },
      });
      if (resposta.ok) {
        setEstado("sucesso");
        toast.success("Recebemos seus dados. Vamos continuar no WhatsApp!");
      } else {
        setEstado("erro");
        toast.error(
          resposta.error ??
            "Não conseguimos enviar agora. Tente de novo ou fale direto no WhatsApp.",
        );
      }
    } catch {
      setEstado("erro");
      toast.error("Não conseguimos enviar agora. Vamos te levar direto ao WhatsApp.");
    } finally {
      enviando.current = false;
      // Regra de ouro: a conversão nunca depende do back-end estar de pé.
      window.open(destino, "_blank", "noopener,noreferrer");
      aoConcluir();
    }
  }

  const hoje = new Date().toISOString().slice(0, 10);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div>
        <h2 className="font-display text-3xl text-grafite">
          Vamos montar o <Destaque>seu evento</Destaque>
        </h2>
        <p className="mt-2 text-sm text-grafite-suave">
          Conte os detalhes e seguimos a conversa no WhatsApp.
        </p>
      </div>

      {/* Honeypot: invisível para pessoas, atrativo para robôs. */}
      <div className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <Campo label="Nome" erro={errors.nome?.message}>
        <Input id="nome" placeholder="Como podemos te chamar?" {...register("nome")} />
      </Campo>

      <Campo label="WhatsApp" erro={errors.whatsapp?.message}>
        <Input
          id="whatsapp"
          inputMode="tel"
          placeholder="(81) 90000-0000"
          {...register("whatsapp", {
            onChange: (evento) => {
              setValue("whatsapp", mascararWhatsapp(evento.target.value));
            },
          })}
        />
      </Campo>

      <Campo label="E-mail (opcional)" erro={errors.email?.message}>
        <Input id="email" type="email" placeholder="voce@email.com" {...register("email")} />
      </Campo>

      <div className="grid gap-5 sm:grid-cols-2">
        <Campo label="Tipo de evento" erro={errors.tipo_evento?.message}>
          <Select
            defaultValue="aniversario"
            onValueChange={(v) => setValue("tipo_evento", v as LeadInput["tipo_evento"])}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIPOS_EVENTO.map((t) => (
                <SelectItem key={t} value={t}>
                  {LABEL_TIPO_EVENTO[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Campo>

        <Campo label="Pacote de interesse" erro={errors.pacote_interesse?.message}>
          <Select
            value={watch("pacote_interesse")}
            onValueChange={(v) => setValue("pacote_interesse", v as PacoteInteresse)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PACOTES.map((p) => (
                <SelectItem key={p} value={p}>
                  {LABEL_PACOTE[p]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Campo>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Campo label="Convidados (opcional)" erro={errors.numero_convidados?.message}>
          <Input
            id="numero_convidados"
            type="number"
            min={1}
            max={30}
            placeholder="Até 30"
            {...register("numero_convidados", {
              setValueAs: (v) => (v === "" || v === null ? undefined : Number(v)),
            })}
          />
        </Campo>

        <Campo
          label="Data desejada (opcional)"
          erro={dataBloqueada ? "Essa data não está disponível." : errors.data_desejada?.message}
        >
          <Input id="data_desejada" type="date" min={hoje} {...register("data_desejada")} />
        </Campo>
      </div>

      <Campo label="Mensagem (opcional)" erro={errors.mensagem?.message}>
        <Textarea
          id="mensagem"
          rows={3}
          placeholder="Conte a ideia do seu evento"
          {...register("mensagem")}
        />
      </Campo>

      <BotaoAera
        type="submit"
        tamanho="lg"
        className="w-full"
        disabled={estado === "enviando"}
        comSeta={estado !== "enviando"}
      >
        {estado === "enviando" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Enviando...
          </>
        ) : (
          "Enviar e falar no WhatsApp"
        )}
      </BotaoAera>

      {estado === "erro" && (
        <p className="text-center text-sm text-quartzo-deep">
          Não conseguimos enviar agora. Tente de novo ou fale direto no WhatsApp.
        </p>
      )}
    </form>
  );
}

function Campo({
  label,
  erro,
  children,
}: {
  label: string;
  erro?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium uppercase tracking-[0.12em] text-grafite-suave">
        {label}
      </Label>
      <div
        className={
          erro
            ? "rounded-md ring-1 ring-quartzo-deep [&_[data-slot=select-trigger]]:border-quartzo-deep [&_input]:border-quartzo-deep [&_textarea]:border-quartzo-deep"
            : "transition-shadow duration-200 focus-within:ring-2 focus-within:ring-serenity rounded-md"
        }
      >
        {children}
      </div>
      {erro && <p className="text-xs text-quartzo-deep">{erro}</p>}
    </div>
  );
}
