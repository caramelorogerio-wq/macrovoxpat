# Corrigir erro 401 na leitura de dados durante o ditado

## O que verifiquei

- Base de dados: permissões da API de dados, políticas de segurança e RLS estão
  corretas nas quatro tabelas (`medicos`, `pacientes`, `relatorios_transcritos`,
  `termos_aprendidos`). O verificador de segurança não encontra problemas.
- Código: a verificação de tipos passa sem erros e o servidor não registou falhas.

Logo, o problema não é de base de dados nem de código quebrado.

## Diagnóstico (a confirmar no primeiro passo)

O pedido a `termos_aprendidos` devolve **401**, que significa credencial de sessão
recusada — não falta de permissões. Nos registos aparecem também vários erros de
comunicação entre a pré-visualização e o mecanismo de sessão
("postMessage ... origin does not match"). A hipótese mais provável é a sessão
expirar ou não conseguir ser renovada dentro da pré-visualização, ficando a
aplicação a usar um token já inválido — coerente com o erro anterior de "sessão
inválida".

Esta hipótese ainda não está confirmada, por isso o primeiro passo do trabalho é
confirmá-la, não corrigir às cegas.

## Passos

1. Reproduzir com sessão real na pré-visualização e registar o estado da sessão
   no momento do 401 (existe sessão? o token está expirado? a renovação falha?).
2. Consoante o resultado:
   - Se for token expirado/renovação falhada: garantir que a aplicação renova a
     sessão antes de ler dados e, ao receber um erro de autenticação, tenta
     renovar e repete o pedido uma vez; se a renovação falhar, encaminha para o
     ecrã de entrada em vez de mostrar erro solto.
   - Se a sessão estiver válida e ainda assim der 401: a causa está na ligação de
     credenciais do backend desta aplicação e será corrigida aí.
3. Voltar a ditar e confirmar que o vocabulário carrega e o relatório grava.

Nada muda na interface, no fluxo, no Resumo Técnico, nos relatórios, nos doentes
nem no vocabulário de macroscopia.

## Detalhes técnicos

- Erro observado: `GET /rest/v1/termos_aprendidos?...` → 401 no cliente do browser.
- Leituras afetadas em `src/routes/_authenticated/app.tsx` (`carregar`), mais as
  escritas em `termos_aprendidos` e `relatorios_transcritos`.
- Confirmação via Playwright com sessão restaurada, inspecionando
  `supabase.auth.getSession()` e `expires_at` no instante do erro.
- Correção prevista: pequena camada de garantia de sessão (renovar + repetir uma
  vez em erro de autenticação) partilhada pelas leituras/escritas do ecrã da
  aplicação. Sem alterações a `src/integrations/supabase/*` (ficheiros gerados).
