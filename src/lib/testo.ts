// Piccoli aiuti per trasformare i testi dei contenuti in HTML sicuro.
// Nei campi di testo si può scrivere *così* per il corsivo (titoli di libri).

const escape = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Testo su una riga, con *corsivo*. */
export function inline(s = ''): string {
  return escape(s).replace(/\*([^*\n]+)\*/g, '<i>$1</i>');
}

/** Toglie gli asterischi del corsivo: per titoli e descrizioni delle pagine. */
export function semplice(s = ''): string {
  return s.replace(/\*/g, '');
}

export type Blocco =
  | { tipo: 'paragrafo'; html: string }
  | { tipo: 'citazione'; html: string; autore: string };

/**
 * Testo lungo: i paragrafi sono separati da una riga vuota.
 * Un paragrafo che inizia con ">" diventa una citazione; se la sua ultima
 * riga inizia con "—", quella riga è l'autore della citazione.
 */
export function blocchi(s = ''): Blocco[] {
  return s
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p): Blocco => {
      if (p.startsWith('>')) {
        const righe = p.split('\n').map((r) => r.replace(/^>\s?/, '').trim());
        let autore = '';
        if (righe.length > 1 && /^[—–-]\s/.test(righe[righe.length - 1])) {
          autore = righe.pop()!.replace(/^[—–-]\s*/, '');
        }
        return { tipo: 'citazione', html: inline(righe.join(' ')), autore: inline(autore) };
      }
      return { tipo: 'paragrafo', html: inline(p.replace(/\n/g, ' ')) };
    });
}

/** Iniziali di un nome, per le foto mancanti. */
export function iniziali(nome = ''): string {
  if (nome.trim().startsWith('[')) return '';
  const parole = nome
    .replace(/[\[\]]/g, '')
    .split(/\s+/)
    .filter((w) => /^[A-ZÀ-Ý]/.test(w));
  return parole.slice(0, 2).map((w) => w[0]).join('') || '';
}

const formatoData = new Intl.DateTimeFormat('it-IT', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/Rome',
});

export const dataLunga = (d: Date) => formatoData.format(d);
export const dataIso = (d: Date) => d.toISOString().slice(0, 10);

/** "2026-07-25-serata-finale" diventa "serata-finale". */
export const slugEvento = (id: string) =>
  id.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/^\d{4}-/, '');

const numeri = [
  'zero', 'una', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove', 'dieci',
  'undici', 'dodici', 'tredici', 'quattordici', 'quindici', 'sedici', 'diciassette', 'diciotto',
  'diciannove', 'venti', 'ventuno', 'ventidue', 'ventitré', 'ventiquattro', 'venticinque',
  'ventisei', 'ventisette', 'ventotto', 'ventinove', 'trenta',
];
export const inLettere = (n: number) => numeri[n] ?? String(n);

/** La miniatura (800 px) di una foto in /media, creata da scripts/miniature.mjs. */
export const miniatura = (src = '') =>
  src.startsWith('/media/') && !src.startsWith('/media/_mini/') ? src.replace('/media/', '/media/_mini/') : src;
