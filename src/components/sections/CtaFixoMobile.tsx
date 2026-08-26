import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { BotaoAera } from "@/components/aera/BotaoAera";
import { useReserva } from "@/components/aera/ReservaProvider";

export function CtaFixoMobile() {
  const [visivel, setVisivel] = useState(false);
  const { abrir } = useReserva();

  useEffect(() => {
    const aoRolar = () => setVisivel(window.scrollY > window.innerHeight * 0.8);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-creme/95 px-4 py-3 backdrop-blur-md transition-all duration-300 md:hidden",
        visivel ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
      )}
    >
      <BotaoAera className="w-full" onClick={() => abrir({ origem: "cta_fixo_mobile" })}>
        Quero reservar
      </BotaoAera>
    </div>
  );
}
