import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Estrela } from "./Estrela";

/** Espaçamento vertical único da página, para não haver margens conflitantes. */
export function Section({
  id,
  children,
  className,
  fundo = "areia",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  fundo?: "areia" | "creme" | "suave";
}) {
  return (
    <section
      id={id}
      className={cn(
        "w-full py-16 md:py-24",
        fundo === "creme" && "bg-creme",
        fundo === "suave" && "gradient-aera-suave",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

export function Divisor() {
  return (
    <div className="flex justify-center py-2">
      <Estrela className="h-8 w-8 text-serenity opacity-20" />
    </div>
  );
}

export function Eyebrow({ children, cor = "serenity" }: { children: ReactNode; cor?: "serenity" | "quartzo" }) {
  return (
    <p className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.18em] text-grafite-suave">
      <span
        className={cn(
          "inline-block h-1.5 w-1.5 rounded-full",
          cor === "serenity" ? "bg-serenity" : "bg-quartzo-deep",
        )}
      />
      {children}
    </p>
  );
}

/** Palavra-chave em itálico serifado com degradê no texto. */
export function Destaque({ children }: { children: ReactNode }) {
  return <em className="gradient-texto font-display italic">{children}</em>;
}

/** Entrada por scroll: fade + subida, uma única vez. */
export function Revelar({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;
    const observer = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) {
            setVisivel(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(elemento);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn("revelar", visivel && "revelado", className)}
    >
      {children}
    </div>
  );
}
