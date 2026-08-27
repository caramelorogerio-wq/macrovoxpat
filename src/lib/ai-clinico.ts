export const mimeFor: Record<string, string> = {
  wav: "audio/wav",
  mp3: "audio/mpeg",
  webm: "audio/webm",
  m4a: "audio/mp4",
  ogg: "audio/ogg",
  aac: "audio/aac",
  flac: "audio/flac",
};

// Vocabulário enviado ao modelo de reconhecimento de voz para melhorar a
// grafia de terminologia de macroscopia em anatomia patológica geral.
export const VOCABULARIO =
  "Ditado clínico em português europeu de exame macroscópico em anatomia patológica geral. Terminologia frequente: exame macroscópico, peça operatória, produto de ressecção, produto de excisão, biópsia incisional, biópsia excisional, biópsia por agulha, fragmento, fragmentos, dimensões, pesa, peso, mede, medindo, superfície externa, superfície de secção, cápsula, cápsula íntegra, consistência elástica, consistência firme, consistência mole, coloração acastanhada, esbranquiçada, acinzentada, amarelada, avermelhada, lesão nodular, nódulo, nodularidade, quisto, cavidade, conteúdo mucoso, conteúdo seroso, conteúdo hemorrágico, conteúdo necrótico, material caseoso, área de necrose, hemorragia, fibrose, calcificação, aderências, infiltração, margens de ressecção, margem proximal, margem distal, margem circunferencial, margem profunda, margem lateral, tinta de margens, marcação com tinta, gânglios linfáticos, adenopatias, epíplon, mesentério, mucosa, submucosa, muscular própria, serosa, parede, luz, apêndice, vesícula biliar, cólon, recto, estômago, intestino delgado, fígado, baço, pâncreas, rim, ureter, bexiga, próstata, testículo, útero, colo do útero, endométrio, miométrio, ovário, trompa, mama, tiroide, paratiroide, pulmão, pleura, placenta, cordão umbilical, tecido adiposo, músculo, osso, pele, fixação em formol tamponado, inclusão em parafina, blocos, secções, seccionado na totalidade, incluído na totalidade, milímetros, mm, centímetros, cm, gramas, g.";

export const PROMPT_OTIMIZACAO =
  "És um revisor de relatórios de macroscopia em anatomia patológica geral em Portugal. Recebes uma transcrição bruta de ditado e devolves o mesmo conteúdo corrigido: pontuação e maiúsculas correctas, parágrafos legíveis, correcção de erros de reconhecimento de voz, e terminologia macroscópica escrita segundo o português europeu padrão (pt-PT, sem grafia brasileira). Expande ditados de pontuação (por exemplo 'ponto final', 'vírgula', 'novo parágrafo') na pontuação respectiva. Abrevia unidades conforme a prática clínica: 'milímetros' → 'mm', 'centímetros' → 'cm', 'gramas' → 'g'. Quando \"por\" for usado como separador de dimensões, como em \"10 por 5 mm\", escrever \"10 x 5 mm\". Não substituir \"por\" quando tiver outro significado na frase. Não inventes, não acrescentes, não removas informação clínica, não resumas e não uses markdown. Devolve apenas o texto revisto.";

export async function gatewayError(response: Response) {
  const body = await response.text();
  let message = body;
  try {
    message = JSON.parse(body)?.error?.message ?? body;
  } catch {
    /* texto simples */
  }
  if (response.status === 429) {
    return "Demasiados pedidos em curto espaço de tempo. Tente novamente dentro de momentos.";
  }
  if (response.status === 402) {
    return message || "Créditos de IA esgotados. Adicione créditos para continuar.";
  }
  return message || "Falha no pedido de IA.";
}
