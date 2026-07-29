# Interner Bereich — Einrichtung und Bedienung

Diese Datei liegt im geschützten Ordner `intern/` und ist damit selbst nur nach
Anmeldung erreichbar. Sie beschreibt den Umzug zu Cloudflare, den Zugriffsschutz
und die tägliche Bedienung.

---

## Was gebaut wurde

| Datei | Zweck |
|---|---|
| `functions/api/data.js` | Server-Teil: liest und speichert die Daten im Cloudflare-KV-Speicher |
| `functions/_middleware.js` | Sicherheitsnetz vor `/intern/` und `/api/` |
| `intern/index.html` | Übersicht mit den drei Kacheln |
| `intern/zielplan.html` | Zielplan mit vier Phasen |
| `intern/stundenbilder.html` | Notizen & Stundenbilder inkl. Druckansicht |
| `intern/spiele.html` | Spieledatenbank inkl. Übernahme ins Stundenbild |
| `intern/gemeinsam.css` / `.js` | gemeinsames Aussehen und die Speicherlogik |

Öffentlich bleiben Startseite, Wissensdatenbank, Impressum und Datenschutz.
Die tägliche Studien-Automatik bleibt unverändert: Sie pusht weiter ins
GitHub-Repo, und Cloudflare Pages veröffentlicht jeden Push automatisch.

---

## Schritt 1 — Dateien ins Repo bringen

Der neue Code muss auf GitHub liegen, damit Cloudflare ihn findet:

```bash
git add .gitignore robots.txt prompt-studien.md functions intern && git commit -m "Interner Bereich mit Cloudflare Pages Functions und Zugriffsschutz" && git push
```

> **Wichtig:** Am 28.07.2026 hat die Studien-Automatik die Ordner `functions/`
> und `intern/` einmal für „projektfremd" gehalten und in die `.gitignore`
> eingetragen. Das ist rückgängig gemacht; in `prompt-studien.md` steht jetzt
> ausdrücklich, dass die Automatik nur `studien.js` anfassen darf. Wenn nach
> einem nächtlichen Lauf einmal etwas fehlt: zuerst in die `.gitignore` schauen.

---

## Schritt 2 — Cloudflare-Konto anlegen

1. <https://dash.cloudflare.com/sign-up> öffnen
2. E-Mail (`daniel.robnik30@gmail.com`) und ein Passwort eintragen
3. Bestätigungsmail abrufen und den Link anklicken

Kostet nichts. Kreditkarte ist für diesen Schritt nicht nötig.

---

## Schritt 3 — Domain zu Cloudflare hinzufügen

1. Im Dashboard oben auf **Add a domain** (bzw. „Domain hinzufügen")
2. `primaersport-projekte.at` eintragen, weiter
3. Als Tarif **Free** wählen
4. Cloudflare liest jetzt die bestehenden DNS-Einträge von IONOS ein und zeigt sie an

### ⚠️ Der wichtigste Punkt des ganzen Umzugs

Prüfe in dieser Liste, ob die **MX-Einträge** dabei sind — das sind die Einträge
für dein E-Mail-Postfach `office@primaersport-projekte.at` bei IONOS. Ebenso
eventuelle `TXT`-Einträge (SPF, DKIM) und ein Eintrag namens `autodiscover` oder
`imap`/`smtp`.

**Fehlt hier ein MX-Eintrag und du stellst trotzdem die Nameserver um, kommen ab
diesem Moment keine E-Mails mehr an.**

Falls etwas fehlt: In einem zweiten Browserfenster bei IONOS unter
*Domains & SSL → primaersport-projekte.at → DNS* die vorhandenen Einträge
ansehen und bei Cloudflare von Hand ergänzen (**Add record**). Erst wenn die
Liste vollständig ist, weitermachen.

Am Ende zeigt Cloudflare **zwei Nameserver-Namen** an, etwa:

```
ana.ns.cloudflare.com
rick.ns.cloudflare.com
```

Diese beiden Namen sind für dein Konto individuell — nimm genau die, die dir
angezeigt werden, nicht die aus diesem Beispiel. Fenster offen lassen.

---

## Schritt 4 — Nameserver bei IONOS umstellen

1. Bei <https://login.ionos.de> anmelden
2. **Domains & SSL** öffnen
3. Bei `primaersport-projekte.at` rechts auf das Zahnrad bzw. die drei Punkte
4. **Nameserver** (je nach Ansicht „Nameserver anpassen" oder „DNS")
5. Von *IONOS-Nameserver* auf **eigene / externe Nameserver** umstellen
6. Eintragen:

   | Feld | Wert |
   |---|---|
   | Nameserver 1 | der **erste** Name aus Schritt 3 (z. B. `ana.ns.cloudflare.com`) |
   | Nameserver 2 | der **zweite** Name aus Schritt 3 (z. B. `rick.ns.cloudflare.com`) |

   Weitere Felder (Nameserver 3–4) bleiben leer.
7. Speichern

Danach bei Cloudflare auf **Check nameservers** klicken. Die Umstellung dauert
meist ein bis vier Stunden, in seltenen Fällen bis zu 24 Stunden. Cloudflare
schickt eine E-Mail, sobald die Domain aktiv ist. **Die Website läuft in dieser
Zeit normal weiter.**

---

## Schritt 5 — Cloudflare-Pages-Projekt anlegen

1. Im Dashboard links auf **Compute (Workers & Pages)**
2. **Create** → Reiter **Pages** → **Connect to Git**
3. GitHub verbinden und autorisieren (Cloudflare fragt nach Zugriff auf die Repos —
   es genügt, nur `primaersport-projekte` freizugeben)
4. Repository `jamesmccloud122/primaersport-projekte` auswählen → **Begin setup**
5. Einstellungen:

   | Feld | Wert |
   |---|---|
   | Project name | `primaersport-projekte` |
   | Production branch | `main` |
   | Framework preset | **None** |
   | Build command | **leer lassen** |
   | Build output directory | `/` |

6. **Save and Deploy**

Nach etwa einer Minute ist die Seite unter `<projektname>.pages.dev` erreichbar.

Ab jetzt gilt: **Jeder Push ins Repo veröffentlicht automatisch neu** — auch die
der nächtlichen Studien-Automatik. Daran ändert sich nichts.

---

## Schritt 6 — Datenspeicher (KV) anlegen und verbinden

1. Links **Storage & Databases** → **KV**
2. **Create a namespace**, Name: `primaersport-intern` → anlegen
3. Zurück ins Pages-Projekt → **Settings** → **Bindings** (bzw. *Functions → KV namespace bindings*)
4. **Add binding**:

   | Feld | Wert |
   |---|---|
   | Variable name | `INTERN_KV` |
   | KV namespace | `primaersport-intern` |

   Der Variablenname muss **exakt** `INTERN_KV` lauten — daran erkennt der Code den Speicher.
5. Dasselbe Binding auch für **Preview** anlegen, falls die Oberfläche das getrennt abfragt.
6. **Deployments** → beim obersten Eintrag **Retry deployment**, damit das Binding aktiv wird.

Ohne diesen Schritt melden die Seiten im Klartext: *„Der Datenspeicher ist nicht
angebunden …"* — dann ist hier etwas offen.

---

## Schritt 7 — Eigene Domain aufs Pages-Projekt legen

Erst machen, wenn die Domain laut Schritt 4 bei Cloudflare **aktiv** ist.

1. Pages-Projekt → **Custom domains** → **Set up a domain**
2. `primaersport-projekte.at` eintragen → **Continue** → **Activate domain**
3. Cloudflare legt den passenden DNS-Eintrag selbst an
4. Optional dasselbe für `www.primaersport-projekte.at`

Nach wenigen Minuten läuft die Website über Cloudflare. Das TLS-Zertifikat kommt
automatisch.

> Die Datei `CNAME` im Repo (Rest von GitHub Pages) kann liegen bleiben. Sie
> stört Cloudflare nicht und macht den Rückweg zu GitHub Pages einfacher.

---

## Schritt 8 — Zugriffsschutz einrichten (Zero Trust / Access)

1. Im Dashboard links auf **Zero Trust**
2. Beim ersten Mal: einen **Team-Namen** wählen, z. B. `primaersport`.
   Daraus wird deine Anmeldeadresse `primaersport.cloudflareaccess.com`.
3. Tarif **Free** wählen (bis 50 Personen kostenlos).
   Cloudflare fragt beim Einrichten unter Umständen nach einer Zahlungsmethode —
   abgebucht wird beim Free-Tarif nichts.
4. Links **Access** → **Applications** → **Add an application** → **Self-hosted**

**Anwendung benennen:**

| Feld | Wert |
|---|---|
| Application name | `Primärsport intern` |
| Session Duration | `1 month` (dann muss man sich selten neu anmelden) |

**Welche Adressen geschützt werden** — hier zwei Einträge anlegen:

| Subdomain | Domain | Path |
|---|---|---|
| *(leer)* | `primaersport-projekte.at` | `intern` |
| *(leer)* | `primaersport-projekte.at` | `api` |

Den zweiten über **+ Add public hostname** hinzufügen. Ein `Path` wirkt als
Anfang der Adresse — `intern` deckt also `/intern/` und alles darunter ab.

**Regel (Policy) anlegen:**

| Feld | Wert |
|---|---|
| Policy name | `Nur ich` |
| Action | **Allow** |
| Include → Selector | **Emails** |
| Value | `daniel.robnik30@gmail.com` |

**Anmeldeverfahren:** Unter *Authentication* muss **One-time PIN** angehakt sein
(ist standardmäßig vorhanden). Damit kommt der Anmeldecode per E-Mail — es ist
kein Google-Login und kein zusätzliches Konto nötig.

Speichern mit **Save application**.

### Optionaler Zusatzriegel

Damit der Server jede Anmeldung zusätzlich kryptografisch prüft:

1. In der fertigen Application unter **Overview** die **Application Audience (AUD) Tag**
   kopieren (lange Zeichenfolge)
2. Pages-Projekt → **Settings** → **Variables and Secrets** → zwei Variablen anlegen:

   | Name | Wert |
   |---|---|
   | `ACCESS_TEAM` | dein Team-Name, z. B. `primaersport` |
   | `ACCESS_AUD` | das kopierte AUD-Tag |

3. Neu veröffentlichen (**Retry deployment**)

Ohne diese beiden Variablen funktioniert alles genauso — der Schutz ruht dann
allein auf Cloudflare Access, was für den normalen Betrieb ausreicht.

---

## Schritt 9 — Prüfen

| Adresse | Erwartung |
|---|---|
| `primaersport-projekte.at` | Startseite, **ohne** Anmeldung |
| `primaersport-projekte.at/wissensdatenbank.html` | Wissensdatenbank, **ohne** Anmeldung |
| `primaersport-projekte.at/intern/` | Anmeldemaske von Cloudflare |
| `<projekt>.pages.dev/intern/` | leitet auf die Hauptdomain um (dort greift der Schutz) |

Anmelden: E-Mail eintragen → Cloudflare schickt einen sechsstelligen Code →
Code eintragen → der interne Bereich öffnet sich.

---

## Schritt 10 — Datenschutzerklärung anpassen

**Nach** dem Umzug stimmt der Hosting-Abschnitt in `datenschutz.html` nicht mehr:
Dort steht GitHub Pages, ausgeliefert wird künftig von Cloudflare.

In `datenschutz.html` den Abschnitt *„Hosting und Server-Logfiles"* ersetzen:
statt GitHub, Inc. dann **Cloudflare, Inc., 101 Townsend Street, San Francisco,
CA 94107, USA**. Auch Cloudflare ist unter dem EU-U.S. Data Privacy Framework
zertifiziert, der bestehende Satz dazu passt also weiterhin — nur der Name und
der Link auf die Datenschutzerklärung
(<https://www.cloudflare.com/privacypolicy/>) ändern sich.

---

## Bedienung

### Wie melde ich mich an?

`primaersport-projekte.at/intern/` aufrufen → E-Mail eintragen → den Code aus der
E-Mail eintragen. Danach bleibt man einen Monat angemeldet (Session Duration).
Auf jedem Gerät einmal — Handy, Laptop, Stream-PC.

### Wie füge ich ein Gerät hinzu?

Gar nicht. Geräte werden nicht freigeschaltet, sondern **Personen**. Auf einem
neuen Gerät einfach `/intern/` aufrufen und den Code eingeben.

### Wie füge ich eine Person hinzu?

Zero Trust → **Access** → **Applications** → `Primärsport intern` → **Policies** →
Regel `Nur ich` bearbeiten → beim Selector *Emails* die weitere Adresse ergänzen
(oder *Emails* mehrfach anlegen) → **Save**.

Ab sofort kann sich diese Person mit ihrer E-Mail anmelden — sie braucht kein
Cloudflare-Konto, nur Zugriff auf ihr Postfach. Wieder entfernen: Adresse aus der
Liste löschen.

### Wo liegen meine Daten?

Im **Cloudflare-KV-Speicher** deines eigenen Kontos, in drei Einträgen
(`bereich:zielplan`, `bereich:stundenbilder`, `bereich:spiele`). Zusätzlich hält
jeder Browser eine Sicherheitskopie des zuletzt bearbeiteten Stands — falls das
Netz ausfällt, geht nichts verloren.

Cloudflare ist ein US-Anbieter. Für eigene Notizen ist das unkritisch. Wenn du in
Stundenbildern **Namen von Kindern** notierst, sind das personenbezogene Daten —
dann besser mit Initialen arbeiten.

### Wie mache ich eine Sicherung?

- **Ein Bereich:** auf der jeweiligen Seite unten *„⬇ Als Datei sichern"*
- **Alles auf einmal:** auf der Übersicht *„⬇ Komplette Sicherung herunterladen"*
- **Zurückspielen:** *„⬆ Sicherung einspielen"*, Datei wählen, bestätigen.
  Der aktuelle Inhalt des Bereichs wird dabei vollständig ersetzt.

Empfehlung: einmal im Monat die Komplettsicherung herunterladen und im
Obsidian-Vault ablegen. Damit bist du unabhängig von Cloudflare.

---

## Laufende Kosten

| Posten | Kosten | Grenze |
|---|---|---|
| Cloudflare-Konto, DNS | 0 € | — |
| Pages (Auslieferung der Website) | 0 € | 500 Bauvorgänge/Monat, Aufrufe unbegrenzt |
| Pages Functions (`/api/data`) | 0 € | 100.000 Aufrufe/Tag |
| KV-Datenspeicher | 0 € | 100.000 Lesevorgänge/Tag, **1.000 Schreibvorgänge/Tag**, 1 GB |
| Zero Trust Access | 0 € | bis 50 Personen |
| Domain bei IONOS | unverändert | bleibt dort registriert |

**Realistisch bleibt das dauerhaft kostenlos.** Ein Schreibvorgang entsteht rund
eine Sekunde nach der letzten Eingabe, nicht bei jedem Tastendruck — ein
intensiver Arbeitstag kommt auf einige Dutzend, nicht auf tausend.

Geld kostet es erst, wenn du über 50 Personen freischaltest (Zero Trust ab ca.
7 $/Person/Monat) oder die KV-Grenzen dauerhaft überschreitest (Workers Paid,
5 $/Monat). Beides ist bei dieser Nutzung nicht in Sicht. **Cloudflare bucht ohne
ausdrückliche Tarifänderung nichts ab.**

---

## Technische Notizen

- **Adressen ohne `.html`:** Cloudflare Pages leitet `/intern/zielplan.html`
  automatisch auf `/intern/zielplan` um. Beide Schreibweisen funktionieren.
- **Änderungen auf mehreren Geräten:** Jeder Bereich hat eine Versionsnummer.
  Hat ein anderes Gerät zwischendurch gespeichert, fragt die Seite nach, statt
  stillschweigend zu überschreiben.
- **Der KV-Speicher ist „eventually consistent":** In seltenen Fällen dauert es
  bis zu einer Minute, bis eine Änderung auf einem anderen Gerät sichtbar ist.
  Notfalls die Seite neu laden.
- **Lokal testen:**
  ```bash
  npx wrangler pages dev . --kv INTERN_KV --port 8788
  ```
  Unter `http://127.0.0.1:8788/intern/` läuft alles ohne Anmeldung; die Daten
  liegen dann in `.wrangler/` und nicht in der echten Datenbank.
- **Notfallschalter:** Sperrt der Zugriffsschutz dich versehentlich aus, kannst du
  im Pages-Projekt unter *Variables and Secrets* die Variable `ACCESS_PFLICHT`
  auf `nein` setzen. Dann prüft nur noch Cloudflare Access selbst. Danach wieder
  entfernen.
