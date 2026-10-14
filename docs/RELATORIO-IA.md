# FinTrack — Relatório de soluções com apoio de IA

Disciplina: Programação para Dispositivos Móveis (IESB) · Aluna: Karina Ribeiro Modesto (GitHub: Karina-RM)
Assistente de IA: Claude (Anthropic), usado como par de programação ao longo do guia.

Este relatório registra, etapa por etapa, os erros e divergências encontrados durante o
desenvolvimento, os prompts usados, a resposta da IA e como a solução foi implementada.

---

## Encontro 1 — Etapas 1 a 3

### Prompt inicial
> "Bora?" (enviado junto com o enunciado da atividade e o PDF *FinTrack-Guia-Passo-a-Passo*)

**Resposta da IA:** leu o guia completo, mapeou as 17 etapas e a rubrica (Apêndice D), e
propôs seguir o cronograma sugerido, começando pelo Encontro 1 (ambiente, projeto e banco).
Também propôs manter este relatório desde o início, atendendo à Obs2 da atividade.

### Ocorrência 1 — `npx expo install` falhou com "HTTP Proxy Network Error: Forbidden"

- **Etapa:** 2.2 (instalar bibliotecas do ecossistema Expo)
- **Erro:**
  ```
  Unable to fetch compatibility data from React Native Directory. Skipping check.
  Error: HTTP Proxy Network Error: Forbidden
  ```
- **Causa:** o `expo install` consulta a API do Expo (api.expo.dev) para descobrir a versão
  compatível de cada pacote com o SDK. O ambiente onde o comando rodou tinha saída de rede
  restrita por proxy, que bloqueava esse domínio (o registro do npm continuava acessível).
- **Solução:** rodar em modo offline, que usa a tabela de versões embutida no próprio pacote
  `expo` (`bundledNativeModules.json`) em vez da API:
  ```bash
  EXPO_OFFLINE=1 npx expo install expo-router react-native-safe-area-context ...
  EXPO_OFFLINE=1 npx expo install --fix
  ```
  As versões resolvidas foram as esperadas para o SDK 57 (ex.: `expo-router ~57.0.26`,
  `react-native-screens ~4.26.0`, `react-native-svg 15.15.4`).
- **Observação:** em uma rede comum (casa/faculdade sem proxy) o comando do guia funciona sem
  o `EXPO_OFFLINE`.

### Verificação do Encontro 1 (lado do código)

- `npm run typecheck` sem erros.
- `npx expo export --platform android` empacotou o app (bundle Hermes gerado) — confirma que o
  Expo Router e as dependências estão corretos antes do teste no celular.
- Versões instaladas: Expo SDK 57.0.28, React Native 0.86.3, React 19.2.3, TypeScript 6.0.3
  (as mesmas do guia).

### Ocorrência 2 — Sem aparelho Android para testar

- **Contexto:** a atividade pede APK para Android, mas o desenvolvimento é feito em um Mac
  (Intel, macOS 15.4.1) com iPhone.
- **Prompt:** "Não tenho um android e estou no hackintosh na versao 15.4.1"
- **Resposta da IA / solução adotada:**
  - Desenvolvimento diário: Expo Go no iPhone (o guia suporta: QR Code lido pela câmera).
  - APK de entrega: gerado na nuvem com EAS Build (Etapa 17.3), sem precisar de Android
    físico nem de Android Studio para compilar.
  - Validação do APK: emulador do Android Studio no Mac (CPU Intel com virtualização).

### Ocorrência 3 — Avisos `ERESOLVE` sobre `react-native-worklets` no `npm install`

- **Etapa:** 2 (primeira instalação no Mac)
- **Erro (aviso):**
  ```
  npm warn ERESOLVE overriding peer dependency
  npm warn Could not resolve dependency:
  peerOptional react-native-worklets@"^0.7.4 || ^0.8.0 || ^0.9.0 || ^0.10.0" from expo-modules-core@57.0.22
  Conflicting peer dependency: react-native-worklets@0.13.0
  ```
- **Prompt:** saída completa do terminal colada para a IA.
- **Resposta da IA:** é só um aviso (`warn`), não um erro. A instalação terminou ("added 912
  packages"). O conflito é numa dependência *opcional* (`peerOptional`) que entra de forma
  indireta (`expo-router` → `@expo/ui` → `react-native-reanimated` → `react-native-worklets`).
  O projeto não usa worklets diretamente, então não há ação necessária. Não usar
  `npm audit fix --force`, porque ele troca versões e quebra a compatibilidade com o SDK do Expo.

### Ocorrência 4 — `npm expo start` → "Unknown command: expo"

- **Erro:** `Unknown command: "expo"`
- **Causa:** digitação. `npm` não executa binários de pacotes; quem faz isso é o `npx`.
- **Solução:** `npx expo start` (ou `npm start`, que chama o script `start` do package.json).

### Ocorrência 5 — `expo-env.d.ts` não foi criado e o `tsconfig.json` mudou sozinho

- **Etapa:** 2.7 (teste de fumaça)
- **Divergência:** o ponto de verificação do guia diz que o arquivo `expo-env.d.ts` aparece na
  raiz após o `npx expo start`. No Expo SDK 57 ele não foi criado, e o próprio Expo reescreveu o
  `tsconfig.json`, removendo `.expo/types/**/*.ts` e `expo-env.d.ts` do `include`.
- **Resposta da IA:** o comportamento é do Expo CLI do SDK 57, que ajusta o `tsconfig.json`
  automaticamente. Manter a versão gerada pelo Expo evita que o arquivo volte a ser alterado a
  cada `expo start`. Conferido com `npm run typecheck`: sem erros.
- **Solução:** versão do Expo mantida e registrada em commit próprio.

### Ocorrência 6 — Variáveis do `.env` com prefixo do Next.js

- **Etapa:** 3.4 (copiar as chaves para o app)
- **Problema:** o `.env` foi preenchido com o trecho que o botão *Connect* do Supabase mostra para
  Next.js:
  ```
  NEXT_PUBLIC_SUPABASE_URL=...
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
  ```
  O Expo só embute no app variáveis com o prefixo `EXPO_PUBLIC_`, e o código do guia lê
  `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_KEY`. Com os nomes errados, o app falharia na
  Etapa 4 com "Variáveis do Supabase ausentes" (Apêndice B).
- **Resposta da IA:** a IA conferiu o `.env` antes de seguir (mascarando a chave), identificou os
  nomes trocados e renomeou as duas variáveis, mantendo os valores.
- **Lição:** o snippet do *Connect* muda conforme o framework selecionado; para este projeto vale
  sempre o nome do `.env.example`.

### Fechamento do Encontro 1

- Teste de fumaça aprovado no iPhone (Expo Go): "FinTrack funcionando!".
- Supabase: projeto `fintrack` em São Paulo, `schema.sql` executado, `categories` com 14 linhas,
  `transactions` vazia, RLS ativo nas duas tabelas, confirmação de e-mail desligada.
- Configurações de segurança na criação do projeto: *Automatically expose new tables* desligado
  (as permissões vêm só dos `grant` do `schema.sql`) e *automatic RLS* ligado.
- Chave usada no app: *publishable*. A *secret key* não foi copiada para o projeto.

---

## Encontro 2 — Etapas 4 a 6

### Ocorrência 7 — Indentação perdida ao copiar os blocos de código do PDF

- **Etapas:** 4 a 6 (todos os "Código N")
- **Problema:** ao copiar texto de um PDF, a indentação dos blocos de código chega irregular
  (linhas com recuo extra, outras coladas à margem), porque o PDF guarda posições na página e
  não espaços.
- **Resposta da IA:** a IA extraiu os blocos usando a fonte monoespaçada do PDF (Consolas) para
  separar código de texto, conferiu o resultado contra o `schema.sql` já testado (60 de 60 linhas
  idênticas) e normalizou a formatação com o Prettier do próprio projeto.
- **Solução para quem copia à mão:** colar o bloco e rodar `npm run format` (Prettier) antes do
  `npm run typecheck`.

### Ocorrência 8 — `Cannot find name 'process'` (TS2591) no `npm run typecheck`

- **Etapa:** 4.7 (ponto de verificação)
- **Erro:**
  ```
  src/lib/supabase.ts(6,13): error TS2591: Cannot find name 'process'.
  Do you need to install type definitions for node?
  ```
- **Contexto:** o próprio guia prevê esse erro e manda conferir se o `expo-env.d.ts` existe. Como
  registrado na Ocorrência 5, no SDK 57 o Expo não criou esse arquivo e removeu a referência do
  `tsconfig.json`. O `expo-env.d.ts` só servia para carregar os tipos globais do Expo
  (`/// <reference types="expo/types" />`), onde está declarado o `process.env`.
- **Resposta da IA:** não instalar `@types/node` (sugestão genérica do TypeScript, que traria
  tipos de Node.js para um app React Native). Em vez disso, carregar os tipos do Expo direto no
  `tsconfig.json`, junto com os do Jest:
  ```json
  "types": ["jest", "expo/types"]
  ```
- **Resultado:** `npm run typecheck` sem erros.

### Ponto de verificação da Etapa 5 — testes automatizados

- `npm test`: **3 suítes, 24 testes passando** (o mesmo número do guia).
- Exercício "quebre de propósito" (roundMoney devolvendo `value` sem arredondar):
  ```
  ● roundMoney / toInputMoney › arredonda para 2 casas
    Expected: 0.3
    Received: 0.30000000000000004
  ```
  O teste detectou o erro clássico de ponto flutuante do JavaScript. Alteração desfeita e os 24
  testes voltaram a passar.

### Ponto de verificação da Etapa 6 — camada de dados

- Schemas Zod, serviços e hooks criados; `npm run typecheck` sem erros e 24 testes passando.
- Arquitetura respeitada: nenhuma tela ainda; o caminho tela → hook → serviço → banco está pronto.

---

## Erros localizados no material

Erros e inconsistências encontrados no próprio guia, que passariam despercebidos para quem só
copia os blocos de código. Para cada um: onde está, por que está errado e como foi corrigido.
Quando há código envolvido, a correção está em um commit `fix:` separado, logo após o commit da
etapa, para o diff mostrar exatamente a mudança.

### Erro 1 — Etapa 2.4: texto e código divergem no identificador do app

- **Onde:** texto da seção 2.4 × Código 2 (`app.json`).
- **O que está errado:** o texto manda trocar `seuusuario` por um nome único, mas o código já
  traz `br.edu.iesb.bruno.fintrack`; a palavra `seuusuario` não aparece em lugar nenhum.
- **Decisão:** mantido o identificador do professor, por orientação.

### Erro 2 — Etapa 2.7: ponto de verificação desatualizado para o SDK 57

- **Onde:** ponto de verificação da seção 2.7 e da Etapa 4.7.
- **O que está errado:** o guia afirma que o `expo-env.d.ts` é criado pelo `npx expo start`. No
  Expo SDK 57 ele não é criado, o que causa o erro de `process` na Etapa 4.
- **Correção:** ver Ocorrências 5 e 8 (`"types": ["jest", "expo/types"]` no `tsconfig.json`).

### Erro 3 — Etapa 3.1: numeração da lista

- **Onde:** passos da seção 3.1, numerados 1, 1, 2, 3.
- **Correção:** apenas documental (são quatro passos: 1 a 4).

### Erro 4 — Etapa 8: telas do Open Finance referenciadas antes de existirem

- **Onde:** Código 39 (`app/(app)/_layout.tsx`) e Código 41 (`app/(app)/(tabs)/profile.tsx`).
- **O que está errado:** os dois blocos são cópias idênticas das versões finais da Etapa 15
  (Códigos 78 e 80). Na Etapa 8:
  - o layout declara `banks/index`, `banks/connect` e `banks/callback`, rotas que só serão
    criadas na Etapa 15. O Expo Router avisa que essas rotas não existem (sintoma descrito no
    Apêndice B: "Aviso de rota inexistente no Router");
  - o Perfil mostra o atalho "Contas bancárias", que leva a `/banks`. Ao tocar, o app abre a tela
    de rota inexistente ("Unmatched route").
  O `npm run typecheck` não detecta nenhum dos dois, porque as rotas não são tipadas.
- **Correção (commit `fix:` após a Etapa 8):** removidas as três `Stack.Screen` de `banks/*` do
  layout e o atalho "Contas bancárias" do Perfil (com os imports e estilos que só ele usava).
  Os dois voltam na Etapa 15, junto com as telas reais, usando os Códigos 78 e 80 do guia.

### Erro 5 — Etapa 9: tela de edição importa um componente da Etapa 15

- **Onde:** Código 48 (`app/(app)/transaction/[id].tsx`).
- **O que está errado:** o arquivo é a versão final (idêntica ao Código 79) e importa
  `ImportedTransactionForm`, que só é criado na Etapa 15 (Código 73). Resultado na Etapa 9:
  ```
  app/(app)/transaction/[id].tsx(3,41): error TS2307: Cannot find module
    '@/components/ImportedTransactionForm' or its corresponding type declarations.
  app/(app)/transaction/[id].tsx(49,22): error TS7006: Parameter 'categoryId'
    implicitly has an 'any' type.
  ```
  Além do erro de tipos, o Metro não consegue empacotar o app (módulo inexistente), então a tela
  vermelha de erro aparece no celular e o roteiro da Etapa 9 não pode ser executado. O guia afirma
  que o código foi conferido "com verificação de tipos sem erros", o que só vale para o projeto
  completo, não para a Etapa 9.
- **Correção (commit `fix:` após a Etapa 9):** versão base da tela de edição, sem o ramo de
  lançamentos importados: removidos o import de `ImportedTransactionForm`, o hook
  `useRecategorizeTransaction` e o bloco `if (data.source === 'open_finance')`. A versão completa
  (Código 79) entra na Etapa 15.
- **Verificação:** `npm run typecheck` sem erros, 24 testes passando e `npx expo export
  --platform android` empacotando o app.

### Erro 6 — Etapa 11: checklist exige um README que só é criado na Etapa 17

- **Onde:** seção 11.3 (checklist de qualidade do repositório) × seção 17.2 (Código 81).
- **O que está errado:** o checklist da Etapa 11 pede "O README tem descrição, tecnologias,
  capturas de tela e instruções de execução", mas o guia só manda criar o `README.md` na
  Etapa 17. Além disso, o Código 81 descreve o Open Finance, que o app base ainda não tem.
- **Correção:** criado na Etapa 11 um README do app base (descrição, funcionalidades,
  tecnologias, como executar, arquitetura, scripts, link para este relatório e autora). Na
  Etapa 17 ele é substituído pela versão completa do Código 81.

### Erro 7 — Etapa 10: aviso "Invalid DOM property `transform-origin`" no gráfico

- **Onde:** Código 51 (`src/components/DonutChart.tsx`), `<G rotation={-90} origin={...}>`.
- **Erro (relatado pela aluna ao rodar o app):**
  ```
  Invalid DOM property `transform-origin`. Did you mean `transformOrigin`?
  ```
- **Prompt:** "invalid DOM property transform-origin did u mean transformOrigin"
- **Resposta da IA / causa:** "DOM property" é um aviso do React DOM, ou seja, da versão web
  do app (o guia instala `react-dom` e `react-native-web`). Na web, o `react-native-svg` converte
  a prop `origin` no atributo `transform-origin` (`node_modules/react-native-svg/lib/module/web/
  utils/prepare.js`, linha 43), e o React 19 rejeita nomes com hífen como propriedade. No
  iPhone e no Android o aviso não aparece, mas o código é o mesmo para as três plataformas.
- **Correção:** trocar `rotation` + `origin` pela transformação SVG equivalente, que gira -90°
  em torno do centro e funciona igual na web e no nativo:
  ```tsx
  <G transform={`rotate(-90 ${center} ${center})`}>
  ```
- **Verificação:** `npm run typecheck` sem erros e `npx expo export --platform web` empacotando.

### Erro 8 — Etapa 8: "Exportar CSV" compartilha texto, não um arquivo .csv

- **Onde:** Código 41 (`app/(app)/(tabs)/profile.tsx`), `Share.share({ title: 'fintrack.csv',
  message: toCsv(all) })`; cenário 14 do roteiro da Etapa 11.
- **Problema (relatado pela aluna no iPhone):** a folha de compartilhamento abre, mas o que é
  exportado é um **arquivo de texto**, não um CSV.
- **Prompt:** "Its updating and its shoing the share page. However, its exporting a text file"
- **Resposta da IA / causa:** o `Share` do React Native só compartilha **texto** (`message`) ou
  uma URL. O conteúdo do CSV vai como texto puro, então ao "Salvar em Arquivos" o iOS cria um
  `.txt`, e no Mail ele vai no corpo da mensagem. O `title: 'fintrack.csv'` não cria arquivo
  nenhum (no iOS ele nem é usado). O guia promete "relatório em CSV" e "o arquivo abre
  corretamente no Excel em português" (seção 5.4), o que o código não entrega.
  Segundo problema, escondido pelo primeiro: mesmo como arquivo, um CSV em UTF-8 **sem BOM**
  abre no Excel com os acentos trocados ("Alimentação" → "AlimentaÃ§Ã£o").
- **Correção:**
  - instaladas as bibliotecas oficiais do Expo para arquivo e compartilhamento:
    `npx expo install expo-file-system expo-sharing`;
  - novo serviço `src/services/exportCsv.ts`: grava `fintrack.csv` no cache do app com BOM
    UTF-8 e abre a folha de compartilhamento com o **arquivo** (`mimeType: 'text/csv'`,
    `UTI: 'public.comma-separated-values-text'`). Se o aparelho não suportar compartilhar
    arquivos (ex.: navegador), cai no comportamento antigo, como texto;
  - o Perfil passa a chamar `shareTransactionsCsv(all)`. A regra pura `toCsv` (testada) não
    mudou, e a tela continua sem acessar arquivos diretamente (camada de serviço).
- **Verificação:** `npm run typecheck` sem erros, 24 testes passando, app empacotando para iOS.
  No iPhone: Perfil → Exportar CSV gera o arquivo `fintrack.csv` (confirmado pela aluna:
  "Export de csv funcionando").

### Observação — validação da Etapa 11 só vale no aparelho

- **Prompt:** "I have not being able to test the airplane mode since pushing down the page does
  not trigger the refresh [...] also, no CSV sharing or nothing."
- **Resposta da IA:** os testes estavam sendo feitos na **versão web** (o mesmo ambiente do
  Erro 7). Na web, o `RefreshControl` (puxar para atualizar) não existe, o `Share` depende do
  navegador e o `Alert.alert` não faz nada, então nem o erro aparece. No iPhone, puxar para
  atualizar e a folha de compartilhamento funcionaram (o que revelou o Erro 8).

### Erro 9 — Etapa 4: erro de rede aparece cru, em inglês, em vez de "Sem conexão com a internet."

- **Onde:** Código 13 (`src/utils/errors.ts`), regex `/network request failed|failed to fetch/i`;
  cenário 16 do roteiro da Etapa 11 (modo avião).
- **Problema (print da aluna no iPhone, modo avião):** a tela de erro aparece com o botão
  "Tentar novamente" (o cenário passa), mas a mensagem é:
  ```
  Error: fetch failed: UnexpectedException: The Internet connection appears to be offline.
  (at ExpoModulesCore/Promise.swift:56)
  ```
  Uma mensagem técnica, em inglês, com caminho de arquivo Swift, exatamente o que o
  `friendlyError` existe para evitar ("O Supabase devolve mensagens em inglês. Aqui traduzimos
  as mais comuns", seção 4.6).
- **Causa:** o regex do guia cobre a mensagem do `fetch` antigo do React Native
  (`Network request failed`) e a do navegador (`Failed to fetch`). No Expo SDK 57 o `fetch`
  usado pelo `supabase-js` é o do Expo (módulo nativo), que falha com `fetch failed: ... The
  Internet connection appears to be offline`. Nenhum dos dois padrões casa, então a função
  devolve a mensagem original.
- **Correção, com TDD:**
  1. **Teste primeiro** (`__tests__/errors.test.ts`): 4 casos para `friendlyError`, incluindo a
     mensagem real copiada do print. Resultado antes da correção:
     ```
     ✕ traduz falha de rede do fetch do Expo (SDK 57, iOS em modo avião)
       Expected: "Sem conexão com a internet."
       Received: "fetch failed: UnexpectedException: The Internet connection appears to be offline. ..."
     Tests: 1 failed, 3 passed, 4 total
     ```
  2. **Correção:** regex ampliado com `fetch failed`, `appears to be offline` e
     `unable to resolve host` (equivalente no Android), com comentário explicando a origem de
     cada padrão.
  3. **Resultado:** 4 suítes, **28 testes passando** (os 24 do guia + 4 novos).
- **Observação:** o guia não testava `friendlyError`; por isso o erro passou pelos "24 testes
  passando" da Etapa 5.

### Erro 10 — Etapa 13: categorização casa palavras no meio de outras palavras

- **Onde:** Código 53 (`supabase/functions/_shared/openfinance.ts`), função `firstMatch`, usada
  por `suggestCategory`.
- **O que está errado:** cada palavra-chave é procurada com `text.includes(w)`, ou seja, em
  qualquer posição do texto, e vence a primeira categoria da lista que casar. Consequências
  verificadas com descrições reais de extrato:

  | Descrição no banco | Esperado | Guia sugeria | Por quê |
  | --- | --- | --- | --- |
  | `MERCADO LIVRE*VENDEDOR` | Compras | Alimentação | "mercado" (Alimentação) vem antes de "mercado livre" (Compras) |
  | `MERCADOLIVRE*3PRODUTOS` | Compras | Alimentação | idem: a regra "mercadolivre" nunca é alcançada |
  | `PAGAMENTO IMPOSTO DE RENDA` | Contas | Transporte | "im**posto**" contém "posto" (posto de gasolina) |
  | `INSCRICAO CONCURSO PUBLICO` | Outros | Educação | "con**curso**" contém "curso" |

  As regras `mercado livre|mercadolivre` da categoria Compras eram **código morto**: nenhuma
  descrição chegava até elas. Os 22 testes do guia não pegam isso porque só testam casos em que
  a primeira palavra da lista é a certa (IFOOD, Drogaria, NETFLIX).
- **Prompt:** nenhum. Encontrado pela IA na auditoria da Etapa 13 (o guia diz que é ali que
  "moram os erros que dinheiro não perdoa").
- **Correção, com TDD:**
  1. **Teste primeiro:** novo caso em `__tests__/openfinance.test.ts` com as quatro descrições
     acima mais dois controles (`SUPERMERCADO EXTRA` → Alimentação, `POSTO SHELL` → Transporte).
     Antes da correção: `Tests: 1 failed, 22 passed` (`Expected: "Compras"`,
     `Received: "Alimentação"`).
  2. **Correção:** a palavra-chave precisa **começar uma palavra** do texto (prefixos continuam
     valendo, como "combust" → "combustivel"), e quando várias casam **vence a mais longa**, a mais
     específica ("mercado livre" vence "mercado"). Em empate, vale a ordem original das regras.
  3. **Resultado:** os 22 testes do guia continuam passando e o novo também. Total: **51**.

### Erro 11 — Etapa 14: conexão não é salva quando o banco ainda está processando

- **Onde:** Código 61 (`supabase/functions/bank-sync/index.ts`).
- **O que está errado:** logo após conectar, o item do Pluggy costuma estar em `UPDATING`. Nesse
  caso a função faz um `update` em `bank_connections` **antes de a conexão existir na tabela**
  (não atualiza nada) e responde 409, sem nunca chegar ao `upsert` que cria a linha. Resultado:
  - o app mostra "Conectado, mas a importação falhou. Toque em **Sincronizar** na lista de bancos
    para tentar de novo" (Código 76), mas o banco **não aparece na lista**: não há botão para
    sincronizar;
  - o Apêndice B manda "Aguardar alguns segundos e tocar em Sincronizar" para o erro 409, o que é
    impossível pelo mesmo motivo;
  - mais grave: a autorização continua ativa no Pluggy, mas o app não tem registro dela, então a
    usuária **não consegue revogar** pelo app (o botão Desconectar também fica na lista). Isso
    contraria a seção 12.4 (revogação e LGPD) e o critério "desconexão que apaga os dados".
- **Prompt:** nenhum. Encontrado pela IA comparando o fluxo da função com o texto do app
  (Códigos 72, 75 e 76) e com o Apêndice B.
- **Correção (commit `fix:` após a Etapa 14):** a conexão é gravada (upsert) **antes** da
  checagem de prontidão, já com `status: 'error'` e a mensagem de `describeItemProblem` quando o
  item não está pronto; só depois a função responde com o erro. A verificação de dono
  (`clientUserId`) continua acontecendo antes de qualquer gravação.
- **Verificação:** `deno check` sem erros nas três funções (antes e depois da correção).

### Erro 12 — Etapa 13: trechos copiados de outro projeto ("ScanIA")

- **Onde:** texto da Etapa 13 ("como o `parse.ts` do ScanIA") e a "Saída esperada" do
  `npm test`, que lista `PASS __tests__/parse.test.ts`.
- **O que está errado:** o FinTrack não tem `parse.ts` nem `parse.test.ts`; as referências vêm de
  outro projeto da série. Quem compara a saída com a do guia procura um arquivo que não existe.
- **Correção:** apenas documental. Saída real: 5 suítes (money, date, summary, errors,
  openfinance).

### Observação — Código 56 (tsconfig da Etapa 14) desfaria a correção do Erro 2

- O Código 56 é idêntico ao Código 3 da Etapa 2. Os `exclude` das funções Deno já estavam lá
  desde o início; nada muda. Colar o bloco literalmente, porém, voltaria a `"types": ["jest"]` e
  ao `expo-env.d.ts`, trazendo de volta o erro de `process` (Ocorrência 8).
- **Decisão:** mantido o `tsconfig.json` atual; aplicada apenas a linha do `format` (Código 57).

### Observação — Client Secret no histórico do terminal (Etapa 14.5)

- O guia publica os segredos com
  `npx supabase secrets set PLUGGY_CLIENT_ID=... PLUGGY_CLIENT_SECRET=...` e avisa que o segredo
  fica no histórico do terminal.
- **Alternativa adotada:** gravar os dois valores em `supabase/.env` (já ignorado pelo Git pelo
  padrão `.env`) e rodar `npx supabase secrets set --env-file supabase/.env`. O segredo não passa
  pela linha de comando nem pelo histórico.

### Observação — permissões além do necessário nas tabelas (melhoria de segurança)

- **Onde:** permissões das tabelas criadas pelos scripts `schema.sql` e `open-finance.sql`.
- **Como foi encontrado:** consulta em `information_schema.role_table_grants` sugerida pela IA
  quando a aluna perguntou "How do i check for RLS on bank_connections?". Resultado:
  - `anon` (sem login): `TRUNCATE`, `REFERENCES`, `TRIGGER`;
  - `authenticated`: `SELECT`, `INSERT`, `UPDATE`, `DELETE` + `TRUNCATE`, `REFERENCES`, `TRIGGER`.
- **Análise:** o essencial estava certo. O `anon` não tinha leitura nem escrita, porque o projeto
  foi criado com *Automatically expose new tables* desligado. Mas os scripts do guia só fazem
  `grant` e nunca `revoke`, então as tabelas herdam as permissões padrão do schema `public`. O
  app não usa `TRUNCATE`, `REFERENCES` nem `TRIGGER`, e o `TRUNCATE` **não passa pelo RLS**. Com
  a opção padrão do Supabase (*expose* ligado), o `anon` teria inclusive `SELECT/INSERT/UPDATE/
  DELETE`: os dados continuariam protegidos pelo RLS, mas sem uma segunda barreira.
- **Correção:** novo script versionado `supabase/hardening.sql` (menor privilégio): `revoke all`
  do `anon` nas três tabelas e `revoke truncate, references, trigger` do `authenticated`. Termina
  com uma consulta de conferência. Executado no SQL Editor pela aluna.
- **Resultado esperado e conferido:** só `authenticated`, com `SELECT` em `categories` e
  `DELETE, INSERT, SELECT, UPDATE` em `transactions` e `bank_connections`; RLS ativo
  (`relrowsecurity = true`) nas três tabelas e 4 políticas em `bank_connections`.

### Observação — legenda do gráfico limitada a 6 categorias

- **Onde:** Código 52 (`app/(app)/(tabs)/index.tsx`), `summary.byCategory.slice(0, 6)`.
- **O que acontece:** o roteiro da Etapa 11 (cenário 13) espera que a legenda some cerca de
  100%. Isso só vale se o mês tiver até 6 categorias de despesa. O banco tem 9; num mês com 7 ou
  mais, o gráfico mostra fatias que não aparecem na legenda e a soma fica abaixo de 100%.
- **Decisão:** mantido como no guia (não afeta o roteiro com os dados sugeridos). Melhoria
  possível: agrupar da 6ª categoria em diante numa fatia "Outras".

### Observação — campos do Open Finance já presentes na base

- O Código 9 (tipos, Etapa 4) é idêntico ao Código 64 (Etapa 15) e o Código 45
  (`TransactionItem`) é idêntico ao 74. Eles citam `source`, `connection_id` e `account_name`,
  colunas que o banco só ganha na Etapa 14 (`open-finance.sql`).
- **Por que não foi corrigido:** não quebra nada. Até a Etapa 14 esses campos chegam como
  `undefined`, e o código só os usa em comparações (`source === 'open_finance'`), que dão falso.
  Fica registrado porque o tipo `Transaction` promete campos que o banco ainda não tem.

---

## Encontro 3 — Etapas 7 a 9

- **Etapa 7:** componentes do design system; `npm run typecheck` sem erros.
- **Etapa 8:** `app/index.tsx` temporário apagado; autenticação, guardas de rota, abas e Perfil.
  Corrigido o Erro 4.
- **Etapa 9:** CRUD de lançamentos. Corrigido o Erro 5.
- **Pontos de verificação no iPhone: todos aprovados** (validados pela aluna): cadastro com
  senha curta, cadastro válido com três abas, sessão mantida ao reabrir, nome e e-mail no
  Perfil, logout, senha errada, CRUD de lançamentos, filtros, busca "aliment", data 31/02,
  troca de tipo limpando a categoria e teste do RLS com uma segunda conta (lista vazia).
- Revisão de código feita contra o texto de cada etapa (formulário limpa a categoria ao trocar o
  tipo, data 31/02 rejeitada por `brToISO`, busca sem acento via `normalize('NFD')`, cache
  invalidado por prefixo `['transactions']`).

---

## Encontro 4 — Etapas 10 e 11

### Etapa 10 — Painel

- `SummaryCards`, `DonutChart` (gráfico de rosca com `react-native-svg`, sem biblioteca de
  gráficos) e tela inicial. `npm run typecheck` sem erros.
- Revisão: saldo = receitas − despesas do mês (somados em centavos em `summarize`); o total no
  centro do gráfico é `summary.expense`; `useMemo` antes dos retornos antecipados (regras dos
  hooks respeitadas).

### Etapa 11 — Qualidade

- `npm run typecheck`: sem erros.
- `npm test`: 3 suítes, 24 testes passando.
- `npm run format`: todos os arquivos já estavam formatados.
- Nenhum `console.log` nem uso de `any` no código (`grep` em `app/`, `src/` e `__tests__/`).
- `.env` ignorado pelo Git; `.env.example` e `supabase/schema.sql` versionados.
- README do app base criado (ver Erro 6).

### Roteiro de validação da Etapa 11 — concluído no iPhone

Os 16 cenários foram executados pela aluna no iPhone (Expo Go) e aprovados. Durante o roteiro
apareceram e foram corrigidos os Erros 7 (aviso na versão web), 8 (CSV como texto) e 9
(mensagem de rede sem tradução). Ao final: `npm run typecheck` sem erros e 28 testes passando.

---

## Encontro 5 — Etapas 12 a 14

### Etapa 12 — Conceitos e conta no Pluggy

- Etapa conceitual (Open Finance, agregador, segurança e custos). A conta de desenvolvedor e a
  *Application* no dashboard.pluggy.ai são criadas pela aluna; o Client ID e o Client Secret
  ficam fora do projeto e fora do chat com a IA.

### Etapa 13 — Regras puras do Open Finance

- `openfinance.ts` e os 22 testes do guia: todos passando.
- Exercício "quebre de propósito" (`Math.abs(tx.amount)` → `tx.amount`): **5 testes falharam**
  (despesa com valor positivo, direção pelo sinal, fatura não contada duas vezes, estornos e
  arredondamento). Alteração desfeita.
- Corrigido o Erro 10 (categorização). Total: 5 suítes, **51 testes passando**.

### Etapa 14 — Banco e Edge Functions

- `supabase/open-finance.sql` versionado. Revisão: `bank_connections` com RLS nas quatro
  operações; `unique (user_id, external_id)` como trava de duplicidade; `on delete cascade` da
  conexão para os lançamentos importados.
- Funções revisadas: `clientUserId` dentro de `options` no Connect Token; verificação de dono no
  `bank-sync` antes de qualquer gravação; cliente Supabase com o token do usuário (RLS vale dentro
  da função); `upsert` com `ignoreDuplicates` (idempotência); revogação apagando primeiro no
  Pluggy.
- Corrigido o Erro 11 (conexão não salva com item em processamento).
- `deno check` das três funções: sem erros. `npm run typecheck`: sem erros.
- Publicação (seção 14.5), feita pela aluna: `supabase init` e `link`, segredos do Pluggy
  enviados com `secrets set --env-file supabase/.env` (o arquivo é ignorado pelo Git e o segredo
  não passou pela linha de comando), deploy das três funções com `--use-api`. Confirmado pela
  aluna: funções ACTIVE, segredos listados só pelo nome, `bank_connections` com RLS.
- Permissões revisadas e endurecidas com `supabase/hardening.sql` (ver observação na seção de
  erros localizados).
