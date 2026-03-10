-- Tabela de controle de cache para data_table com fonte externa
CREATE TABLE IF NOT EXISTS public.data_table_cache (
  company_service_id uuid PRIMARY KEY REFERENCES public.company_services(id) ON DELETE CASCADE,
  cached_at timestamptz NOT NULL DEFAULT now(),
  row_count integer NOT NULL DEFAULT 0,
  error text,
  refreshing boolean NOT NULL DEFAULT false
);

-- RLS
ALTER TABLE public.data_table_cache ENABLE ROW LEVEL SECURITY;

-- Admins full access
CREATE POLICY "Admins full access on data_table_cache"
  ON public.data_table_cache FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Clientes podem ler cache status dos serviços da sua empresa
CREATE POLICY "Clients can read own company data_table_cache"
  ON public.data_table_cache FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.company_services cs
      WHERE cs.id = data_table_cache.company_service_id
        AND cs.company_id = public.get_user_company_id(auth.uid())
        AND cs.is_active = true
    )
  );
