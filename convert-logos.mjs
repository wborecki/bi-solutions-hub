import sharp from 'sharp';
import fs from 'fs';

const logos = [
  'logo-vernalha-pereira',
  'logo-future-law',
  'logo-oab-parana',
  'logo-seleme'
];

async function convert() {
  for (const logo of logos) {
    const input = `src/assets/${logo}.png`;
    const output = `src/assets/${logo}.webp`;
    
    if (fs.existsSync(input) && !fs.existsSync(output)) {
      try {
        await sharp(input).webp().toFile(output);
        console.log(`✓ ${logo} convertido com sucesso`);
      } catch (err) {
        console.error(`✗ Erro ao converter ${logo}:`, err.message);
      }
    }
  }
  console.log('Conversão concluída!');
}

convert();
