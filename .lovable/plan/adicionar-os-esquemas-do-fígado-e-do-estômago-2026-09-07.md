# Adicionar os esquemas do fígado e do estômago

Os dois novos desenhos juntam-se aos 10 esquemas já existentes na legenda de blocos, com o mesmo funcionamento: escolher a peça, clicar sobre a estrutura e a linha da legenda fica logo com o nome dessa estrutura, editável e com o número do bloco ditado ou escrito.

## Fígado (esquema seccionado)

Zonas nomeadas: lobo direito, lobo esquerdo, segmentos I a VIII (lobo caudado = segmento I, lobo quadrado = segmento IV), cápsula hepática, parênquima hepático, veia cava inferior, veias hepáticas direita, média e esquerda, veia porta, artéria hepática, ducto hepático comum e vesícula biliar.

## Estômago (gastrectomia)

Zonas nomeadas: margem esofágica, cárdia, junção gastroesofágica, fundo, corpo, curvatura maior, curvatura menor, lesão/tumor, antro, piloro e margem duodenal.

## Notas técnicas

- As duas imagens são carregadas para o CDN de assets e adicionadas a `src/lib/orgaos.ts` com a imagem, as dimensões originais (1536x1024 e 1549x1015) e as zonas em coordenadas normalizadas, seguindo o formato já usado.
- Nenhuma alteração no componente do diagrama, na exportação Word/HL7, no Resumo Técnico, nos relatórios, nos Doentes, na autenticação ou na persistência.
