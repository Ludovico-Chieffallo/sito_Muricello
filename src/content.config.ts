import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Un testo facoltativo: se manca o è vuoto diventa una stringa vuota.
const testo = z.string().nullish().transform((v) => (v ?? '').trim());
const lista = <T extends z.ZodTypeAny>(schema: T) =>
  z.array(schema).nullish().transform((v) => v ?? []);

const premio = z.object({
  sezione: z.string(),
  nome: z.string(),
  opera: testo,
  editore: testo,
  ruolo: testo,
  motivazione: testo,
  foto: testo,
  // Copertina del libro premiato: se c'è, si mostra intera al posto della foto.
  copertina: testo,
});

const finalista = z.object({
  autore: z.string(),
  opera: z.string(),
  editore: testo,
  nota: testo,
  copertina: testo,
  vincitore: z.boolean().nullish().transform((v) => !!v),
});

const momento = z.object({
  titolo: z.string(),
  testo: testo,
});

// Una scheda per ogni edizione del Premio: src/content/edizioni/<anno>.json
const edizioni = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/edizioni' }),
  schema: z.object({
    anno: z.number().int(),
    numero: z.string(),
    ordinale: z.string(),
    // Periodo degli eventi, se va oltre l'anno del Premio (es. "2024/25").
    periodo: testo,
    data: testo,
    luogo: testo,
    tema: testo,
    racconto: testo,
    copertina: testo,
    premi: lista(premio),
    citazione: z
      .object({ testo: testo, autore: testo })
      .nullish()
      .transform((v) => (v && v.testo ? v : null)),
    finalistiIntro: testo,
    finalisti: lista(finalista),
    momentiTitolo: testo,
    momentiIntro: testo,
    momenti: lista(momento),
  }),
});

// Un file per ogni evento: src/content/eventi/<data>-<titolo>.json
const eventi = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/eventi' }),
  schema: z.object({
    titolo: z.string(),
    data: z.coerce.date(),
    // Anno dell'edizione a cui appartiene l'evento; se manca, vale l'anno della data.
    edizione: z.number().int().nullish(),
    luogo: testo,
    descrizione: testo,
    locandina: testo,
    foto: z
      .array(z.string().nullish())
      .nullish()
      .transform((v) => (v ?? []).filter((f): f is string => !!f)),
  }),
});

// Un file per ogni persona: associazione, giuria letteraria, giuria di poesia
const persone = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/persone' }),
  schema: z.object({
    nome: z.string(),
    ruolo: testo,
    gruppo: z.enum(['associazione', 'giuria-letteraria', 'giuria-poesia']),
    ordine: z.number().nullish().transform((v) => v ?? 99),
    bio: testo,
    foto: testo,
    // In evidenza: esce dalla griglia e si mostra in grande, con la biografia visibile.
    evidenza: z.boolean().nullish().transform((v) => !!v),
  }),
});

export const collections = { edizioni, eventi, persone };
