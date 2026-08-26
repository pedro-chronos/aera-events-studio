import { Estrela } from "@/components/aera/Estrela";
import { Destaque, Eyebrow, Revelar, Section } from "@/components/aera/Section";
import { EXPERIENCIA_ITENS } from "@/data/content";

export function Experiencia() {
  return (
    <Section id="experiencia">
      <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <Revelar>
          <Eyebrow>A experiência</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.5vw,3rem)] leading-tight text-grafite">
            Uma experiência pensada para <Destaque>encantar</Destaque>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-grafite-suave">
            No Studio Casa Forte II, o seu evento se torna uma experiência wellness única para você
            e seus convidados.
          </p>
        </Revelar>

        <ul className="space-y-4">
          {EXPERIENCIA_ITENS.map((item, i) => (
            <Revelar key={item} delay={i * 80}>
              <li className="group flex items-start gap-4 rounded-3xl bg-creme p-5 shadow-aera transition-all duration-300">
                <Estrela className="mt-0.5 h-5 w-5 shrink-0 text-serenity transition-all duration-300 group-hover:rotate-45 group-hover:text-quartzo-deep" />
                <span className="text-base text-grafite transition-all duration-300 group-hover:pl-1">
                  {item}
                </span>
              </li>
            </Revelar>
          ))}
        </ul>
      </div>
    </Section>
  );
}
