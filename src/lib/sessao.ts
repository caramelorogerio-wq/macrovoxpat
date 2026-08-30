import { supabase } from "@/integrations/supabase/client";

const MARGEM_SEGUNDOS = 90;

/**
 * Devolve uma sessão válida, renovando-a quando está expirada ou quase a
 * expirar. Devolve null quando não há forma de obter sessão válida.
 */
export async function garantirSessao() {
  const { data } = await supabase.auth.getSession();
  const sessao = data.session;

  if (!sessao) {
    const renovada = await supabase.auth.refreshSession();
    return renovada.data.session ?? null;
  }

  const agora = Math.floor(Date.now() / 1000);
  const expiraEm = sessao.expires_at ?? 0;

  if (expiraEm - agora <= MARGEM_SEGUNDOS) {
    const renovada = await supabase.auth.refreshSession();
    return renovada.data.session ?? null;
  }

  return sessao;
}

function eErroDeAutenticacao(erro: unknown) {
  if (!erro || typeof erro !== "object") return false;
  const e = erro as { code?: string; status?: number; message?: string };
  if (e.status === 401 || e.status === 403) return true;
  if (e.code === "PGRST301" || e.code === "PGRST302") return true;
  const mensagem = (e.message ?? "").toLowerCase();
  return (
    mensagem.includes("jwt") ||
    mensagem.includes("token") ||
    mensagem.includes("unauthorized")
  );
}

/**
 * Executa um pedido à base de dados garantindo sessão válida e, em caso de
 * erro de autenticação, renova a sessão e repete uma vez.
 */
export async function comSessao<T extends { error: unknown }>(
  pedido: () => PromiseLike<T>,
): Promise<T> {
  await garantirSessao();

  const primeiro = await pedido();
  if (!eErroDeAutenticacao(primeiro.error)) return primeiro;

  const renovada = await supabase.auth.refreshSession();
  if (!renovada.data.session) return primeiro;

  return pedido();
}
