# Corrigir "Sessão inválida" + vocabulário de Patologia Geral (macroscopia)

## 1. Porque aparece "Sessão inválida"

A transcrição desta aplicação não está a ser feita aqui: a função de servidor
`transcribeAudio` envia o áudio para `https://digivoz.lovable.app/api/transcrever`,
ou seja, para o backend da aplicação original. Esse serviço valida o token de
sessão contra a base de dados dele, e o token desta aplicação vem de outra base de
dados — por isso responde `401 Sessão inválida.`, mensagem que aparece no ecrã.

Esta aplicação já tem a rota de transcrição própria (`/api/transcrever`), com a
mesma lógica, apenas não está a ser usada.

Correção:
1. `transcribeAudio` passa a chamar a rota desta aplicação, usando a origem do
   próprio pedido (funciona no preview e na versão publicada).
2. Encaminhar também as pistas de contexto (`pistas`) que a app já envia, para não
   perder a personalização da transcrição.

## 2. Vocabulário: dermatopatologia → macroscopia em Patologia Geral

Substituir, em `src/lib/ai-clinico.ts`, o contexto linguístico usado pela
transcrição e pela otimização por IA:

- `VOCABULARIO` (prompt do reconhecimento de voz) passa a descrever ditado de
  **exame macroscópico em anatomia patológica geral**, com termos como: peça
  operatória, produto de ressecção, biópsia incisional/excisional, dimensões e
  pesos, superfície de secção, cápsula, consistência, coloração, lesão nodular,
  nódulo, quisto, cavidade, conteúdo mucoso/hemorrágico/necrótico, área de
  necrose, hemorragia, fibrose, calcificação, margens de ressecção (proximal,
  distal, circunferencial, profunda), tinta de margens, gânglios linfáticos,
  epíplon, mucosa, serosa, parede, luz, apêndice, vesícula biliar, útero, colo,
  ovário, mama, tiroide, próstata, rim, pulmão, cólon, estômago, baço, placenta,
  fixação em formol tamponado, inclusão em parafina, fragmentos, blocos,
  secções, mm, cm, g.
- `PROMPT_OTIMIZACAO` passa a identificar o revisor como revisor de relatórios de
  **macroscopia em anatomia patológica geral** (pt-PT), mantendo exactamente as
  mesmas regras já existentes: pontuação ditada, `milímetros → mm`,
  `centímetros → cm`, `10 por 5 mm → 10 x 5 mm`, sem inventar, sem resumir, sem
  markdown.

Nada mais muda: interface, Resumo Técnico, estrutura dos relatórios, Doentes,
autenticação, persistência e a lógica de aprendizagem (que continua a aprender a
partir dos relatórios do próprio médico) ficam iguais.

## 3. Verificação

Gravar um áudio curto no preview, confirmar que já não aparece "Sessão inválida"
e que a transcrição sai com terminologia de macroscopia.

## Detalhes técnicos

- `src/lib/transcribe.functions.ts`: substituir a base fixa
  `VITE_LOVABLE_API_URL ?? "https://digivoz.lovable.app"` por uma URL derivada de
  `new URL(request.url).origin`; passar `pistas` no corpo do pedido.
- `src/routes/api/transcrever.ts`: aceitar `pistas` opcional no schema e juntá-la
  ao prompt de vocabulário (mantém validação de token e API key só no servidor).
- `src/lib/ai-clinico.ts`: reescrever as constantes `VOCABULARIO` e
  `PROMPT_OTIMIZACAO` conforme acima; `src/lib/vocabulario.ts` (heurísticas de
  aprendizagem) não precisa de alterações — é agnóstico ao domínio.
