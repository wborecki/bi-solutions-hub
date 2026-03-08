

## Plano: Nova ilustração de Jurimetria estilo dashboard real

### Objetivo
Gerar uma nova imagem para `src/assets/illustration-jurimetria.png` que simule uma **tela de dashboard de jurimetria com dados reais legíveis**, incluindo:

- **Gráficos de barras** com "Tempo médio por processo" (ex: Cível 18m, Trabalhista 12m, Criminal 8m)
- **Mapa de tribunais** ou heatmap regional
- **Gráficos de tendência** com linhas temporais
- **Tabelas com números** que pareçam dados reais
- Leve **perspectiva/inclinação isométrica** (não totalmente flat/plano)

### Detalhes técnicos

**Arquivo a editar:** `src/assets/illustration-jurimetria.png`

**Prompt de geração:** Criar uma ilustração de dashboard de analytics jurídico com aparência de tela real, usando perspectiva com leve inclinação (~15-20°). Incluir elementos como:
- Barra lateral com menu
- Gráfico de barras horizontais "Tempo médio por tipo" com valores legíveis
- Mini mapa do Brasil com pontos de tribunais
- Gráfico de linha mostrando tendência processual
- Cards com KPIs (ex: "12.450 processos", "87% favorável")
- Paleta: roxo (#512a6c), teal (#81bbb6), fundo branco/cinza claro
- Estilo: UI design moderno, semi-realista, não cartoon

**Componentes que usam:** `SolucaoDetalhe.tsx` (página /solucoes/jurimetria) e `SolutionsSection.tsx` (homepage, usa `solution-jurimetria.jpg` separadamente).

### Implementação
1. Gerar nova imagem via AI image generation com o prompt descrito
2. Salvar como `src/assets/illustration-jurimetria.png`

