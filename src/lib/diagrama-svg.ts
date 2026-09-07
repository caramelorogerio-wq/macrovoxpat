/**
 * Conversão do diagrama (imagem do esquema + marcadores numerados) para PNG,
 * usada nas exportações (Word) — sem dependências externas.
 */

import type { Diagrama, LinhaLegenda } from "./legendas";
import { orgaoPorId } from "./orgaos";

/**
 * Desenha o esquema com os marcadores numerados e devolve o PNG.
 * Devolve `null` se a conversão não for possível (fora do browser, esquema
 * desconhecido ou imagem indisponível).
 */
export async function pngDiagrama(
  diagrama: Diagrama,
  larguraPx = 900,
): Promise<Uint8Array | null> {
  if (typeof document === "undefined") return null;

  const orgao = orgaoPorId(diagrama.orgao);
  if (!orgao) return null;

  try {
    const imagem = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Falha ao carregar o esquema."));
      img.src = orgao.imagem;
    });

    const largura = larguraPx;
    const altura = Math.round((larguraPx * orgao.altura) / orgao.largura);

    const canvas = document.createElement("canvas");
    canvas.width = largura;
    canvas.height = altura;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, largura, altura);
    ctx.drawImage(imagem, 0, 0, largura, altura);

    const raio = Math.max(12, Math.round(largura * 0.022));
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `bold ${Math.round(raio * 1.2)}px Arial, Helvetica, sans-serif`;

    for (const m of diagrama.marcadores) {
      const x = (m.x / 100) * largura;
      const y = (m.y / 100) * altura;

      ctx.beginPath();
      ctx.arc(x, y, raio, 0, Math.PI * 2);
      ctx.fillStyle = "#1f4e79";
      ctx.fill();
      ctx.lineWidth = Math.max(1, raio * 0.14);
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.fillText(String(m.bloco), x, y + raio * 0.06);
    }

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/png"),
    );

    if (!blob) return null;

    return new Uint8Array(await blob.arrayBuffer());
  } catch {
    return null;
  }
}


/** Texto alternativo do diagrama para acessibilidade/exportações. */
export const descricaoDiagrama = (
  diagrama: Diagrama,
  legenda: LinhaLegenda[],
) => {
  const orgao = orgaoPorId(diagrama.orgao);
  const nomes = legenda
    .map((l) => `${l.bloco}: ${l.descricao.trim()}`)
    .filter(Boolean)
    .join("; ");

  return `Esquema de ${orgao?.nome ?? "peça"} com os blocos marcados${
    nomes ? ` (${nomes})` : ""
  }.`;
};
