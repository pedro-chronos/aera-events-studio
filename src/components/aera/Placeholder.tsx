import { cn } from "@/lib/utils";
import type { ImagemAera } from "@/data/images";
import { Estrela } from "./Estrela";

/**
 * Enquanto não há fotos reais, renderiza um bloco em degradê suave na proporção
 * correta. Assim que `src` existir em src/data/images.ts, a foto aparece.
 */
export function Figura({
  imagem,
  className,
  prioridade = false,
}: {
  imagem: ImagemAera;
  className?: string;
  prioridade?: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl shadow-aera",
        imagem.proporcao,
        className,
      )}
    >
      {imagem.src ? (
        <img
          src={imagem.src}
          alt={imagem.alt}
          loading={prioridade ? "eager" : "lazy"}
          className="h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.08]"
        />
      ) : (
        /* TODO: foto real */
        <div className="gradient-aera-suave flex h-full w-full items-center justify-center transition-transform duration-[600ms] ease-out group-hover:scale-[1.08]">
          <Estrela className="h-16 w-16 text-serenity opacity-30" />
          <span className="sr-only">{imagem.alt}</span>
        </div>
      )}
      <div className="gradient-aera pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-15" />
    </div>
  );
}
