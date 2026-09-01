import { useState } from "react";
import { ListOrdered, Map, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DiagramaOrgao } from "@/components/diagrama-orgao";
import {
  ordenarLegenda,
  proximoBloco,
  removerLinhaLegenda,
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

  const linhas = ordenarLegenda(legenda);

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
          {linhas.map((l) => (
            <li key={l.bloco} className="flex items-center gap-2">
              <span
                className={`w-20 shrink-0 rounded-md px-2 py-1 text-xs font-medium ${
                  l.bloco === blocoActivo
                    ? "bg-clinical/20 text-clinical"
                    : "text-muted-foreground"
                }`}
              >
                Bloco {l.bloco}
              </span>

              <Input
                value={l.descricao}
                onChange={(e) =>
                  onLegendaChange(
                    linhas.map((item) =>
                      item.bloco === l.bloco
                        ? { ...item, descricao: e.target.value }
                        : item,
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
                  onLegendaChange(removerLinhaLegenda(linhas, l.bloco));

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
        />
      )}
    </div>
  );
}
