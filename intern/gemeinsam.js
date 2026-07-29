/**
 * Interner Bereich — gemeinsame Grundlage aller Seiten
 * ==============================================================
 * Kuemmert sich um:
 *   • Laden und Speichern ueber /api/data (Cloudflare KV)
 *   • automatisches Speichern kurz nach jeder Aenderung
 *   • eine Sicherheitskopie im Browser, falls das Netz weg ist
 *   • Sicherungsdatei herunterladen und wieder einspielen
 *   • kleine Helfer (Statusanzeige, Meldungen, Textabsicherung)
 *
 * Die Seiten selbst kuemmern sich nur noch um ihre Darstellung.
 */

/* ── Leere Grundstrukturen ──────────────────────────────────────────
   Spiegel von functions/api/data.js. Doppelt gepflegt, damit die Seiten
   auch dann etwas anzeigen, wenn der Server gerade nicht antwortet. */
const LEERE_STRUKTUR = {
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

/* ── Kleine Helfer ──────────────────────────────────────────────── */

/** Text so absichern, dass spitze Klammern & Co. die Seite nicht zerlegen. */
function esc(wert) {
  return String(wert === null || wert === undefined ? '' : wert)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/** Mehrzeiligen Text als HTML mit Zeilenumbruechen. */
function escZeilen(wert) { return esc(wert).replace(/\r?\n/g, '<br>'); }

/** Eindeutige Kennung fuer neue Eintraege. */
function uid() {
  return 'e' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function heuteIso() { return new Date().toISOString().slice(0, 10); }

function datumHuebsch(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d)) return String(iso);
  return d.toLocaleDateString('de-AT', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function zeitHuebsch(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d)) return '';
  const heute = new Date().toDateString() === d.toDateString();
  return heute
    ? d.toLocaleTimeString('de-AT', { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('de-AT', { day: '2-digit', month: '2-digit' }) + ' ' +
      d.toLocaleTimeString('de-AT', { hour: '2-digit', minute: '2-digit' });
}

/** Kurze Meldung am unteren Rand. */
function toast(text, istFehler) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = text;
  el.className = 'zeigen' + (istFehler ? ' fehler' : '');
  clearTimeout(el._weg);
  el._weg = setTimeout(() => { el.className = ''; }, istFehler ? 6000 : 2600);
}

/** Statusanzeige im Kopf. */
const Status = {
  setze(text, art) {
    const el = document.getElementById('status');
    if (!el) return;
    el.textContent = text;
    el.className = 'status' + (art ? ' ' + art : '');
  }
};

/** Aktiven Menuepunkt markieren. */
function navMarkieren() {
  const hier = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav.bereiche a').forEach(a => {
    const ziel = a.getAttribute('href').split('/').pop();
    if (ziel === hier) a.classList.add('aktiv');
  });
}

/* ── Verbindung zum Server ──────────────────────────────────────── */

/** Ein Fehler, den der Benutzer verstehen soll. */
function Klartext(text, art) { return { klartext: text, art: art || 'fehler' }; }

async function apiRufen(methode, bereich, body) {
  let antwort;
  try {
    antwort = await fetch('/api/data?bereich=' + encodeURIComponent(bereich), {
      method: methode,
      credentials: 'same-origin',
      headers: body ? { 'content-type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined
    });
  } catch (e) {
    // Typischer Fall: kein Netz — oder die Access-Anmeldung ist abgelaufen und
    // Cloudflare leitet auf die Anmeldeseite um, was der Browser hier blockt.
    throw Klartext(navigator.onLine
      ? 'Keine Verbindung zum Server. Vermutlich ist die Anmeldung abgelaufen — bitte die Seite neu laden.'
      : 'Gerade offline. Die Änderungen bleiben auf diesem Gerät gespeichert und werden später übertragen.',
      navigator.onLine ? 'anmeldung' : 'offline');
  }

  // Umleitung zur Anmeldeseite: kommt als HTML zurueck, nicht als JSON.
  const typ = antwort.headers.get('content-type') || '';
  if (antwort.redirected || !typ.includes('application/json')) {
    throw Klartext('Die Anmeldung ist abgelaufen. Bitte die Seite neu laden und noch einmal anmelden.', 'anmeldung');
  }

  const daten = await antwort.json().catch(() => null);

  if (antwort.status === 401) {
    throw Klartext((daten && daten.fehler) ||
      'Nicht angemeldet. Bitte die Seite neu laden.', 'anmeldung');
  }
  if (antwort.status === 409) {
    throw { konflikt: true, ...daten };
  }
  if (!antwort.ok) {
    throw Klartext((daten && daten.fehler) ||
      ('Der Server hat mit Fehler ' + antwort.status + ' geantwortet.'), 'fehler');
  }

  // Wer angemeldet ist, setzt die Middleware in diesen Kopfzeilen-Eintrag.
  const wer = antwort.headers.get('x-angemeldet-als');
  if (wer) {
    const el = document.getElementById('angemeldet');
    if (el) el.textContent = wer;
  }

  return daten;
}

/* ── Der Datenspeicher einer Seite ──────────────────────────────── */

const Daten = {
  bereich: null,
  inhalt: null,
  version: 0,
  gespeichertAm: null,
  nurLokal: false,          // true = Stand kommt aus dem Browser, nicht vom Server
  offen: false,             // true = es gibt noch nicht gespeicherte Aenderungen
  beiAenderung: null,       // Rueckruf zum Neuzeichnen
  _timer: null,
  _laeuft: false,

  get _schluessel() { return 'primaersport-intern-' + this.bereich; },

  /** Seite starten: Daten laden, Browser-Kopie als Rueckfallebene. */
  async oeffnen(bereich) {
    this.bereich = bereich;
    Status.setze('Lädt …', 'laeuft');

    try {
      const antwort = await apiRufen('GET', bereich);
      this.inhalt = antwort.daten || LEERE_STRUKTUR[bereich]();
      this.version = antwort.version || 0;
      this.gespeichertAm = antwort.gespeichertAm;
      this.nurLokal = false;

      // Hat dieses Gerät noch ungesendete Änderungen von vorhin?
      const kopie = this._kopieLesen();
      if (kopie && kopie.offen && kopie.version >= this.version) {
        if (confirm('Auf diesem Gerät liegen noch Änderungen, die nicht übertragen wurden ' +
                    '(vom ' + zeitHuebsch(kopie.zeit) + ').\n\n' +
                    'OK = diese Änderungen verwenden und jetzt speichern\n' +
                    'Abbrechen = den Stand vom Server verwenden')) {
          this.inhalt = kopie.daten;
          this.merken();
          this.planeSpeichern(0);
        } else {
          this._kopieLoeschen();
        }
      }

      Status.setze(this.gespeichertAm ? 'Gespeichert · ' + zeitHuebsch(this.gespeichertAm) : 'Noch nichts gespeichert', 'ok');
    } catch (e) {
      const kopie = this._kopieLesen();
      if (kopie) {
        this.inhalt = kopie.daten;
        this.version = kopie.version || 0;
        this.nurLokal = true;
        this.offen = !!kopie.offen;
        warnungZeigen((e.klartext || 'Der Server ist nicht erreichbar.') +
          ' Angezeigt wird der zuletzt auf diesem Gerät gespeicherte Stand.', e.art === 'anmeldung');
        Status.setze('Nur auf diesem Gerät', 'fehler');
      } else {
        this.inhalt = LEERE_STRUKTUR[bereich]();
        this.version = 0;
        this.nurLokal = true;
        warnungZeigen((e.klartext || 'Der Server ist nicht erreichbar.') +
          ' Es wird vorerst eine leere Ansicht gezeigt — bitte nichts Wichtiges eintragen, ' +
          'bevor die Verbindung wieder steht.', e.art === 'anmeldung');
        Status.setze('Nicht verbunden', 'fehler');
      }
    }

    if (this.beiAenderung) this.beiAenderung();
    return this.inhalt;
  },

  /** Etwas geaendert: sofort im Browser sichern, gleich darauf zum Server. */
  aendern(arbeit) {
    if (typeof arbeit === 'function') arbeit(this.inhalt);
    this.offen = true;
    this.merken();
    if (this.beiAenderung) this.beiAenderung();
    this.planeSpeichern();
  },

  planeSpeichern(verzoegerung) {
    clearTimeout(this._timer);
    Status.setze('Nicht gespeichert …', 'laeuft');
    this._timer = setTimeout(() => this.speichern(), verzoegerung === undefined ? 900 : verzoegerung);
  },

  /** Zum Server schreiben. */
  async speichern(erzwingen) {
    clearTimeout(this._timer);
    if (this._laeuft) { this.planeSpeichern(400); return; }
    this._laeuft = true;
    Status.setze('Speichert …', 'laeuft');

    try {
      const antwort = await apiRufen('PUT', this.bereich,
        erzwingen ? { daten: this.inhalt } : { version: this.version, daten: this.inhalt });
      this.version = antwort.version;
      this.gespeichertAm = antwort.gespeichertAm;
      this.offen = false;
      this.nurLokal = false;
      this._kopieLoeschen();
      warnungWeg();
      Status.setze('Gespeichert · ' + zeitHuebsch(this.gespeichertAm), 'ok');
    } catch (e) {
      if (e.konflikt) {
        Status.setze('Anderes Gerät war schneller', 'fehler');
        const nehmen = confirm(
          'Auf einem anderen Gerät wurde inzwischen gespeichert.\n\n' +
          'OK = meine Änderungen von hier durchsetzen (der andere Stand wird überschrieben)\n' +
          'Abbrechen = Seite neu laden und den anderen Stand übernehmen');
        if (nehmen) {
          this.version = e.version || this.version;
          this._laeuft = false;
          return this.speichern(true);
        }
        location.reload();
        return;
      }
      this.offen = true;
      this.merken();
      Status.setze(e.art === 'offline' ? 'Offline — nur auf diesem Gerät' : 'Nicht gespeichert', 'fehler');
      warnungZeigen((e.klartext || 'Das Speichern hat nicht geklappt.') +
        ' Die Eingaben sind auf diesem Gerät gesichert und gehen nicht verloren.',
        e.art === 'anmeldung');
      // Im Offline-Fall in Ruhe weiter versuchen.
      if (e.art === 'offline') this.planeSpeichern(15000);
    } finally {
      this._laeuft = false;
    }
  },

  /* ── Kopie im Browser ── */
  merken() {
    try {
      localStorage.setItem(this._schluessel, JSON.stringify({
        daten: this.inhalt, version: this.version, offen: this.offen, zeit: new Date().toISOString()
      }));
    } catch (e) { /* Speicher voll oder gesperrt — nicht schlimm */ }
  },
  _kopieLesen() {
    try {
      const roh = localStorage.getItem(this._schluessel);
      return roh ? JSON.parse(roh) : null;
    } catch (e) { return null; }
  },
  _kopieLoeschen() {
    try { localStorage.removeItem(this._schluessel); } catch (e) {}
  }
};

/* Beim Verlassen warnen, wenn noch etwas offen ist. */
window.addEventListener('beforeunload', (e) => {
  if (Daten.offen) { e.preventDefault(); e.returnValue = ''; }
});

/* Wenn das Netz zurueckkommt, Offenes gleich nachreichen. */
window.addEventListener('online', () => {
  if (Daten.offen && Daten.bereich) { toast('Verbindung wieder da — speichere …'); Daten.planeSpeichern(300); }
});

/* ── Warnband oben auf der Seite ────────────────────────────────── */

function warnungZeigen(text, mitNeuladen) {
  let el = document.getElementById('warnband');
  if (!el) {
    el = document.createElement('div');
    el.id = 'warnband';
    const ziel = document.querySelector('main') || document.body;
    ziel.insertBefore(el, ziel.firstChild);
  }
  el.className = 'warnung' + (mitNeuladen ? ' schlimm' : '');
  el.innerHTML = '<span>⚠️</span><span>' + esc(text) + '</span>' +
    (mitNeuladen ? '<button class="btn klein ghost" onclick="location.reload()">Neu laden</button>' : '');
}

function warnungWeg() {
  const el = document.getElementById('warnband');
  if (el) el.remove();
}

/* ── Sicherung: herunterladen und einspielen ────────────────────── */

const Sicherung = {
  /** Aktuellen Bereich als Datei herunterladen. */
  herunterladen(bereich, inhalt) {
    const paket = {
      programm: 'primaersport-intern',
      bereich,
      exportiertAm: new Date().toISOString(),
      version: Daten.version,
      daten: inhalt
    };
    const blob = new Blob([JSON.stringify(paket, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'primaersport-' + bereich + '-' + heuteIso() + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('Sicherungsdatei wurde heruntergeladen.');
  },

  /** Alle drei Bereiche in einer Datei (nur Übersichtsseite). */
  async alleHerunterladen() {
    const paket = { programm: 'primaersport-intern', bereich: 'alle', exportiertAm: new Date().toISOString(), inhalte: {} };
    for (const name of Object.keys(LEERE_STRUKTUR)) {
      try {
        const a = await apiRufen('GET', name);
        paket.inhalte[name] = a.daten;
      } catch (e) {
        toast('Der Bereich „' + name + '" konnte nicht gelesen werden: ' + (e.klartext || ''), true);
        return;
      }
    }
    const blob = new Blob([JSON.stringify(paket, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'primaersport-intern-komplett-' + heuteIso() + '.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('Komplette Sicherung wurde heruntergeladen.');
  },

  /** Datei auswaehlen und einspielen. */
  einspielen(bereich, fertig) {
    const feld = document.createElement('input');
    feld.type = 'file';
    feld.accept = 'application/json,.json';
    feld.onchange = async () => {
      const datei = feld.files && feld.files[0];
      if (!datei) return;
      let paket;
      try {
        paket = JSON.parse(await datei.text());
      } catch (e) {
        toast('Diese Datei ist keine gültige Sicherung (kein lesbares JSON).', true);
        return;
      }

      // Komplettsicherung: nur den passenden Bereich herausnehmen.
      let neu = null;
      if (paket && paket.inhalte && paket.inhalte[bereich]) neu = paket.inhalte[bereich];
      else if (paket && paket.daten) neu = paket.daten;
      else neu = paket;

      if (paket && paket.bereich && paket.bereich !== bereich && paket.bereich !== 'alle') {
        toast('Diese Datei gehört zum Bereich „' + paket.bereich + '", nicht zu „' + bereich + '".', true);
        return;
      }
      if (!neu || typeof neu !== 'object') {
        toast('In dieser Datei sind keine verwertbaren Daten enthalten.', true);
        return;
      }

      const anzahl = Array.isArray(neu.eintraege) ? neu.eintraege.length
                   : Array.isArray(neu.phasen) ? neu.phasen.length : null;
      const info = anzahl === null ? '' : ' (' + anzahl + ' ' + (neu.phasen ? 'Phasen' : 'Einträge') + ')';

      if (!confirm('Sicherung vom ' + datumHuebsch(paket.exportiertAm) + ' einspielen' + info + '?\n\n' +
                   'Der aktuelle Inhalt dieses Bereichs wird dabei vollständig ersetzt.')) return;

      Daten.inhalt = neu;
      Daten.offen = true;
      Daten.merken();
      await Daten.speichern(true);   // erzwingen: die Datei gewinnt
      if (fertig) fertig();
      toast('Sicherung wurde eingespielt.');
    };
    feld.click();
  }
};

/* ── Dialoge ────────────────────────────────────────────────────── */

function dialogOeffnen(id) {
  const d = document.getElementById(id);
  if (!d) return;
  if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', '');
  const erstes = d.querySelector('input,select,textarea');
  if (erstes && window.innerWidth > 640) setTimeout(() => erstes.focus(), 60);
}

function dialogSchliessen(id) {
  const d = document.getElementById(id);
  if (!d) return;
  if (typeof d.close === 'function') d.close(); else d.removeAttribute('open');
}

/* ── Druck ──────────────────────────────────────────────────────── */

function drucken(html) {
  let bereich = document.getElementById('druckbereich');
  if (!bereich) {
    bereich = document.createElement('div');
    bereich.id = 'druckbereich';
    document.body.appendChild(bereich);
  }
  bereich.innerHTML = html;
  document.body.classList.add('druckt');
  const aufraeumen = () => {
    document.body.classList.remove('druckt');
    window.removeEventListener('afterprint', aufraeumen);
  };
  window.addEventListener('afterprint', aufraeumen);
  window.print();
  setTimeout(aufraeumen, 1500);   // Rueckfallebene fuer Browser ohne afterprint
}

/* ── Gemeinsame Auswahllisten ───────────────────────────────────── */

const ALTERSGRUPPEN = [
  'Kindergarten (3–6)',
  'Volksschule (6–10)',
  'Sekundarstufe (10–14)',
  'Jugendliche (14+)',
  'altersübergreifend'
];

const SCHWERPUNKTE = ['Körpererfahrung', 'Materialerfahrung', 'Sozialerfahrung'];

const SPIEL_KATEGORIEN = [
  'Körpererfahrung',
  'Materialerfahrung',
  'Sozialerfahrung',
  'Wahrnehmung',
  'Bewegungsbaustelle',
  'Ruhe/Entspannung'
];

/** <option>-Liste bauen. */
function optionen(werte, ausgewaehlt, ersteZeile) {
  let html = ersteZeile ? '<option value="">' + esc(ersteZeile) + '</option>' : '';
  html += werte.map(w =>
    '<option value="' + esc(w) + '"' + (w === ausgewaehlt ? ' selected' : '') + '>' + esc(w) + '</option>'
  ).join('');
  return html;
}

navMarkieren();
