

## Redesign: Página de Detalhe da Solução (`SolucaoDetalhe.tsx`)

Objetivo: visual premium, limpo, tech, objetivo -- consistente com o padrão já aplicado nas outras páginas.

### Problemas atuais
- Hero com gradient blob pesado e ícone gigante genérico no lado direito (lazy visual)
- Cards de features com `border-0 shadow-lg` pesados
- Benefícios em grid simples sem hierarquia visual
- Navegação prev/next sem polimento

### Mudanças

**1. Hero -- Clean e Split Layout**
- Fundo `bg-background` limpo, sem blob gradient
- Breadcrumb sutil no topo (Soluções > Nome da Solução)
- Texto esquerda com badge, título com `text-gradient`, descrição
- Direita: ícone em container `bg-muted rounded-3xl` com decoração geométrica sutil (linhas/dots pattern) em vez de gradient block
- Adicionar CTA button (Fale Conosco / Saiba Mais)
- Animações com framer-motion

**2. Features -- Cards Polidos**
- `rounded-2xl border bg-card` com hover shadow suave
- Número em circle `bg-primary/10 text-primary` em vez de square colorido
- Tipografia mais limpa

**3. Benefícios -- Visual Melhorado**
- Fundo `bg-muted/30` mantido
- Cards com `bg-card border rounded-xl` com ícone check em `text-primary` (não accent)
- Grid 2 colunas no mobile, 3 no desktop

**4. Navegação prev/next -- Polida**
- Cards estilizados com nome + subtítulo da solução adjacente
- Border sutil, hover com shadow

**5. CTA Final**
- Usa `CTASection` existente (já com `bg-primary-dark`)

### Arquivo editado
- `src/pages/SolucaoDetalhe.tsx` -- reescrita completa do componente (dados mantidos)

