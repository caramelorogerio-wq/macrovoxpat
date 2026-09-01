/**
 * Reconhecimento de comandos de voz em pt-PT para o fluxo de Patologia Geral.
 *
 * Cada frase captada pelo navegador é normalizada (sem acentos, sem
 * pontuação) e comparada com os padrões abaixo. Só as frases iniciadas pela
 * palavra de activação ("App") são tratadas como comando — tudo o resto
 * é ditado normal e é ignorado por este módulo.
 */

export type ResumoComando = {
  fragmentos?: number;
  blocos?: number;
  seccionado?: boolean;
  inclusao?: "total" | "reserva";
  codigoFaturacao?: "31057" | "31077";
};

export type Comando =
  | { tipo: "analise"; valor: string }
  | { tipo: "iniciar-gravacao" }
  | { tipo: "parar-gravacao" }
  | { tipo: "nova-amostra" }
  | { tipo: "ir-amostra"; indice: number }
  | { tipo: "apagar-amostra" }
  | { tipo: "resumo"; resumo: ResumoComando }
  | { tipo: "legenda-bloco"; blocos: number[]; descricao: string }
  | { tipo: "apagar-legenda-bloco"; bloco: number }
  | { tipo: "diagrama"; aberto: boolean }
  | { tipo: "separar" }
  | { tipo: "otimizar" }
  | { tipo: "guardar" }
  | { tipo: "exportar" }
  | { tipo: "copiar" }
  | { tipo: "novo-relatorio" }
  | { tipo: "sair" }
  | { tipo: "ajuda" }
  | { tipo: "confirmar" }
  | { tipo: "cancelar" };


/** Acções que só executam depois de um "confirmar". */
export const COMANDOS_DESTRUTIVOS: ReadonlySet<Comando["tipo"]> = new Set([
  "apagar-amostra",
  "novo-relatorio",
  "sair",
]);

export const PALAVRA_ACTIVACAO = "App";

const NUMEROS: Record<string, number> = {
  zero: 0,
  um: 1,
  uma: 1,
  dois: 2,
  duas: 2,
  tres: 3,
  quatro: 4,
  cinco: 5,
  seis: 6,
  meia: 6,
  sete: 7,
  oito: 8,
  nove: 9,
  dez: 10,
  onze: 11,
  doze: 12,
  treze: 13,
  catorze: 14,
  quatorze: 14,
  quinze: 15,
  dezasseis: 16,
  dezesseis: 16,
  dezassete: 17,
  dezessete: 17,
  dezoito: 18,
  dezanove: 19,
  dezenove: 19,
  vinte: 20,
  trinta: 30,
  quarenta: 40,
  cinquenta: 50,
  sessenta: 60,
  setenta: 70,
  oitenta: 80,
  noventa: 90,
  cem: 100,
  cento: 100,
  duzentos: 200,
  trezentos: 300,
  quatrocentos: 400,
  quinhentos: 500,
  seiscentos: 600,
  setecentos: 700,
  oitocentos: 800,
  novecentos: 900,
  mil: 1000,
};


const LETRAS_DITADAS: Record<string, string> = {
  alfa: "A",
  bravo: "B",
  charlie: "C",
  delta: "D",
  eco: "E",
  echo: "E",
  foxtrot: "F",
  golf: "G",
  hotel: "H",
  india: "I",
  juliet: "J",
  kilo: "K",
  lima: "L",
  mike: "M",
  november: "N",
  oscar: "O",
  papa: "P",
  quebec: "Q",
  romeu: "R",
  romeo: "R",
  sierra: "S",
  tango: "T",
  uniform: "U",
  victor: "V",
  whiskey: "W",
  xray: "X",
  yankee: "Y",
  zulu: "Z",

  // Nomes das letras em português (já normalizados, sem acentos).
  be: "B",
  ce: "C",
  de: "D",
  efe: "F",
  ge: "G",
  je: "G",
  aga: "H",
  aca: "H",
  jota: "J",
  capa: "K",
  ka: "K",
  ele: "L",
  eme: "M",
  ene: "N",
  pe: "P",
  que: "Q",
  erre: "R",
  esse: "S",
  te: "T",
  ve: "V",
  dablio: "W",
  dabliu: "W",
  xis: "X",
  ipsilon: "Y",
  ze: "Z",
};

/** Separadores que podem ser ditados dentro de um código. */
const SEPARADORES: Record<string, string> = {
  traco: "-",
  hifen: "-",
  menos: "-",
  barra: "/",
  ponto: ".",
};


export const normalizar = (frase: string) =>
  frase
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const VARIANTES_ACTIVACAO = [
  "app",
  "ap",
  "apo",
  "apps",
  "ape",
  "up",
  "aplicacao",
  "patologia geral",
  "patologia",
  "patologia geral app",
];

/** Palavras de enchimento que podem envolver o comando. */
const FILLERS = [
  "por favor",
  "agora",
  "ja",
  "entao",
  "ok",
  "obrigado",
  "obrigada",
  "faz favor",
];

const limparFillers = (t: string) => {
  let saida = t;
  let mudou = true;

  while (mudou) {
    mudou = false;
    for (const f of FILLERS) {
      if (saida.startsWith(`${f} `)) {
        saida = saida.slice(f.length + 1).trim();
        mudou = true;
      }
      if (saida.endsWith(` ${f}`)) {
        saida = saida.slice(0, -(f.length + 1)).trim();
        mudou = true;
      }
      if (saida === f) {
        saida = "";
        mudou = true;
      }
    }
  }

  return saida;
};

/** Devolve o texto do comando quando a frase começa pela palavra de activação. */
export function extrairComando(frase: string): string | null {
  const n = normalizar(frase);
  for (const v of VARIANTES_ACTIVACAO) {
    if (n === v) return "";
    if (n.startsWith(`${v} `)) return n.slice(v.length + 1).trim();
  }
  return null;
}


const numeroDe = (palavra: string | undefined): number | undefined => {
  if (!palavra) return undefined;
  if (/^\d+$/.test(palavra)) return Number(palavra);
  return NUMEROS[palavra];
};

/**
 * Converte a leitura soletrada de um código em texto.
 *
 * "cê vinte e seis agá zero zero zero zero" → "C26H0000"
 * "dê eme pê traço zero zero um"            → "DMP-001"
 */
function juntarCodigo(texto: string): string {
  const partes = texto.split(" ").filter(Boolean);

  let saida = "";
  let pendente: number | null = null;

  const descarregar = () => {
    if (pendente !== null) {
      saida += String(pendente);
      pendente = null;
    }
  };

  for (const p of partes) {
    // "vinte e seis" — o "e" liga dois números, senão é ignorado.
    if (p === "e") continue;

    if (p === "espaco") {
      descarregar();
      continue;
    }

    if (p in SEPARADORES) {
      descarregar();
      saida += SEPARADORES[p];
      continue;
    }

    if (/^\d+$/.test(p)) {
      descarregar();
      saida += p;
      continue;
    }

    const valor = NUMEROS[p];

    if (valor !== undefined) {
      if (
        pendente !== null &&
        pendente >= 20 &&
        pendente % 10 === 0 &&
        valor < pendente
      ) {
        pendente += valor;
      } else {
        descarregar();
        pendente = valor;
      }
      continue;
    }

    descarregar();

    const letra = LETRAS_DITADAS[p];
    saida += letra ?? p.toUpperCase();
  }

  descarregar();

  return saida.replace(/\s+/g, "").toUpperCase();
}


function lerResumo(texto: string): ResumoComando | null {
  const resumo: ResumoComando = {};

  const frag = texto.match(/(\d+|[a-z]+)\s+fragmentos?/);
  const fragN = numeroDe(frag?.[1]);
  if (fragN !== undefined) resumo.fragmentos = fragN;

  const blo = texto.match(/(\d+|[a-z]+)\s+blocos?/);
  const bloN = numeroDe(blo?.[1]);
  if (bloN !== undefined) resumo.blocos = bloN;

  if (/nao seccionado/.test(texto)) resumo.seccionado = false;
  else if (/seccionado/.test(texto)) resumo.seccionado = true;

  if (/inclusao total|total/.test(texto)) resumo.inclusao = "total";
  if (/reserva/.test(texto)) resumo.inclusao = "reserva";

  if (/31057|31 057/.test(texto)) resumo.codigoFaturacao = "31057";
  if (/31077|31 077/.test(texto)) resumo.codigoFaturacao = "31077";

  return Object.keys(resumo).length > 0 ? resumo : null;
}

/**
 * Interpreta o texto que vem depois da palavra de activação.
 * Devolve `null` quando nenhum comando é reconhecido.
 */
export function interpretarComando(texto: string): Comando | null {
  const t = limparFillers(normalizar(texto));
  if (!t) return null;

  if (/^(confirmar|confirmo|sim|confirma)$/.test(t)) return { tipo: "confirmar" };
  if (/^(cancelar|cancela|nao|anular)$/.test(t)) return { tipo: "cancelar" };

  if (/^(ajuda|que comandos|comandos|lista de comandos)$/.test(t))
    return { tipo: "ajuda" };

  if (/^(abrir|mostrar|ver|abre) (o |do )?(diagrama|esquema)( do orgao| do órgão| da peca| da peça)?$/.test(t))
    return { tipo: "diagrama", aberto: true };

  if (/^(fechar|esconder|fecha|ocultar) (o )?(diagrama|esquema)$/.test(t))
    return { tipo: "diagrama", aberto: false };

  const apagarLegenda = t.match(
    /^(?:apagar|remover|eliminar) (?:a )?legenda (?:do )?bloco (\d+|[a-z]+)$/,
  );
  const blocoApagar = numeroDe(apagarLegenda?.[1]);
  if (blocoApagar !== undefined && blocoApagar >= 1)
    return { tipo: "apagar-legenda-bloco", bloco: blocoApagar };

  const legenda = t.match(
    /^legenda(?: de| do| da)?\s+blocos?\s+(\d+|[a-z]+)(?:\s+(?:a|ate|e)\s+(\d+|[a-z]+))?\s+(.+)$/,
  );

  if (legenda) {
    const inicio = numeroDe(legenda[1]);
    const fim = numeroDe(legenda[2]) ?? inicio;
    const descricao = (legenda[3] ?? "").trim();

    if (
      inicio !== undefined &&
      inicio >= 1 &&
      fim !== undefined &&
      fim >= inicio &&
      fim - inicio < 50 &&
      descricao
    ) {
      const blocos: number[] = [];
      for (let b = inicio; b <= fim; b++) blocos.push(b);

      return {
        tipo: "legenda-bloco",
        blocos,
        descricao: descricao.charAt(0).toUpperCase() + descricao.slice(1),
      };
    }
  }


  const analise = t.match(
    /^(?:(?:numero|n|numero de|codigo|codigo de|referencia|referencia de)\s+)?(?:da\s+|de\s+|do\s+)?analise(?:\s+numero)?\s+(.+)$/,
  );
  if (analise?.[1]) {
    const valor = juntarCodigo(analise[1]);
    if (valor) return { tipo: "analise", valor };
  }

  if (
    /^(iniciar|comecar|comeca|inicia|gravar|grava|retomar|continuar)(\s+(a\s+)?(gravacao|gravar|ditado|o ditado))?$/.test(
      t,
    )
  )
    return { tipo: "iniciar-gravacao" };

  if (
    /^(parar|para|pare|parem|terminar|termina|termine|stop|fim|acabar|acaba)(\s+(a\s+|de\s+|o\s+)?(gravacao|gravar|ditado|ditar))?$/.test(
      t,
    )
  )
    return { tipo: "parar-gravacao" };


  if (/^(nova amostra|adicionar amostra|proxima amostra)$/.test(t))
    return { tipo: "nova-amostra" };

  const irAmostra = t.match(/^(?:ir para |abrir |seleccionar |selecionar )?amostra (\d+|[a-z]+)$/);
  const indice = numeroDe(irAmostra?.[1]);
  if (indice !== undefined && indice >= 1)
    return { tipo: "ir-amostra", indice };

  if (/^(apagar|remover|eliminar) (a )?amostra$/.test(t))
    return { tipo: "apagar-amostra" };

  if (/^(separar amostras|separar|dividir amostras)$/.test(t))
    return { tipo: "separar" };

  if (/^(otimizar|optimizar|otimiza|otimizar relatorio|otimizar com ia|optimizar com ia)$/.test(t))
    return { tipo: "otimizar" };

  if (/^(guardar|guarda|gravar relatorio|guardar relatorio)$/.test(t))
    return { tipo: "guardar" };

  if (/^(exportar|exporta|exportar word|exportar documento|exportar para word)$/.test(t))
    return { tipo: "exportar" };

  if (/^(copiar|copia|copiar texto)$/.test(t)) return { tipo: "copiar" };

  if (/^(novo relatorio|limpar|limpa|apagar tudo)$/.test(t))
    return { tipo: "novo-relatorio" };

  if (/^(terminar sessao|sair|fechar sessao|logout)$/.test(t))
    return { tipo: "sair" };

  if (/^resumo tecnico\b/.test(t) || /\b(fragmentos?|blocos?)\b/.test(t)) {
    const resumo = lerResumo(t);
    if (resumo) return { tipo: "resumo", resumo };
  }

  // Tolerância final: frases com palavras a mais ("parar a gravação já", …).
  if (/\b(parar|pare|para|terminar|termina|stop|fim)\b/.test(t))
    return { tipo: "parar-gravacao" };

  if (/\b(iniciar|comecar|inicia|comeca)\b.*\b(gravacao|gravar|ditado)\b/.test(t))
    return { tipo: "iniciar-gravacao" };

  return null;
}


/** Lista mostrada no diálogo de ajuda. */
export const LISTA_COMANDOS: { dizer: string; faz: string }[] = [
  { dizer: "App, análise C26H0000", faz: "Preenche o n.º da análise" },
  {
    dizer: "App, análise cê vinte e seis agá zero zero zero zero",
    faz: "Mesmo código, ditado letra a letra (C26H0000)",
  },
  {
    dizer: "App, análise dê eme pê traço zero zero um",
    faz: "Códigos com traço ou barra (DMP-001)",
  },

  { dizer: "App, iniciar gravação", faz: "Começa a gravar" },
  { dizer: "App, parar", faz: "Pára e transcreve" },
  { dizer: "App, nova amostra", faz: "Cria uma amostra" },
  { dizer: "App, amostra dois", faz: "Muda para essa amostra" },
  { dizer: "App, apagar amostra", faz: "Remove a amostra activa (confirmar)" },
  { dizer: "App, separar amostras", faz: "Separa o ditado em amostras" },
  {
    dizer: "App, legenda bloco um margem proximal",
    faz: "Escreve a legenda desse bloco",
  },
  {
    dizer: "App, legenda blocos dois a quatro parede posterior",
    faz: "Mesma legenda para vários blocos",
  },
  {
    dizer: "App, apagar legenda bloco três",
    faz: "Remove a legenda desse bloco",
  },
  { dizer: "App, abrir diagrama", faz: "Mostra o esquema do órgão" },
  { dizer: "App, fechar diagrama", faz: "Esconde o esquema" },

  {
    dizer: "App, resumo técnico 3 fragmentos 2 blocos seccionado total",
    faz: "Preenche o resumo técnico",
  },
  { dizer: "App, otimizar", faz: "Otimiza o relatório com IA" },
  { dizer: "App, guardar", faz: "Guarda o relatório" },
  { dizer: "App, exportar", faz: "Gera o ficheiro Word" },
  { dizer: "App, copiar", faz: "Copia o texto" },
  { dizer: "App, novo relatório", faz: "Limpa tudo (confirmar)" },
  { dizer: "App, terminar sessão", faz: "Sai da conta (confirmar)" },
  { dizer: "App, ajuda", faz: "Mostra esta lista" },
];
