import g1 from "@/assets/galeria/galeria-1.jpeg.asset.json";
import g2 from "@/assets/galeria/galeria-2.jpeg.asset.json";
import g3 from "@/assets/galeria/galeria-3.jpeg.asset.json";
import g4 from "@/assets/galeria/galeria-4.jpeg.asset.json";
import g5 from "@/assets/galeria/galeria-5.jpeg.asset.json";
import g6 from "@/assets/galeria/galeria-6.jpeg.asset.json";
import g7 from "@/assets/galeria/galeria-7.jpeg.asset.json";
import g8 from "@/assets/galeria/galeria-8.jpeg.asset.json";

export type FotoGaleria = { src: string; alt: string };

export const GALERIA: FotoGaleria[] = [
  { src: g1.url, alt: "Grupo de amigas reunidas e sorrindo no studio antes da aula" },
  { src: g2.url, alt: "Aniversariante comemorando ao lado da mesa de doces do studio" },
  { src: g3.url, alt: "Treino no saco de boxe com iluminação cênica rosa e azul" },
  { src: g4.url, alt: "Sucos naturais, kombucha e adesivos personalizados do evento" },
  { src: g5.url, alt: "Decoração com letreiro Happy B-Day e balão estrela" },
  { src: g6.url, alt: "Bolo do aniversário decorado com confeitos azuis e dourados" },
  { src: g7.url, alt: "Mesa completa com salgados, cupcakes e doces do evento" },
  { src: g8.url, alt: "Aniversariante apagando as velas do bolo no studio" },
];
