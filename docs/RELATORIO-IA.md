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
