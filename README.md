# FinTrack

Aplicativo mobile de finanças pessoais: registre receitas e despesas e acompanhe para onde o
dinheiro está indo, com painel mensal e gráfico por categoria.

> Projeto da disciplina Programação para Dispositivos Móveis (IESB), construído a partir do
> guia passo a passo do professor, com os erros encontrados no material documentados e
> corrigidos em [`docs/RELATORIO-IA.md`](docs/RELATORIO-IA.md).

## Funcionalidades

- Cadastro, login e sessão persistente (Supabase Auth)
- Lançamentos de receitas e despesas: criar, editar e excluir
- **Open Finance (Pluggy):** conecte bancos e importe extratos e faturas, somente leitura
- Painel mensal com saldo, receitas, despesas e gráfico por categoria
- Lista agrupada por dia, com busca e filtro por tipo
- Exportação dos lançamentos em CSV
- Dados isolados por usuário com Row Level Security

## Tecnologias

React Native · Expo · Expo Router · TypeScript · Supabase (Auth, Postgres, RLS, Edge
Functions) · Pluggy (Open Finance) ·
TanStack Query · React Hook Form · Zod · react-native-svg · Jest

## Como executar

1. Instale as dependências: `npm install`
2. Crie um projeto no [Supabase](https://supabase.com) e execute, nesta ordem,
   `supabase/schema.sql`, `supabase/open-finance.sql` e `supabase/hardening.sql` no SQL Editor.
3. Copie `.env.example` para `.env` e preencha a URL e a chave pública (publishable).
4. Open Finance: crie uma aplicação em [dashboard.pluggy.ai](https://dashboard.pluggy.ai),
   grave `PLUGGY_CLIENT_ID` e `PLUGGY_CLIENT_SECRET` em `supabase/.env` (ignorado pelo Git) e
   publique:
   ```
   npx supabase link --project-ref SEU-PROJECT-REF
   npx supabase secrets set --env-file supabase/.env
   npx supabase functions deploy bank-connect-token --use-api
   npx supabase functions deploy bank-sync --use-api
   npx supabase functions deploy bank-disconnect --use-api
   ```
5. Inicie o app: `npx expo start` e abra no Expo Go.

## Arquitetura

O caminho dos dados é sempre tela → hook → serviço → banco. Regras de negócio (dinheiro,
datas, resumos e CSV) ficam em funções puras em `src/utils/`, cobertas por testes.

## Scripts

| Comando             | O que faz                   |
| ------------------- | --------------------------- |
| `npm start`         | Inicia o servidor do Expo   |
| `npm test`          | Executa os testes unitários |
| `npm run typecheck` | Verifica os tipos com o TSC |
| `npm run format`    | Formata o código (Prettier) |

## Relatório de desenvolvimento

O relatório com os erros encontrados, prompts, respostas da IA e soluções está em
[`docs/RELATORIO-IA.md`](docs/RELATORIO-IA.md).

## Autora

Karina Ribeiro Modesto · [GitHub](https://github.com/Karina-RM)
