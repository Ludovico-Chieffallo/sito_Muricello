// Crea le miniature delle foto in public/media (larghe 800 px) dentro
// public/media/_mini, con lo stesso percorso. Le usano le griglie della
// Gallery e delle edizioni; la foto intera si apre al clic.
// Gira da solo prima di ogni build: le miniature non vanno nel repository.
import { readdirSync, statSync, mkdirSync, existsSync } from 'node:fs';
import { join, relative, dirname, extname } from 'node:path';
import sharp from 'sharp';

const media = new URL('../public/media', import.meta.url).pathname;
const mini = join(media, '_mini');
const estensioni = new Set(['.jpg', '.jpeg', '.png', '.webp']);
let create = 0;

async function scorri(dir) {
  for (const nome of readdirSync(dir)) {
    const percorso = join(dir, nome);
    if (percorso === mini) continue;
    if (statSync(percorso).isDirectory()) {
      await scorri(percorso);
      continue;
    }
    if (!estensioni.has(extname(nome).toLowerCase())) continue;
    const destinazione = join(mini, relative(media, percorso));
    if (existsSync(destinazione) && statSync(destinazione).mtimeMs >= statSync(percorso).mtimeMs) continue;
    mkdirSync(dirname(destinazione), { recursive: true });
    await sharp(percorso).rotate().resize({ width: 800, withoutEnlargement: true }).toFile(destinazione);
    create++;
  }
}

if (existsSync(media)) await scorri(media);
console.log(`Miniature: ${create} create.`);
