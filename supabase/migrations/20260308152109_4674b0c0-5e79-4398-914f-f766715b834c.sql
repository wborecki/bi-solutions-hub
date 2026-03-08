-- Fix company_services policies: drop restrictive, recreate as permissive
DROP POLICY IF EXISTS "Admins can manage company_services" ON public.company_services;
DROP POLICY IF EXISTS "Clients can view own company services" ON public.company_services;

CREATE POLICY "Admins can manage company_services"
  ON public.company_services FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view own company services"
  ON public.company_services FOR SELECT TO authenticated
  USING (company_id = get_user_company_id(auth.uid()));

-- Fix services policies
DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
DROP POLICY IF EXISTS "Authenticated users can view services" ON public.services;

CREATE POLICY "Admins can manage services"
  ON public.services FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can view services"
  ON public.services FOR SELECT TO authenticated
  USING (true);

-- Fix companies policies
DROP POLICY IF EXISTS "Admins can manage companies" ON public.companies;
DROP POLICY IF EXISTS "Clients can view their company" ON public.companies;

CREATE POLICY "Admins can manage companies"
  ON public.companies FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view their company"
  ON public.companies FOR SELECT TO authenticated
  USING (id = get_user_company_id(auth.uid()));