# 🚀 Guia de Deploy - Vercel

## Preparação Pré-Deploy

### ✅ Checklist

- [x] Build local testado (`npm run build && npm run preview`)
- [x] Testes passando (`npm test`)
- [x] Lint sem erros (`npm run lint`)
- [x] Assets otimizados (WebP, compressão)
- [x] SEO configurado (meta tags, sitemap, robots.txt)
- [x] Configuração Vercel criada (`vercel.json`)

## Deploy Automático via GitHub

### 1. Conecte o Repositório

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Selecione "Import Git Repository"
3. Escolha o repositório `Solutions-in-BI/bi-solutions-hub`
4. Clique em "Import"

### 2. Configure o Projeto

A Vercel detectará automaticamente:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

**Não é necessário alterar nada!** ✅

### 3. Variáveis de Ambiente (Opcional)

Se precisar adicionar variáveis:
- Acesse: Project Settings → Environment Variables
- Adicione variáveis com prefixo `VITE_`
- Exemplo: `VITE_API_URL`, `VITE_GA_ID`

### 4. Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (≈ 1-2 minutos)
3. Seu site estará disponível em: `https://seu-projeto.vercel.app`

## Deploy via CLI

### Instalação

```bash
npm i -g vercel
```

### Login

```bash
vercel login
```

### Deploy Preview

```bash
vercel
```

### Deploy Produção

```bash
vercel --prod
```

## Domínio Personalizado

### Adicionar Domínio

1. Acesse: Project → Settings → Domains
2. Adicione seu domínio: `solutionsinbi.com.br`
3. Configure DNS conforme instruções da Vercel:

**Opção A - CNAME (recomendado):**
```
CNAME: www → cname.vercel-dns.com
A: @ → 76.76.21.21
```

**Opção B - Nameservers:**
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

4. Aguarde propagação DNS (até 48h, geralmente < 1h)

## Configurações Avançadas

### Headers de Segurança

Já configurados no `vercel.json`:
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: DENY
- ✅ X-XSS-Protection: 1; mode=block
- ✅ Referrer-Policy: strict-origin-when-cross-origin
- ✅ Permissions-Policy (Camera, Mic, Geolocation bloqueados)

### Cache

Assets estáticos (`/assets/*`):
- Cache: 1 ano (immutable)
- Compressão Brotli/Gzip automática

### SPA Routing

Todas as rotas redirecionam para `index.html` (já configurado)

### Região

Deploy na região **GRU1** (São Paulo, Brasil) para melhor latência

## Performance

### Métricas Esperadas

- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.5s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1

### Otimizações Aplicadas

- ✅ Code splitting automático
- ✅ Tree shaking
- ✅ Minificação com Terser
- ✅ Compressão Brotli (Vercel)
- ✅ Logos WebP otimizados
- ✅ Lazy loading de componentes
- ✅ Cache agressivo de assets

## Monitoramento

### Vercel Analytics

Habilitado automaticamente:
- Page views
- Web Vitals
- Visitor insights

Acesse em: Project → Analytics

### Speed Insights

Habilite em: Project → Settings → Speed Insights

## Troubleshooting

### Build falha

```bash
# Limpe cache e reinstale
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Rotas 404

Verifique `vercel.json`:
```json
"rewrites": [{"source": "/(.*)", "destination": "/index.html"}]
```

### Assets não carregam

Certifique-se que paths são relativos:
```typescript
// ✅ Correto
import logo from "@/assets/logo.webp"

// ❌ Evite
import logo from "/src/assets/logo.webp"
```

## Comandos Úteis

```bash
# Ver logs em tempo real
vercel logs

# Listar deploys
vercel ls

# Promover deploy para produção
vercel promote <deployment-url>

# Reverter deploy
vercel rollback

# Remover projeto
vercel remove
```

## Suporte

- Documentação: https://vercel.com/docs
- Status: https://vercel-status.com
- Support: support@vercel.com
