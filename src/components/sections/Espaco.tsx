import { BotaoAera } from "@/components/aera/BotaoAera";
import { CarrosselGaleria } from "@/components/aera/CarrosselGaleria";
import { Destaque, Eyebrow, Revelar, Section } from "@/components/aera/Section";
import { useReserva } from "@/components/aera/ReservaProvider";


const CHIPS = ["50 minutos", "Reformer", "Até 19 pessoas"];

export function Espaco() {
  const { abrir } = useReserva();

  return (
    <Section id="espaco">
      <div className="max-w-2xl">
        <Revelar>
          <Eyebrow>Conheça o espaço</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.5vw,3rem)] leading-tight text-grafite">
            Aera <Destaque>Pilates</Destaque>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-grafite-suave">
            Aula de 50 minutos de pilates em reformer com ritmo e musicalidade, na sala mais
            instagramável, toda rosa e azul.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {CHIPS.map((chip) => (
              <li
                key={chip}
                className="cursor-default rounded-full border border-serenity/40 px-4 py-1.5 text-xs font-medium text-grafite transition-colors duration-300 hover:bg-serenity hover:text-creme"
              >
                {chip}
              </li>
            ))}
          </ul>
        </Revelar>
      </div>

      <Revelar delay={80} className="mt-10">
        <CarrosselGaleria />
      </Revelar>


      <Revelar delay={160} className="mt-12 flex justify-center">
        <BotaoAera tamanho="lg" onClick={() => abrir({ origem: "pos_galeria" })}>
          Quero reservar o Aera
        </BotaoAera>
      </Revelar>
    </Section>
  );
}
