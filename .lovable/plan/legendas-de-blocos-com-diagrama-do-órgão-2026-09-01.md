# Legendas de blocos com diagrama do órgão

Novo campo por amostra: uma **legenda de blocos** (bloco → descrição), ditada por voz,
ligada a um **diagrama esquemático do órgão** onde cada bloco fica marcado com o seu
número. A legenda e o diagrama entram nas exportações Word/PDF.

Nada do que já existe é alterado: interface actual, gravação, transcrição, IA,
Resumo Técnico, relatórios, Doentes, autenticação e persistência mantêm-se.

## Como vai funcionar

1. Em cada amostra passa a existir um bloco "Legenda de blocos", com linhas
   `Bloco N — descrição` editáveis à mão.
2. Por voz, durante ou depois do ditado:
   - "App, legenda bloco um margem proximal" cria/actualiza a linha do bloco 1
   - "App, legenda bloco dois a quatro parede posterior" cria as linhas 2, 3 e 4
   - "App, apagar legenda bloco três" remove essa linha
   - "App, abrir diagrama" / "App, fechar diagrama"
3. Escolha do órgão numa lista (pele, cólon/recto, estômago, mama, útero e colo,
   próstata, pulmão, rim, tiróide, vesícula/apêndice, gânglio, esquema genérico).
   Cada esquema é um SVG simples desenhado no projecto, com zonas anatómicas.
4. No diagrama, clicar numa zona atribui-lhe o número do bloco seleccionado; os
   números aparecem como marcadores sobre o esquema, com a lista da legenda ao lado.
   Também é possível colocar um marcador em qualquer ponto do esquema.
5. Cada linha da legenda com marcador mostra a zona correspondente; as linhas sem
   marcador continuam válidas (só texto).

## Exportações

- **Word (DOCX)** e **PDF**: no fim de cada amostra, secção "Legenda de blocos"
  com a lista `Bloco N — descrição` e, quando existe diagrama, a imagem do
  esquema com os números.
- **HL7**: acrescenta apenas as linhas de texto da legenda (sem imagem), no
  segmento de texto da amostra.
- Relatórios guardados voltam a abrir com legenda e diagrama intactos.

## Detalhes técnicos

- `src/lib/legendas.ts`: tipos `LinhaLegenda { bloco, descricao, marcadorId? }`,
  `Diagrama { orgao, marcadores: { id, bloco, x, y, zona? }[] }`, e utilitários de
  ordenação/intervalos de blocos (reutiliza `intervaloBlocos` de `relatorio-docx.ts`).
- `src/lib/orgaos-svg.tsx`: biblioteca de esquemas SVG (viewBox normalizado
  0 0 100 100), cada um com zonas `<path id="…" aria-label="…">` clicáveis.
- `src/components/legenda-blocos.tsx`: lista editável de linhas + botão de diagrama.
- `src/components/diagrama-orgao.tsx`: render do SVG, selecção de órgão, colocação
  e remoção de marcadores, coordenadas em percentagem do viewBox.
- `src/lib/amostras.ts`: `Amostra` ganha `legenda: LinhaLegenda[]` e
  `diagrama: Diagrama | null`, com valores por omissão (`[]` / `null`) para não
  quebrar relatórios já guardados.
- `src/lib/comandos-voz.ts`: novos comandos `legenda-bloco`, `apagar-legenda-bloco`,
  `abrir-diagrama`, `fechar-diagrama`, com parsing de números ditados por extenso e
  intervalos ("dois a quatro"); entradas correspondentes em `LISTA_COMANDOS`.
- `src/lib/comandos-voz.test.ts`: testes com frases reais para os novos comandos.
- `src/routes/_authenticated/app.tsx`: estado por amostra, handlers dos novos
  comandos e persistência dentro do JSON `amostras` já existente.
- `src/lib/relatorio-docx.ts`: secção de legenda por amostra e `ImageRun` com PNG
  do SVG (serialização do SVG → canvas → PNG no browser, sem dependências novas).
- `src/components/modelo-documento.tsx` e `exportar-hl7.tsx`: incluir as linhas da
  legenda.
- Sem alterações de base de dados: usa a coluna `amostras jsonb` existente.

## Verificação

Ditar uma amostra, atribuir legendas por voz a vários blocos, marcar pontos num
esquema, guardar, reabrir o relatório e exportar para Word e PDF confirmando a
legenda e o diagrama.
