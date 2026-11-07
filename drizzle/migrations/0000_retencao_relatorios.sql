ALTER TABLE public.relatorios_transcritos ADD COLUMN IF NOT EXISTS expira_em timestamptz;
ALTER TABLE public.relatorios_transcritos ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE TABLE IF NOT EXISTS public.configuracoes_medico (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  medico_id uuid NOT NULL UNIQUE,
  prazo_reter_dias integer NOT NULL DEFAULT 90,
  base_prazo text NOT NULL DEFAULT 'ultima_edicao',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.configuracoes_medico TO authenticated;
GRANT ALL ON public.configuracoes_medico TO service_role;
ALTER TABLE public.configuracoes_medico ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Médico gere a sua configuração" ON public.configuracoes_medico
  FOR ALL TO authenticated USING (medico_id = auth.uid()) WITH CHECK (medico_id = auth.uid());

CREATE OR REPLACE FUNCTION public.apagar_relatorios_expirados()
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  DELETE FROM public.relatorios_transcritos WHERE expira_em IS NOT NULL AND expira_em < now();
$$;
REVOKE EXECUTE ON FUNCTION public.apagar_relatorios_expirados() FROM PUBLIC, anon, authenticated;