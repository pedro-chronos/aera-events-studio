# Aera Pilates — Landing de Eventos & Aniversários

Página única em português, com captura de lead no banco e redirecionamento para o WhatsApp, mais um painel interno protegido por login.

## Decisões já fechadas
- Backend completo: leads, datas indisponíveis e painel `/admin`.
- Imagens: placeholders com degradê rosa/azul e proporção correta, prontos para troca.
- Formulário: modal único, aberto por qualquer botão "Quero reservar", com o pacote pré-selecionado conforme o botão de origem. Tela cheia no celular.
- Sem e-mail de notificação por agora (pode entrar depois).

## Identidade visual
- Paleta exata do briefing (areia, creme, serenity, quartzo, grafite) como tokens de tema — nenhum hex solto nos componentes.
- Quatro degradês reutilizáveis: `gradient-aera`, `gradient-aera-suave`, `gradient-glow`, `gradient-texto`.
- Tipografia: Playfair Display nos títulos, DM Sans no corpo, carregadas via `<link>`.
- Palavra-chave de cada título em itálico serifado com degradê no texto.
- Estrela radial da marca como marca d'água no hero (rotação lenta), divisor entre seções e bullet das listas.
- Sombras coloridas, raio 24px em cards e 999px em botões/badges, espaçamento vertical padronizado por um componente `Section`.

## Seções (na ordem)
1. Header fixo transparente que ganha fundo creme com blur após 80px; menu drawer no celular.
2. Hero split 50/50 com título "Viva um momento **inesquecível**", botão "Quero reservar" e link "Ver pacotes".
3. A experiência — 4 itens com bullet-estrela.
4. Pacotes — Pacote 01 "A sala, só sua" (R$ 2.000 seg–sex / R$ 2.800 fins de semana e feriados, destacado com tag "Mais escolhido") e Pacote 02 "Comemore no lounge" (R$ 500), com todas as observações do briefing.
5. O espaço — Aera Pilates, chips (50 minutos · Reformer · Até 19 pessoas) e galeria de 2 imagens.
6. Os outros studios — Tonus Gym e Jab House, cards compactos.
7. Parceiros oficiais — grid de 8 cards com o aviso de custos à parte.
8. Incremente sua experiência — 4 itens de decoração e a nota de aprovação prévia.
9. Observações importantes — accordion de 6 itens.
10. CTA final em degradê suave.
11. Footer com endereço, Instagram, horários e barra de degradê no topo.

Quatro pontos de conversão: hero, após pacotes, após galeria e CTA final. Botão fixo na base no celular depois do hero.

## Movimento e acessibilidade
Entrada das seções por fade + subida com Intersection Observer (uma vez só, escalonado). Hover em todo elemento clicável: botões com brilho em movimento e seta que avança, cards que sobem com sombra colorida, imagens com zoom dentro do card parado, bullets que giram, chips que invertem cor. Foco visível em tudo. `prefers-reduced-motion` desliga animações e a rotação da estrela. Sem rolagem horizontal de 320px a 1440px.

## Backend
- Tabela `leads` com nome, whatsapp, e-mail, tipo de evento, pacote, número de convidados, data desejada, mensagem, seção de origem, UTMs e status. Índices em data, status e whatsapp; `updated_at` por trigger.
- Tabela `datas_indisponiveis` (data única + motivo) para desabilitar dias no seletor.
- Segurança: RLS em ambas. `leads` sem nenhuma leitura ou escrita pública — a gravação passa por função de servidor com credencial privilegiada; leitura só para usuário autenticado no painel. `datas_indisponiveis` com leitura pública e escrita só autenticada. Nenhum segredo no código do navegador.
- Envio do formulário: validação também no servidor, honeypot oculto, limite de 5 envios por IP por hora, resposta sem detalhe interno em caso de erro.
- Regra de ouro: se o envio falhar, a visitante é levada ao WhatsApp de qualquer forma; botão desabilitado durante o envio evita duplicidade; estados idle / enviando / sucesso / erro com mensagem acionável.
- `/admin`: login por e-mail e senha, rota protegida, tabela de leads com ordenação, filtro por status e pacote, busca por nome/WhatsApp, troca de status inline, link direto de WhatsApp, contadores (últimos 7 dias, novos sem contato, taxa de fechamento) e gestão das datas indisponíveis.

## Notas técnicas
- Stack fixa do projeto: TanStack Start (React + TypeScript + Vite) + Tailwind v4 + shadcn/ui, lucide-react, react-hook-form + zod, sonner.
- Backend via Lovable Cloud. Nesta stack a lógica de servidor usa funções de servidor do próprio framework (não Edge Functions), que é o equivalente seguro ao pedido no briefing.
- Tokens e degradês em `src/styles.css` (Tailwind v4 não usa `tailwind.config`). Seções em `src/components/sections/`, acesso a dados em `src/lib/`, WhatsApp em `src/config/site.ts`, caminhos de imagem em `src/data/images.ts`. Tipos do banco gerados, sem interface manual. Sem localStorage.
- Suposições documentadas em comentário: número de WhatsApp, endereço e Instagram entram como placeholder até você me passar os valores reais.
