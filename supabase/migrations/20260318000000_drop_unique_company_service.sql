-- Allow multiple instances of the same service type per company
-- (e.g., multiple data_table services for one company)
ALTER TABLE public.company_services
  DROP CONSTRAINT IF EXISTS company_services_company_id_service_id_key;
