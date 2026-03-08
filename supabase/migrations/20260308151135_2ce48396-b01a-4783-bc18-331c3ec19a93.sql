-- Enum for service types
CREATE TYPE public.service_type AS ENUM ('bi_embed', 'looker_embed', 'document', 'custom');

-- Services catalog
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'BarChart3',
  type service_type NOT NULL DEFAULT 'bi_embed',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage services" ON public.services
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can view services" ON public.services
  FOR SELECT TO authenticated
  USING (true);

-- Company-service link
CREATE TABLE public.company_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  embed_url text NOT NULL DEFAULT '',
  config jsonb NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (company_id, service_id)
);

ALTER TABLE public.company_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage company_services" ON public.company_services
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients can view own company services" ON public.company_services
  FOR SELECT TO authenticated
  USING (company_id = get_user_company_id(auth.uid()));