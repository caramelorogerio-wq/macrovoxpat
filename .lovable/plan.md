# Actualizar Patologia Geral com a versão actual da Pathology Notes

A aplicação original evoluiu desde a cópia inicial. Esta actualização traz tudo o
que existe agora na Pathology Notes, mantendo apenas duas diferenças: o nome
"Patologia Geral" e o vocabulário/prompts de IA orientados para macroscopia em
patologia geral.

## O que passa a existir aqui (novo, vindo do original)

- Comandos de voz durante a gravação e reconhecimento de voz do navegador
- Lista de amostras e campo de análise por amostra, com separação automática do
  ditado em amostras por IA
- Exportação HL7 e geração de documento (modelo de relatório / DOCX)
- Versões actualizadas do painel de gravação, Resumo Técnico e ecrãs de
  autenticação, entrada e aplicação
- Coluna `amostras` na tabela de relatórios, igual à do original

Nada é simplificado nem reescrito: o código é copiado tal como está no original.

## O que se mantém desta aplicação

- Nome visível "Patologia Geral" (títulos, metadados das páginas)
- Transcrição a correr no backend desta aplicação (correcção do erro
  "Sessão inválida"), com envio das pistas de vocabulário aprendido
- Vocabulário e prompts de IA de macroscopia em patologia geral, agora também
  aplicados ao novo prompt de separação de amostras
- Base de dados, autenticação e dados próprios desta aplicação

## Verificação

Gravar um áudio curto no preview e confirmar: transcrição sem erro de sessão,
terminologia de macroscopia, separação em amostras, Resumo Técnico e exportações
a funcionar.

## Detalhes técnicos

- Copiar `src/` do snapshot excepto `src/integrations/supabase/` (específico
  desta backend) e `src/routeTree.gen.ts` (regenerado).
- Ficheiros novos: `components/barra-comandos-voz.tsx`, `campo-analise.tsx`,
  `exportar-hl7.tsx`, `lista-amostras.tsx`, `modelo-documento.tsx`,
  `hooks/use-reconhecimento-voz.ts`, `lib/amostras.ts`, `comandos-voz.ts`,
  `hl7.ts`, `hl7.functions.ts`, `relatorio-docx.ts`.
- Reaplicar, após a cópia: em `src/lib/transcribe.functions.ts` a origem
  derivada de `new URL(request.url).origin` e o campo `pistas`; em
  `src/routes/api/transcrever.ts` o `pistas` opcional no schema e no prompt.
- `src/lib/ai-clinico.ts`: manter `VOCABULARIO` e `PROMPT_OTIMIZACAO` de
  macroscopia e adaptar o novo `PROMPT_SEPARACAO` ao mesmo domínio.
- Substituir "DermaVoz"/dermatopatologia por "Patologia Geral" nos textos de
  `routes/index.tsx`, `routes/auth.tsx`, `routes/_authenticated/app.tsx`.
- Instalar `docx`; manter o override de `rolldown` e a versão fixa de `vite`
  deste projecto.
- Migração: `ALTER TABLE public.relatorios_transcritos ADD COLUMN IF NOT EXISTS
  amostras jsonb NOT NULL DEFAULT '[]'::jsonb;`
