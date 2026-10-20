// Elenca i testi ancora da completare, cioè quelli scritti [tra parentesi quadre],
// e le persone senza biografia. Da lanciare prima di pubblicare: npm run controlla
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const radice = new URL('..', import.meta.url).pathname;
const cartelle = ['src/content', 'src/data'];
const trovati = [];
const senzaBio = [];

function scorri(dir) {
  for (const nome of readdirSync(dir)) {
    const percorso = join(dir, nome);
    if (statSync(percorso).isDirectory()) scorri(percorso);
    else if (nome.endsWith('.json')) controlla(percorso);
  }
}

function controlla(file) {
  const testo = readFileSync(file, 'utf8');
  const rel = relative(radice, file);
  for (const m of testo.matchAll(/"\[[^\]"]+\][^"]*"/g)) trovati.push(`${rel}: ${m[0]}`);
  if (rel.includes('persone')) {
    const dati = JSON.parse(testo);
    if (!dati.bio) senzaBio.push(`${rel}: ${dati.nome}`);
  }
}

cartelle.forEach((c) => scorri(join(radice, c)));

if (trovati.length) {
  console.log(`\nTesti da completare (${trovati.length}):\n`);
  trovati.forEach((t) => console.log('  ' + t));
} else {
  console.log('\nNessun testo tra parentesi quadre: tutto completato.');
}
if (senzaBio.length) {
  console.log(`\nPersone senza biografia (${senzaBio.length}), la loro scheda non si apre:\n`);
  senzaBio.forEach((t) => console.log('  ' + t));
}
console.log('');
