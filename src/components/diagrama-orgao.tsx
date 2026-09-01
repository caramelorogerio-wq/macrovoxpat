import { useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ORGAOS, orgaoPorId } from "@/lib/orgaos";
import {
  novoMarcadorId,
  type Diagrama,
  type LinhaLegenda,
} from "@/lib/legendas";

type Props = {
  diagrama: Diagrama | null;
  legenda: LinhaLegenda[];
  /** Bloco que recebe o próximo marcador. */
  blocoActivo: number;
  onBlocoActivoChange: (bloco: number) => void;
  onChange: (diagrama: Diagrama | null) => void;
};

export function DiagramaOrgao({
  diagrama,
  legenda,
  blocoActivo,
  onBlocoActivoChange,
  onChange,
}: Props) {
  const [orgaoId, setOrgaoId] = useState(diagrama?.orgao ?? "generico");

  const orgao = orgaoPorId(diagrama?.orgao ?? orgaoId) ?? ORGAOS[0]!;
  const marcadores = diagrama?.marcadores ?? [];

  const escolherOrgao = (id: string) => {
    setOrgaoId(id);
    onChange({ orgao: id, marcadores: diagrama?.marcadores ?? [] });
  };

  const colocar = (x: number, y: number, zona?: string) =>
    onChange({
      orgao: orgao.id,
      marcadores: [
        ...marcadores.filter((m) => m.bloco !== blocoActivo),
        {
          id: novoMarcadorId(),
          bloco: blocoActivo,
          x: Number(x.toFixed(2)),
          y: Number(y.toFixed(2)),
          ...(zona ? { zona } : {}),
        },
      ],
    });

  const clicarSvg = (e: React.MouseEvent<SVGSVGElement>) => {
    const alvo = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - alvo.left) / alvo.width) * 100;
    const y = ((e.clientY - alvo.top) / alvo.height) * 100;
    colocar(x, y);
  };

  const remover = (id: string) =>
    onChange({
      orgao: orgao.id,
      marcadores: marcadores.filter((m) => m.id !== id),
    });

  const blocos = legenda.map((l) => l.bloco);
  const opcoesBloco =
    blocos.length > 0 ? blocos : [blocoActivo];

  return (
    <div className="space-y-3 rounded-md border border-border bg-secondary/30 p-3">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-xs font-medium text-muted-foreground">
          Órgão
          <select
            value={orgao.id}
            onChange={(e) => escolherOrgao(e.target.value)}
            className="ml-2 rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground"
          >
            {ORGAOS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.nome}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-medium text-muted-foreground">
          Bloco a marcar
          <select
            value={blocoActivo}
            onChange={(e) => onBlocoActivoChange(Number(e.target.value))}
            className="ml-2 rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground"
          >
            {opcoesBloco.map((b) => (
              <option key={b} value={b}>
                Bloco {b}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-4">
        <svg
          viewBox="0 0 100 100"
          onClick={clicarSvg}
          role="img"
          aria-label={`Esquema de ${orgao.nome}`}
          className="h-64 w-64 shrink-0 cursor-crosshair rounded-md border border-border bg-background"
        >
          {orgao.zonas.map((z) => (
            <path
              key={z.id}
              d={z.d}
              className="fill-secondary stroke-border transition-colors hover:fill-clinical/30"
              strokeWidth={0.5}
              onClick={(e) => {
                e.stopPropagation();
                const alvo = (
                  e.currentTarget.ownerSVGElement as SVGSVGElement
                ).getBoundingClientRect();
                const x = ((e.clientX - alvo.left) / alvo.width) * 100;
                const y = ((e.clientY - alvo.top) / alvo.height) * 100;
                colocar(x, y, z.nome);
              }}
            >
              <title>{z.nome}</title>
            </path>
          ))}

          {(orgao.contorno ?? []).map((d, i) => (
            <path
              key={`c-${i}`}
              d={d}
              fill="none"
              className="stroke-primary"
              strokeWidth={0.9}
              pointerEvents="none"
            />
          ))}

          {marcadores.map((m) => (
            <g key={m.id} pointerEvents="none">
              <circle cx={m.x} cy={m.y} r={4.6} className="fill-primary" />
              <text
                x={m.x}
                y={m.y + 1.9}
                textAnchor="middle"
                fontSize={5.2}
                className="fill-primary-foreground"
              >
                {m.bloco}
              </text>
            </g>
          ))}
        </svg>

        <div className="min-w-[180px] flex-1 space-y-2">
          <p className="text-xs text-muted-foreground">
            Clique numa zona (ou em qualquer ponto) para marcar o bloco
            seleccionado.
          </p>

          {marcadores.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Ainda não há marcadores neste esquema.
            </p>
          ) : (
            <ul className="space-y-1">
              {[...marcadores]
                .sort((a, b) => a.bloco - b.bloco)
                .map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center gap-2 rounded-md border border-border bg-background px-2 py-1 text-xs"
                  >
                    <span className="font-medium text-foreground">
                      Bloco {m.bloco}
                    </span>

                    <span className="min-w-0 flex-1 truncate text-muted-foreground">
                      {m.zona ?? "ponto marcado"}
                    </span>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-6"
                      aria-label={`Remover marcador do bloco ${m.bloco}`}
                      onClick={() => remover(m.id)}
                    >
                      <X className="size-3" />
                    </Button>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
