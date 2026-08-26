import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import type { PacoteInteresse } from "@/lib/lead-schema";
import { FormularioReserva } from "./FormularioReserva";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type AbrirArgs = { pacote?: PacoteInteresse; origem: string };

type ReservaContexto = {
  abrir: (args: AbrirArgs) => void;
};

const Contexto = createContext<ReservaContexto | null>(null);

export function useReserva() {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error("useReserva precisa estar dentro de ReservaProvider");
  return ctx;
}

export function ReservaProvider({ children }: { children: ReactNode }) {
  const [aberto, setAberto] = useState(false);
  const [pacote, setPacote] = useState<PacoteInteresse>("indeciso");
  const [origem, setOrigem] = useState("hero");

  const abrir = useCallback(({ pacote: p, origem: o }: AbrirArgs) => {
    setPacote(p ?? "indeciso");
    setOrigem(o);
    setAberto(true);
  }, []);

  const valor = useMemo(() => ({ abrir }), [abrir]);

  return (
    <Contexto.Provider value={valor}>
      {children}
      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent
          showCloseButton
          className="max-h-[100dvh] w-full max-w-lg overflow-y-auto rounded-none border-0 bg-creme p-6 sm:max-h-[92vh] sm:rounded-3xl sm:p-8"
        >
          <FormularioReserva
            pacoteInicial={pacote}
            origem={origem}
            aoConcluir={() => setAberto(false)}
          />
        </DialogContent>
      </Dialog>
    </Contexto.Provider>
  );
}
