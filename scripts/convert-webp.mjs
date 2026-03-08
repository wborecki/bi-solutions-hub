import { readdirSync, statSync, existsSync } from "node:fs";
import { extname, join, basename } from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const TARGET_DIRS = [join(ROOT, "src/assets"), join(ROOT, "public")];
const VALID_EXTENSIONS = new Set([".png", ".jpg", ".jpeg"]);

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stats = statSync(full);
    if (stats.isDirectory()) {
      walk(full, files);
      continue;
    }
    files.push(full);
  }
  return files;
}

function convertToWebp(inputPath) {
  const ext = extname(inputPath).toLowerCase();
  if (!VALID_EXTENSIONS.has(ext)) return false;

  const outputPath = inputPath.slice(0, -ext.length) + ".webp";
  if (existsSync(outputPath)) return false;

  const result = spawnSync("convert", [inputPath, "-quality", "82", outputPath], {
    stdio: "pipe",
  });

  if (result.status !== 0) {
    const err = (result.stderr || "").toString().trim();
    console.error(`Erro ao converter ${basename(inputPath)}: ${err}`);
    return false;
  }

  return true;
}

let converted = 0;

for (const dir of TARGET_DIRS) {
  for (const file of walk(dir)) {
    if (convertToWebp(file)) converted += 1;
  }
}

console.log(`Conversão WebP concluída. Novos arquivos: ${converted}`);
