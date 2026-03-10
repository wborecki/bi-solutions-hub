-- Client admin policies (requires enum value 'client_admin' from previous migration)

-- Client admins: read rules of their company
CREATE POLICY "client_admin_read_rls_rules" ON rls_rules
  FOR SELECT USING (
    has_role(auth.uid(), 'client_admin')
    AND company_id = get_user_company_id(auth.uid())
  );

-- Client admins: manage rules for users in their company
CREATE POLICY "client_admin_manage_user_rls_rules" ON user_rls_rules
  FOR ALL USING (
    has_role(auth.uid(), 'client_admin')
    AND user_id IN (
      SELECT p.id FROM profiles p
      WHERE p.company_id = get_user_company_id(auth.uid())
    )
  );

-- Allow client_admin to read profiles of same company
CREATE POLICY "client_admin_read_profiles" ON profiles
  FOR SELECT USING (
    has_role(auth.uid(), 'client_admin')
    AND company_id = get_user_company_id(auth.uid())
  );

-- Allow client_admin to read user_roles for same company users
CREATE POLICY "client_admin_read_user_roles" ON user_roles
  FOR SELECT USING (
    has_role(auth.uid(), 'client_admin')
    AND user_id IN (
      SELECT p.id FROM profiles p
      WHERE p.company_id = get_user_company_id(auth.uid())
    )
  );
