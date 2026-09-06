# Substituir os esquemas anatómicos pelos seus desenhos

Os desenhos esquemáticos atuais (feitos à mão em traço simples) são substituídos pelos 10 esquemas que enviou. Passam a ser as únicas peças disponíveis na legenda de blocos.

## Esquemas incluídos

- Colectomia direita
- Colectomia esquerda
- Colectomia total
- Sigmoidectomia
- Ressecção abdominoperineal do recto
- Prostatectomia radical
- Rim
- Vesícula biliar
- Duodenopancreatectomia cefálica (Whipple)
- Esófago

Os desenhos antigos (pele, mama, útero, estômago, pulmão, tiróide, gânglio, genérico) são removidos da lista.

## Como funciona

- Escolhe-se a peça e vê-se a imagem real, na sua proporção original.
- Sobre cada imagem ficam áreas invisíveis com o nome das estruturas rotuladas no desenho (por exemplo "margem de ressecção proximal", "mesorrecto", "cabeça do pâncreas", "vesícula seminal direita"). Ao clicar numa dessas áreas, o marcador do bloco é colocado e a linha da legenda fica automaticamente com o nome dessa estrutura, continuando editável.
- Clicar fora das áreas nomeadas continua a colocar o marcador nesse ponto, sem descrição automática.
- Os números dos blocos continuam a poder ser ditados ou escritos, como agora.
- Na exportação (Word e HL7) mantém-se o mesmo comportamento: imagem do esquema com os números e o texto da legenda por baixo.

## Notas técnicas

- As 10 imagens são carregadas para o CDN de assets e referenciadas por ponteiro, sem ficarem no repositório.
- `src/lib/orgaos.ts` passa a descrever cada peça com: imagem, dimensões (largura/altura para proporção correta) e zonas nomeadas definidas por retângulos/polígonos em coordenadas normalizadas.
- `src/components/diagrama-orgao.tsx` desenha a imagem como fundo do SVG, mantendo as zonas como `path` transparentes com `title`, o clique livre e a remoção de marcadores.
- `src/lib/diagrama-svg.ts` embute a imagem em base64 no SVG autónomo (para o PNG do Word continuar a funcionar) e passa a usar o viewBox de cada peça em vez de `0 0 100 100`.
- Sem alterações no Resumo Técnico, estrutura de relatórios, Doentes, autenticação ou persistência. Diagramas já gravados que apontem para peças removidas deixam de mostrar imagem, mas o texto da legenda mantém-se.
