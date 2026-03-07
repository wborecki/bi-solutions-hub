

# Recriar Mascote Bia — Consistência Visual

## Situação Atual

A Bia aparece em dois lugares com imagens/contextos diferentes:
- **Hero** (`Index.tsx`): usa `hero-illustration.png` (ilustração genérica)
- **BiaAnaliseSection** (`BiaAnaliseSection.tsx`): usa `bia-robot.png`

O mascote oficial deveria ser **um só**, conforme a identidade definida: robô flutuante em formato de cápsula/gota, sem pernas, visor preto com olhos azuis, corpo branco/cinza com detalhes em roxo (#270e3e, #512a6c) e verde água (#81bbb6).

## Plano

1. **Gerar nova imagem da Bia** usando IA (Gemini image generation) seguindo a identidade visual definida: robô cápsula flutuante, minimalista, premium, com as cores da marca
2. **Substituir `bia-robot.png`** pela nova imagem gerada
3. **Substituir `hero-illustration.png`** no Hero pela mesma Bia (versão maior/diferente pose se necessário, mas mesmo personagem)
4. **Garantir consistência**: mesma Bia em toda a aplicação — Hero e BiaAnaliseSection

## Resultado

Um único mascote Bia consistente em todo o site, alinhado com a identidade visual da Solutions in BI.

