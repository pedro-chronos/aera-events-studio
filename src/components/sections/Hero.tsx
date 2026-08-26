import { BotaoAera, LinkAera } from "@/components/aera/BotaoAera";
import { Estrela } from "@/components/aera/Estrela";
import { Destaque, Eyebrow, Revelar } from "@/components/aera/Section";
import { Figura } from "@/components/aera/Placeholder";
import { useReserva } from "@/components/aera/ReservaProvider";
import { IMAGENS } from "@/data/images";

export function Hero() {
  const { abrir } = useReserva();

  return (
    <div id="top" className="relative grid min-h-[92vh] items-center gap-10 pt-24 md:grid-cols-2 md:gap-0 md:pt-0">
      <div className="relative order-1 px-5 sm:px-6 md:pl-10 lg:pl-16">
        <div className="gradient-glow pointer-events-none absolute -left-24 top-0 h-[520px] w-[520px] rounded-full" />
        <Estrela className="girar-lento pointer-events-none absolute -top-16 left-4 h-72 w-72 text-serenity opacity-[0.14]" />

        <Revelar className="relative max-w-xl">
          <Eyebrow>Eventos &amp; aniversários exclusivos</Eyebrow>
          <h1 className="mt-5 font-display text-[clamp(2.5rem,7vw,4.25rem)] leading-[1.05] text-grafite">
            Viva um
            <br />
            momento
            <br />
            <Destaque>inesquecível</Destaque>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-grafite-suave">
            Transforme seu aniversário ou evento de marca numa experiência imersiva e exclusiva,
            dentro do Studio que você já ama.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <BotaoAera tamanho="lg" onClick={() => abrir({ origem: "hero" })}>
              Quero reservar
            </BotaoAera>
            <LinkAera href="#pacotes">Ver pacotes</LinkAera>
          </div>
        </Revelar>
      </div>

      <div className="order-2 md:h-screen">
        <Figura
          imagem={IMAGENS.hero}
          prioridade
          className="h-full w-full rounded-none md:rounded-l-[3rem] [&>div]:h-full"
        />
      </div>
    </div>
  );
}
