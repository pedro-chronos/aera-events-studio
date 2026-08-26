/**
 * Ainda não há fotos reais do studio. Cada item usa placeholder em degradê com a
 * proporção correta — troque `src` pelo caminho da foto quando ela chegar.
 */
export type ImagemAera = {
  src: string | null;
  alt: string;
  proporcao: string;
};

export const IMAGENS = {
  hero: {
    src: null,
    alt: "Sala do Aera Pilates em tons de rosa e azul com aparelhos de reformer",
    proporcao: "aspect-[4/5]",
  },
  espaco1: {
    src: null,
    alt: "Vista ampla da sala do Aera Pilates com iluminação cênica",
    proporcao: "aspect-[16/10]",
  },
  espaco2: {
    src: null,
    alt: "Detalhe do reformer na sala rosa e azul do Aera Pilates",
    proporcao: "aspect-[16/10]",
  },
  lounge: {
    src: null,
    alt: "Lounge do Studios Casa Forte II preparado para confraternização",
    proporcao: "aspect-[16/10]",
  },
} satisfies Record<string, ImagemAera>;
