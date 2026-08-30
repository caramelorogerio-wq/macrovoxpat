# Corrigir erro de permissões no acesso aos dados

O pedido ao Vocabulário Aprendido (`termos_aprendidos`) falha porque nenhuma
tabela desta aplicação tem permissões atribuídas à API de dados. Confirmei na
base de dados: não existe uma única atribuição de permissões para as tabelas
`medicos`, `pacientes`, `relatorios_transcritos` e `termos_aprendidos`. As
regras de segurança por utilizador (RLS) estão criadas, mas sem permissões a
API recusa o pedido antes de sequer avaliar as regras.

Isto afecta todo o acesso a dados (Doentes, Relatórios, Vocabulário), não apenas
este pedido.

## Correcção

Aplicar uma migração que concede à API de dados o acesso às quatro tabelas,
mantendo as regras de segurança existentes intactas — cada médico continua a ver
apenas os seus próprios dados.

Nada muda na interface, no fluxo, no Resumo Técnico, nos relatórios, nos doentes,
na autenticação nem no vocabulário de macroscopia.

## Detalhes técnicos

Migração única:

```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON public.medicos TO authenticated;
GRANT ALL ON public.medicos TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pacientes TO authenticated;
GRANT ALL ON public.pacientes TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.relatorios_transcritos TO authenticated;
GRANT ALL ON public.relatorios_transcritos TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.termos_aprendidos TO authenticated;
GRANT ALL ON public.termos_aprendidos TO service_role;
```

Sem acesso para utilizadores não autenticados: todas as políticas dependem de
`auth.uid()`.

## Verificação

Entrar na aplicação e confirmar que o Vocabulário Aprendido carrega sem erro, e
que criar/listar um doente e guardar um relatório funcionam.
