

# Plano de Guerra - Polimento Final do Site Solutions in BI

## Panorama Atual
O site ja esta bem estruturado com: Home, Solucoes, Solucao Detalhe, Servicos, Sobre, Blog, BlogPost, Contato, Cases de Sucesso, Privacy, Terms. Tem SEO, cookie consent, WhatsApp button, animacoes com Framer Motion e design system consistente.

---

## Problemas Encontrados e Melhorias

### 1. Corrigir links quebrados no Footer
Os links de solucoes no Footer apontam todos para `/solucoes` generico em vez dos slugs corretos (`/solucoes/automacao-ia`, `/solucoes/business-intelligence`, etc).

### 2. Menu mobile incompleto - falta Solucoes
O menu mobile no Header nao inclui o link de "Solucoes" (so mostra Sobre, Blog, Contato). Precisa adicionar Solucoes e sub-itens.

### 3. Pagina Servicos com link quebrado
O botao "Ver Cases de Sucesso" aponta para `/casos-de-sucesso`, mas essa rota nao esta registrada no App.tsx. Precisa adicionar a rota.

### 4. Formulario de contato nao envia de verdade
O form simula envio com `setTimeout`. Ideal seria integrar com um servico real (ex: enviar por email via Supabase Edge Function ou Formspree/EmailJS).

### 5. Falta pagina /contato no router (ja existe)
A pagina Contato esta lazy-loaded e roteada corretamente. OK.

### 6. Adicionar numeros/estatisticas na Home
A Home nao tem uma secao de numeros (ex: "50+ clientes", "500k processos analisados"). Adicionar uma barra de stats entre o Hero e "Como funciona" para gerar credibilidade.

### 7. SEO - falta og-image.png
O componente SEO referencia `/og-image.png` mas o arquivo nao existe no `/public`. Criar uma imagem OG para compartilhamento em redes sociais.

### 8. Acessibilidade - melhorias
- Adicionar `aria-label` nos links de redes sociais (se houver)
- Garantir contraste adequado no botao accent (teal sobre branco)

### 9. Loading state global mais polido
O fallback do Suspense e um spinner basico. Podemos adicionar o logo da SBI no loading.

### 10. Footer - adicionar links de redes sociais
Nao ha links para LinkedIn, Instagram ou outras redes sociais.

---

## Plano de Implementacao (por prioridade)

### Fase 1 - Bugs e Links Quebrados
1. **Adicionar rota `/casos-de-sucesso`** no App.tsx (a pagina ja existe)
2. **Corrigir links do Footer** para apontar aos slugs corretos das solucoes
3. **Adicionar Solucoes ao menu mobile** com os sub-itens expandiveis

### Fase 2 - Credibilidade e Conversao
4. **Adicionar secao de estatisticas na Home** (50+ clientes, 98% satisfacao, etc.) entre Hero e "Como funciona"
5. **Integrar formulario de contato** com servico real de email (EmailJS ou similar, sem backend)

### Fase 3 - Polimento Visual
6. **Criar og-image.png** para SEO de compartilhamento social
7. **Melhorar loading global** com logo da SBI
8. **Adicionar links de redes sociais** no Footer (LinkedIn, Instagram)
9. **Adicionar secao de logos de clientes/parceiros** na Home (social proof)

### Fase 4 - Extras Opcionais
10. **Dark mode toggle** no header (ja tem as variaveis CSS configuradas)
11. **Animacao de contagem** nos numeros de estatisticas
12. **Back to top button** para paginas longas

---

## Detalhes Tecnicos

- Rota faltante: adicionar `CasesDeSucesso` como lazy import + `<Route path="/casos-de-sucesso">` no App.tsx
- Footer links: trocar `/solucoes` por `/solucoes/automacao-ia`, `/solucoes/business-intelligence`, `/solucoes/dashboards`, `/solucoes/chatbots`
- Menu mobile: adicionar acordeao/lista de solucoes no menu hamburger
- Stats section: reutilizar o array de `stats` ja existente em CasesDeSucesso.tsx
- Formulario: integrar com EmailJS (client-side, sem backend) ou usar `mailto:` como fallback

