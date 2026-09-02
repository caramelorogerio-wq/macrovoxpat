/**
 * Legenda de blocos de uma amostra: correspondência entre o número do bloco
 * e a zona/descrição do órgão, opcionalmente ligada a um marcador colocado
 * sobre o esquema anatómico.
 */

export type LinhaLegenda = {
  bloco: number;
  descricao: string;
  /** Marcador correspondente no diagrama, quando existe. */
  marcadorId?: string;
};

export type Marcador = {
  id: string;
  bloco: number;
  /** Coordenadas em percentagem do viewBox (0–100). */
  x: number;
  y: number;
  /** Nome da zona anatómica clicada, quando aplicável. */
  zona?: string;
};

export type Diagrama = {
  /** Identificador do esquema em `ORGAOS`. */
  orgao: string;
  marcadores: Marcador[];
};

export const novoMarcadorId = () =>
  `m-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const ordenarLegenda = (linhas: LinhaLegenda[]) =>
  [...linhas].sort((a, b) => a.bloco - b.bloco);

/** Cria ou actualiza as linhas dos blocos indicados com a mesma descrição. */
export function aplicarLegenda(
  linhas: LinhaLegenda[],
  blocos: number[],
  descricao: string,
): LinhaLegenda[] {
  const saida = [...linhas];

  for (const bloco of blocos) {
    const i = saida.findIndex((l) => l.bloco === bloco);

    if (i >= 0) saida[i] = { ...saida[i]!, descricao };
    else saida.push({ bloco, descricao });
  }

  return ordenarLegenda(saida);
}

export const removerLinhaLegenda = (
  linhas: LinhaLegenda[],
  bloco: number,
): LinhaLegenda[] => linhas.filter((l) => l.bloco !== bloco);

/** Próximo número de bloco livre, começando em 1. */
export function proximoBloco(linhas: LinhaLegenda[]): number {
  const usados = new Set(linhas.map((l) => l.bloco));
  let n = 1;
  while (usados.has(n)) n += 1;
  return n;
}

/**
 * Linhas em texto: "Bloco 1 — margem proximal".
 * Inclui os blocos marcados no diagrama que ainda não têm linha de legenda,
 * usando a zona anatómica como descrição.
 */
export const legendaTexto = (
  linhas: LinhaLegenda[],
  diagrama?: Diagrama | null,
): string[] => {
  const descricoes = new Map<number, string>();

  for (const l of ordenarLegenda(linhas)) {
    descricoes.set(l.bloco, l.descricao.trim());
  }

  for (const m of diagrama?.marcadores ?? []) {
    const actual = descricoes.get(m.bloco);
    if (!actual) descricoes.set(m.bloco, (m.zona ?? "").trim());
  }

  return [...descricoes.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([bloco, descricao]) =>
      descricao ? `Bloco ${bloco} — ${descricao}` : `Bloco ${bloco}`,
    );
};


/** Normaliza dados vindos da base de dados (JSON sem tipos garantidos). */
export function lerLegenda(valor: unknown): LinhaLegenda[] {
  if (!Array.isArray(valor)) return [];

  return ordenarLegenda(
    valor
      .filter(
        (l): l is LinhaLegenda =>
          !!l && typeof l === "object" && Number.isFinite((l as LinhaLegenda).bloco),
      )
      .map((l) => ({
        bloco: Number(l.bloco),
        descricao: typeof l.descricao === "string" ? l.descricao : "",
        ...(typeof l.marcadorId === "string" ? { marcadorId: l.marcadorId } : {}),
      })),
  );
}

export function lerDiagrama(valor: unknown): Diagrama | null {
  if (!valor || typeof valor !== "object") return null;

  const d = valor as Partial<Diagrama>;

  if (typeof d.orgao !== "string") return null;

  const marcadores = Array.isArray(d.marcadores)
    ? d.marcadores
        .filter(
          (m): m is Marcador =>
            !!m &&
            typeof m === "object" &&
            Number.isFinite((m as Marcador).x) &&
            Number.isFinite((m as Marcador).y),
        )
        .map((m) => ({
          id: typeof m.id === "string" ? m.id : novoMarcadorId(),
          bloco: Number.isFinite(m.bloco) ? Number(m.bloco) : 1,
          x: Number(m.x),
          y: Number(m.y),
          ...(typeof m.zona === "string" ? { zona: m.zona } : {}),
        }))
    : [];

  return { orgao: d.orgao, marcadores };
}
