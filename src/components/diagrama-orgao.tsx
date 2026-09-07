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
  /** Avisa que um bloco foi marcado, para garantir a linha de legenda. */
  onMarcar?: (bloco: number, zona?: string) => void;
};

export function DiagramaOrgao({
  diagrama,
  legenda,
  blocoActivo,
  onBlocoActivoChange,
  onChange,
  onMarcar,
}: Props) {
  const [orgaoId, setOrgaoId] = useState(
    diagrama?.orgao ?? ORGAOS[0]!.id,
  );


  const orgao = orgaoPorId(diagrama?.orgao ?? orgaoId) ?? ORGAOS[0]!;
  const marcadores = diagrama?.marcadores ?? [];

  const escolherOrgao = (id: string) => {
    setOrgaoId(id);
    onChange({ orgao: id, marcadores: diagrama?.marcadores ?? [] });
  };

  const colocar = (x: number, y: number, zona?: string) => {
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

    onMarcar?.(blocoActivo, zona);
  };


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
          preserveAspectRatio="none"
          onClick={clicarSvg}
          role="img"
          aria-label={`Esquema de ${orgao.nome}`}
          style={{ aspectRatio: `${orgao.largura} / ${orgao.altura}` }}
          className="h-auto w-full max-w-sm shrink-0 cursor-crosshair rounded-md border border-border bg-background"
        >
          <image
            href={orgao.imagem}
            x={0}
            y={0}
            width={100}
            height={100}
            preserveAspectRatio="none"
            pointerEvents="none"
          />

          {orgao.zonas.map((z) => (
            <path
              key={z.id}
              d={z.d}
              fill="transparent"
              className="stroke-transparent transition-colors hover:fill-clinical/25 hover:stroke-primary"
              strokeWidth={0.4}
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

          {marcadores.map((m) => (
            <g
              key={m.id}
              pointerEvents="none"
              transform={`translate(${m.x} ${m.y}) scale(1 ${
                orgao.largura / orgao.altura
              })`}
            >
              <circle cx={0} cy={0} r={4.6} className="fill-primary" />
              <text
                x={0}
                y={1.9}
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
