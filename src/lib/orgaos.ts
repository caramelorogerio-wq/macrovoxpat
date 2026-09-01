/**
 * Biblioteca de esquemas anatómicos simples usados na legenda de blocos.
 *
 * Cada esquema é desenhado num viewBox normalizado 0 0 100 100 e é composto
 * por zonas (`path`) clicáveis, mais linhas de contorno decorativas. Os
 * desenhos são esquemáticos — servem para localizar os blocos, não para
 * representar anatomia à escala.
 */

export type ZonaOrgao = {
  id: string;
  nome: string;
  /** Path SVG dentro do viewBox 0 0 100 100. */
  d: string;
};

export type Orgao = {
  id: string;
  nome: string;
  zonas: ZonaOrgao[];
  /** Traços de contorno sem interacção. */
  contorno?: string[];
};

const rect = (x: number, y: number, l: number, a: number) =>
  `M${x} ${y} H${x + l} V${y + a} H${x} Z`;

export const ORGAOS: Orgao[] = [
  {
    id: "pele",
    nome: "Pele (excisão fusiforme)",
    contorno: ["M6 50 C26 16 74 16 94 50 C74 84 26 84 6 50 Z"],
    zonas: [
      {
        id: "lesao",
        nome: "Lesão central",
        d: "M38 50 A12 12 0 1 0 62 50 A12 12 0 1 0 38 50 Z",
      },
      {
        id: "margem-a",
        nome: "Margem lateral A (vértice esquerdo)",
        d: "M6 50 C14 34 22 27 30 24 L30 76 C22 73 14 66 6 50 Z",
      },
      {
        id: "margem-b",
        nome: "Margem lateral B (vértice direito)",
        d: "M94 50 C86 34 78 27 70 24 L70 76 C78 73 86 66 94 50 Z",
      },
      {
        id: "margem-superior",
        nome: "Margem superior",
        d: "M30 24 C42 18 58 18 70 24 L70 42 L30 42 Z",
      },
      {
        id: "margem-inferior",
        nome: "Margem inferior",
        d: "M30 76 C42 82 58 82 70 76 L70 58 L30 58 Z",
      },
      {
        id: "profunda",
        nome: "Margem profunda",
        d: rect(30, 42, 40, 16),
      },
    ],
  },

  {
    id: "colon",
    nome: "Cólon / recto",
    contorno: [
      "M10 30 H90 M10 70 H90",
      "M10 30 V70 M90 30 V70",
    ],
    zonas: [
      { id: "margem-proximal", nome: "Margem proximal", d: rect(10, 30, 14, 40) },
      { id: "margem-distal", nome: "Margem distal", d: rect(76, 30, 14, 40) },
      {
        id: "tumor",
        nome: "Lesão / tumor",
        d: "M38 50 A12 12 0 1 0 62 50 A12 12 0 1 0 38 50 Z",
      },
      { id: "parede", nome: "Parede — bordo anti-mesentérico", d: rect(24, 30, 52, 10) },
      { id: "serosa", nome: "Serosa / margem radial", d: rect(24, 60, 52, 10) },
      { id: "ganglios", nome: "Gânglios do mesentério", d: rect(24, 74, 52, 16) },
    ],
  },

  {
    id: "estomago",
    nome: "Estômago",
    contorno: ["M28 14 C12 34 16 70 40 86 C64 94 84 76 84 54 C84 34 66 16 46 12 Z"],
    zonas: [
      { id: "cardia", nome: "Cárdia / margem proximal", d: "M28 14 C22 24 22 32 26 38 L46 30 L46 12 Z" },
      { id: "fundo", nome: "Fundo", d: "M46 12 C64 16 78 30 80 44 L54 46 L46 30 Z" },
      { id: "corpo", nome: "Corpo", d: "M26 38 C24 52 28 64 38 72 L58 66 L54 46 Z" },
      { id: "antro", nome: "Antro", d: "M38 72 C48 82 64 84 76 74 L74 58 L58 66 Z" },
      { id: "piloro", nome: "Piloro / margem distal", d: "M76 74 C84 66 86 58 84 52 L74 58 Z" },
      { id: "lesao", nome: "Lesão", d: "M44 44 A9 9 0 1 0 62 44 A9 9 0 1 0 44 44 Z" },
    ],
  },

  {
    id: "mama",
    nome: "Mama (quadrantes)",
    contorno: ["M50 50 A38 38 0 1 0 50 50.01 Z", "M12 50 H88 M50 12 V88"],
    zonas: [
      { id: "qse", nome: "Quadrante superior externo", d: "M50 50 L50 12 A38 38 0 0 1 88 50 Z" },
      { id: "qsi", nome: "Quadrante superior interno", d: "M50 50 L12 50 A38 38 0 0 1 50 12 Z" },
      { id: "qie", nome: "Quadrante inferior externo", d: "M50 50 L88 50 A38 38 0 0 1 50 88 Z" },
      { id: "qii", nome: "Quadrante inferior interno", d: "M50 50 L50 88 A38 38 0 0 1 12 50 Z" },
      { id: "mamilo", nome: "Complexo mamilo-areolar", d: "M42 50 A8 8 0 1 0 58 50 A8 8 0 1 0 42 50 Z" },
    ],
  },

  {
    id: "utero",
    nome: "Útero e colo",
    contorno: ["M30 16 H70 L74 54 C74 72 62 86 50 90 C38 86 26 72 26 54 Z"],
    zonas: [
      { id: "endometrio", nome: "Endométrio", d: "M42 22 H58 L58 56 L50 62 L42 56 Z" },
      { id: "miometrio-ant", nome: "Miométrio anterior", d: "M30 16 H42 L42 56 L34 62 L28 40 Z" },
      { id: "miometrio-post", nome: "Miométrio posterior", d: "M70 16 H58 L58 56 L66 62 L72 40 Z" },
      { id: "colo", nome: "Colo do útero", d: "M38 66 H62 C60 80 56 87 50 90 C44 87 40 80 38 66 Z" },
      { id: "anexos", nome: "Anexos / paramétrios", d: rect(8, 16, 14, 30) },
    ],
  },

  {
    id: "prostata",
    nome: "Próstata",
    contorno: ["M50 14 C74 14 88 34 84 58 C80 80 64 90 50 90 C36 90 20 80 16 58 C12 34 26 14 50 14 Z", "M50 14 V90"],
    zonas: [
      { id: "apice-d", nome: "Ápex direito", d: "M50 66 C64 66 74 74 74 80 C66 88 58 90 50 90 Z" },
      { id: "apice-e", nome: "Ápex esquerdo", d: "M50 66 C36 66 26 74 26 80 C34 88 42 90 50 90 Z" },
      { id: "media-d", nome: "Terço médio direito", d: "M50 40 H82 L80 66 H50 Z" },
      { id: "media-e", nome: "Terço médio esquerdo", d: "M50 40 H18 L20 66 H50 Z" },
      { id: "base-d", nome: "Base direita", d: "M50 14 C70 14 82 26 82 40 H50 Z" },
      { id: "base-e", nome: "Base esquerda", d: "M50 14 C30 14 18 26 18 40 H50 Z" },
    ],
  },

  {
    id: "pulmao",
    nome: "Pulmão",
    contorno: ["M56 12 C34 20 20 44 24 68 C28 86 44 92 58 88 L58 12 Z"],
    zonas: [
      { id: "lobo-superior", nome: "Lobo superior", d: "M56 12 C40 18 30 30 28 44 L58 44 Z" },
      { id: "lobo-medio", nome: "Lobo médio / língula", d: "M28 44 H58 V64 H26 Z" },
      { id: "lobo-inferior", nome: "Lobo inferior", d: "M26 64 H58 V88 C44 92 28 86 26 64 Z" },
      { id: "hilo", nome: "Hilo / brônquio e margem vascular", d: rect(58, 40, 22, 18) },
      { id: "pleura", nome: "Pleura", d: "M24 68 C20 44 34 20 56 12 L52 12 C30 22 16 46 20 70 Z" },
      { id: "lesao", nome: "Lesão / nódulo", d: "M34 52 A8 8 0 1 0 50 52 A8 8 0 1 0 34 52 Z" },
    ],
  },

  {
    id: "rim",
    nome: "Rim",
    contorno: ["M62 12 C34 16 22 36 24 54 C26 76 44 90 64 88 C58 68 58 34 62 12 Z"],
    zonas: [
      { id: "polo-superior", nome: "Pólo superior", d: "M62 12 C42 14 30 26 28 38 L60 38 Z" },
      { id: "medio", nome: "Terço médio", d: "M28 38 H60 V62 H26 Z" },
      { id: "polo-inferior", nome: "Pólo inferior", d: "M26 62 H60 V88 C44 90 28 78 26 62 Z" },
      { id: "seio", nome: "Seio renal / pélvis", d: rect(62, 40, 20, 20) },
      { id: "gordura", nome: "Gordura perirrenal / cápsula", d: "M64 88 C58 68 58 34 62 12 L70 14 C66 36 66 68 72 88 Z" },
      { id: "ureter", nome: "Margem do uréter", d: rect(78, 66, 14, 12) },
    ],
  },

  {
    id: "tiroide",
    nome: "Tiróide",
    contorno: ["M46 34 H54 V60 H46 Z"],
    zonas: [
      { id: "lobo-d-sup", nome: "Lobo direito — terço superior", d: "M54 26 C70 24 82 32 82 44 H54 Z" },
      { id: "lobo-d-inf", nome: "Lobo direito — terço inferior", d: "M54 44 H82 C82 62 70 74 54 72 Z" },
      { id: "lobo-e-sup", nome: "Lobo esquerdo — terço superior", d: "M46 26 C30 24 18 32 18 44 H46 Z" },
      { id: "lobo-e-inf", nome: "Lobo esquerdo — terço inferior", d: "M46 44 H18 C18 62 30 74 46 72 Z" },
      { id: "istmo", nome: "Istmo", d: rect(46, 34, 8, 26) },
    ],
  },

  {
    id: "vesicula",
    nome: "Vesícula biliar / apêndice",
    contorno: ["M50 10 C64 20 70 40 66 62 C62 82 54 90 46 90 C38 90 30 78 30 60 C30 38 38 20 50 10 Z"],
    zonas: [
      { id: "colo", nome: "Colo / margem cirúrgica", d: "M50 10 C58 16 62 24 63 32 H37 C39 24 43 16 50 10 Z" },
      { id: "corpo", nome: "Corpo", d: "M37 32 H63 L64 62 H33 Z" },
      { id: "fundo", nome: "Fundo / ponta", d: "M33 62 H64 C60 82 54 90 46 90 C38 90 33 78 33 62 Z" },
      { id: "lesao", nome: "Lesão / espessamento", d: "M41 46 A8 8 0 1 0 57 46 A8 8 0 1 0 41 46 Z" },
    ],
  },

  {
    id: "ganglio",
    nome: "Gânglios / esvaziamento",
    contorno: [],
    zonas: [
      { id: "nivel-1", nome: "Nível I", d: rect(10, 14, 36, 22) },
      { id: "nivel-2", nome: "Nível II", d: rect(54, 14, 36, 22) },
      { id: "nivel-3", nome: "Nível III", d: rect(10, 44, 36, 22) },
      { id: "nivel-4", nome: "Nível IV", d: rect(54, 44, 36, 22) },
      { id: "sentinela", nome: "Gânglio sentinela", d: rect(32, 74, 36, 16) },
    ],
  },

  {
    id: "generico",
    nome: "Esquema genérico (peça)",
    contorno: ["M12 18 H88 V82 H12 Z", "M50 18 V82", "M12 50 H88"],
    zonas: [
      { id: "sup-e", nome: "Quadrante superior esquerdo", d: rect(12, 18, 38, 32) },
      { id: "sup-d", nome: "Quadrante superior direito", d: rect(50, 18, 38, 32) },
      { id: "inf-e", nome: "Quadrante inferior esquerdo", d: rect(12, 50, 38, 32) },
      { id: "inf-d", nome: "Quadrante inferior direito", d: rect(50, 50, 38, 32) },
    ],
  },
];

export const orgaoPorId = (id: string): Orgao | undefined =>
  ORGAOS.find((o) => o.id === id);

export const nomeZona = (orgaoId: string, zonaId: string): string =>
  orgaoPorId(orgaoId)?.zonas.find((z) => z.id === zonaId)?.nome ?? "";
