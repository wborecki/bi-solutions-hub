-- ============================================================
-- 1. Add 'client_admin' to app_role enum
-- ============================================================
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'client_admin';

-- ============================================================
-- 2. Create rls_rules table (per company)
-- ============================================================
CREATE TABLE IF NOT EXISTS rls_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  pbi_role TEXT,            -- Power BI RLS role name
  looker_filters JSONB,     -- Looker filter params e.g. {"region": "Sul"}
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_rls_rules_company ON rls_rules(company_id);

-- ============================================================
-- 3. Create user_rls_rules junction table
-- ============================================================
CREATE TABLE IF NOT EXISTS user_rls_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rls_rule_id UUID NOT NULL REFERENCES rls_rules(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, rls_rule_id)
);

CREATE INDEX idx_user_rls_rules_user ON user_rls_rules(user_id);
CREATE INDEX idx_user_rls_rules_rule ON user_rls_rules(rls_rule_id);

-- ============================================================
-- 4. RLS for rls_rules (admins only for now)
-- ============================================================
ALTER TABLE rls_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_full_rls_rules" ON rls_rules
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ============================================================
-- 5. RLS for user_rls_rules (admins only for now)
-- ============================================================
ALTER TABLE user_rls_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_full_user_rls_rules" ON user_rls_rules
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Clients: read own rules
CREATE POLICY "clients_read_own_rls_rules" ON user_rls_rules
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================
-- 6. Function to get user's RLS rules for a company
-- ============================================================
CREATE OR REPLACE FUNCTION get_user_rls_for_company(_user_id UUID, _company_id UUID)
RETURNS TABLE(pbi_role TEXT, looker_filters JSONB)
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT r.pbi_role, r.looker_filters
  FROM user_rls_rules ur
  JOIN rls_rules r ON r.id = ur.rls_rule_id
  WHERE ur.user_id = _user_id
    AND r.company_id = _company_id;
$$;
