

## Plano: Atualizar seção Bia

### Alteracoes no `src/pages/Index.tsx`

1. **Botao "Em Breve"**: Substituir o botao `<a href="https://bia.solutionsinbi.com">Conhecer a Bia</a>` por um botao desabilitado com texto "Em Breve", sem link externo.

2. **Ilustracao estilo EVA (Wall-E)**: Substituir o placeholder atual (icone MessageSquare + texto) por uma ilustracao SVG inline de um robo fofo inspirado no EVA de Wall-E, usando as cores da marca (accent/primary). O robo tera formas arredondadas, olhos expressivos e um visual clean/minimalista, mantendo a estetica do site.

### Detalhes tecnicos

- Remover import do `ExternalLink` se nao for usado em outro lugar
- Criar SVG inline do robo dentro do componente com cores `hsl(var(--accent))` e `hsl(var(--primary))`
- Botao usara `disabled` com estilo `opacity-50 cursor-not-allowed`

