import { describe, expect, it } from "vitest";

import { extrairComando, interpretarComando } from "./comandos-voz";

/** Simula a frase tal como o navegador a entrega e devolve o comando. */
const ouvir = (frase: string) => {
  const texto = extrairComando(frase);
  return texto === null ? null : interpretarComando(texto);
};

describe("palavra de activação", () => {
  it("aceita as variantes de activação", () => {
    for (const frase of [
      "App, parar",
      "Ap parar",
      "Apps, parar",
      "Patologia Geral, parar",
      "patologia parar",
    ]) {
      expect(ouvir(frase)?.tipo).toBe("parar-gravacao");
    }
  });

  it("ignora ditado normal sem palavra de activação", () => {
    expect(ouvir("peça cirúrgica com margens livres")).toBeNull();
    expect(ouvir("parar de sangrar na superfície")).toBeNull();
  });
});

describe("parar gravação", () => {
  const exemplos = [
    "App, parar",
    "App, para",
    "App pare",
    "App, parar gravação",
    "App, parar a gravação",
    "App, parar a gravação já",
    "App, terminar",
    "App, terminar o ditado",
    "App, termina a gravação por favor",
    "App, stop",
    "App, fim",
    "App, acabar",
    "App, parar de ditar",
    "App, por favor parar agora",
  ];

  it.each(exemplos)("reconhece %s", (frase) => {
    expect(ouvir(frase)).toEqual({ tipo: "parar-gravacao" });
  });
});

describe("iniciar gravação", () => {
  const exemplos = [
    "App, iniciar gravação",
    "App, iniciar",
    "App, começar a gravar",
    "App, gravar",
    "App, continuar",
    "App, iniciar o ditado",
    "App, retomar",
  ];

  it.each(exemplos)("reconhece %s", (frase) => {
    expect(ouvir(frase)).toEqual({ tipo: "iniciar-gravacao" });
  });
});

describe("número de análise", () => {
  it("aceita o código dito de forma directa", () => {
    expect(ouvir("App, análise C26H0000")).toEqual({
      tipo: "analise",
      valor: "C26H0000",
    });
  });

  it("aceita o código soletrado", () => {
    expect(ouvir("App, análise cê vinte e seis agá zero zero zero zero")).toEqual(
      { tipo: "analise", valor: "C26H0000" },
    );
  });

  it("aceita separadores ditados", () => {
    expect(ouvir("App, análise dê eme pê traço zero zero um")).toEqual({
      tipo: "analise",
      valor: "DMP-001",
    });
  });

  it("aceita prefixos como número da análise", () => {
    expect(ouvir("App, número da análise C26H0001")).toEqual({
      tipo: "analise",
      valor: "C26H0001",
    });
  });
});

describe("amostras", () => {
  it("cria nova amostra", () => {
    expect(ouvir("App, nova amostra")).toEqual({ tipo: "nova-amostra" });
  });

  it("muda de amostra por número escrito ou dito", () => {
    expect(ouvir("App, amostra 2")).toEqual({ tipo: "ir-amostra", indice: 2 });
    expect(ouvir("App, ir para amostra três")).toEqual({
      tipo: "ir-amostra",
      indice: 3,
    });
  });

  it("apaga a amostra activa", () => {
    expect(ouvir("App, apagar amostra")).toEqual({ tipo: "apagar-amostra" });
    expect(ouvir("App, eliminar a amostra")).toEqual({ tipo: "apagar-amostra" });
  });

  it("separa amostras", () => {
    expect(ouvir("App, separar amostras")).toEqual({ tipo: "separar" });
  });
});

describe("acções do relatório", () => {
  it.each([
    ["App, otimizar", "otimizar"],
    ["App, optimizar com IA", "otimizar"],
    ["App, guardar", "guardar"],
    ["App, exportar para Word", "exportar"],
    ["App, copiar texto", "copiar"],
    ["App, novo relatório", "novo-relatorio"],
    ["App, terminar sessão", "sair"],
    ["App, ajuda", "ajuda"],
    ["App, confirmar", "confirmar"],
    ["App, cancelar", "cancelar"],
  ])("reconhece %s", (frase, tipo) => {
    expect(ouvir(frase)?.tipo).toBe(tipo);
  });
});

describe("resumo técnico", () => {
  it("lê fragmentos, blocos, secção e inclusão", () => {
    expect(
      ouvir("App, resumo técnico 3 fragmentos 2 blocos seccionado total"),
    ).toEqual({
      tipo: "resumo",
      resumo: {
        fragmentos: 3,
        blocos: 2,
        seccionado: true,
        inclusao: "total",
      },
    });
  });

  it("lê números ditados e não seccionado", () => {
    expect(
      ouvir("App, resumo técnico dois fragmentos um bloco não seccionado reserva"),
    ).toEqual({
      tipo: "resumo",
      resumo: {
        fragmentos: 2,
        blocos: 1,
        seccionado: false,
        inclusao: "reserva",
      },
    });
  });

  it("lê o código de faturação", () => {
    expect(ouvir("App, resumo técnico 31057")?.tipo).toBe("resumo");
    expect(
      (ouvir("App, resumo técnico 2 blocos 31077") as {
        resumo: { codigoFaturacao?: string };
      }).resumo.codigoFaturacao,
    ).toBe("31077");
  });
});

describe("frases não reconhecidas", () => {
  it.each([
    "App, faz um café",
    "App, xpto",
  ])("devolve null para %s", (frase) => {
    expect(ouvir(frase)).toBeNull();
  });
});
