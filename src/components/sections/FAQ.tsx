import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Destaque, Eyebrow, Revelar, Section } from "@/components/aera/Section";
import { FAQS } from "@/data/content";

export function FAQ() {
  return (
    <Section id="faq">
      <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        <Revelar>
          <Eyebrow>Dúvidas</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.5vw,3rem)] leading-tight text-grafite">
            Perguntas <Destaque>frequentes</Destaque>
          </h2>
        </Revelar>

        <Revelar delay={80}>
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, i) => (
              <AccordionItem key={faq.pergunta} value={`faq-${i}`}>
                <AccordionTrigger className="text-left font-display text-lg text-grafite hover:text-serenity-deep">
                  {faq.pergunta}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-grafite-suave">
                  {faq.resposta}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Revelar>
      </div>
    </Section>
  );
}
