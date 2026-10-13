# FinTrack

Aplicativo mobile de finanças pessoais: registre receitas e despesas e acompanhe para onde o
dinheiro está indo, com painel mensal e gráfico por categoria.

> Projeto da disciplina Programação para Dispositivos Móveis (IESB). Esta é a versão do app
> base (Etapas 1 a 11). A integração com o Open Finance entra nas Etapas 12 a 16.

## Funcionalidades

- Cadastro, login e sessão persistente (Supabase Auth)
- Lançamentos de receitas e despesas: criar, editar e excluir
- Painel mensal com saldo, receitas, despesas e gráfico por categoria
- Lista agrupada por dia, com busca e filtro por tipo
- Exportação dos lançamentos em CSV
- Dados isolados por usuário com Row Level Security

## Tecnologias

React Native · Expo · Expo Router · TypeScript · Supabase (Auth, Postgres, RLS) ·
TanStack Query · React Hook Form · Zod · react-native-svg · Jest

## Como executar

1. Instale as dependências: `npm install`
2. Crie um projeto no [Supabase](https://supabase.com) e execute `supabase/schema.sql` no
   SQL Editor.
3. Copie `.env.example` para `.env` e preencha a URL e a chave pública (publishable).
4. Inicie o app: `npx expo start` e abra no Expo Go.

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
