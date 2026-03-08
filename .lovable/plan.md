

## Plano: Portal do Cliente — Login + Chamados + Documentos

### Visão Geral

Portal completo para clientes acessarem serviços da SBI, com autenticação, sistema de chamados, upload de documentos organizados por pastas, e suporte multi-usuário por empresa.

### Pré-requisito

Conectar o Supabase ao projeto (via ícone Supabase no preview).

---

### 1. Banco de Dados (Supabase Migrations)

**Tabelas a criar:**

```text
companies
├── id (uuid, PK)
├── name (text)
├── slug (text, unique)
├── created_at (timestamptz)

profiles
├── id (uuid, PK, FK → auth.users)
├── company_id (uuid, FK → companies)
├── full_name (text)
├── email (text)
├── avatar_url (text)
├── created_at (timestamptz)

user_roles
├── id (uuid, PK)
├── user_id (uuid, FK → auth.users)
├── role (app_role enum: admin, client)

tickets (chamados)
├── id (uuid, PK)
├── company_id (uuid, FK → companies)
├── created_by (uuid, FK → auth.users)
├── title (text)
├── description (text)
├── status (enum: aberto, em_andamento, resolvido, fechado)
├── priority (enum: baixa, media, alta, urgente)
├── created_at / updated_at

ticket_messages (respostas nos chamados)
├── id (uuid, PK)
├── ticket_id (uuid, FK → tickets)
├── author_id (uuid, FK → auth.users)
├── content (text)
├── created_at

documents (metadados dos arquivos)
├── id (uuid, PK)
├── company_id (uuid, FK → companies)
├── uploaded_by (uuid, FK → auth.users)
├── folder_path (text, ex: "contratos/2024")
├── file_name (text)
├── file_url (text)
├── file_size (bigint)
├── mime_type (text)
├── created_at
```

**RLS:** Cada tabela terá políticas baseadas em `company_id` do usuário (clientes veem apenas dados da sua empresa) e `has_role()` para admin ver tudo.

**Storage bucket:** `documents` (privado, com RLS por empresa).

---

### 2. Página de Login (Split Layout)

- **Rota:** `/portal/login`
- **Layout dividido:** Lado esquerdo com branding SBI, explicação do portal e benefícios. Lado direito com formulário de login (email + senha).
- **Funcionalidades:** Login, "Esqueci minha senha" (com fluxo de reset via email), redirecionamento pós-login.
- **Página `/portal/reset-password`** para definir nova senha.
- Sem cadastro público (admin cria os usuários).

---

### 3. Portal do Cliente (Área Logada)

**Layout:** Sidebar com navegação + área principal de conteúdo.

**Páginas:**

- **Dashboard** (`/portal`) — Resumo: chamados abertos, documentos recentes, atalhos rápidos
- **Chamados** (`/portal/chamados`) — Lista de chamados com filtros (status, prioridade). Abertura de novo chamado. Detalhes do chamado com timeline de mensagens.
- **Documentos** (`/portal/documentos`) — Navegação por pastas (criação de pastas, upload de arquivos). Visualização e download. Organização hierárquica.
- **Perfil** (`/portal/perfil`) — Editar nome, trocar senha.

---

### 4. Painel Admin

**Páginas adicionais para role `admin`:**

- **Gerenciar Empresas** — CRUD de empresas
- **Gerenciar Usuários** — Criar usuários, vincular a empresa, definir role
- **Ver todos os chamados** — De todas as empresas, com filtros
- **Ver todos os documentos** — Acesso total

---

### 5. Arquivos a Criar/Editar

```text
src/
├── integrations/supabase/    (gerado pela conexão)
├── contexts/AuthContext.tsx
├── components/portal/
│   ├── PortalLayout.tsx      (sidebar + header logado)
│   ├── ProtectedRoute.tsx
│   ├── TicketList.tsx
│   ├── TicketDetail.tsx
│   ├── TicketForm.tsx
│   ├── DocumentBrowser.tsx
│   ├── DocumentUpload.tsx
│   ├── FolderTree.tsx
│   └── AdminUserForm.tsx
├── pages/portal/
│   ├── Login.tsx             (split layout)
│   ├── ResetPassword.tsx
│   ├── Dashboard.tsx
│   ├── Chamados.tsx
│   ├── ChamadoDetalhe.tsx
│   ├── Documentos.tsx
│   └── Perfil.tsx
├── pages/admin/
│   ├── Empresas.tsx
│   ├── Usuarios.tsx
│   └── AdminChamados.tsx
```

**App.tsx:** Adicionar rotas `/portal/*` e `/admin/*` com proteção por auth e role.

---

### 6. Ordem de Implementação

1. Migrations (tabelas + RLS + storage bucket)
2. Auth context + página de login split
3. Reset de senha
4. Layout do portal (sidebar + protected routes)
5. Dashboard do cliente
6. Sistema de chamados (CRUD + mensagens)
7. Sistema de documentos (upload + pastas)
8. Painel admin (empresas, usuários, visão geral)

