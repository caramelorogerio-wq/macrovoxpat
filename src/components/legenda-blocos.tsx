import { useState } from "react";
import { ListOrdered, Map, Mic, MicOff, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDitadoCurto } from "@/hooks/use-ditado-curto";
import { interpretarLegendaDitada } from "@/lib/comandos-voz";

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

  const { aOuvir, ouvir, parar } = useDitadoCurto();

  /** Mantém acentos: retira só o prefixo "bloco N" da frase original. */
  const descricaoOriginal = (frase: string, fallback: string) => {
    const resto = frase
      .replace(/^\s*(legenda\s+)?((d[oa]|de)\s+)?blocos?\s+(n[uú]mero\s+)?\S+(\s+(a|até|ate|e)\s+\S+)?[\s,:.-]+/i, "")
      .replace(/[.\s]+$/, "")
      .trim();
    const d = resto || fallback;
    return d.charAt(0).toUpperCase() + d.slice(1);
  };

  /** Ditado "bloco N descrição": cria/actualiza a linha. */
  const ditarLinhaNova = () => {
    if (aOuvir) return parar();
    ouvir(
      "nova",
      (frase) => {
        const r = interpretarLegendaDitada(frase);
        if (!r) {
          toast.error(`Diga "bloco número descrição". Ouvi: "${frase}"`);
          return;
        }
        const descricao = descricaoOriginal(frase, r.descricao);
        onLegendaChange(aplicarLegenda(linhas, r.blocos, descricao));
        setBlocoActivo(r.blocos[0]);
        toast.success(`Bloco ${r.blocos.join(", ")}: ${descricao}`);
      },
      (m) => toast.error(m),
    );
  };

  /** Ditado numa linha: "bloco N descrição" muda ambos; senão só a descrição. */
  const ditarLinha = (i: number) => {
    if (aOuvir) return parar();
    ouvir(
      `linha-${i}`,
      (frase) => {
        const r = interpretarLegendaDitada(frase);
        const anterior = linhas[i]?.bloco ?? 1;
        const bloco = r?.blocos[0] ?? anterior;
        const descricao = r
          ? descricaoOriginal(frase, r.descricao)
          : frase.charAt(0).toUpperCase() + frase.slice(1).replace(/[.\s]+$/, "");
        onLegendaChange(
          linhas.map((item, j) => (j === i ? { bloco, descricao } : item)),
        );
        setBlocoActivo(bloco);
        if (diagrama && bloco !== anterior) {
          onDiagramaChange({
            ...diagrama,
            marcadores: diagrama.marcadores.map((m) =>
              m.bloco === anterior ? { ...m, bloco } : m,
            ),
          });
        }
      },
      (m) => toast.error(m),
    );
  };

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
          Carregue no microfone e dite &quot;bloco um margem proximal&quot;, ou
          em mãos livres &quot;App, bloco um margem proximal&quot;.
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
                variant={aOuvir === `linha-${i}` ? "default" : "ghost"}
                size="icon"
                className="size-8 shrink-0"
                aria-label={`Ditar legenda do bloco ${l.bloco}`}
                onClick={() => ditarLinha(i)}
              >
                {aOuvir === `linha-${i}` ? <MicOff className="size-4" /> : <Mic className="size-4" />}
              </Button>

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

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={aOuvir === "nova" ? "default" : "outline"}
          size="sm"
          className="gap-2"
          onClick={ditarLinhaNova}
        >
          {aOuvir === "nova" ? <MicOff className="size-4" /> : <Mic className="size-4" />}
          {aOuvir === "nova" ? "A ouvir… (diga «bloco N descrição»)" : "Ditar bloco"}
        </Button>

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
      </div>

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
