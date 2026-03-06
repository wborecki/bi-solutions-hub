

## Substituir o símbolo circular do Hero por uma ilustração profissional

O círculo concêntrico roxo com "SBI" no centro realmente parece um símbolo genérico. Vamos substituí-lo por uma ilustração moderna e tecnológica.

### Abordagem

Substituir os 3 círculos concêntricos (linhas 119-125 do `Index.tsx`) por uma ilustração temática usando **ícones Lucide compostos** em um layout visual elegante — um "grid" de ícones flutuantes representando dados, IA e automação, com efeitos de glassmorphism e animações sutis.

A composição será:
- Um card central com glassmorphism (`backdrop-blur`) mostrando um gráfico/dashboard estilizado
- Ícones flutuantes ao redor (Brain, Database, Zap, TrendingUp, BarChart3) com animações individuais de flutuação
- Linhas/conexões sutis entre elementos para transmitir "integração"
- Mantém os floating badges existentes ("+50 projetos", "100% satisfação")

### Arquivo alterado
- `src/pages/Index.tsx` — substituir linhas 119-125 (os 3 divs circulares) pela nova composição visual

