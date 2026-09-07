/**
 * Biblioteca de esquemas anatómicos usados na legenda de blocos.
 *
 * Cada esquema é uma imagem real da peça cirúrgica (servida pelo CDN) com
 * zonas nomeadas sobrepostas. As zonas são rectângulos em coordenadas
 * normalizadas 0–100 (percentagem da largura e da altura da imagem), tal
 * como os marcadores dos blocos.
 */

import colectomiaDireita from "@/assets/esquemas/esquema-anatomico-da-colectomia-direita.png.asset.json";
import colectomiaEsquerda from "@/assets/esquemas/esquema-anatomico-da-colectomia-esquerda.png.asset.json";
import colectomiaTotal from "@/assets/esquemas/esquema-anatomico-da-colectomia-total.webp.asset.json";
import dpc from "@/assets/esquemas/esquema-anatomico-da-dpc.webp.asset.json";
import prostatectomia from "@/assets/esquemas/esquema-anatomico-da-prostatectomia-radical.png.asset.json";
import raRecto from "@/assets/esquemas/esquema-anatomico-da-rarecto.png.asset.json";
import rim from "@/assets/esquemas/esquema-anatomico-da-rim.webp.asset.json";
import sigmoide from "@/assets/esquemas/esquema-anatomico-da-sigmoide.png.asset.json";
import vesicula from "@/assets/esquemas/esquema-anatomico-da-vesicula-biliar.png.asset.json";
import esofago from "@/assets/esquemas/esquema-anatomico-do-esofago.png.asset.json";

export type ZonaOrgao = {
  id: string;
  nome: string;
  /** Path SVG em coordenadas normalizadas 0–100. */
  d: string;
};

export type Orgao = {
  id: string;
  nome: string;
  /** URL da imagem do esquema. */
  imagem: string;
  /** Dimensões originais da imagem, usadas para manter a proporção. */
  largura: number;
  altura: number;
  zonas: ZonaOrgao[];
};

/** Rectângulo em percentagem (x, y, largura, altura). */
const cx = (x: number, y: number, l: number, a: number) =>
  `M${x} ${y} H${x + l} V${y + a} H${x} Z`;

export const ORGAOS: Orgao[] = [
  {
    id: "colectomia-direita",
    nome: "Colectomia direita",
    imagem: colectomiaDireita.url,
    largura: 1312,
    altura: 1199,
    zonas: [
      { id: "flexura-hepatica", nome: "Flexura hepática", d: cx(30, 5, 16, 12) },
      { id: "colon-transverso", nome: "Cólon transverso", d: cx(52, 4, 33, 26) },
      {
        id: "margem-transverso",
        nome: "Margem de secção do cólon transverso",
        d: cx(85, 6, 8, 28),
      },
      { id: "colon-ascendente", nome: "Cólon ascendente", d: cx(30, 30, 20, 35) },
      { id: "valvula-ileocecal", nome: "Válvula ileocecal", d: cx(42, 66, 11, 7) },
      { id: "cego", nome: "Cego", d: cx(28, 73, 20, 14) },
      { id: "apendice", nome: "Apêndice", d: cx(46, 86, 16, 12) },
      { id: "ileon-terminal", nome: "Íleon terminal", d: cx(55, 63, 18, 16) },
      {
        id: "margem-ileal",
        nome: "Margem de secção ileal",
        d: cx(66, 62, 8, 20),
      },
      {
        id: "mesocolon",
        nome: "Mesocólon / gânglios linfáticos",
        d: cx(50, 20, 16, 42),
      },
    ],
  },

  {
    id: "colectomia-esquerda",
    nome: "Colectomia esquerda",
    imagem: colectomiaEsquerda.url,
    largura: 1208,
    altura: 1302,
    zonas: [
      { id: "colon-transverso", nome: "Cólon transverso", d: cx(10, 10, 26, 18) },
      {
        id: "margem-transverso",
        nome: "Margem de secção do cólon transverso",
        d: cx(5, 8, 7, 22),
      },
      { id: "flexura-esplenica", nome: "Flexura esplénica", d: cx(52, 5, 20, 14) },
      { id: "colon-descendente", nome: "Cólon descendente", d: cx(48, 28, 22, 34) },
      { id: "colon-sigmoide", nome: "Cólon sigmoide", d: cx(42, 72, 30, 18) },
      { id: "mesocolon-sigmoide", nome: "Mesocólon sigmoide", d: cx(25, 58, 22, 20) },
      {
        id: "margem-distal",
        nome: "Recto / margem de secção distal",
        d: cx(12, 74, 17, 18),
      },
      {
        id: "ganglios",
        nome: "Gânglios do mesocólon",
        d: cx(30, 30, 18, 26),
      },
    ],
  },

  {
    id: "colectomia-total",
    nome: "Colectomia total",
    imagem: colectomiaTotal.url,
    largura: 1339,
    altura: 1174,
    zonas: [
      { id: "flexura-hepatica", nome: "Flexura hepática", d: cx(18, 8, 14, 12) },
      { id: "colon-transverso", nome: "Cólon transverso", d: cx(35, 10, 28, 16) },
      { id: "flexura-esplenica", nome: "Flexura esplénica", d: cx(70, 8, 15, 12) },
      { id: "colon-ascendente", nome: "Cólon ascendente", d: cx(18, 34, 15, 32) },
      { id: "colon-descendente", nome: "Cólon descendente", d: cx(68, 34, 16, 32) },
      { id: "cego", nome: "Cego", d: cx(16, 66, 15, 14) },
      { id: "apendice", nome: "Apêndice", d: cx(22, 80, 14, 14) },
      { id: "colon-sigmoide", nome: "Cólon sigmoide", d: cx(60, 72, 18, 16) },
      { id: "recto", nome: "Recto / margem distal", d: cx(45, 88, 14, 11) },
      {
        id: "mesocolon",
        nome: "Mesocólon / gânglios linfáticos",
        d: cx(36, 32, 26, 36),
      },
    ],
  },

  {
    id: "sigmoidectomia",
    nome: "Sigmoidectomia",
    imagem: sigmoide.url,
    largura: 1230,
    altura: 1278,
    zonas: [
      {
        id: "margem-proximal",
        nome: "Margem de ressecção proximal (cólon descendente distal)",
        d: cx(34, 2, 26, 10),
      },
      { id: "colon-sigmoide", nome: "Cólon sigmoide (aberto)", d: cx(34, 30, 24, 34) },
      { id: "mesocolon-sigmoide", nome: "Mesocólon sigmoide", d: cx(60, 32, 24, 26) },
      {
        id: "margem-distal",
        nome: "Margem de ressecção distal (recto proximal)",
        d: cx(34, 88, 26, 10),
      },
      { id: "ganglios", nome: "Gânglios do mesocólon", d: cx(72, 46, 20, 22) },
    ],
  },

  {
    id: "ra-recto",
    nome: "Ressecção abdominoperineal do recto",
    imagem: raRecto.url,
    largura: 1230,
    altura: 1278,
    zonas: [
      {
        id: "margem-proximal",
        nome: "Margem de ressecção proximal (cólon sigmoide)",
        d: cx(34, 3, 28, 9),
      },
      { id: "colon-sigmoide", nome: "Cólon sigmoide", d: cx(36, 14, 24, 18) },
      { id: "mesocolon-sigmoide", nome: "Mesocólon sigmoide", d: cx(58, 18, 22, 18) },
      { id: "recto", nome: "Recto (aberto)", d: cx(36, 44, 24, 28) },
      { id: "mesorrecto", nome: "Mesorrecto", d: cx(58, 44, 22, 28) },
      {
        id: "margem-distal",
        nome: "Margem de ressecção distal (canal anal)",
        d: cx(36, 76, 24, 10),
      },
      { id: "anoderma", nome: "Anoderma (pele perianal)", d: cx(42, 88, 22, 10) },
    ],
  },

  {
    id: "prostatectomia",
    nome: "Prostatectomia radical",
    imagem: prostatectomia.url,
    largura: 1312,
    altura: 1199,
    zonas: [
      {
        id: "colo-vesical",
        nome: "Colo vesical (margem de secção)",
        d: cx(43, 14, 14, 12),
      },
      {
        id: "deferente-d",
        nome: "Canal deferente direito (seccionado)",
        d: cx(17, 11, 12, 7),
      },
      {
        id: "vesicula-seminal-d",
        nome: "Vesícula seminal direita (seccionada)",
        d: cx(17, 18, 14, 9),
      },
      {
        id: "deferente-e",
        nome: "Canal deferente esquerdo (seccionado)",
        d: cx(71, 11, 13, 7),
      },
      {
        id: "vesicula-seminal-e",
        nome: "Vesícula seminal esquerda (seccionada)",
        d: cx(69, 18, 15, 9),
      },
      { id: "base", nome: "Base (corte com vesículas seminais)", d: cx(34, 33, 32, 12) },
      { id: "uretra", nome: "Uretra prostática", d: cx(46, 36, 10, 8) },
      { id: "capsula", nome: "Cápsula prostática", d: cx(60, 46, 12, 9) },
      { id: "medio-sup", nome: "Terço médio superior", d: cx(34, 47, 32, 11) },
      { id: "medio-inf", nome: "Terço médio inferior", d: cx(34, 60, 32, 11) },
      { id: "apice", nome: "Ápice", d: cx(36, 73, 28, 11) },
      {
        id: "margem-apical",
        nome: "Margem apical (de secção)",
        d: cx(44, 84, 18, 8),
      },
    ],
  },

  {
    id: "rim",
    nome: "Rim (nefrectomia)",
    imagem: rim.url,
    largura: 1312,
    altura: 1199,
    zonas: [
      { id: "capsula", nome: "Cápsula renal", d: cx(26, 5, 13, 11) },
      { id: "cortex", nome: "Córtex renal", d: cx(55, 4, 18, 11) },
      { id: "medula", nome: "Pirâmide renal (medula)", d: cx(57, 17, 16, 12) },
      { id: "papila", nome: "Papila renal", d: cx(54, 29, 13, 8) },
      { id: "calice-menor", nome: "Cálice menor", d: cx(57, 38, 14, 9) },
      { id: "calice-maior", nome: "Cálice maior", d: cx(57, 48, 14, 9) },
      { id: "pelve", nome: "Pelve renal", d: cx(44, 52, 14, 11) },
      { id: "arteria", nome: "Artéria renal (margem vascular)", d: cx(19, 35, 16, 10) },
      { id: "veia", nome: "Veia renal (margem vascular)", d: cx(21, 45, 16, 9) },
      { id: "ureter", nome: "Ureter (margem)", d: cx(25, 78, 16, 13) },
    ],
  },

  {
    id: "vesicula-biliar",
    nome: "Vesícula biliar (colecistectomia)",
    imagem: vesicula.url,
    largura: 1312,
    altura: 1199,
    zonas: [
      { id: "ducto-cistico", nome: "Ducto cístico (margem)", d: cx(69, 7, 14, 10) },
      { id: "colo", nome: "Colo", d: cx(56, 17, 13, 10) },
      { id: "arteria-cistica", nome: "Artéria cística", d: cx(73, 31, 12, 10) },
      { id: "ducto-hepatico", nome: "Ducto hepático comum", d: cx(85, 29, 12, 12) },
      { id: "corpo", nome: "Corpo da vesícula biliar (aberto)", d: cx(30, 39, 25, 17) },
      { id: "mucosa", nome: "Mucosa com pregas", d: cx(30, 57, 22, 12) },
      { id: "serosa", nome: "Serosa", d: cx(52, 73, 19, 12) },
      { id: "fundo", nome: "Fundo", d: cx(13, 85, 17, 11) },
    ],
  },

  {
    id: "dpc",
    nome: "Duodenopancreatectomia cefálica (Whipple)",
    imagem: dpc.url,
    largura: 1402,
    altura: 1122,
    zonas: [
      { id: "estomago", nome: "Estômago (porção distal)", d: cx(8, 19, 20, 26) },
      {
        id: "margem-gastrica",
        nome: "Margem gástrica (de secção)",
        d: cx(3, 49, 12, 20),
      },
      { id: "duodeno", nome: "Duodeno aberto", d: cx(29, 20, 15, 68) },
      {
        id: "margem-duodenal",
        nome: "Margem duodenal (de secção)",
        d: cx(25, 72, 11, 16),
      },
      { id: "ampola", nome: "Ampola de Vater", d: cx(42, 49, 11, 13) },
      { id: "coledoco", nome: "Colédoco", d: cx(49, 29, 12, 15) },
      {
        id: "ducto-pancreatico",
        nome: "Ducto pancreático principal",
        d: cx(47, 51, 13, 12),
      },
      {
        id: "margem-biliar",
        nome: "Margem biliar (de secção)",
        d: cx(67, 19, 12, 13),
      },
      { id: "vesicula", nome: "Vesícula biliar", d: cx(71, 7, 14, 14) },
      { id: "cabeca-pancreas", nome: "Cabeça do pâncreas", d: cx(57, 39, 22, 16) },
      {
        id: "margem-pancreatica",
        nome: "Margem de secção pancreática (colo do pâncreas)",
        d: cx(80, 31, 15, 14),
      },
      {
        id: "leito-vascular",
        nome: "Leito vascular (veia mesentérica superior)",
        d: cx(65, 57, 14, 11),
      },
      {
        id: "margem-retroperitoneal",
        nome: "Margem retroperitoneal (de secção)",
        d: cx(78, 61, 15, 14),
      },
      { id: "processo-uncinado", nome: "Processo uncinado", d: cx(55, 69, 17, 12) },
      {
        id: "margem-uncinada",
        nome: "Margem uncinada (de secção)",
        d: cx(67, 77, 14, 13),
      },
    ],
  },

  {
    id: "esofago",
    nome: "Esófago (esofagectomia)",
    imagem: esofago.url,
    largura: 1024,
    altura: 1536,
    zonas: [
      { id: "faringe", nome: "Faringe / margem proximal", d: cx(38, 1, 22, 8) },
      {
        id: "esfincter-superior",
        nome: "Esfíncter esofágico superior",
        d: cx(42, 10, 12, 7),
      },
      { id: "cervical", nome: "Esófago cervical", d: cx(42, 21, 13, 10) },
      { id: "toracico", nome: "Esófago torácico", d: cx(43, 41, 13, 11) },
      { id: "diafragma", nome: "Diafragma", d: cx(56, 61, 18, 8) },
      { id: "abdominal", nome: "Esófago abdominal", d: cx(43, 70, 13, 9) },
      {
        id: "juncao",
        nome: "Junção gastroesofágica",
        d: cx(43, 80, 14, 8),
      },
    ],
  },
  {
    id: "figado",
    nome: "Fígado (esquema seccionado)",
    imagem: figado.url,
    largura: 1536,
    altura: 1024,
    zonas: [
      { id: "lobo-direito", nome: "Lobo direito", d: cx(11, 40, 10, 14) },
      { id: "lobo-esquerdo", nome: "Lobo esquerdo", d: cx(84, 27, 10, 12) },
      { id: "capsula", nome: "Cápsula hepática", d: cx(15, 20, 10, 8) },
      { id: "parenquima", nome: "Parênquima hepático", d: cx(84, 60, 12, 8) },
      { id: "segmento-i", nome: "Segmento I (lobo caudado)", d: cx(44, 46, 9, 9) },
      { id: "segmento-ii", nome: "Segmento II", d: cx(72, 32, 9, 9) },
      { id: "segmento-iii", nome: "Segmento III", d: cx(74, 48, 9, 9) },
      { id: "segmento-iv", nome: "Segmento IV (lobo quadrado)", d: cx(60, 39, 9, 9) },
      { id: "segmento-v", nome: "Segmento V", d: cx(20, 49, 9, 9) },
      { id: "segmento-vi", nome: "Segmento VI", d: cx(31, 54, 9, 9) },
      { id: "segmento-vii", nome: "Segmento VII", d: cx(36, 34, 9, 9) },
      { id: "segmento-viii", nome: "Segmento VIII", d: cx(23, 33, 9, 9) },
      { id: "veia-cava", nome: "Veia cava inferior", d: cx(44, 10, 11, 12) },
      { id: "veia-hepatica-direita", nome: "Veia hepática direita", d: cx(35, 21, 8, 8) },
      { id: "veia-hepatica-media", nome: "Veia hepática média", d: cx(45, 24, 7, 10) },
      { id: "veia-hepatica-esquerda", nome: "Veia hepática esquerda", d: cx(59, 24, 8, 7) },
      { id: "veia-porta", nome: "Veia porta", d: cx(45, 64, 8, 8) },
      { id: "arteria-hepatica", nome: "Artéria hepática", d: cx(52, 68, 7, 7) },
      { id: "ducto-hepatico", nome: "Ducto hepático comum", d: cx(50, 76, 8, 7) },
      { id: "vesicula", nome: "Vesícula biliar", d: cx(30, 76, 11, 18) },
    ],
  },
  {
    id: "estomago",
    nome: "Estômago (gastrectomia)",
    imagem: estomago.url,
    largura: 1549,
    altura: 1015,
    zonas: [
      { id: "margem-esofagica", nome: "Margem de secção esofágica", d: cx(45, 3, 11, 9) },
      { id: "cardia", nome: "Cárdia", d: cx(42, 19, 9, 8) },
      { id: "juncao", nome: "Junção gastroesofágica", d: cx(51, 17, 10, 8) },
      { id: "fundo", nome: "Fundo gástrico", d: cx(28, 20, 14, 12) },
      { id: "corpo", nome: "Corpo gástrico", d: cx(39, 49, 12, 12) },
      { id: "lesao", nome: "Lesão / tumor", d: cx(45, 38, 13, 10) },
      { id: "curvatura-maior", nome: "Curvatura maior", d: cx(28, 38, 8, 16) },
      { id: "curvatura-menor", nome: "Curvatura menor", d: cx(62, 38, 8, 16) },
      { id: "antro", nome: "Antro", d: cx(41, 71, 13, 9) },
      { id: "piloro", nome: "Piloro", d: cx(42, 81, 12, 7) },
      { id: "margem-duodenal", nome: "Margem de secção duodenal", d: cx(43, 89, 12, 8) },
    ],
  },
];


export const orgaoPorId = (id: string): Orgao | undefined =>
  ORGAOS.find((o) => o.id === id);

export const nomeZona = (orgaoId: string, zonaId: string): string =>
  orgaoPorId(orgaoId)?.zonas.find((z) => z.id === zonaId)?.nome ?? "";
