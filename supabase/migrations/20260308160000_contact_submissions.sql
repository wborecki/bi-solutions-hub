-- Tabela para armazenar envios do formulário de contato
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  message text not null,
  created_at timestamptz default now()
);

-- RLS
alter table public.contact_submissions enable row level security;

-- Qualquer pessoa pode inserir (formulário público)
create policy "Anyone can insert contact submissions"
  on public.contact_submissions for insert
  with check (true);

-- Somente admins podem ler
create policy "Admins can read contact submissions"
  on public.contact_submissions for select
  using (public.has_role(auth.uid(), 'admin'));
