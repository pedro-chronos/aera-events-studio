# Aera Events Studio

PROMPT — LANDING PAGE AERA PILATES (Studios Casa Forte II)

0. SEU PAPEL

Você é um engenheiro full-stack sênior especializado em landing pages de alta conversão para o mercado wellness premium. Você tem olho de designer (hierarquia visual, ritmo de leitura, contraste, microinterações) e disciplina de back-end (validação, segurança, RLS, tratamento de erro). Você não entrega layout genérico de template nem back-end improvisado.

1. ANTES DE ESCREVER QUALQUER CÓDIGO (obrigatório)

Execute nesta ordem e só depois comece a implementar:

Leia e mapeie o projeto atual. Liste os arquivos existentes, o design system já configurado (tailwind.config, index.css, tokens, variáveis CSS), os componentes disponíveis (shadcn/ui), o estado da integração com Supabase (tabelas, policies, migrations já existentes) e as convenções de nomenclatura em uso.

Não duplique o que já existe. Se já houver Button, Card, Accordion, Section wrapper, client do Supabase ou tokens de cor, reutilize e estenda — não crie versões paralelas.

Declare seu plano antes de codar. Em no máximo 12 linhas: quais arquivos vai criar, quais vai alterar, quais tabelas e policies vai criar, e por quê.

Depois de implementar, revise seu próprio código: classes Tailwind conflitantes, espaçamentos duplicados entre seções, imports não usados, any desnecessário, componentes que quebram em 320px, queries sem índice, policies de RLS abertas demais e segredos vazando para o client.

Se qualquer informação essencial estiver faltando, assuma a decisão mais conservadora e documente a suposição em comentário no topo do arquivo — não trave a entrega.

2. CONTEXTO DO NEGÓCIO

Marca: Aera Pilates — um dos três studios do complexo Studios Casa Forte II (Recife/PE), ao lado do Tonus Gym e do Jab House.

O produto Aera: aula de 50 minutos de pilates em reformer, com ritmo e musicalidade, na sala mais instagramável do complexo — toda rosa e azul, com iluminação cênica. Capacidade máxima de 19 pessoas.

O que esta página vende: a experiência de eventos e aniversários exclusivos dentro do Aera Pilates. A cliente aluga a sala (ou o lounge) e transforma o próprio aniversário / evento de marca em uma experiência wellness imersiva com as amigas ou com convidados.

Público-alvo: mulheres de 25 a 45 anos, classe A/B, alunas ou frequentadoras de studios boutique, ativas no Instagram, que valorizam estética, exclusividade e "momento fotografável". Também gestoras de marketing de marcas que buscam ativação em ambiente wellness.

Tom de voz: acolhedor, sofisticado, celebrativo. Frases curtas. Nada de linguagem corporativa ou de academia tradicional. Fala com a cliente, não sobre ela.

3. RESULTADO ESPERADO

Uma landing page de página única, responsiva, em português do Brasil, cujo trabalho é: capturar o lead no banco e levar a visitante ao WhatsApp do studio com mensagem pré-preenchida.

Critérios do resultado:

A visitante entende em menos de 5 segundos: o que é, onde é, e que ela pode reservar.

Existem no mínimo 4 pontos de conversão distribuídos ao longo do scroll (hero, após pacotes, após galeria, seção final).

Todo lead capturado é gravado no banco antes de abrir o WhatsApp — nenhum contato se perde.

O preço aparece de forma clara e sem constrangimento, tratado como valor e não como custo.

A página parece um convite, não um catálogo de serviços.

4. STACK E RESTRIÇÕES TÉCNICAS

Front-end: React + TypeScript + Vite + Tailwind CSS + shadcn/ui.

Back-end: Supabase (Postgres + Auth + Edge Functions), usando a integração nativa do Lovable.

Ícones: lucide-react. Formulários: react-hook-form + zod. Toasts: sonner ou o toast do shadcn.

Animações de scroll: CSS + Intersection Observer, ou framer-motion se já estiver no projeto. Não instale biblioteca pesada de animação sem necessidade.

Componentes de seção em src/components/sections/. Acesso a dados em src/lib/ — nenhum componente de UI fala direto com o Supabase.

Nada de localStorage ou sessionStorage.

O número do WhatsApp fica na constante WHATSAPP_NUMBER em src/config/site.ts, fácil de trocar.

5. BACK-END (Supabase) — faça bem-feito

5.1 Schema

Crie via migration versionada, nunca só pelo painel.

Tabela leads

Coluna Tipo Regras id uuid PK, default gen_random_uuid() created_at timestamptz default now(), not null updated_at timestamptz atualizado por trigger nome text not null, 2–120 caracteres whatsapp text not null, apenas dígitos, 10–13 caracteres email text nullable, validado por formato tipo_evento enum aniversario | marca | outro pacote_interesse enum sala_exclusiva | lounge | indeciso numero_convidados int nullable, 1–30 data_desejada date nullable mensagem text nullable, máx. 800 caracteres origem_secao text de qual CTA veio (hero, pacote_01, pacote_02, cta_final) utm_source / utm_medium / utm_campaign text nullable, lidos da URL status enum novo | em_contato | fechado | perdido, default novo

Índices em created_at desc, status e whatsapp.

Tabela datas_indisponiveis — id, data (date, unique), motivo (text). Usada para desabilitar dias no seletor de data do formulário. Leitura pública, escrita só autenticada.

5.2 Segurança (não negocie isto)

RLS habilitado em todas as tabelas. Sem exceção.

leads: nenhuma policy de SELECT para anon. A tabela de leads jamais pode ser lida do client público. INSERT também não vai direto do client — passa pela Edge Function com service_role.

datas_indisponiveis: SELECT liberado para anon; INSERT/UPDATE/DELETE apenas para authenticated.

Nenhuma chave secreta no bundle do front-end. SUPABASE_SERVICE_ROLE_KEY, chave de e-mail e webhooks ficam em Supabase Secrets, usados só nas Edge Functions.

Trigger set_updated_at em leads.

5.3 Edge Functions

submit-lead (POST)

Valida o payload com zod no servidor — nunca confie na validação do client.

Normaliza o WhatsApp (remove máscara, garante DDI 55).

Honeypot: campo oculto website no formulário; se vier preenchido, responde 200 falso e descarta.

Rate limit: máximo 5 envios por IP por hora. Excedeu, retorna 429 com mensagem clara.

Insere em leads com service_role.

Dispara notify-lead de forma assíncrona (não bloqueia a resposta).

Retorna { ok: true, id } ou { ok: false, error } — nunca vaze stack trace nem detalhe do banco para o client.

notify-lead Envia e-mail para a gestão do studio (Resend ou similar) com nome, WhatsApp, pacote, data desejada e mensagem. Falha nessa função não pode derrubar o cadastro do lead — trate com try/catch e log.

5.4 Painel interno /admin

Protegido por Supabase Auth (e-mail + senha). Rota privada com guard; usuário deslogado é redirecionado.

Tabela de leads com ordenação por data, filtro por status e por pacote_interesse, busca por nome/WhatsApp.

Ação de trocar o status inline e link direto wa.me para responder a lead.

Contadores no topo: leads dos últimos 7 dias, novos sem contato, taxa de fechamento.

Gerenciamento de datas_indisponiveis (adicionar/remover data).

5.5 Regras de front-end para o back-end

Tipos do banco gerados pelo Supabase e importados — nada de interface escrita à mão que desincroniza.

Estados de UI obrigatórios em todo formulário: idle, enviando (botão desabilitado + spinner), sucesso, erro com mensagem acionável ("Não conseguimos enviar agora. Tente de novo ou fale direto no WhatsApp").

Regra de ouro: se o submit-lead falhar por qualquer motivo, a visitante ainda é redirecionada para o WhatsApp. A conversão nunca depende do back-end estar de pé.

Envio duplo bloqueado (debounce + botão desabilitado durante o request).

6. IDENTIDADE VISUAL

6.1 Paleta (tokens no tailwind.config + variáveis CSS)

Token Hex Uso areia #F3EBDD fundo principal da página creme #FAF6EF cards e superfícies elevadas serenity #7BA4DB azul da marca — destaque principal, itálicos, badges serenity-deep #3F5F8F texto sobre fundos claros de destaque, hover de links quartzo #F2B9C6 rosa da sala — segundo destaque, badges de preço quartzo-deep #D98BA0 bordas e estados hover do rosa grafite #2E2A26 texto principal grafite-suave #6B635A texto secundário e legendas

Contraste: texto principal sempre grafite sobre areia/creme. Nunca azul claro em corpo de texto — serenity é destaque, não leitura longa.

6.2 Degradês (elemento central do visual)

A sala do Aera é rosa e azul. Esse é o DNA visual da página. Crie como utilitários reutilizáveis:

gradient-aera: linear 135° #F2B9C6 → #7BA4DB. Barra fina no topo da página, badges, borda dos cards de pacote, botão primário.

gradient-aera-suave: mesma direção, opacidade 12%, sobre creme. Fundo de cards e seções alternadas.

gradient-glow: radial #F2B9C6 35% no centro → transparente. Halo atrás do hero e do logo estrela.

gradient-texto: linear 100° #7BA4DB → #D98BA0, com background-clip: text, apenas nas palavras em itálico dos títulos.

Não encha a página de degradê. Degradê é acento — funciona porque o resto é sólido e calmo.

6.3 Tipografia

Display (títulos): serifada de alto contraste, editorial — Playfair Display ou Cormorant Garamond. Peso 400–500, nunca bold pesado.

Corpo e UI: sans-serif geométrica — Inter ou DM Sans. 400 para corpo, 500/600 para labels.

Eyebrows: sans-serif, uppercase, letter-spacing: 0.18em, 12px, grafite-suave, precedido de um ponto colorido (serenity ou quartzo, alternando por seção).

Assinatura tipográfica: em todo título principal, a palavra-chave vai em itálico serifado com gradient-texto. Ex.: "Viva um momento inesquecível", "A sala, só sua". Obrigatório — é o que amarra a página à identidade.

6.4 Elemento-assinatura

O logo do Aera é uma estrela radial (explosão de traços em V):

Divisor entre seções: estrela pequena, centralizada, opacidade 20%, em serenity.

No hero: estrela grande em marca d'água atrás do título, com gradient-glow por trás e rotação lenta contínua (60s por volta, respeitando prefers-reduced-motion).

Bullet das listas, no lugar de check genérico.

6.5 Formas e sombras

Raio: 24px em cards grandes, 999px em botões e badges. Consistente na página inteira.

Sombras suaves e coloridas, nunca cinza puro: 0 12px 40px -12px rgba(123,164,219,0.28).

Espaçamento vertical entre seções: py-24 desktop, py-16 mobile, via componente <Section> para evitar margens conflitantes.

6.6 Imagens

Não há assets ainda. Use placeholders com gradient-aera-suave e proporção correta (aspect-[4/5] retratos, aspect-[16/10] ambientes), com comentário {/* TODO: foto real */}. Todos os caminhos em src/data/images.ts para troca rápida.

7. ESTRUTURA DA PÁGINA (seção a seção, com o conteúdo real)

7.1 Header fixo

Logo Aera à esquerda, âncoras ao centro (A experiência · Pacotes · O espaço · Parceiros), botão "Reservar" à direita. Transparente no topo; após 80px de scroll, fundo creme com blur e sombra sutil, com transição suave.

7.2 Hero — split 50/50

Esquerda (sobre areia): eyebrow EVENTOS & ANIVERSÁRIOS EXCLUSIVOS; título display em 3 linhas — "Viva um momento inesquecível"; subtítulo: "Transforme seu aniversário ou evento de marca numa experiência imersiva e exclusiva, dentro do Studio que você já ama."; botão primário "Quero reservar" (abre o formulário) + link secundário "Ver pacotes".

Direita: imagem full-bleed até a borda da tela, sem padding.

Estrela radial em marca d'água + gradient-glow atrás do título.

7.3 A experiência

Eyebrow A EXPERIÊNCIA. Título "Uma experiência pensada para encantar". Texto: "No Studio Casa Forte II, o seu evento se torna uma experiência wellness única para você e seus convidados." Lista com 4 itens (bullet = estrela da marca):

Tenha uma aula exclusiva no Studio

Escolha o tema da playlist da sua aula

Viva um momento inesquecível com seus amigos e convidados

Customize seu evento do seu jeito

7.4 Pacotes — dois cards lado a lado (coração da página)

Pacote 01 — "A sala, só sua" Aula exclusiva da modalidade escolhida + ativação no lounge (pré e pós-aula), criando um momento de confraternização com os convidados. Dois blocos de preço no card:

SEGUNDA À SEXTA — R$ 2.000 (fundo creme)

FINAIS DE SEMANA E FERIADOS — R$ 2.800 (fundo serenity, texto grafite) Observações menores: horários apenas fora da grade oficial de aulas; consultar disponibilidade com a equipe; alunas aniversariantes do mês que fecham antecipado têm benefícios e descontos exclusivos. Rodapé em grafite-suave 12px: o lounge não é exclusivo para o evento; serviços e decoração passam por aprovação prévia da gestão e devem ser enviados em detalhe com antecedência. CTA: "Quero reservar →" (abre o formulário com pacote_interesse = sala_exclusiva)

Pacote 02 — "Comemore no lounge" Ativação do lounge por 2h (antes ou depois da aula regular). 4 itens: não inclui aula exclusiva · convidados garantem créditos e vagas com antecedência · sem bloqueio de vagas, as aulas seguem abertas · fotos, vídeos e ativações ficam no lounge, preservando as aulas. Preço: badge USO DO LOUNGE — R$ 500 (fundo quartzo). Observações: permite apenas o uso do lounge; não inclui café ou cardápio; recomendado fechar com o parceiro interno Boost ou pagar a taxa de mesa. CTA: "Quero reservar →" (pacote_interesse = lounge)

Pacote 01 é o destaque: card ligeiramente maior, borda com gradient-aera e tag "Mais escolhido" no canto superior.

7.5 O espaço — Aera Pilates

Eyebrow CONHEÇA O ESPAÇO. Título "Aera Pilates". Texto: "Aula de 50 minutos de pilates em reformer com ritmo e musicalidade, na sala mais instagramável, toda rosa e azul." Três chips: 50 minutos · Reformer · Até 19 pessoas. Galeria de 2 imagens grandes lado a lado.

7.6 Os outros studios (secundária, compacta)

Cards menores: Tonus Gym (musculação coletiva em duplas, 50 min, até 26 pessoas) e Jab House (cardio com técnicas de boxe na aquabag e funcional, até 14 pessoas). Mostra que o complexo comporta eventos maiores ou de outro perfil.

7.7 Parceiros oficiais

Grid responsivo de 8 cards (imagem + eyebrow de categoria + nome + descrição curta):

MP Skin Spa — Experiência · massagem + degustação de produtos premium

Camarim VIP — Penteados & styling · finalizações rápidas para fotos

Café Boost — Café & cardápio completo · mesa de café e doces

Sublime — Doces & bombons especiais · doces gourmet

Mavie — Doces saudáveis · opções fit para a mesa

Roseberry Flores — Flores · arranjos e composições personalizadas

Casa de Luiza — Bolo · bolos artesanais e composições doces

Garimpe Decore — Decoração · peças e cenários exclusivos

Aviso no rodapé da seção: custos e contratações não estão inclusos no pacote e devem ser negociados diretamente com cada parceiro; solicite os contatos à gestão.

7.8 Incremente sua experiência

Fundo gradient-aera-suave. Título "Incremente sua experiência". Texto: no pacote de aula exclusiva existem itens de decoração que podem ser incluídos na ativação. Quatro ícones em linha: Telefone · Almofadas rosa · Câmeras rosa · Molduras para arte e foto. Nota: não é permitido colar nada nas paredes e portas; todo item de decoração ou ativação precisa de aprovação da liderança do studio.

7.9 Observações importantes — accordion

Accordion do shadcn, 6 itens:

Todos os serviços extras são contratados à parte.

Aniversariante do mês possui benefícios exclusivos.

O pacote do Studio inclui experiência de aula e uso do espaço; qualquer contratação extra é por conta da aluna ou empresa/marca e precisa passar pela aprovação da gestão.

Os horários para eventos são fora da grade de aulas — não removemos aulas da grade para esse tipo de ativação.

É responsabilidade da aluna ou marca retirar todos os itens trazidos e devolver os emprestados como foram recebidos.

Temos pacotes customizáveis para deixar sua experiência do jeito que você deseja.

7.10 Formulário de reserva

Modal (ou seção fixa antes do CTA final) com os campos: nome, WhatsApp com máscara, e-mail (opcional), tipo de evento, pacote de interesse (pré-selecionado conforme o CTA de origem), número de convidados, data desejada (seletor que desabilita as datas de datas_indisponiveis), mensagem. Campo honeypot oculto. Ao enviar: grava o lead e redireciona para o WhatsApp com mensagem montada a partir das respostas. Título: "Vamos montar o seu evento". Um único botão: "Enviar e falar no WhatsApp".

7.11 CTA final

Fundo gradient-aera-suave em largura total. Eyebrow "FALE COM NOSSO TIME E MONTE SEU EVENTO NOS STUDIOS CASA FORTE II". Título grande: "Mais do que um espaço, uma experiência pensada para celebrar do jeito que você merece!". Botão grande abrindo o formulário.

7.12 Footer

Logos dos três studios em preto, endereço, Instagram, horário de funcionamento. Barra fina com gradient-aera no topo do footer.

8. UX E MICROINTERAÇÕES (leve isto a sério)

Nada na página responde de forma estática ao mouse. Toda superfície clicável reage.

Botão primário — fundo gradient-aera. Hover: scale(1.04), sombra colorida mais forte, background-position de 0% → 100% em 400ms criando movimento de luz; a seta interna translada 4px à direita. active: scale(0.98).

Botão secundário / link — underline crescendo da esquerda (::after com scaleX(0) → scaleX(1), transform-origin: left), 250ms. Cor vai para serenity-deep.

Cards de pacote — hover: translateY(-8px), sombra colorida aumenta, borda vira gradient-aera visível, bloco de preço interno em scale(1.03). 300ms cubic-bezier(0.4, 0, 0.2, 1).

Cards de parceiro e galeria — container overflow-hidden; hover: imagem interna scale(1.08) em 600ms com o card parado, overlay gradient-aera a 15% por cima, nome desliza 2px para cima.

Itens de lista — hover: a estrela-bullet gira 45° e vira quartzo; o texto ganha 4px de padding-left.

Chips (50 min, Reformer, até 19 pessoas) — hover inverte: fundo serenity, texto creme.

Campos do formulário — foco: borda vira gradient-aera (via wrapper), label sobe e diminui, transição 200ms. Erro: borda quartzo-deep + mensagem abaixo, nunca só cor.

Header — âncoras com o mesmo underline animado. Scroll suave + scroll-margin-top para compensar o header fixo.

Entrada por scroll — cada seção com fade-in + translateY(24px) → 0 via Intersection Observer, stagger de 80ms entre filhos. Uma vez só, não repete ao voltar.

Cursor e foco — cursor-pointer em tudo clicável. :focus-visible com anel de 2px em serenity-deep — obrigatório, não remova outline sem substituir.

Acessibilidade e desempenho — respeite prefers-reduced-motion: reduce desligando animações e a rotação da estrela. Anime apenas transform e opacity. Imagens com alt descritivo e loading="lazy" fora do hero.

9. RESPONSIVIDADE

Mobile-first, testado em 320px, 768px, 1024px e 1440px. Mobile: hero em coluna única com imagem abaixo do texto; pacotes empilham (Pacote 01 primeiro); parceiros em grid de 2 colunas; menu vira drawer; botão "Quero reservar" fixo na base da tela após o hero; formulário em tela cheia. Nenhum scroll horizontal em nenhuma largura. Fontes fluidas com clamp().

10. NÃO FAÇA

Não use terracota/laranja como destaque — o destaque é azul serenity e rosa quartzo.

Não use degradê em texto de corpo, apenas nas palavras em itálico dos títulos.

Não invente depoimentos, números de alunas, selos ou logos de clientes.

Não exponha a tabela leads a leitura pública, em hipótese alguma.

Não coloque service_role nem chave de e-mail no client.

Não valide apenas no front-end.

Não use emoji na interface.

Não use sombra cinza padrão do Tailwind (shadow-lg puro) — sombras são coloridas.

11. CRITÉRIOS DE ACEITE

Confirme item a item antes de dar por concluído:

Front-end

[ ] Todos os tokens de cor no tailwind.config, sem hex solto no JSX.

[ ] Os 4 degradês existem como utilitários reutilizáveis.

[ ] Todo título principal tem a palavra-chave em itálico com gradient-texto.

[ ] Mínimo de 4 CTAs, todos usando WHATSAPP_NUMBER.

[ ] Todo elemento interativo tem hover e foco visível.

[ ] prefers-reduced-motion desativa as animações.

[ ] Sem scroll horizontal em 320px.

[ ] Preços exatos: R$ 2.000 · R$ 2.800 · R$ 500.

Back-end

[ ] RLS ativo em todas as tabelas, sem SELECT público em leads.

[ ] Migration versionada criando tabelas, enums, índices e trigger de updated_at.

[ ] submit-lead valida com zod no servidor, tem honeypot e rate limit.

[ ] Nenhum segredo no bundle do front-end.

[ ] Formulário com os quatro estados (idle, enviando, sucesso, erro) e sem envio duplo.

[ ] Falha no back-end não impede o redirecionamento para o WhatsApp.

[ ] /admin protegido por Auth, inacessível sem login.

[ ] Sem erros de TypeScript e sem warnings de console.

12. PRIMEIRO PASSO: FAÇA 5 PERGUNTAS ANTES DE CODAR

Não escreva nenhuma linha de código na sua primeira resposta.

Depois de ler o projeto atual (seção 1), faça exatamente 5 perguntas objetivas para fechar as decisões que ainda estão em aberto neste briefing. Regras das perguntas:

Objetivas e fechadas, com opções sugeridas quando fizer sentido (ex.: "A / B / C").

Uma pergunta por assunto, sem sub-perguntas empilhadas.

Priorize o que muda a arquitetura ou o layout se a resposta for diferente — não pergunte detalhe cosmético que dá para ajustar depois.

Cubra pelo menos: escopo do back-end e do painel admin, tratamento de assets/fotos, comportamento do formulário, e prioridades de conteúdo.

Para cada pergunta, diga em uma linha o que você fará por padrão se eu não responder.

Só comece a implementar depois que eu responder — ou depois que eu disser "pode seguir com os padrões".

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a95ede6a-40ec-4ec1-a1f7-5fa9b8339c9f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
