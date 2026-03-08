

## RLS por Usuário em Relatórios BI Embarcados

### Como funciona o RLS em cada plataforma

**Power BI (Embed com RLS)**
- O "Publish to Web" (URL pública) **não suporta RLS** — qualquer pessoa com o link vê tudo.
- Para RLS, é preciso usar o **Power BI Embedded** (serviço Azure). Uma edge function no backend gera um **embed token** passando a identidade do usuário (email) para o Power BI, que aplica as regras de RLS configuradas no modelo.
- Requer: Azure AD App Registration (client_id + client_secret), Power BI Workspace ID, e capacidade Embedded (ou PPU/Pro license).

**Looker Studio (Gratuito)**
- O Looker Studio gratuito **não suporta RLS nativo em embeds**. Filtros por URL podem ser manipulados pelo usuário.
- Para RLS real, seria necessário o **Looker (pago)** com signed embed URLs.
- Alternativa viável: passar parâmetros de filtro na URL (ex: `?params={"company":"ACME"}`) — não é seguro contra manipulação, mas funciona como conveniência.

### O que será construído

**1. Power BI Embedded com RLS (seguro)**
- Edge function `generate-pbi-token` que:
  - Autentica com Azure AD via client credentials
  - Gera embed token com `EffectiveIdentity` usando o email do usuário logado
  - Retorna `embedUrl` + `accessToken` para o frontend
- Admin configura por empresa: `report_id`, `dataset_id`, `workspace_id` no campo `config` JSONB do `company_services`
- Frontend usa o token gerado (sem iframe simples — usa a Power BI JS SDK ou iframe com token)

**2. Looker Studio com filtros por URL (conveniência)**
- Admin configura a URL base do embed
- O sistema injeta automaticamente parâmetros de filtro na URL (ex: email do usuário, company_id)
- Campo `config` armazena o mapeamento de parâmetros

**3. Alterações no Admin (EmpresaServicos)**
- Para serviços tipo `bi_embed`: campos adicionais para `workspace_id`, `report_id`, `dataset_id` (armazenados no `config` JSONB)
- Para serviços tipo `looker_embed`: campo para mapeamento de filtros URL

**4. Alterações no ServicoDetalhe**
- Power BI: chama a edge function para obter token, renderiza com iframe autenticado
- Looker: injeta parâmetros de filtro na URL antes de renderizar o iframe

**5. Secrets necessários (Power BI)**
- `PBI_TENANT_ID` — Azure AD Tenant ID
- `PBI_CLIENT_ID` — App Registration Client ID  
- `PBI_CLIENT_SECRET` — App Registration Client Secret

### Fluxo do usuário

```text
Cliente acessa Serviço
  ↓
Frontend detecta tipo (bi_embed / looker_embed)
  ↓
bi_embed → chama edge function → gera token com email do usuário → iframe com RLS
looker_embed → injeta filtros na URL → iframe com parâmetros
```

### Limitação importante

O Looker Studio gratuito não oferece RLS verdadeiro — os filtros por URL são uma conveniência, não uma barreira de segurança. Para RLS real no Looker, seria necessário migrar para o Looker Enterprise. O Power BI Embedded, por outro lado, oferece RLS completo e seguro.

