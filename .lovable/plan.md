

# Plano de Correcao Completa do Site - Solutions in BI

## Problemas Identificados

### 1. Classes CSS inexistentes (CRITICO - cores quebradas)
Multiplas paginas usam classes que **nao existem** no design system atual:
- `text-brand-tiffany` / `bg-brand-tiffany` - usado em Blog, Servicos, CasesDeSucesso, Solucoes, SolucaoDetalhe, CTASection
- `bg-gradient-brand` - usado em Servicos, CasesDeSucesso, SolucaoDetalhe, CTASection
- `from-secondary to-brand-tiffany` / `from-brand-tiffany to-primary` - gradientes quebrados em Solucoes e SolucaoDetalhe

Essas classes nao estao definidas no `tailwind.config.ts` nem no `index.css`, entao **nenhuma cor e aplicada** — textos ficam invisiveis ou sem destaque.

### 2. Erros de console (warnings de ref)
- `CTASection` nao usa `forwardRef` mas recebe ref via `useInView`
- Paginas como `Blog` e `BlogPost` usam `CTASection` que gera warning

### 3. Inconsistencias de design entre paginas
- **Index.tsx**: Usa o design system correto (`text-primary`, `bg-primary`, `bg-accent`)
- **Servicos.tsx, CasesDeSucesso.tsx, Solucoes.tsx, SolucaoDetalhe.tsx, Blog.tsx**: Usam classes `brand-tiffany` / `gradient-brand` que nao existem — sao restos de um design system anterior
- **CTASection.tsx**: Inteiramente baseada em `brand-tiffany` / `gradient-brand` (fundo invisivel)

### 4. Pagina 404 em ingles
- NotFound.tsx exibe "Oops! Page not found" e "Return to Home" — deveria estar em portugues

### 5. Header sem fundo no topo
- Quando nao tem scroll, o header fica transparente sem `bg-background`, dificultando leitura em paginas com hero colorido (Servicos, CasesDeSucesso)

### 6. WhatsApp button nao esta no Layout
- O componente `WhatsAppButton` existe mas nao e renderizado em nenhum lugar

### 7. Link de WhatsApp com numero errado no CTASection
- Usa `5547999999999` (placeholder) em vez de `551151920925`

---

## Plano de Implementacao

### Tarefa 1: Adicionar cores `brand-tiffany` e `gradient-brand` ao Tailwind config
Adicionar ao `tailwind.config.ts`:
- `brand-tiffany` como cor (usar o accent/teal existente: `hsl(174, 42%, 51%)` ou `#4DB6AC`)
- Classe utilitaria `bg-gradient-brand` no `index.css` (gradiente de primary para accent)

### Tarefa 2: Corrigir CTASection com forwardRef
Converter `CTASection` para usar `forwardRef` para eliminar o warning de console.

### Tarefa 3: Corrigir numero WhatsApp no CTASection
Trocar `5547999999999` por `551151920925`.

### Tarefa 4: Adicionar WhatsAppButton ao Layout
Incluir `<WhatsAppButton />` no `Layout.tsx`.

### Tarefa 5: Corrigir Header para paginas com hero colorido
Garantir que o header tenha `bg-background/80 backdrop-blur-md` sempre (nao apenas apos scroll), ou adicionar fundo sutil quando no topo.

### Tarefa 6: Traduzir NotFound.tsx para portugues
Texto em PT-BR, usar Layout, manter design consistente.

### Tarefa 7: Revisar consistencia visual geral
- Blog.tsx: trocar `text-brand-tiffany` por `text-accent` e `bg-brand-tiffany` por `bg-accent` nos badges
- Servicos.tsx: mesma substituicao
- CasesDeSucesso.tsx: mesma substituicao
- Solucoes.tsx: ajustar gradientes para usar cores validas
- SolucaoDetalhe.tsx: ajustar gradientes e cores

**Abordagem**: Em vez de adicionar `brand-tiffany` ao config (Tarefa 1), a abordagem mais limpa e substituir TODAS as ocorrencias de `brand-tiffany` por `accent` e `gradient-brand` por `bg-gradient-to-r from-primary to-accent` diretamente nos componentes. Isso mantem o design system coeso e evita duplicacao de tokens.

---

## Resumo das alteracoes por arquivo

| Arquivo | Correcoes |
|---------|-----------|
| `index.css` | Adicionar classe `.bg-gradient-brand` como atalho |
| `Header.tsx` | Fundo sutil no topo |
| `Layout.tsx` | Adicionar WhatsAppButton |
| `NotFound.tsx` | Traduzir para PT-BR, usar Layout |
| `CTASection.tsx` | forwardRef + corrigir WhatsApp + trocar brand-tiffany por accent |
| `Blog.tsx` | Trocar brand-tiffany por accent/primary |
| `Servicos.tsx` | Trocar brand-tiffany e gradient-brand por cores validas |
| `CasesDeSucesso.tsx` | Idem |
| `Solucoes.tsx` | Trocar gradientes quebrados |
| `SolucaoDetalhe.tsx` | Trocar brand-tiffany e gradientes |

Total: ~10 arquivos editados, nenhuma nova dependencia.

