import { Estrela } from "@/components/aera/Estrela";
import { BotaoAera } from "@/components/aera/BotaoAera";
import { Destaque, Eyebrow, Revelar, Section } from "@/components/aera/Section";
import { useReserva } from "@/components/aera/ReservaProvider";

function Item({ children }: { children: React.ReactNode }) {
  return (
    <li className="group flex items-start gap-3">
      <Estrela className="mt-1 h-4 w-4 shrink-0 text-serenity transition-all duration-300 group-hover:rotate-45 group-hover:text-quartzo-deep" />
      <span className="text-sm leading-relaxed text-grafite transition-all duration-300 group-hover:pl-1">
        {children}
      </span>
    </li>
  );
}

export function Pacotes() {
  const { abrir } = useReserva();

  return (
    <Section id="pacotes" fundo="creme">
      <Revelar className="max-w-2xl">
        <Eyebrow cor="quartzo">Pacotes</Eyebrow>
        <h2 className="mt-5 font-display text-[clamp(2rem,4.5vw,3rem)] leading-tight text-grafite">
          Escolha como quer <Destaque>celebrar</Destaque>
        </h2>
      </Revelar>

      <div className="mt-12 grid items-start gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        {/* Pacote 01 — destaque */}
        <Revelar>
          <article className="borda-aera group relative rounded-3xl p-7 shadow-aera transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-2 hover:shadow-aera-forte sm:p-9">
            <span className="gradient-aera absolute -top-3 right-6 rounded-full px-4 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-grafite">
              Mais escolhido
            </span>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-grafite-suave">
              Pacote 01
            </p>
            <h3 className="mt-2 font-display text-3xl text-grafite">
              A sala, <Destaque>só sua</Destaque>
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-grafite-suave">
              Aula exclusiva da modalidade escolhida e ativação no lounge, antes e depois da aula,
              criando um momento de confraternização com os convidados.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-creme p-5 shadow-aera transition-transform duration-300 group-hover:scale-[1.03]">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-grafite-suave">
                  Segunda à sexta
                </p>
                <p className="mt-2 font-display text-3xl text-grafite">R$ 2.000</p>
              </div>
              <div className="rounded-3xl bg-serenity p-5 shadow-aera transition-transform duration-300 group-hover:scale-[1.03]">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-grafite">
                  Finais de semana e feriados
                </p>
                <p className="mt-2 font-display text-3xl text-grafite">R$ 2.800</p>
              </div>
            </div>

            <ul className="mt-7 space-y-3">
              <Item>Horários apenas fora da grade oficial de aulas.</Item>
              <Item>Consultar disponibilidade com a equipe.</Item>
              <Item>
                Alunas aniversariantes do mês que fecham antecipado têm benefícios e descontos
                exclusivos.
              </Item>
            </ul>

            <p className="mt-6 text-[12px] leading-relaxed text-grafite-suave">
              O lounge não é exclusivo para o evento. Serviços e decoração passam por aprovação
              prévia da gestão e devem ser enviados em detalhe com antecedência.
            </p>

            <BotaoAera
              className="mt-7 w-full sm:w-auto"
              onClick={() => abrir({ pacote: "sala_exclusiva", origem: "pacote_01" })}
            >
              Quero reservar
            </BotaoAera>
          </article>
        </Revelar>

        {/* Pacote 02 */}
        <Revelar delay={80}>
          <article className="group rounded-3xl border border-border bg-creme p-7 shadow-aera transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-2 hover:shadow-aera-forte sm:p-8">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-grafite-suave">
              Pacote 02
            </p>
            <h3 className="mt-2 font-display text-3xl text-grafite">
              Comemore no <Destaque>lounge</Destaque>
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-grafite-suave">
              Ativação do lounge por 2h, antes ou depois da aula regular.
            </p>

            <ul className="mt-6 space-y-3">
              <Item>Não inclui aula exclusiva.</Item>
              <Item>Convidados garantem créditos e vagas com antecedência.</Item>
              <Item>Sem bloqueio de vagas — as aulas seguem abertas.</Item>
              <Item>Fotos, vídeos e ativações ficam no lounge, preservando as aulas.</Item>
            </ul>

            <div className="mt-7 rounded-3xl bg-quartzo p-5 shadow-quartzo transition-transform duration-300 group-hover:scale-[1.03]">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-grafite">
                Uso do lounge
              </p>
              <p className="mt-2 font-display text-3xl text-grafite">R$ 500</p>
            </div>

            <p className="mt-6 text-[12px] leading-relaxed text-grafite-suave">
              Permite apenas o uso do lounge. Não inclui café ou cardápio — recomendamos fechar com
              o parceiro interno Boost ou pagar a taxa de mesa.
            </p>

            <BotaoAera
              className="mt-7 w-full sm:w-auto"
              onClick={() => abrir({ pacote: "lounge", origem: "pacote_02" })}
            >
              Quero reservar
            </BotaoAera>
          </article>
        </Revelar>
      </div>
    </Section>
  );
}
