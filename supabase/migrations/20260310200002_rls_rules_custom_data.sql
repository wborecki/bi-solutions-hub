-- Add pbi_custom_data and pbi_username to rls_rules
ALTER TABLE rls_rules ADD COLUMN IF NOT EXISTS pbi_custom_data TEXT;
ALTER TABLE rls_rules ADD COLUMN IF NOT EXISTS pbi_username TEXT;

-- Drop and recreate function with new return type
DROP FUNCTION IF EXISTS get_user_rls_for_company(UUID, UUID);

CREATE OR REPLACE FUNCTION get_user_rls_for_company(_user_id UUID, _company_id UUID)
RETURNS TABLE(pbi_role TEXT, pbi_custom_data TEXT, pbi_username TEXT, looker_filters JSONB)
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT r.pbi_role, r.pbi_custom_data, r.pbi_username, r.looker_filters
  FROM user_rls_rules ur
  JOIN rls_rules r ON r.id = ur.rls_rule_id
  WHERE ur.user_id = _user_id
    AND r.company_id = _company_id;
$$;
