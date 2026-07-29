/**
 * Schutzriegel vor /intern/* und /api/*
 * ==============================================================
 * Cloudflare Access ist der eigentliche Türsteher. Diese Middleware ist
 * das Sicherheitsnetz darunter und schliesst zwei Luecken:
 *
 *  1) Die Vorschau-Adresse.  Ein Pages-Projekt ist immer auch unter
 *     <projekt>.pages.dev erreichbar. Eine Access-Regel fuer
 *     primaersport-projekte.at gilt dort NICHT — der interne Bereich waere
 *     ueber die pages.dev-Adresse offen. Deshalb: Jeder Aufruf von
 *     /intern/* oder /api/* ueber einen fremden Hostnamen wird auf die
 *     Hauptdomain umgeleitet, wo Access greift.
 *
 *  2) Ein vergessener oder falsch gesetzter Access-Pfad.  Ohne gueltige
 *     Access-Anmeldung kommt hier nichts durch — es erscheint stattdessen
 *     eine Seite, die erklaert, was noch fehlt.
 *
 * Oeffentliche Seiten (Startseite, Wissensdatenbank, Impressum …) beruehrt
 * diese Datei nicht.
 *
 * Einstellungen (Pages -> Settings -> Variables and Secrets), alle optional:
 *   HAUPT_DOMAIN   Standard: primaersport-projekte.at
 *   ACCESS_PFLICHT "nein" schaltet die Anmeldepflicht ab (nur fuer Notfaelle)
 *   ACCESS_TEAM    z. B. "primaersport"  ─┐ beide gesetzt = das Anmelde-Ticket
 *   ACCESS_AUD     Application Audience  ─┘ wird zusaetzlich kryptografisch geprueft
 */

const GESCHUETZT = ['/intern', '/api'];
const STANDARD_DOMAIN = 'primaersport-projekte.at';

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const pfad = url.pathname;

  // Alles Oeffentliche unveraendert durchlassen.
  const istGeschuetzt = GESCHUETZT.some(p => pfad === p || pfad.startsWith(p + '/') || pfad.startsWith(p + '?'));
  if (!istGeschuetzt) return next();

  // Lokales Testen (wrangler pages dev) kennt kein Access.
  const host = url.hostname.toLowerCase();
  if (host === 'localhost' || host === '127.0.0.1' || host === '::1' || host.endsWith('.localhost')) {
    return next();
  }

  // ── Luecke 1: fremder Hostname (z. B. pages.dev) ──────────────────
  const hauptDomain = (env.HAUPT_DOMAIN || STANDARD_DOMAIN).toLowerCase().trim();
  if (host !== hauptDomain) {
    const ziel = 'https://' + hauptDomain + pfad + url.search;
    return Response.redirect(ziel, 302);
  }

  // ── Luecke 2: keine gueltige Access-Anmeldung ─────────────────────
  if (String(env.ACCESS_PFLICHT || '').toLowerCase() === 'nein') return next();

  const email = request.headers.get('cf-access-authenticated-user-email');
  const token = request.headers.get('cf-access-jwt-assertion') || cookieLesen(request, 'CF_Authorization');

  if (!email && !token) {
    return abweisen(pfad,
      'Der Zugriffsschutz ist noch nicht aktiv.',
      'Für diese Adresse ist in Cloudflare Zero Trust noch keine Access-Application eingerichtet — ' +
      'oder sie deckt den Pfad /intern und /api nicht ab. Solange das so ist, bleibt der interne ' +
      'Bereich vorsichtshalber gesperrt.');
  }

  // Zusatzriegel: Ticket kryptografisch pruefen, wenn konfiguriert.
  if (env.ACCESS_TEAM && env.ACCESS_AUD) {
    const pruefung = await tokenPruefen(token, env.ACCESS_TEAM, env.ACCESS_AUD);
    if (!pruefung.ok) {
      return abweisen(pfad,
        'Die Anmeldung konnte nicht bestätigt werden.',
        'Bitte die Seite neu laden und noch einmal anmelden. (Grund: ' + pruefung.grund + ')');
    }
  }

  // Angemeldet — die E-Mail an die Seite weiterreichen, damit sie
  // „Angemeldet als …" anzeigen kann.
  const antwort = await next();
  const kopie = new Response(antwort.body, antwort);
  if (email) kopie.headers.set('x-angemeldet-als', email);
  kopie.headers.set('x-robots-tag', 'noindex, nofollow');
  return kopie;
}

/* ── Helfer ─────────────────────────────────────────────────────── */

function cookieLesen(request, name) {
  const roh = request.headers.get('cookie') || '';
  for (const teil of roh.split(';')) {
    const [k, ...rest] = teil.trim().split('=');
    if (k === name) return rest.join('=');
  }
  return null;
}

/** Abweisung: fuer /api/ als JSON, sonst als lesbare Seite im Website-Design. */
function abweisen(pfad, titel, text) {
  if (pfad.startsWith('/api')) {
    return new Response(JSON.stringify({ fehler: titel + ' ' + text, anmeldung: true }), {
      status: 401,
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
    });
  }
  const seite = `<!DOCTYPE html>
<html lang="de"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex">
<title>Kein Zugriff – Primär Sportprojekte</title>
<style>
  body{font-family:'Segoe UI',system-ui,sans-serif;background:#F7F4EE;color:#28322D;
       display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;padding:20px}
  .box{background:#fff;border-radius:14px;border-top:5px solid #D98E32;padding:34px 30px;max-width:520px;line-height:1.6}
  h1{color:#1F4A35;font-size:1.4rem;margin:0 0 12px}
  p{color:#5C6660;margin:0 0 14px}
  a{display:inline-block;background:#2E6E4E;color:#fff;text-decoration:none;padding:10px 22px;border-radius:28px;font-weight:600}
</style></head>
<body><div class="box">
  <h1>${titel}</h1>
  <p>${text}</p>
  <a href="/">Zur öffentlichen Startseite</a>
</div></body></html>`;
  return new Response(seite, {
    status: 401,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' }
  });
}

/* ── Access-Ticket (JWT) kryptografisch pruefen ─────────────────────
   Nur aktiv, wenn ACCESS_TEAM und ACCESS_AUD gesetzt sind. Die
   oeffentlichen Schluessel werden pro Server-Instanz zwischengespeichert,
   damit nicht jeder Aufruf sie neu holt. */

let schluesselCache = { team: null, geholt: 0, keys: null };

async function tokenPruefen(token, team, aud) {
  if (!token) return { ok: false, grund: 'kein Anmelde-Ticket vorhanden' };

  const teile = token.split('.');
  if (teile.length !== 3) return { ok: false, grund: 'Ticket unlesbar' };

  let kopf, inhalt;
  try {
    kopf   = JSON.parse(new TextDecoder().decode(base64UrlZuBytes(teile[0])));
    inhalt = JSON.parse(new TextDecoder().decode(base64UrlZuBytes(teile[1])));
  } catch (e) {
    return { ok: false, grund: 'Ticket unlesbar' };
  }

  const jetzt = Math.floor(Date.now() / 1000);
  if (inhalt.exp && jetzt > Number(inhalt.exp)) return { ok: false, grund: 'Anmeldung abgelaufen' };
  if (inhalt.nbf && jetzt < Number(inhalt.nbf) - 60) return { ok: false, grund: 'Ticket noch nicht gültig' };

  const zielgruppe = Array.isArray(inhalt.aud) ? inhalt.aud : [inhalt.aud];
  if (!zielgruppe.includes(aud)) return { ok: false, grund: 'Ticket gehört zu einer anderen Anwendung' };

  const erwarteterIss = `https://${team}.cloudflareaccess.com`;
  if (inhalt.iss && inhalt.iss !== erwarteterIss) return { ok: false, grund: 'Ticket stammt von einem anderen Team' };

  let keys;
  try {
    keys = await schluesselHolen(team);
  } catch (e) {
    // Schluessel nicht erreichbar: Der Access-Türsteher hat den Aufruf
    // bereits geprueft, sonst waere er gar nicht hier. Nicht aussperren.
    return { ok: true };
  }

  const jwk = keys.find(k => k.kid === kopf.kid);
  if (!jwk) return { ok: false, grund: 'Schlüssel des Tickets unbekannt' };

  try {
    const key = await crypto.subtle.importKey(
      'jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const gueltig = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5', key,
      base64UrlZuBytes(teile[2]),
      new TextEncoder().encode(teile[0] + '.' + teile[1]));
    return gueltig ? { ok: true } : { ok: false, grund: 'Unterschrift stimmt nicht' };
  } catch (e) {
    return { ok: false, grund: 'Prüfung fehlgeschlagen' };
  }
}

async function schluesselHolen(team) {
  const alter = Date.now() - schluesselCache.geholt;
  if (schluesselCache.keys && schluesselCache.team === team && alter < 60 * 60 * 1000) {
    return schluesselCache.keys;
  }
  const r = await fetch(`https://${team}.cloudflareaccess.com/cdn-cgi/access/certs`);
  if (!r.ok) throw new Error('certs HTTP ' + r.status);
  const daten = await r.json();
  const keys = daten.keys || [];
  schluesselCache = { team, geholt: Date.now(), keys };
  return keys;
}

function base64UrlZuBytes(s) {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4);
  const roh = atob(b64);
  const out = new Uint8Array(roh.length);
  for (let i = 0; i < roh.length; i++) out[i] = roh.charCodeAt(i);
  return out;
}
