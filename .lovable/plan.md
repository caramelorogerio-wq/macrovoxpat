# Legenda de blocos ausente na exportação

Na exportação Word aparece o esquema do órgão mas não as linhas "Bloco N — descrição".

## Causa

A legenda exportada é construída apenas a partir das linhas da lista de legenda
(`legendaTexto(a.legenda)`). Os marcadores colocados no diagrama são guardados
numa estrutura separada (`diagrama.marcadores`) e o componente do diagrama
permite marcar um bloco mesmo quando ainda não existe nenhuma linha de legenda
(o selector "Bloco a marcar" usa o bloco activo como opção de reserva). Nesse
caso a lista de legenda fica vazia, a lista de texto fica vazia e o documento
mostra só a imagem.

## Correcção

1. Ao colocar um marcador no diagrama, criar automaticamente a linha de legenda
   correspondente ao bloco (com a zona anatómica clicada como descrição inicial,
   quando existe), para que o bloco fique sempre visível e editável na lista.
2. Na exportação, gerar as linhas de texto a partir da união entre legenda e
   marcadores: qualquer bloco com marcador sem linha de legenda passa a produzir
   `Bloco N — zona` (ou `Bloco N`), ordenado por número.
3. Aplicar a mesma união ao HL7, para coerência entre exportações.

## Detalhes técnicos

- `src/lib/legendas.ts`: `legendaTexto(linhas, diagrama?)` passa a fundir os
  blocos dos marcadores (descrição da linha, senão `zona`), sem duplicados e
  ordenado por bloco.
- `src/routes/_authenticated/app.tsx`: a exportação Word e o HL7 chamam
  `legendaTexto(a.legenda ?? [], a.diagrama)`.
- `src/components/legenda-blocos.tsx` / `src/components/diagrama-orgao.tsx`: ao
  colocar um marcador, garantir a linha de legenda desse bloco via
  `aplicarLegenda` (sem sobrepor descrições já escritas).
- `src/lib/hl7.ts`: usar a mesma função unificada.
- Sem alterações de base de dados, do Resumo Técnico ou da estrutura dos
  relatórios.

## Verificação

Marcar um bloco no esquema sem escrever descrição, exportar para Word e
confirmar que aparece a secção "Legenda de blocos" com a linha do bloco e a
imagem; repetir com descrições ditadas.
