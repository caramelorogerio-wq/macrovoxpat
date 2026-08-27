# Corrigir "Sessão inválida" na transcrição

## O que está a acontecer

A transcrição desta aplicação não está a ser feita aqui: a função de servidor
`transcribeAudio` envia o áudio para `https://digivoz.lovable.app/api/transcrever`,
ou seja, para o backend da aplicação original. Esse serviço valida o token de
sessão contra a base de dados dele, e o token desta aplicação vem de outra base de
dados — por isso responde `401 Sessão inválida.`, mensagem que aparece no ecrã.

Esta aplicação já tem a rota de transcrição própria (`/api/transcrever`), com a
mesma lógica e o mesmo vocabulário, apenas não está a ser usada.

## Correção

1. Fazer `transcribeAudio` chamar a rota de transcrição desta aplicação em vez do
   domínio externo — usando a origem do próprio pedido, para funcionar tanto no
   preview como na versão publicada.
2. Encaminhar também as pistas de contexto (`pistas`) que a app já envia, para não
   perder a personalização da transcrição.
3. Confirmar no preview: gravar um áudio curto, transcrever e verificar que já não
   aparece "Sessão inválida".

Nada mais muda: interface, Resumo Técnico, relatórios, Doentes, autenticação,
persistência e vocabulário ficam exatamente como estão.

## Detalhes técnicos

- `src/lib/transcribe.functions.ts`: substituir a base fixa
  `VITE_LOVABLE_API_URL ?? "https://digivoz.lovable.app"` por uma URL derivada de
  `new URL(request.url).origin`, e passar `pistas` no corpo do pedido.
- `src/routes/api/transcrever.ts`: aceitar `pistas` opcional no schema e juntá-la
  ao prompt de vocabulário (a rota mantém a validação de token e a API key só no
  servidor).
