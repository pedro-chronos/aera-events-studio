import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { BotaoAera } from "@/components/aera/BotaoAera";
import { Estrela } from "@/components/aera/Estrela";
import { useReserva } from "@/components/aera/ReservaProvider";

const ANCORAS = [
  { href: "#experiencia", label: "A experiência" },
  { href: "#pacotes", label: "Pacotes" },
  { href: "#espaco", label: "O espaço" },
  { href: "#parceiros", label: "Parceiros" },
];

export function Header() {
  const [rolou, setRolou] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const { abrir } = useReserva();

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 80);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        rolou ? "bg-creme/85 shadow-aera backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="gradient-aera h-[3px] w-full" />
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-3 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2">
          <Estrela className="h-7 w-7 text-serenity" />
          <span className="font-display text-lg tracking-wide text-grafite">Aera Pilates</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {ANCORAS.map((a) => (
            <a key={a.href} href={a.href} className="link-aera text-sm text-grafite">
              {a.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <BotaoAera
            className="hidden md:inline-flex"
            comSeta={false}
            onClick={() => abrir({ origem: "header" })}
          >
            Reservar
          </BotaoAera>
          <button
            type="button"
            aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMenuAberto((v) => !v)}
            className="cursor-pointer rounded-full p-2 text-grafite transition-colors hover:bg-creme md:hidden"
          >
            {menuAberto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuAberto && (
        <div className="border-t border-border bg-creme px-5 pb-6 pt-2 md:hidden">
          <nav className="flex flex-col gap-4">
            {ANCORAS.map((a) => (
              <a
                key={a.href}
                href={a.href}
                onClick={() => setMenuAberto(false)}
                className="link-aera w-fit text-base text-grafite"
              >
                {a.label}
              </a>
            ))}
            <BotaoAera
              className="mt-2 w-full"
              onClick={() => {
                setMenuAberto(false);
                abrir({ origem: "header" });
              }}
            >
              Reservar
            </BotaoAera>
          </nav>
        </div>
      )}
    </header>
  );
}
