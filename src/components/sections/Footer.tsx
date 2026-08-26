import { Instagram, MapPin, MessageCircle } from "lucide-react";

import { Estrela } from "@/components/aera/Estrela";
import { SITE, whatsappLink } from "@/config/site";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-grafite px-5 py-16 text-creme sm:px-6 lg:px-8">
      <Estrela className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 text-serenity opacity-10" />
      <div className="relative mx-auto w-full max-w-6xl">
        <div className="flex items-center gap-2">
          <Estrela className="h-7 w-7 text-serenity" />
          <span className="font-display text-xl tracking-wide">Aera Pilates</span>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-creme/60">
              Studio
            </p>
            <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-creme/90">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-serenity" />
              {SITE.endereco}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-creme/60">
              Fale com a gente
            </p>
            <a
              href={whatsappLink("Olá! Quero saber mais sobre eventos no Aera Pilates.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-sm text-creme/90 transition-colors hover:text-serenity"
            >
              <MessageCircle className="h-4 w-4 text-serenity" />
              {SITE.whatsappExibicao}
            </a>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-creme/60">
              Instagram
            </p>
            <a
              href={SITE.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-sm text-creme/90 transition-colors hover:text-serenity"
            >
              <Instagram className="h-4 w-4 text-serenity" />
              {SITE.instagram}
            </a>
          </div>
        </div>

        <p className="mt-12 border-t border-creme/15 pt-6 text-xs text-creme/50">
          © {new Date().getFullYear()} Aera Pilates — Studios Casa Forte II. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
}
