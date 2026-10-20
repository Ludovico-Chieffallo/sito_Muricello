# Sito del Premio Muricello

Il sito dell'Associazione culturale Muricello e del Premio Muricello di San Mango d'Aquino: [muricello.it](https://muricello.it).

È un sito statico costruito con [Astro](https://astro.build): ogni pagina viene generata in HTML una volta sola, al momento della pubblicazione. È veloce, non ha database da mantenere e Google legge tutto il testo.

## Come sono organizzati i contenuti

Tutti i testi del sito stanno in file separati dal codice. Per aggiornare il sito si modificano solo questi:

| Cosa | Dove | Note |
| --- | --- | --- |
| Edizioni del Premio | `src/content/edizioni/<anno>.json` | Una scheda per anno. Le sezioni vuote non compaiono. |
| Eventi e album | `src/content/eventi/<data>-<titolo>.json` | Le foto di un evento formano il suo album nella Gallery. |
| Persone e giurie | `src/content/persone/<nome>.json` | `gruppo`: `associazione`, `giuria-letteraria` o `giuria-poesia`. |
| Ultima notizia | `src/data/news.json` | C'è una sola notizia: la nuova sostituisce la precedente. |
| Impostazioni | `src/data/sito.json` | Contatti, numeri del Premio, foto della home e delle pagine. |
| Foto e locandine | `public/media/` | Nei contenuti si scrive il percorso, es. `/media/iorfida.jpg`. |

Regole di scrittura nei testi:

- `*Montagnammare*` diventa corsivo, per i titoli dei libri.
- Nei testi lunghi (news) i paragrafi sono separati da una riga vuota.
- Una riga che inizia con `>` diventa una citazione; se l'ultima riga inizia con `— ` è l'autore.
- I testi `[tra parentesi quadre]` sono segnaposto da completare.

## Modificare i contenuti dal pannello (senza codice)

Il repository è già configurato per [Pages CMS](https://pagescms.org), un pannello web gratuito: si accede con un account GitHub, si sceglie questo repository e si modificano news, edizioni, eventi, persone e foto con dei moduli. Ogni salvataggio aggiorna il repository e Cloudflare ripubblica il sito in automatico (circa un minuto).

Per far modificare il sito a qualcun altro: aggiungilo come collaboratore del repository su GitHub, poi gli basta entrare su Pages CMS con il suo account.

La configurazione del pannello è nel file `.pages.yml`.

## Aggiornamenti tipici

**Nuova edizione.** Crea `src/content/edizioni/2027.json` copiando la struttura di `2026.json`. La home, la pagina Edizioni e la barra degli anni si aggiornano da sole. Ricordati di aggiornare i numeri in `src/data/sito.json`.

**Nuovo evento.** Crea un file in `src/content/eventi/` con titolo, data (`2027-07-24`), luogo, descrizione e locandina. Se aggiungi le foto nel campo `foto`, l'album compare nella Gallery di quell'anno.

**Nuova notizia.** Sostituisci i testi in `src/data/news.json`.

**Prima di pubblicare** controlla cosa manca:

```sh
npm run controlla
```

Elenca i segnaposto ancora tra parentesi quadre e le persone senza biografia.

## Lavorare sul codice

Serve Node.js 22 o superiore.

```sh
npm install
npm run dev       # anteprima su http://localhost:4321 mentre modifichi
npm run build     # genera il sito nella cartella dist/
npm run preview   # anteprima del sito generato
```

Struttura:

```
src/
  content/          contenuti (edizioni, eventi, persone)
  data/             news e impostazioni
  pages/            le pagine del sito
  components/       parti riutilizzate (testata, foto, schede...)
  layouts/Base.astro  struttura comune e dati per Google
  styles/global.css   colori, caratteri e impaginazione
public/
  media/            foto e locandine
  _redirects        reindirizzamenti dal vecchio sito
```

I caratteri (Bodoni Moda e Spectral) sono inclusi nel sito e non vengono caricati da Google Fonts.

## Pubblicazione su Cloudflare Pages

1. Su Cloudflare apri **Workers & Pages**, crea un progetto **Pages** e collega questo repository GitHub.
2. Impostazioni di build:
   - Framework: **Astro**
   - Comando di build: `npm run build`
   - Cartella di output: `dist`
   - Variabile d'ambiente: `NODE_VERSION` = `22`
3. Dopo la prima pubblicazione il sito è visibile su un indirizzo `*.pages.dev`: controllalo prima di collegare il dominio.

Ogni modifica al ramo `main`, dal codice o dal pannello, ripubblica il sito da sola.

## Collegare il dominio muricello.it

1. Scopri dove è registrato il dominio (su [whois.nic.it](https://whois.nic.it)) e ottieni l'accesso al pannello.
2. **Prima di cambiare qualsiasi cosa**, annota tutti i record DNS attuali, in particolare i record **MX** e **TXT** della posta: se si perdono, `info@muricello.it` smette di funzionare.
3. Su Cloudflare aggiungi il dominio, controlla che abbia importato i record della posta, poi cambia i nameserver presso il registrar con quelli indicati da Cloudflare.
4. Nel progetto Pages, in **Custom domains**, aggiungi `muricello.it` e `www.muricello.it`.

## Non perdere l'indicizzazione

- Il file `public/_redirects` porta ogni indirizzo del vecchio sito (es. `/chi-siamo`, `/2019`, `/blog-detail`) alla pagina nuova con un reindirizzamento permanente (301). Se scopri altri vecchi indirizzi, aggiungili lì.
- Dopo il passaggio, registra il sito su [Google Search Console](https://search.google.com/search-console), invia la mappa `https://muricello.it/sitemap-index.xml` e controlla le pagine con lo strumento di controllo URL.
- Qualche settimana di assestamento nei risultati è normale.
