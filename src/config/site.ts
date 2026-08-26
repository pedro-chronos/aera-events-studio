/**
 * Suposições documentadas: os dados de contato abaixo são provisórios até a
 * gestão do studio confirmar os valores oficiais. Basta trocar aqui.
 */
export const WHATSAPP_NUMBER = "5581999999999";

export const SITE = {
  nome: "Aera Pilates",
  complexo: "Studios Casa Forte II",
  endereco: "Rua Dona Tereza Cardoso, 100 — Casa Forte, Recife/PE",
  instagram: "@aerapilates",
  instagramUrl: "https://instagram.com/aerapilates",
  horario: "Segunda a sexta, 6h às 21h · Sábados, 7h às 12h",
} as const;

export function whatsappLink(mensagem: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
}
