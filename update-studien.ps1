<#
    update-studien.ps1
    ------------------
    Taegliches Studien-Update fuer die Wissensdatenbank von
    primaersport-projekte.at.

    Ruft Claude Code im Headless-Modus (claude -p) mit dem Auftrag aus
    prompt-studien.md auf. Claude sucht neue Studien, ergaenzt studien.js
    und pusht die Aenderung selbst. Jeder Lauf wird in update.log
    protokolliert.

    Manuell starten:
        powershell -ExecutionPolicy Bypass -File update-studien.ps1
#>

$ErrorActionPreference = 'Continue'

# UTF-8, damit Umlaute in Prompt, Ausgabe und Log nicht zerbrechen
$OutputEncoding = New-Object System.Text.UTF8Encoding($false)
try { [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false) } catch {}

$Projekt    = $PSScriptRoot
$LogDatei   = Join-Path $Projekt 'update.log'
$PromptFile = Join-Path $Projekt 'prompt-studien.md'
$Studien    = Join-Path $Projekt 'studien.js'
$Start      = Get-Date

function Schreibe-Log {
    param([string]$Text)
    $zeile = '[{0:yyyy-MM-dd HH:mm:ss}] {1}' -f (Get-Date), $Text
    try {
        [System.IO.File]::AppendAllText($LogDatei, $zeile + "`r`n",
            (New-Object System.Text.UTF8Encoding($false)))
    } catch { }
    Write-Output $zeile
}

function Beende {
    param([string]$Text)
    Schreibe-Log $Text
    $dauer = (Get-Date) - $Start
    Schreibe-Log ('===== Lauf beendet nach {0:mm\:ss} =====' -f $dauer)
    exit
}

Schreibe-Log '===== Lauf gestartet ====='

# --- PATH absichern -------------------------------------------------------
# Die Aufgabenplanung startet mit einer schmaleren Umgebung als eine
# normale Konsole. Deshalb die noetigen Verzeichnisse explizit ergaenzen.
$zusatz = @(
    (Join-Path $env:APPDATA 'npm'),
    'C:\Program Files\nodejs',
    'C:\Program Files\GitHub CLI',
    'C:\Program Files\Git\cmd'
) | Where-Object { Test-Path $_ }
foreach ($p in $zusatz) {
    if ($env:Path -notlike "*$p*") { $env:Path = "$p;$env:Path" }
}

# --- Voraussetzungen ------------------------------------------------------
foreach ($werkzeug in @('claude', 'node', 'git')) {
    if (-not (Get-Command $werkzeug -ErrorAction SilentlyContinue)) {
        Beende "ABBRUCH: '$werkzeug' wurde nicht gefunden."
    }
}
if (-not (Test-Path $PromptFile)) { Beende "ABBRUCH: prompt-studien.md fehlt." }
if (-not (Test-Path $Studien))    { Beende "ABBRUCH: studien.js fehlt." }

$anzahlVorher = ([regex]::Matches((Get-Content $Studien -Raw), '(?m)^\s*title:')).Count
Schreibe-Log "Bestand vor dem Lauf: $anzahlVorher Studien"

# --- Repo auf Stand bringen ----------------------------------------------
# Der Credential-Helper wird lokal gesetzt, damit 'git push' auch ohne
# Eingabemoeglichkeit funktioniert (Token kommt aus der GitHub CLI).
git -C $Projekt config credential.helper '!gh auth git-credential' 2>&1 | Out-Null
$pull = git -C $Projekt pull --rebase --autostash 2>&1 | Out-String
Schreibe-Log ("git pull: " + ($pull.Trim() -replace '\s*\r?\n\s*', ' | '))

# --- Claude im Headless-Modus ---------------------------------------------
# Bewusst KEIN --dangerously-skip-permissions: Die Automatik darf nur
# genau diese Werkzeuge benutzen. Alles andere wird verweigert.
$werkzeuge = @(
    'WebSearch', 'WebFetch', 'Read', 'Edit', 'Glob', 'Grep',
    'Bash(node --check studien.js)',
    'Bash(git add studien.js)',
    'Bash(git commit *)',
    'Bash(git push *)',
    'Bash(git status *)',
    'Bash(git diff *)',
    'Bash(git checkout -- studien.js)'
)

Schreibe-Log 'Claude wird gestartet (Suche, Auswahl, Zusammenfassung, Commit) ...'
Push-Location $Projekt
try {
    $auftrag = Get-Content $PromptFile -Raw -Encoding UTF8
    $ausgabe = $auftrag | & claude -p --permission-mode acceptEdits --allowedTools $werkzeuge 2>&1 | Out-String
    $code = $LASTEXITCODE
} catch {
    $ausgabe = "AUSNAHME: $($_.Exception.Message)"
    $code = 1
} finally {
    Pop-Location
}

Schreibe-Log "Claude beendet (Exitcode $code). Ausgabe:"
foreach ($zeile in ($ausgabe -split "`r?`n")) {
    if ($zeile.Trim()) { Schreibe-Log ("    " + $zeile.TrimEnd()) }
}

# --- Fehlschlaege klar benennen -------------------------------------------
# Wichtig: Ein fehlgeschlagener Lauf darf NICHT wie "heute nichts gefunden"
# aussehen - sonst meldet das Log monatelang Ruhe, obwohl nichts laeuft.
if ($ausgabe -match 'Not logged in|Please run /login') {
    Schreibe-Log 'FEHLER: Claude Code ist nicht angemeldet - es wurde nichts gesucht.'
    Schreibe-Log '        Einmalig im Terminal ausfuehren:  claude setup-token'
    Schreibe-Log '        Pruefen mit:                      claude auth status'
    Beende 'ERGEBNIS: Lauf fehlgeschlagen (nicht angemeldet).'
}
if ($code -ne 0) {
    Schreibe-Log "FEHLER: Claude-Lauf fehlgeschlagen (Exitcode $code) - siehe Ausgabe oben."
    Beende 'ERGEBNIS: Lauf fehlgeschlagen.'
}

# --- Ergebnis festhalten --------------------------------------------------
$anzahlNachher = ([regex]::Matches((Get-Content $Studien -Raw), '(?m)^\s*title:')).Count
$neu = $anzahlNachher - $anzahlVorher

if ($neu -gt 0) {
    Schreibe-Log "ERGEBNIS: $neu neue Studie(n) ergaenzt (jetzt $anzahlNachher insgesamt)."
} elseif ($neu -lt 0) {
    Schreibe-Log "WARNUNG: Es sind $([Math]::Abs($neu)) Studien VERSCHWUNDEN. Bitte pruefen!"
} else {
    Schreibe-Log 'ERGEBNIS: keine neuen Studien - Bestand unveraendert.'
}

$offen = git -C $Projekt status --porcelain -- studien.js 2>&1 | Out-String
if ($offen.Trim()) {
    Schreibe-Log 'HINWEIS: studien.js ist geaendert, aber nicht committet.'
}

Beende 'Fertig.'
