/**
 * Serialização do diagrama para SVG autónomo e conversão para PNG,
 * usada nas exportações (Word) — sem dependências externas.
 */

import type { Diagrama, LinhaLegenda } from "./legendas";
import { orgaoPorId } from "./orgaos";

const escapar = (v: string) =>
  v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** SVG autónomo (fundo branco) do esquema com os marcadores numerados. */
export function svgDiagrama(diagrama: Diagrama): string {
  const orgao = orgaoPorId(diagrama.orgao);

  if (!orgao) return "";

  const zonas = orgao.zonas
    .map(
      (z) =>
        `<path d="${z.d}" fill="#eef2f7" stroke="#9bb0c6" stroke-width="0.5"/>`,
    )
    .join("");

  const contorno = (orgao.contorno ?? [])
    .map(
      (d) =>
        `<path d="${d}" fill="none" stroke="#1f4e79" stroke-width="0.9"/>`,
    )
    .join("");

  const marcadores = diagrama.marcadores
    .map(
      (m) =>
        `<g><circle cx="${m.x}" cy="${m.y}" r="4.6" fill="#1f4e79"/>` +
        `<text x="${m.x}" y="${m.y + 1.9}" font-family="Arial, Helvetica, sans-serif"` +
        ` font-size="5.2" fill="#ffffff" text-anchor="middle">${escapar(
          String(m.bloco),
        )}</text></g>`,
    )
    .join("");

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="600" height="600">` +
    `<rect x="0" y="0" width="100" height="100" fill="#ffffff"/>` +
    zonas +
    contorno +
    marcadores +
    `</svg>`
  );
}

/**
 * Converte o SVG do diagrama em PNG (no browser, via canvas).
 * Devolve `null` se a conversão não for possível.
 */
export async function pngDiagrama(
  diagrama: Diagrama,
  lado = 600,
): Promise<Uint8Array | null> {
  if (typeof document === "undefined") return null;

  const svg = svgDiagrama(diagrama);
  if (!svg) return null;

  const url = URL.createObjectURL(
    new Blob([svg], { type: "image/svg+xml;charset=utf-8" }),
  );

  try {
    const imagem = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Falha ao desenhar o diagrama."));
      img.src = url;
    });

    const canvas = document.createElement("canvas");
    canvas.width = lado;
    canvas.height = lado;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, lado, lado);
    ctx.drawImage(imagem, 0, 0, lado, lado);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/png"),
    );

    if (!blob) return null;

    return new Uint8Array(await blob.arrayBuffer());
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
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
