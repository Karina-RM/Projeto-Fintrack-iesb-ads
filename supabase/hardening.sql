-- FinTrack: endurecimento de permissões (execute DEPOIS de schema.sql e open-finance.sql)
--
-- O app só acessa o banco como usuário logado (papel authenticated). O papel anon
-- (visitante sem login) não precisa de nenhuma permissão nas tabelas do app.
-- TRUNCATE, REFERENCES e TRIGGER vêm das permissões padrão do schema public e não são
-- usados pelo app. TRUNCATE, em especial, não passa pelo RLS. Menor privilégio:
-- cada papel fica só com o que usa.

revoke all on public.categories, public.transactions, public.bank_connections from anon;

revoke truncate, references, trigger
  on public.categories, public.transactions, public.bank_connections
  from authenticated;

-- Conferência (esperado: só authenticated, com SELECT nas categorias e
-- SELECT/INSERT/UPDATE/DELETE em transactions e bank_connections)
select table_name, grantee, string_agg(privilege_type, ', ' order by privilege_type) as privilegios
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in ('categories', 'transactions', 'bank_connections')
  and grantee in ('anon', 'authenticated')
group by table_name, grantee
order by table_name, grantee;
