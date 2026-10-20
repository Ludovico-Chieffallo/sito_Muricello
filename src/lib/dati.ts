import { getCollection, type CollectionEntry } from 'astro:content';
import { slugEvento } from './testo';

export type Edizione = CollectionEntry<'edizioni'>['data'];
export type Evento = CollectionEntry<'eventi'>['data'] & { id: string; slug: string; anno: number };
export type Persona = CollectionEntry<'persone'>['data'] & { id: string };

/** Tutte le edizioni, dalla più recente. */
export async function edizioni(): Promise<Edizione[]> {
  const voci = await getCollection('edizioni');
  return voci.map((v) => v.data).sort((a, b) => b.anno - a.anno);
}

/** Tutti gli eventi, in ordine di data: ogni edizione si legge dal primo appuntamento all'ultimo. */
export async function eventi(): Promise<Evento[]> {
  const voci = await getCollection('eventi');
  return voci
    .map((v) => ({
      ...v.data,
      id: v.id,
      slug: slugEvento(v.id),
      anno: v.data.edizione ?? Number(v.data.data.toISOString().slice(0, 4)),
    }))
    .sort((a, b) => a.data.getTime() - b.data.getTime());
}

export async function persone(gruppo: Persona['gruppo']): Promise<Persona[]> {
  const voci = await getCollection('persone');
  return voci
    .filter((v) => v.data.gruppo === gruppo)
    .map((v) => ({ ...v.data, id: v.id }))
    .sort((a, b) => a.ordine - b.ordine || a.nome.localeCompare(b.nome, 'it'));
}

/** Un'edizione "compilata" ha almeno un premiato. */
export const compilata = (e: Edizione) => e.premi.length > 0;

/**
 * Raggruppa i premi per sezione, per i riepiloghi:
 * [{ sezione: 'Premio letterario', nomi: ['Eliana Iorfida'], opera: 'Montagnammare' }, ...]
 */
export function premiPerSezione(e: Edizione) {
  const gruppi: { sezione: string; nomi: string[]; opera: string }[] = [];
  for (const p of e.premi) {
    const g = gruppi.find((x) => x.sezione === p.sezione);
    if (g) g.nomi.push(p.nome);
    else gruppi.push({ sezione: p.sezione, nomi: [p.nome], opera: p.opera });
  }
  return gruppi;
}

/** "A, B, C e altri" con al massimo `max` nomi. */
export function elencoNomi(nomi: string[], max = 3) {
  if (nomi.length <= 1) return nomi.join('');
  if (nomi.length > max) return nomi.slice(0, max).join(', ') + ' e altri';
  return nomi.slice(0, -1).join(', ') + ' e ' + nomi[nomi.length - 1];
}
