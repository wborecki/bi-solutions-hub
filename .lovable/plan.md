

## Plano: Gestão de Serviços e Relatórios BI por Cliente

### Contexto

Você quer que a plataforma permita:
1. **Cadastrar serviços** (ex: Dashboards Power BI, Relatórios Looker, Jurimetria, etc. — seus ~10 serviços)
2. **Vincular serviços a cada empresa/cliente** com configurações específicas (ex: URL do embed do Looker/Power BI)
3. **Exibir relatórios embarcados** (iframe) diretamente no portal do cliente
4. **Cada cliente vê apenas os serviços contratados**

### Arquitetura proposta

```text
┌─────────────────────────────────────────────┐
│  services (catálogo de serviços)            │
│  - id, name, slug, description, icon, type  │
│  - type: 'bi_embed' | 'looker' | 'custom'  │
└──────────────┬──────────────────────────────┘
               │ 1:N
┌──────────────▼──────────────────────────────┐
│  company_services (serviços por empresa)    │
│  - id, company_id, service_id              │
│  - embed_url (URL do Power BI / Looker)    │
│  - config (JSONB - params extras)          │
│  - is_active                               │
└─────────────────────────────────────────────┘
```

### O que será construído

**1. Banco de dados (2 tabelas novas)**
- `services` — catálogo dos seus serviços (admin cadastra)
- `company_services` — vincula serviço + empresa + URL de embed
- RLS: admin gerencia tudo; cliente vê apenas os da sua empresa

**2. Admin: Gestão de Serviços**
- Nova tela `/portal/admin/servicos` para CRUD do catálogo
- Na tela de Empresas, botão para vincular/desvincular serviços e configurar URL de embed por empresa

**3. Portal do Cliente: Aba "Serviços"**
- Nova seção na sidebar: **Serviços**
- Lista os serviços contratados pelo cliente
- Ao clicar em um serviço tipo BI/Looker, abre a página com **iframe embarcado** do relatório
- Serviços sem embed mostram descrição + status

**4. Dashboard atualizado**
- Card com contagem de serviços ativos

### Integração Power BI e Looker

Ambas as plataformas suportam embed via URL pública ou com token:
- **Power BI**: Publish to Web gera uma URL de embed pública (`app.powerbi.com/view?r=...`)
- **Looker Studio**: Compartilhar > Incorporar gera URL de embed (`lookerstudio.google.com/embed/...`)

O admin cadastra a URL de embed de cada relatório por empresa. O portal renderiza via `<iframe>`. Não é necessário API key — usa URLs de embed públicas.

### Detalhes técnicos

- Tipo do serviço como enum: `bi_embed`, `looker_embed`, `document`, `custom`
- JSONB `config` para parâmetros extras (filtros, dimensões do iframe, etc.)
- Sidebar dinâmica: lista serviços ativos do cliente abaixo do menu fixo
- Página `/portal/servicos/:id` com iframe responsivo full-width

