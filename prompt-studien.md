# Tägliches Studien-Update für die Wissensdatenbank

Du arbeitest im Projektordner der Website **primaersport-projekte.at**. Ziel ist es,
die Wissensdatenbank um aktuelle wissenschaftliche Studien zu erweitern. Arbeite die
folgenden Schritte der Reihe nach ab.

## 0. Dein Auftrag hat einen engen Rand

Du fasst in diesem Lauf **ausschliesslich `studien.js`** an. Sonst nichts.

- **Raeume nichts auf.** Im Projektordner liegen Dateien und Ordner, die nicht zu
  deiner Aufgabe gehoeren — unter anderem `functions/` (Serverteil von Cloudflare
  Pages: `/api/data` und der Zugriffsschutz) und `intern/` (passwortgeschuetzter
  Bereich). **Diese gehoeren zur Website und muessen im Repo bleiben.** Auch alles
  andere, was du nicht kennst, laesst du unveraendert stehen.
- **Aendere niemals `.gitignore`**, entferne nichts aus der Versionierung, loesche
  keine Dateien und benenne nichts um.
- Wirkt etwas fehl am Platz: **melde es in deiner Ausgabe**, aber greife nicht ein.
- Committe nur `studien.js` — nie mit `git commit -a` oder `-am`, sondern immer
  nur den zuvor mit `git add studien.js` vorbereiteten Stand.

## 1. Bestand einlesen

Lies zuerst `studien.js`. Die Datei enthält ein Array `studies` mit bereits erfassten
Studien. Merke dir **alle** vorhandenen `title`- und `link`-Werte — sie bestimmen, was
als Duplikat gilt.

## 2. Suchen

Suche mit **WebSearch** nach Studien aus **2025 und 2026** zu diesen Themenfeldern:

- Psychomotorik / psychomotor intervention
- Motopädagogik
- motorische Entwicklung und Kognition bei Kindern
- fundamental motor skills
- executive functions (im Zusammenhang mit Bewegung)
- Developmental Coordination Disorder (DCD)
- Bewegungsförderung in Kindergarten und Vorschule
- Motogeragogik (Psychomotorik im Alter)

**Variiere die Suchbegriffe von Tag zu Tag.** Leite die Auswahl aus dem heutigen Datum
ab: Nimm den Wochentag als Ausgangspunkt und beginne mit einem anderen Themenfeld der
obigen Liste, kombiniere es mit wechselnden Zusatzbegriffen (z. B. „randomized controlled
trial", „meta-analysis", „preschool", „systematic review", „intervention study",
„children motor competence"). Führe mehrere Suchen durch, nicht nur eine.

Bevorzugte Quellen: **Frontiers, MDPI, Springer/BMC, PubMed Central (PMC), ScienceDirect**.
Bevorzuge Peer-Review-Publikationen; keine Blogs, keine Preprints ohne Peer Review,
keine Pressemitteilungen.

## 3. Duplikate ausschließen

Verwirf jeden Treffer, dessen Titel oder Link bereits in `studien.js` vorkommt. Prüfe
den Titel sinngemäß, nicht nur zeichengenau — dieselbe Studie kann bei verschiedenen
Anbietern leicht abweichend benannt sein. Im Zweifel: überspringen.

## 4. Auswählen und lesen

Wähle **1 bis 3** wirklich neue und fachlich relevante Studien aus. Lieber eine sehr
gute als drei mittelmäßige. Öffne jede ausgewählte Studie mit **WebFetch** und lies
Abstract sowie Methoden- und Ergebnisteil.

**Erfinde nichts.** Jede Zahl, jeder Stichprobenumfang und jede Effektstärke muss
tatsächlich in der Quelle stehen. Steht eine Angabe dort nicht, lass sie weg und
formuliere den Satz ohne sie. Lieber knapp und korrekt als vollständig und erfunden.
Wenn du eine Studie nicht öffnen kannst, nimm sie nicht auf.

## 5. Einfügen

Füge die neuen Einträge **ganz oben** im Array `studies` in `studien.js` ein — direkt
nach der Zeile `const studies = [`. Die bestehenden Einträge bleiben dabei vollständig
und unverändert erhalten. Ändere keine anderen Dateien.

Exakt dieses Format und diese Feldreihenfolge:

```javascript
  {
    title: "Originaltitel der Studie, unübersetzt",
    authors: "Nachname et al., JAHR · Zeitschrift (Anbieter)",
    topic: "Kurzes deutsches Themenschlagwort",
    method: "Stichprobe, Alter, Land, Studiendesign, Dauer und Umfang der Intervention.",
    findings: "Konkrete Ergebnisse mit Zahlen und Effektstärken, soweit in der Quelle vorhanden.",
    relevance: "Ein Satz: Was bedeutet das für die praktische psychomotorische Arbeit?",
    link: "https://...",
    date: "JJJJ-MM-TT"
  },
```

Regeln zu den Feldern:

- **Alle Texte auf Deutsch**, einzige Ausnahme ist `title` (Originaltitel bleibt).
- `topic`: Wenn ein inhaltlich passendes Schlagwort bereits im Array vorkommt, verwende
  genau dieses — sonst wächst der Themenfilter der Seite unnötig zu.
- `findings`: nach Möglichkeit mit konkreten Zahlen (Stichprobe, p-Werte, Cohens d,
  Hedges g, SMD, Prozentangaben).
- `relevance`: genau ein Satz, praxisbezogen für Kindergarten, Schule, Elternarbeit
  oder Therapie.
- `date`: das **heutige** Datum im Format JJJJ-MM-TT (Erfassungsdatum, nicht das
  Publikationsdatum).
- Achte auf gültiges JavaScript: doppelte Anführungszeichen innerhalb der Texte
  vermeiden oder escapen, hinter jedem Objekt ein Komma.

## 6. Wenn nichts Neues da ist

Findest du an einem Tag keine passende, noch nicht erfasste Studie: **ändere nichts**,
committe nichts, pushe nichts. Gib als letzte Zeile aus:

```
ERGEBNIS: keine neuen Studien
```

Das ist ein völlig normaler Ausgang — erzwinge keine Ergänzung, nur damit sich etwas tut.

## 7. Prüfen, committen, pushen

Nur wenn du etwas ergänzt hast:

1. Prüfe die Syntax mit `node --check studien.js`. **Schlägt die Prüfung fehl, mache
   deine Änderung an `studien.js` rückgängig**, committe nichts und gib als letzte Zeile
   `ERGEBNIS: Syntaxfehler, Änderung verworfen` aus.
2. Ist die Prüfung in Ordnung: `git add studien.js`, dann committen mit der Nachricht
   `Studien-Update: <Titel der ersten neuen Studie>` und mit `git push` veröffentlichen.
   **Warte, bis der Push tatsächlich abgeschlossen ist**, und prüfe mit
   `git status`, dass nichts mehr aussteht. Beende dich nicht, solange ein Push
   noch im Hintergrund läuft — sonst bleibt der Commit liegen und die Website
   wird nicht aktualisiert.
3. Gib als letzte Zeile aus:

```
ERGEBNIS: <Anzahl> Studie(n) ergaenzt - <Titel der ersten neuen Studie>
```

Committe ausschließlich `studien.js`. Andere geänderte Dateien im Ordner lässt du in Ruhe.
