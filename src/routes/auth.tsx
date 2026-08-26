import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { BotaoAera } from "@/components/aera/BotaoAera";
import { Estrela } from "@/components/aera/Estrela";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TITULO = "Acesso restrito — Aera Pilates";
const DESCRICAO = "Área interna da equipe Aera Pilates para gestão de reservas e disponibilidade.";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: TITULO },
      { name: "description", content: DESCRICAO },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: TITULO },
      { property: "og:description", content: DESCRICAO },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function entrar(evento: React.FormEvent) {
    evento.preventDefault();
    setCarregando(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setCarregando(false);
    if (error) {
      toast.error("E-mail ou senha inválidos.");
      return;
    }
    navigate({ to: "/admin" });
  }

  return (
    <div className="gradient-aera-suave flex min-h-screen items-center justify-center px-5">
      <form
        onSubmit={entrar}
        className="w-full max-w-sm rounded-3xl bg-creme p-8 shadow-aera-forte"
      >
        <Estrela className="h-8 w-8 text-serenity" />
        <h1 className="mt-4 font-display text-2xl text-grafite">Área da equipe</h1>
        <p className="mt-1 text-sm text-grafite-suave">Entre para gerenciar reservas e datas.</p>

        <div className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs uppercase tracking-[0.12em]">
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="senha" className="text-xs uppercase tracking-[0.12em]">
              Senha
            </Label>
            <Input
              id="senha"
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
        </div>

        <BotaoAera type="submit" className="mt-6 w-full" comSeta={false} disabled={carregando}>
          {carregando ? "Entrando..." : "Entrar"}
        </BotaoAera>
      </form>
    </div>
  );
}
