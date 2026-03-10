-- Adicionar tipo data_table ao enum service_type
ALTER TYPE public.service_type ADD VALUE IF NOT EXISTS 'data_table';

-- Tabela para armazenar linhas de dados dos clientes (serviço Tabela de Dados)
CREATE TABLE IF NOT EXISTS public.data_table_rows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_service_id uuid NOT NULL REFERENCES public.company_services(id) ON DELETE CASCADE,
  data jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_data_table_rows_cs ON public.data_table_rows(company_service_id);

-- RLS
ALTER TABLE public.data_table_rows ENABLE ROW LEVEL SECURITY;

-- Admins podem tudo
CREATE POLICY "Admins full access on data_table_rows"
  ON public.data_table_rows FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Clientes podem ler linhas dos serviços da sua empresa
CREATE POLICY "Clients can read own company data_table_rows"
  ON public.data_table_rows FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.company_services cs
      WHERE cs.id = data_table_rows.company_service_id
        AND cs.company_id = public.get_user_company_id(auth.uid())
        AND cs.is_active = true
    )
  );
