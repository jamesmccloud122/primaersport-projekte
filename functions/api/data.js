/**
 * /api/data — Datenspeicher des internen Bereichs
 * ==============================================================
 * Speichert die Inhalte der drei internen Seiten in Cloudflare KV,
 * damit sie auf allen Geraeten (PC, Handy, Laptop, Stream-PC) gleich sind.
 *
 *   GET  /api/data?bereich=zielplan
 *        -> { bereich, version, gespeichertAm, daten }
 *        Wurde noch nie gespeichert, kommt eine leere Grundstruktur
 *        zurueck (version 0) — nie ein Fehler.
 *
 *   PUT  /api/data?bereich=zielplan
 *        Body A (empfohlen):  { "version": 7, "daten": { ... } }
 *            Speichert nur, wenn zwischenzeitlich kein anderes Geraet
 *            gespeichert hat. Sonst 409 samt aktuellem Stand.
 *        Body B (einfach):    { ...beliebiges JSON... }
 *            Speichert ohne Rueckfrage (wird beim Wiederherstellen
 *            einer Sicherungsdatei verwendet).
 *        -> { ok: true, bereich, version, gespeichertAm }
 *
 * Fehler kommen immer als JSON mit einem verstaendlichen Text im Feld
 * "fehler" zurueck — nie als nackter Statuscode.
 *
 * Voraussetzung: Im Pages-Projekt muss ein KV-Namespace unter dem Namen
 * INTERN_KV gebunden sein (Settings -> Bindings -> KV namespace),
 * und zwar fuer Production UND Preview. Fehlt die Bindung, sagt die
 * Antwort genau das — statt kryptisch abzustuerzen.
 */

/** Groesse eines einzelnen Bereichs. KV koennte 25 MB, aber alles
 *  darueber ist bei Textnotizen ein Zeichen fuer einen Fehler. */
const MAX_BYTES = 4 * 1024 * 1024; // 4 MB

/** Die erlaubten Bereiche und ihre leere Grundstruktur.
 *  Achtung: Dieselben Strukturen stehen auch in intern/gemeinsam.js,
 *  damit die Seiten notfalls auch ohne Server starten koennen. */
const BEREICHE = {
  zielplan: () => ({
    phasen: [
      { id: 'phase1', titel: 'Phase 1 — Lehrveranstaltung übernehmen', beschreibung: '', meilensteine: [] },
      { id: 'phase2', titel: 'Phase 2 — Wissensbasis und YouTube',     beschreibung: '', meilensteine: [] },
      { id: 'phase3', titel: 'Phase 3 — Trainer werden',               beschreibung: '', meilensteine: [] },
      { id: 'phase4', titel: 'Phase 4 — Nachfolge vorbereiten',        beschreibung: '', meilensteine: [] }
    ],
    rueckblick: ''
  }),
  stundenbilder: () => ({ eintraege: [] }),
  spiele:        () => ({ eintraege: [] })
};

const BEREICHSNAMEN = Object.keys(BEREICHE);

/* ── kleine Helfer ──────────────────────────────────────────────── */

function json(inhalt, status = 200) {
  return new Response(JSON.stringify(inhalt), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      // Niemals zwischenspeichern: sonst sieht das Handy alte Staende.
      'cache-control': 'no-store, must-revalidate',
      'x-robots-tag': 'noindex'
    }
  });
}

function fehler(text, status, extra = {}) {
  return json({ fehler: text, ...extra }, status);
}

/** Bereichsnamen aus der URL pruefen. Gibt entweder den Namen oder eine
 *  fertige Fehlerantwort zurueck. */
function bereichAusUrl(request) {
  const roh = new URL(request.url).searchParams.get('bereich');
  if (!roh) {
    return { antwort: fehler(
      'Es fehlt die Angabe, welcher Bereich gemeint ist. Erwartet wird ?bereich=' +
      BEREICHSNAMEN.join(' oder ?bereich='), 400) };
  }
  const name = roh.trim().toLowerCase();
  if (!Object.prototype.hasOwnProperty.call(BEREICHE, name)) {
    return { antwort: fehler(
      `Den Bereich „${roh}" gibt es nicht. Möglich sind: ${BEREICHSNAMEN.join(', ')}.`, 400) };
  }
  return { name };
}

/** Pruefen, ob der KV-Speicher wirklich angebunden ist. */
function kvOderFehler(env) {
  const kv = env && env.INTERN_KV;
  if (!kv || typeof kv.get !== 'function') {
    return { antwort: fehler(
      'Der Datenspeicher ist nicht angebunden. Im Cloudflare-Pages-Projekt unter ' +
      'Settings → Bindings muss ein KV-Namespace mit dem Namen INTERN_KV eingetragen ' +
      'sein — für Production und für Preview. Danach einmal neu veröffentlichen.', 503) };
  }
  return { kv };
}

/** Schluessel im KV-Speicher. */
const schluessel = (name) => `bereich:${name}`;

/* ── GET: Daten lesen ───────────────────────────────────────────── */

export async function onRequestGet({ request, env }) {
  const b = bereichAusUrl(request);
  if (b.antwort) return b.antwort;

  const k = kvOderFehler(env);
  if (k.antwort) return k.antwort;

  let roh;
  try {
    roh = await k.kv.get(schluessel(b.name));
  } catch (e) {
    return fehler(
      'Der Datenspeicher war gerade nicht erreichbar, die Daten konnten nicht geladen ' +
      'werden. Bitte die Seite in einem Moment neu laden. (Technisch: ' + String(e && e.message || e) + ')',
      502);
  }

  // Noch nie gespeichert -> leere Grundstruktur, kein Fehler.
  if (roh === null || roh === undefined || roh === '') {
    return json({
      bereich: b.name,
      version: 0,
      gespeichertAm: null,
      daten: BEREICHE[b.name]()
    });
  }

  let satz;
  try {
    satz = JSON.parse(roh);
  } catch (e) {
    // Sollte nie passieren; wenn doch, lieber ehrlich melden als still
    // eine leere Struktur liefern und damit den Bestand verdecken.
    return fehler(
      'Die gespeicherten Daten dieses Bereichs sind beschädigt und konnten nicht ' +
      'gelesen werden. Bitte die letzte Sicherungsdatei einspielen.', 500);
  }

  // Aeltere oder von Hand geschriebene Eintraege ohne Huelle tolerieren.
  const daten = (satz && typeof satz === 'object' && 'daten' in satz) ? satz.daten : satz;

  return json({
    bereich: b.name,
    version: Number(satz && satz.version) || 1,
    gespeichertAm: (satz && satz.gespeichertAm) || null,
    daten: (daten === null || daten === undefined) ? BEREICHE[b.name]() : daten
  });
}

/* ── PUT: Daten speichern ───────────────────────────────────────── */

export async function onRequestPut({ request, env }) {
  const b = bereichAusUrl(request);
  if (b.antwort) return b.antwort;

  const k = kvOderFehler(env);
  if (k.antwort) return k.antwort;

  // 1) Body einlesen und pruefen
  let text;
  try {
    text = await request.text();
  } catch (e) {
    return fehler('Die gesendeten Daten konnten nicht gelesen werden. Bitte noch einmal versuchen.', 400);
  }

  if (!text || !text.trim()) {
    return fehler('Es wurden keine Daten mitgeschickt — gespeichert wurde nichts.', 400);
  }

  const bytes = new TextEncoder().encode(text).length;
  if (bytes > MAX_BYTES) {
    return fehler(
      `Der Bereich ist mit ${(bytes / 1024 / 1024).toFixed(1)} MB zu groß zum Speichern ` +
      `(erlaubt sind ${MAX_BYTES / 1024 / 1024} MB). Bitte alte Einträge auslagern oder ` +
      'große Texte kürzen.', 413);
  }

  let body;
  try {
    body = JSON.parse(text);
  } catch (e) {
    return fehler(
      'Die gesendeten Daten sind kein gültiges JSON und wurden deshalb nicht gespeichert. ' +
      'Der bisherige Stand bleibt unverändert.', 400);
  }

  // 2) Huelle { version, daten } erkennen — oder rohes JSON akzeptieren
  const mitHuelle = body && typeof body === 'object' && !Array.isArray(body) && 'daten' in body;
  const daten     = mitHuelle ? body.daten : body;
  const erwartet  = mitHuelle && body.version !== undefined && body.version !== null
                    ? Number(body.version) : null;

  if (daten === null || daten === undefined) {
    return fehler('Es wurden leere Daten geschickt — gespeichert wurde nichts.', 400);
  }

  // 3) Aktuellen Stand holen (fuer die Versionspruefung)
  let alt = null;
  try {
    const rohAlt = await k.kv.get(schluessel(b.name));
    if (rohAlt) alt = JSON.parse(rohAlt);
  } catch (e) {
    alt = null; // Nicht lesbar? Dann behandeln wir es wie „noch nichts da".
  }

  const altVersion = Number(alt && alt.version) || 0;

  // Schutz gegen gegenseitiges Ueberschreiben: Wer eine Version mitschickt,
  // bekommt einen Konflikt gemeldet, wenn inzwischen ein anderes Geraet
  // gespeichert hat. Ohne Versionsangabe wird bewusst ueberschrieben.
  if (erwartet !== null && Number.isFinite(erwartet) && erwartet !== altVersion) {
    return json({
      fehler: 'Auf einem anderen Gerät wurde inzwischen gespeichert. Damit nichts verloren ' +
              'geht, wurde hier nicht überschrieben. Bitte die Seite neu laden und die ' +
              'Änderung noch einmal eintragen.',
      konflikt: true,
      bereich: b.name,
      version: altVersion,
      gespeichertAm: (alt && alt.gespeichertAm) || null,
      daten: alt ? (('daten' in alt) ? alt.daten : alt) : BEREICHE[b.name]()
    }, 409);
  }

  // 4) Schreiben
  const satz = {
    version: altVersion + 1,
    gespeichertAm: new Date().toISOString(),
    daten
  };

  try {
    await k.kv.put(schluessel(b.name), JSON.stringify(satz));
  } catch (e) {
    return fehler(
      'Das Speichern hat nicht geklappt — der Datenspeicher hat die Änderung abgelehnt. ' +
      'Die Eingaben sind im Browser noch vorhanden: einfach in einem Moment noch einmal ' +
      'auf Speichern tippen. (Technisch: ' + String(e && e.message || e) + ')', 502);
  }

  return json({
    ok: true,
    bereich: b.name,
    version: satz.version,
    gespeichertAm: satz.gespeichertAm
  });
}

/* ── Alles andere: klar abweisen ────────────────────────────────── */

export async function onRequest({ request }) {
  return new Response(
    JSON.stringify({
      fehler: `Die Methode ${request.method} wird hier nicht unterstützt. ` +
              'Möglich sind GET (lesen) und PUT (speichern).'
    }),
    {
      status: 405,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'allow': 'GET, PUT',
        'cache-control': 'no-store'
      }
    }
  );
}
