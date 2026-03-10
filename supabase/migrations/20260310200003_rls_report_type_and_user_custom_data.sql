-- 1) Add custom_data field to user profiles (user-level dynamic data)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS custom_data TEXT;

-- 2) Add report_type and company_service_id to rls_rules
ALTER TABLE rls_rules ADD COLUMN IF NOT EXISTS report_type TEXT CHECK (report_type IN ('powerbi', 'looker'));
ALTER TABLE rls_rules ADD COLUMN IF NOT EXISTS company_service_id UUID REFERENCES company_services(id) ON DELETE SET NULL;

-- 3) Create function to get user's RLS rules for a specific service
CREATE OR REPLACE FUNCTION get_user_rls_for_service(_user_id UUID, _company_service_id UUID)
RETURNS TABLE(pbi_role TEXT, pbi_custom_data TEXT, pbi_username TEXT, looker_filters JSONB, report_type TEXT)
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT r.pbi_role, r.pbi_custom_data, r.pbi_username, r.looker_filters, r.report_type
  FROM user_rls_rules ur
  JOIN rls_rules r ON r.id = ur.rls_rule_id
  WHERE ur.user_id = _user_id
    AND (r.company_service_id = _company_service_id OR r.company_service_id IS NULL);
$$;

-- 4) Update existing function to also return report_type
DROP FUNCTION IF EXISTS get_user_rls_for_company(UUID, UUID);
CREATE OR REPLACE FUNCTION get_user_rls_for_company(_user_id UUID, _company_id UUID)
RETURNS TABLE(pbi_role TEXT, pbi_custom_data TEXT, pbi_username TEXT, looker_filters JSONB, report_type TEXT)
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT r.pbi_role, r.pbi_custom_data, r.pbi_username, r.looker_filters, r.report_type
  FROM user_rls_rules ur
  JOIN rls_rules r ON r.id = ur.rls_rule_id
  WHERE ur.user_id = _user_id
    AND r.company_id = _company_id;
$$;
