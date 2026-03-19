-- Add observations column to data_table_rows for client annotations
ALTER TABLE public.data_table_rows
  ADD COLUMN IF NOT EXISTS observations text DEFAULT NULL;

-- Allow clients to UPDATE their own company data_table_rows (for observations)
CREATE POLICY "Clients can update own company data_table_rows"
  ON public.data_table_rows FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.company_services cs
      WHERE cs.id = data_table_rows.company_service_id
        AND cs.company_id = public.get_user_company_id(auth.uid())
        AND cs.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.company_services cs
      WHERE cs.id = data_table_rows.company_service_id
        AND cs.company_id = public.get_user_company_id(auth.uid())
        AND cs.is_active = true
    )
  );
