import { Destaque, Eyebrow, Revelar, Section } from "@/components/aera/Section";
import { PARCEIROS } from "@/data/content";

export function Parceiros() {
  return (
    <Section id="parceiros" fundo="creme">
      <Revelar className="max-w-2xl">
        <Eyebrow cor="quartzo">Parceiros</Eyebrow>
        <h2 className="mt-5 font-display text-[clamp(2rem,4.5vw,3rem)] leading-tight text-grafite">
          Tudo o que você precisa, <Destaque>em um só lugar</Destaque>
        </h2>
        <p className="mt-5 text-base leading-relaxed text-grafite-suave">
          Parceiros de confiança para deixar o seu evento completo.
        </p>
      </Revelar>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PARCEIROS.map((parceiro, i) => (
          <Revelar key={parceiro.nome} delay={i * 60}>
            <article className="group h-full rounded-3xl border border-border bg-background p-6 shadow-aera transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1.5 hover:border-serenity/50 hover:shadow-aera-forte">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-serenity-deep">
                {parceiro.categoria}
              </p>
              <h3 className="mt-2 font-display text-2xl text-grafite">{parceiro.nome}</h3>
              <p className="mt-3 text-sm leading-relaxed text-grafite-suave">
                {parceiro.descricao}
              </p>
            </article>
          </Revelar>
        ))}
      </div>
    </Section>
  );
}
