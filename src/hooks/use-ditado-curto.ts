import { useCallback, useRef, useState } from "react";

/** Ditado curto (uma frase) com o reconhecimento de voz do navegador. */
export function useDitadoCurto() {
  const [aOuvir, setAOuvir] = useState<string | null>(null);
  const ref = useRef<{ abort: () => void } | null>(null);

  const ouvir = useCallback(
    (chave: string, onTexto: (texto: string) => void, onErro?: (m: string) => void) => {
      if (typeof window === "undefined") return;
      const w = window as unknown as Record<string, any>;
      const Ctor = w["SpeechRecognition"] ?? w["webkitSpeechRecognition"];
      if (!Ctor) {
        onErro?.("Este navegador não suporta ditado por voz. Use o Edge ou o Chrome.");
        return;
      }
      ref.current?.abort();
      const r = new Ctor();
      r.lang = "pt-PT";
      r.continuous = false;
      r.interimResults = false;
      r.onresult = (e: any) => {
        const t = String(e.results?.[0]?.[0]?.transcript ?? "").trim();
        if (t) onTexto(t);
      };
      r.onerror = (e: any) => {
        if (e?.error && e.error !== "no-speech" && e.error !== "aborted")
          onErro?.("Não foi possível captar o ditado.");
      };
      r.onend = () => {
        setAOuvir(null);
        ref.current = null;
      };
      ref.current = r;
      setAOuvir(chave);
      try {
        r.start();
      } catch {
        setAOuvir(null);
      }
    },
    [],
  );

  const parar = useCallback(() => ref.current?.abort(), []);

  return { aOuvir, ouvir, parar };
}
