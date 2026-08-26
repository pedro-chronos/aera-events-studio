import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Destaque, Eyebrow, Revelar, Section } from "@/components/aera/Section";
import { OBSERVACOES } from "@/data/content";

export function FAQ() {
  return (
    <Section id="faq">
      <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        <Revelar>
          <Eyebrow>Boas práticas</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.5vw,3rem)] leading-tight text-grafite">
            Observações <Destaque>importantes</Destaque>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-grafite-suave">
            Tudo o que combinamos antes para o seu evento fluir sem surpresas.
          </p>
        </Revelar>

        <Revelar delay={80}>
          <Accordion type="single" collapsible className="w-full">
            {OBSERVACOES.map((item, i) => (
              <AccordionItem key={item.titulo} value={`obs-${i}`}>
                <AccordionTrigger className="text-left font-display text-lg text-grafite hover:text-serenity-deep">
                  {item.titulo}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-grafite-suave">
                  {item.conteudo}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Revelar>
      </div>
    </Section>
  );
}
