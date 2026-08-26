import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { BotaoAera } from "@/components/aera/BotaoAera";
import { Estrela } from "@/components/aera/Estrela";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  adicionarDataIndisponivel,
  atualizarStatusLead,
  listarDatasAdmin,
  listarLeads,
  removerDataIndisponivel,
} from "@/lib/admin.functions";
import {
  LABEL_PACOTE,
  LABEL_STATUS,
  LABEL_TIPO_EVENTO,
  STATUS_LEAD,
  type StatusLead,
} from "@/lib/lead-schema";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Painel de reservas — Aera Pilates" },
      { name: "description", content: "Gestão de leads e datas indisponíveis do Aera Pilates." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Painel de reservas — Aera Pilates" },
      { property: "og:description", content: "Gestão interna de leads e disponibilidade." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

function formatarData(valor: string | null) {
  if (!valor) return "—";
  const data = new Date(valor.length === 10 ? `${valor}T12:00:00` : valor);
  return data.toLocaleDateString("pt-BR");
}

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const buscarLeads = useServerFn(listarLeads);
  const buscarDatas = useServerFn(listarDatasAdmin);
  const salvarStatus = useServerFn(atualizarStatusLead);
  const salvarData = useServerFn(adicionarDataIndisponivel);
  const apagarData = useServerFn(removerDataIndisponivel);

  const [novaData, setNovaData] = useState("");
  const [motivo, setMotivo] = useState("");

  const leads = useQuery({ queryKey: ["admin", "leads"], queryFn: () => buscarLeads({}) });
  const datas = useQuery({ queryKey: ["admin", "datas"], queryFn: () => buscarDatas({}) });

  async function mudarStatus(id: string, status: StatusLead) {
    try {
      await salvarStatus({ data: { id, status } });
      toast.success("Status atualizado.");
      queryClient.invalidateQueries({ queryKey: ["admin", "leads"] });
    } catch {
      toast.error("Não conseguimos atualizar o status.");
    }
  }

  async function bloquearData(evento: React.FormEvent) {
    evento.preventDefault();
    if (!novaData) return;
    try {
      await salvarData({ data: { data: novaData, motivo: motivo || undefined } });
      setNovaData("");
      setMotivo("");
      toast.success("Data bloqueada.");
      queryClient.invalidateQueries({ queryKey: ["admin", "datas"] });
    } catch {
      toast.error("Essa data já está bloqueada ou não pôde ser salva.");
    }
  }

  async function liberarData(id: string) {
    try {
      await apagarData({ data: { id } });
      toast.success("Data liberada.");
      queryClient.invalidateQueries({ queryKey: ["admin", "datas"] });
    } catch {
      toast.error("Não conseguimos remover a data.");
    }
  }

  async function sair() {
    await supabase.auth.signOut();
    queryClient.clear();
    navigate({ to: "/auth" });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-creme">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Estrela className="h-6 w-6 text-serenity" />
            <span className="font-display text-lg text-grafite">Painel Aera</span>
          </div>
          <button
            type="button"
            onClick={sair}
            className="link-aera cursor-pointer text-sm text-grafite"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl space-y-12 px-5 py-10 sm:px-6 lg:px-8">
        <section>
          <h1 className="font-display text-2xl text-grafite">Leads</h1>
          {leads.isLoading && <p className="mt-3 text-sm text-grafite-suave">Carregando...</p>}
          {leads.isError && (
            <p className="mt-3 text-sm text-quartzo-deep">Não conseguimos carregar os leads.</p>
          )}
          {leads.data && leads.data.length === 0 && (
            <p className="mt-3 text-sm text-grafite-suave">Nenhum lead ainda.</p>
          )}
          {leads.data && leads.data.length > 0 && (
            <div className="mt-4 overflow-x-auto rounded-3xl border border-border bg-creme">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recebido</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>WhatsApp</TableHead>
                    <TableHead>Evento</TableHead>
                    <TableHead>Pacote</TableHead>
                    <TableHead>Convidados</TableHead>
                    <TableHead>Data desejada</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.data.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="whitespace-nowrap text-xs text-grafite-suave">
                        {formatarData(lead.created_at)}
                      </TableCell>
                      <TableCell className="font-medium text-grafite">{lead.nome}</TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        <a
                          href={`https://wa.me/${lead.whatsapp.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-aera"
                        >
                          {lead.whatsapp}
                        </a>
                      </TableCell>
                      <TableCell className="text-sm">
                        {LABEL_TIPO_EVENTO[lead.tipo_evento as keyof typeof LABEL_TIPO_EVENTO]}
                      </TableCell>
                      <TableCell className="text-sm">
                        {LABEL_PACOTE[lead.pacote_interesse as keyof typeof LABEL_PACOTE]}
                      </TableCell>
                      <TableCell className="text-sm">{lead.numero_convidados ?? "—"}</TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        {formatarData(lead.data_desejada)}
                      </TableCell>
                      <TableCell className="text-xs text-grafite-suave">
                        {lead.origem_secao ?? "—"}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={lead.status ?? "novo"}
                          onValueChange={(v) => mudarStatus(lead.id, v as StatusLead)}
                        >
                          <SelectTrigger className="w-[150px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_LEAD.map((s) => (
                              <SelectItem key={s} value={s}>
                                {LABEL_STATUS[s]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </section>

        <section>
          <h2 className="font-display text-2xl text-grafite">Datas indisponíveis</h2>
          <form onSubmit={bloquearData} className="mt-4 flex flex-wrap items-end gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="nova-data" className="text-xs uppercase tracking-[0.12em]">
                Data
              </Label>
              <Input
                id="nova-data"
                type="date"
                value={novaData}
                onChange={(e) => setNovaData(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="motivo" className="text-xs uppercase tracking-[0.12em]">
                Motivo (opcional)
              </Label>
              <Input
                id="motivo"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Evento fechado"
              />
            </div>
            <BotaoAera type="submit" comSeta={false}>
              Bloquear
            </BotaoAera>
          </form>

          <ul className="mt-6 flex flex-wrap gap-2">
            {datas.data?.map((d) => (
              <li
                key={d.id}
                className="flex items-center gap-2 rounded-full border border-border bg-creme px-4 py-1.5 text-sm text-grafite"
              >
                {formatarData(d.data)}
                {d.motivo && <span className="text-xs text-grafite-suave">· {d.motivo}</span>}
                <button
                  type="button"
                  aria-label={`Liberar ${formatarData(d.data)}`}
                  onClick={() => liberarData(d.id)}
                  className="cursor-pointer text-grafite-suave transition-colors hover:text-quartzo-deep"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
            {datas.data && datas.data.length === 0 && (
              <li className="text-sm text-grafite-suave">Nenhuma data bloqueada.</li>
            )}
          </ul>
        </section>
      </main>
    </div>
  );
}
