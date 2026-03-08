
-- Drop and recreate policies as PERMISSIVE for company_services
DROP POLICY IF EXISTS "Admins can manage company_services" ON public.company_services;
DROP POLICY IF EXISTS "Clients can view own company services" ON public.company_services;

CREATE POLICY "Admins can manage company_services" ON public.company_services
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients can view own company services" ON public.company_services
FOR SELECT TO authenticated
USING (company_id = public.get_user_company_id(auth.uid()));

-- Drop and recreate policies as PERMISSIVE for companies
DROP POLICY IF EXISTS "Admins can manage companies" ON public.companies;
DROP POLICY IF EXISTS "Clients can view their company" ON public.companies;

CREATE POLICY "Admins can manage companies" ON public.companies
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients can view their company" ON public.companies
FOR SELECT TO authenticated
USING (id = public.get_user_company_id(auth.uid()));

-- Drop and recreate policies as PERMISSIVE for services
DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
DROP POLICY IF EXISTS "Authenticated users can view services" ON public.services;

CREATE POLICY "Admins can manage services" ON public.services
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can view services" ON public.services
FOR SELECT TO authenticated
USING (true);

-- Drop and recreate policies as PERMISSIVE for profiles
DROP POLICY IF EXISTS "Admins can manage profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

CREATE POLICY "Admins can manage profiles" ON public.profiles
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE TO authenticated
USING (id = auth.uid());

-- Drop and recreate policies as PERMISSIVE for documents
DROP POLICY IF EXISTS "Admins can manage all documents" ON public.documents;
DROP POLICY IF EXISTS "Clients can view company documents" ON public.documents;
DROP POLICY IF EXISTS "Clients can upload to company" ON public.documents;
DROP POLICY IF EXISTS "Clients can delete own documents" ON public.documents;

CREATE POLICY "Admins can manage all documents" ON public.documents
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients can view company documents" ON public.documents
FOR SELECT TO authenticated
USING (company_id = public.get_user_company_id(auth.uid()));

CREATE POLICY "Clients can upload to company" ON public.documents
FOR INSERT TO authenticated
WITH CHECK (company_id = public.get_user_company_id(auth.uid()) AND uploaded_by = auth.uid());

CREATE POLICY "Clients can delete own documents" ON public.documents
FOR DELETE TO authenticated
USING (company_id = public.get_user_company_id(auth.uid()) AND uploaded_by = auth.uid());

-- Drop and recreate policies as PERMISSIVE for tickets
DROP POLICY IF EXISTS "Admins can manage all tickets" ON public.tickets;
DROP POLICY IF EXISTS "Clients can view company tickets" ON public.tickets;
DROP POLICY IF EXISTS "Clients can create tickets" ON public.tickets;
DROP POLICY IF EXISTS "Clients can update own tickets" ON public.tickets;

CREATE POLICY "Admins can manage all tickets" ON public.tickets
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients can view company tickets" ON public.tickets
FOR SELECT TO authenticated
USING (company_id = public.get_user_company_id(auth.uid()));

CREATE POLICY "Clients can create tickets" ON public.tickets
FOR INSERT TO authenticated
WITH CHECK (company_id = public.get_user_company_id(auth.uid()) AND created_by = auth.uid());

CREATE POLICY "Clients can update own tickets" ON public.tickets
FOR UPDATE TO authenticated
USING (company_id = public.get_user_company_id(auth.uid()) AND created_by = auth.uid());

-- Drop and recreate policies as PERMISSIVE for ticket_messages
DROP POLICY IF EXISTS "Admins can manage all messages" ON public.ticket_messages;
DROP POLICY IF EXISTS "Users can view messages for their tickets" ON public.ticket_messages;
DROP POLICY IF EXISTS "Users can create messages on their tickets" ON public.ticket_messages;

CREATE POLICY "Admins can manage all messages" ON public.ticket_messages
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view messages for their tickets" ON public.ticket_messages
FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM tickets t WHERE t.id = ticket_messages.ticket_id AND (t.company_id = public.get_user_company_id(auth.uid()) OR public.has_role(auth.uid(), 'admin'))));

CREATE POLICY "Users can create messages on their tickets" ON public.ticket_messages
FOR INSERT TO authenticated
WITH CHECK (author_id = auth.uid() AND EXISTS (SELECT 1 FROM tickets t WHERE t.id = ticket_messages.ticket_id AND (t.company_id = public.get_user_company_id(auth.uid()) OR public.has_role(auth.uid(), 'admin'))));

-- Drop and recreate policies as PERMISSIVE for user_roles
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own role" ON public.user_roles;

CREATE POLICY "Admins can manage roles" ON public.user_roles
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own role" ON public.user_roles
FOR SELECT TO authenticated
USING (user_id = auth.uid());
