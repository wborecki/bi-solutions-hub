import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const IMAGE_DIRS = ["src/assets", "public"];
const TEXT_DIRS = ["src"];
const TEXT_FILES = ["index.html", "README.md", "DEPLOY.md", "CHECKLIST.md"];
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg"]);
const TEXT_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".css", ".html", ".md"]);
const SKIP_BASENAMES = new Set(["favicon"]);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function toPosix(relativePath) {
  return relativePath.split(path.sep).join("/");
}

async function convertImages() {
  const replacements = [];
  let converted = 0;
  let skipped = 0;

  for (const relDir of IMAGE_DIRS) {
    const absDir = path.join(ROOT, relDir);
    let files = [];
    try {
      files = await walk(absDir);
    } catch {
      continue;
    }

    for (const absFile of files) {
      const ext = path.extname(absFile).toLowerCase();
      if (!IMAGE_EXTENSIONS.has(ext)) continue;

      const baseName = path.basename(absFile, ext).toLowerCase();
      if (SKIP_BASENAMES.has(baseName)) {
        skipped += 1;
        continue;
      }

      const outFile = absFile.slice(0, -ext.length) + ".webp";
      const relFromRoot = toPosix(path.relative(ROOT, absFile));
      const outRelFromRoot = toPosix(path.relative(ROOT, outFile));

      replacements.push({ from: relFromRoot, to: outRelFromRoot });
      replacements.push({ from: "/" + relFromRoot, to: "/" + outRelFromRoot });

      if (relFromRoot.startsWith("public/")) {
        const publicPath = relFromRoot.replace(/^public\//, "");
        const publicOutPath = outRelFromRoot.replace(/^public\//, "");
        replacements.push({ from: "/" + publicPath, to: "/" + publicOutPath });
        replacements.push({ from: publicPath, to: publicOutPath });
      }

      try {
        await fs.access(outFile);
      } catch {
        await sharp(absFile).webp({ quality: 82 }).toFile(outFile);
        converted += 1;
      }
    }
  }

  return { replacements, converted, skipped };
}

async function updateTextFile(filePath, replacements) {
  const original = await fs.readFile(filePath, "utf8");
  let next = original;

  for (const { from, to } of replacements) {
    if (from.startsWith("src/assets/") || from.includes("/src/assets/")) {
      const aliasFrom = from.replace(/^src\/assets\//, "@/assets/");
      const aliasTo = to.replace(/^src\/assets\//, "@/assets/");
      next = next.split(aliasFrom).join(aliasTo);
    }

    next = next.split(from).join(to);
  }

  if (next !== original) {
    await fs.writeFile(filePath, next, "utf8");
    return true;
  }
  return false;
}

async function updateReferences(replacements) {
  const filesToCheck = [];

  for (const relDir of TEXT_DIRS) {
    const absDir = path.join(ROOT, relDir);
    let files = [];
    try {
      files = await walk(absDir);
    } catch {
      continue;
    }
    for (const file of files) {
      if (TEXT_EXTENSIONS.has(path.extname(file).toLowerCase())) {
        filesToCheck.push(file);
      }
    }
  }

  for (const relFile of TEXT_FILES) {
    const absFile = path.join(ROOT, relFile);
    try {
      await fs.access(absFile);
      filesToCheck.push(absFile);
    } catch {
      // Ignore missing optional docs.
    }
  }

  let updated = 0;
  for (const filePath of filesToCheck) {
    if (await updateTextFile(filePath, replacements)) {
      updated += 1;
    }
  }

  return updated;
}

async function main() {
  const { replacements, converted, skipped } = await convertImages();
  const updatedFiles = await updateReferences(replacements);

  console.log(`Converted images: ${converted}`);
  console.log(`Skipped (preserved compatibility): ${skipped}`);
  console.log(`Updated text files: ${updatedFiles}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
