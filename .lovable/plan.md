

# Plano de Implementação — Melhorias 3, 4, 6 e 7

---

## 3. Ilustração do Hero visível no mobile

**Arquivo:** `src/pages/Index.tsx`

Atualmente a ilustração da BIA tem `hidden lg:flex`, ficando invisível no mobile. A mudança:
- Remover `hidden lg:flex` e substituir por layout responsivo
- No mobile, mostrar a imagem abaixo do texto em tamanho menor (w-64, centralizada)
- No desktop, manter o layout atual lado a lado

---

## 4. Seção de FAQ com Accordion

**Novo componente:** `src/components/home/FAQSection.tsx`  
**Integração:** Adicionar na página de Contato (`src/pages/Contato.tsx`) antes do `<CTASection />`

Perguntas frequentes relevantes para o público-alvo:
- "Quanto tempo leva um projeto?"
- "Vocês atendem empresas fora de São Paulo?"
- "Preciso ter um sistema de gestão para usar BI?"
- "Como funciona o suporte após a entrega?"
- "Qual o investimento para um projeto de BI/Jurimetria?"

Utilizará o componente `Accordion` do shadcn/ui já instalado, com animações framer-motion na entrada.

---

## 6. Cards de soluções clicáveis na Home

**Arquivo:** `src/pages/Index.tsx`

Os cards de soluções na Home (linhas 200-216) não têm links. A mudança:
- Adicionar um mapeamento de título para rota (ex: "Business Intelligence" → `/solucoes/business-intelligence`)
- Envolver cada Card com `<Link>` para a página correspondente
- Adicionar indicador visual de clicabilidade (seta ou hover com cor de acento)

---

## 7. Melhorar conteúdo dos posts do Blog

**Arquivo:** `src/pages/BlogPost.tsx`

Os posts têm conteúdo mas a renderização é básica (só parágrafos). Melhorias:
- Adicionar imagem de destaque no topo do artigo (usando as imagens já existentes do Blog)
- Estilizar o primeiro parágrafo como lead/destaque (texto maior, cor diferente)
- Adicionar subtítulos automáticos entre seções (a cada 2 parágrafos)
- Incluir box de "Artigos relacionados" no final (3 posts da mesma categoria)
- Adicionar estimativa de leitura com barra de progresso no topo

