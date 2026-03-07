

# Recriar Mascote Bia — Múltiplas Variações

## Direção definida
- **Estilo**: Robô humanóide fofo (cabeçudo, proporções chibi), **sem boca**
- **Corpo**: Flutuante (sem pernas/pés)
- **Olhos**: Visor com olhos LED azuis brilhantes
- **Cores**: Roxo escuro (#270e3e, #512a6c), verde água (#81bbb6), corpo branco/cinza

## Plano

1. **Gerar 4 variações distintas da Bia** usando IA de imagem, cada uma com abordagem diferente:
   - **Variação A**: Cabeça grande arredondada, visor escuro com LEDs azuis, corpo compacto branco com detalhes roxos, bracinhos curtos, flutuando com brilho verde água embaixo
   - **Variação B**: Formato mais cilíndrico/compacto, visor em faixa horizontal, anteninhas curtas, corpo roxo escuro com luzes verde água
   - **Variação C**: Estilo "capacete de astronauta" com visor amplo, corpo branco minimalista, detalhes roxos nos ombros/braços, aura tech
   - **Variação D**: Cabeça quadrada arredondada (tipo pixel art 3D), visor com dois LEDs, corpo pequeno branco, bracinhos finos, detalhes em roxo e verde água

2. **Salvar as 4 variações** como assets temporários (`bia-v1.png` a `bia-v4.png`)

3. **Criar uma página de preview** (`/bia-preview`) temporária mostrando as 4 opções lado a lado para o usuário escolher

4. **Após escolha**: substituir `bia-robot.png` e `hero-illustration.png` pela versão escolhida e remover a página temporária

## Arquivos modificados
- `src/assets/bia-v1.png` a `bia-v4.png` (novos, gerados)
- `src/pages/BiaPreview.tsx` (novo, temporário)
- `src/App.tsx` (rota temporária `/bia-preview`)

