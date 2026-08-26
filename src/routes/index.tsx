import { createFileRoute } from "@tanstack/react-router";

import { ReservaProvider } from "@/components/aera/ReservaProvider";
import { Divisor } from "@/components/aera/Section";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Experiencia } from "@/components/sections/Experiencia";
import { Pacotes } from "@/components/sections/Pacotes";
import { Espaco } from "@/components/sections/Espaco";
import { Parceiros } from "@/components/sections/Parceiros";
import { FAQ } from "@/components/sections/FAQ";
import { Footer } from "@/components/sections/Footer";
import { CtaFixoMobile } from "@/components/sections/CtaFixoMobile";

const TITULO = "Aera Pilates — Eventos e aniversários no Studio Casa Forte II";
const DESCRICAO =
  "Celebre seu aniversário ou evento de marca em uma experiência wellness exclusiva: aula privativa de pilates reformer e lounge no Aera Pilates, Casa Forte, Recife.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITULO },
      { name: "description", content: DESCRICAO },
      { property: "og:title", content: TITULO },
      { property: "og:description", content: DESCRICAO },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <ReservaProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <Experiencia />
          <Pacotes />
          <Divisor />
          <Espaco />
          <Parceiros />
          <FAQ />
        </main>
        <Footer />
        <CtaFixoMobile />
      </div>
    </ReservaProvider>
  );
}
