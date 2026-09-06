import { useState } from "react";
import { ListOrdered, Map, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DiagramaOrgao } from "@/components/diagrama-orgao";
import {
  aplicarLegenda,
  proximoBloco,
  type Diagrama,
  type LinhaLegenda,
} from "@/lib/legendas";


type Props = {
  legenda: LinhaLegenda[];
  diagrama: Diagrama | null;
  onLegendaChange: (linhas: LinhaLegenda[]) => void;
  onDiagramaChange: (diagrama: Diagrama | null) => void;
  /** Abre o diagrama por comando de voz. */
  diagramaAberto?: boolean;
  onDiagramaAbertoChange?: (aberto: boolean) => void;
};

export function LegendaBlocos({
  legenda,
  diagrama,
  onLegendaChange,
  onDiagramaChange,
  diagramaAberto,
  onDiagramaAbertoChange,
}: Props) {
  const [abertoLocal, setAbertoLocal] = useState(false);

  const aberto = diagramaAberto ?? abertoLocal;

  const alternar = (v: boolean) => {
    setAbertoLocal(v);
    onDiagramaAbertoChange?.(v);
  };

  const [blocoActivo, setBlocoActivo] = useState(1);

  const linhas = legenda;

  const adicionar = () => {
    const bloco = proximoBloco(linhas);
    onLegendaChange([...linhas, { bloco, descricao: "" }]);
    setBlocoActivo(bloco);
  };

  return (
    <div className="space-y-3 rounded-md border border-border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ListOrdered className="size-4 text-clinical" />

          <h3 className="text-sm font-medium text-foreground">
            Legenda de blocos
          </h3>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => alternar(!aberto)}
        >
          <Map className="size-4" />
          {aberto ? "Fechar diagrama" : "Diagrama do órgão"}
        </Button>
      </div>

      {linhas.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          Dite &quot;App, legenda bloco um margem proximal&quot; ou acrescente
          linhas à mão.
        </p>
      ) : (
        <ul className="space-y-2">
          {linhas.map((l, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="shrink-0 text-xs font-medium text-muted-foreground">
                Bloco
              </span>

              <Input
                type="number"
                min={1}
                value={l.bloco}
                onChange={(e) => {
                  const novo = Number(e.target.value);
                  if (!Number.isFinite(novo)) return;

                  const anterior = l.bloco;

                  onLegendaChange(
                    linhas.map((item, j) =>
                      j === i ? { ...item, bloco: novo } : item,
                    ),
                  );

                  setBlocoActivo(novo);

                  if (diagrama) {
                    onDiagramaChange({
                      ...diagrama,
                      marcadores: diagrama.marcadores.map((m) =>
                        m.bloco === anterior ? { ...m, bloco: novo } : m,
                      ),
                    });
                  }
                }}
                onFocus={() => setBlocoActivo(l.bloco)}
                aria-label={`Número do bloco (linha ${i + 1})`}
                className={`h-8 w-16 shrink-0 text-sm ${
                  l.bloco === blocoActivo ? "border-clinical text-clinical" : ""
                }`}
              />

              <Input
                value={l.descricao}
                onChange={(e) =>
                  onLegendaChange(
                    linhas.map((item, j) =>
                      j === i ? { ...item, descricao: e.target.value } : item,
                    ),
                  )
                }
                onFocus={() => setBlocoActivo(l.bloco)}
                placeholder="Zona correspondente"
                className="h-8 text-sm"
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 shrink-0"
                aria-label={`Remover legenda do bloco ${l.bloco}`}
                onClick={() => {
                  onLegendaChange(linhas.filter((_, j) => j !== i));

                  if (diagrama) {
                    onDiagramaChange({
                      ...diagrama,
                      marcadores: diagrama.marcadores.filter(
                        (m) => m.bloco !== l.bloco,
                      ),
                    });
                  }
                }}
              >
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>

      )}

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="gap-2"
        onClick={adicionar}
      >
        <Plus className="size-4" />
        Adicionar bloco
      </Button>

      {aberto && (
        <DiagramaOrgao
          diagrama={diagrama}
          legenda={linhas}
          blocoActivo={blocoActivo}
          onBlocoActivoChange={setBlocoActivo}
          onChange={onDiagramaChange}
          onMarcar={(bloco, zona) => {
            const existente = linhas.find((l) => l.bloco === bloco);

            if (existente?.descricao.trim()) return;

            onLegendaChange(
              aplicarLegenda(linhas, [bloco], (zona ?? "").trim()),
            );
          }}
        />
      )}

    </div>
  );
}
