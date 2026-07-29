/* Datenbasis der Wissensdatenbank.
   Neue Studien werden von der täglichen Automatik OBEN eingefügt.
   Feldreihenfolge bitte beibehalten: title, authors, topic, method,
   findings, relevance, link, date. */
const studies = [
  {
    title: "Optimal exercise interventions for enhancing cognitive function in older adults: a network meta-analysis",
    authors: "Han et al., 2025 · Frontiers in Aging Neuroscience",
    topic: "Motogeragogik",
    method: "Netzwerk-Meta-Analyse von 58 RCTs mit insgesamt 4.349 kognitiv gesunden älteren Erwachsenen; verglichen wurden 5 Bewegungsmodalitäten: Widerstandstraining, Ausdauertraining, achtsamkeitsbasierte Bewegung (Tai Chi, Yoga), Mehrkomponenten­training und HIIT.",
    findings: "Achtsamkeitsbasierte Bewegung erzielte die größten Effekte auf die globale Kognition (SMD = 0,62, 95 % KI: 0,38–0,86, p < 0,001) und das Arbeitsgedächtnis (SMD = 2,45, 95 % KI: 1,48–3,42, p < 0,001); Widerstandstraining war am wirksamsten für die Inhibitionskontrolle (SMD = −0,32, p = 0,04, SUCRA = 82,1 %); Ausdauertraining verbesserte die Gedächtnisfunktion (SMD = 0,42, p < 0,001). Optimale Dosierung: 2× wöchentlich, 45 Min., 12 Wochen.",
    relevance: "Für die motogeragogische Praxis: Achtsamkeitsbasierte Bewegungsformen wie Tai Chi und Yoga sind besonders wirksam, um kognitive Funktionen im Alter zu erhalten — ein starkes Argument für integrative Bewegungsprogramme in der Seniorenarbeit.",
    link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12289702/",
    date: "2026-07-29"
  },
  {
    title: "Effects of movement behaviors on preschoolers' cognition: a systematic review of randomized controlled trials",
    authors: "Pacheco et al., 2025 · International Journal of Behavioral Nutrition and Physical Activity (Springer/BMC)",
    topic: "Bewegungsförderung Vorschule",
    method: "Systematisches Review von 22 RCTs (14 individuell, 8 Cluster-RCTs); Vorschulkinder im Alter 3,8–5,84 Jahre; Stichprobengrößen zwischen 45 und 486 Kindern pro Studie; Interventionen umfassten körperliche Aktivität, Sedentärverhalten und Schlaf; Einschlusskriterium: mind. 4 Wochen Dauer, kognitive Outcomes als primäres Ziel.",
    findings: "19 von 22 Studien zeigten signifikante Verbesserungen kognitiver Outcomes; kognitiv angereicherte Bewegungsinterventionen erzielten die größten Effekte (Cohen's d > 0,8 für exekutive Funktionen; Beispiel: d = 2,33 für Inhibitionskontrolle); allgemeine Motorik- und Bewegungsprogramme zeigten moderate Effekte (d = 0,5–0,8). Keine RCTs zu kombinierten 24-Stunden-Bewegungsinterventionen vorhanden.",
    relevance: "Für Kita und Vorschule gilt: Reine Bewegungszeit reicht nicht — erst die kognitive Anreicherung (z. B. Regelspiele, Bewegungsaufgaben mit Planungs- und Gedächtnisanforderungen) erzielt große Effekte auf Denken und Lernen.",
    link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11755889/",
    date: "2026-07-29"
  },
  {
    title: "Effects of exercise interventions on hand-eye coordination and fine motor skills in children with developmental coordination disorder: a meta-analysis",
    authors: "Shi et al., 2025 · Frontiers in Physiology",
    topic: "Motorische Förderung bei DCD",
    method: "Meta-Analyse von 14 Studien (RCT und quasi-experimentell), n = 528 Kinder unter 12 Jahren; Interventionstypen: Bewegungsprogramme, visuomotorisches Training, Tischtennis, virtuelle Realität und Sensomotorik.",
    findings: "Signifikante Verbesserungen der Hand-Auge-Koordination (SMD = 0,45, 95 % CI: 0,16–0,73, p = 0,002) und der Feinmotorik (SMD = 0,74, 95 % CI: 0,30–1,18, p = 0,001); moderate bis hohe Intensität erzielte große Effekte auf die Feinmotorik (SMD = 1,22, p < 0,001); Gesamtdauer über 720 Minuten war entscheidend.",
    relevance: "Für die DCD-Förderung gilt: Intensität und Dauer entscheiden – kurze Einheiten niedriger Intensität reichen nicht; 8–12 Wochen mit moderat-hoher Belastung sind wirksam.",
    link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12575161/",
    date: "2026-07-28"
  },
  {
    title: "The impact of structured motor learning intervention on preschool children's executive functions",
    authors: "Hao et al., 2025 · Scientific Reports (Nature)",
    topic: "Motorik & exekutive Funktionen",
    method: "80 Vorschulkinder (4–6 J., China); RCT: 12 Wochen, 2×/Woche 30 Min strukturierte motorische Lerneinheiten (4 Phasen: Spielszenarien, Grundbewegungserwerb, Exploration, Reflexion) vs. reguläres Freiluftspiel.",
    findings: "Signifikante Verbesserung des Arbeitsgedächtnisses in der Interventionsgruppe (B = 0,20, 95 % CI: 0,14–0,26, p < 0,01); keine signifikanten Effekte auf Inhibitionskontrolle (B = -0,07, p = 0,15) oder kognitive Flexibilität (B = -0,03, p = 0,23).",
    relevance: "Strukturierte Bewegungseinheiten stärken gezielt das Arbeitsgedächtnis im Vorschulalter – ein konkretes Argument für pädagogisch durchdachte Einheiten neben freiem Spiel.",
    link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12104419/",
    date: "2026-07-28"
  },
  {
    title: "Effect of a Psychomotor Intervention on Motor Competence, Graphomotor Performance and Writing Proficiency in 5- to 6-Year-Old Preschool Children",
    authors: "Blanco-Martínez et al., 2026 · Children (MDPI)",
    topic: "Psychomotorik & Grafomotorik",
    method: "34 Vorschulkinder (5–6 J., Spanien); quasi-experimentell: 6 Wochen, 3×/Woche 50 Min psychomotorische Einheiten vs. Regelunterricht.",
    findings: "Signifikante Verbesserung der grafomotorischen Leistung (p<0,001) und aller vier motorischen Aufgaben; bei der Schreibfertigkeit war v. a. die Stifthaltung signifikant verbessert.",
    relevance: "Starkes Argument für psychomotorische Einheiten im Kindergarten zur Schreibvorbereitung – inklusive konkretem Stundenformat.",
    link: "https://www.mdpi.com/2227-9067/13/7/973",
    date: "2026-07-28"
  },
  {
    title: "Fundamental motor skill interventions significantly improve executive functions and social–emotional competence in preschoolers: a meta-analysis",
    authors: "2026 · Frontiers in Psychology",
    topic: "Motorik & exekutive Funktionen",
    method: "Meta-Analyse (PRISMA), 10 Studien, n = 2.039 Vorschulkinder, Zeitraum 2000–2025.",
    findings: "Exekutive Funktionen: SMD = 0,40 (p<0,001); sozial-emotionale Kompetenz: SMD = 0,16 (p=0,02). Mehr als 2 Einheiten/Woche à 30 Min wirken deutlich stärker (0,51 vs. 0,27); 5-Jährige profitieren mehr als 3–4-Jährige.",
    relevance: "Belegt den Kern der Psychomotorik: Bewegung fördert Denken und Sozialverhalten – mit klarer Dosierungsempfehlung für Kurskonzepte.",
    link: "https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2025.1721589/full",
    date: "2026-07-28"
  },
  {
    title: "Motor-Based Interventions in Children with Developmental Coordination Disorder: A Systematic Review and Meta-analysis of Randomised Controlled Trials",
    authors: "2025 · Sports Medicine – Open",
    topic: "Motorische Förderung bei DCD",
    method: "Meta-Analyse von 32 randomisierten kontrollierten Studien, n = 1.265 Kinder (4–13 Jahre).",
    findings: "Große Effekte auf Gesamtmotorik (g = 1,00) und kognitive Funktion (g = 1,53); Grobmotorik g = 0,95, Gleichgewicht g = 0,57. Aufgabenorientierte Ansätze wirken konsistent besser als rein prozessorientierte.",
    relevance: "Wichtig für die Arbeit mit koordinationsschwachen Kindern und für die Abgrenzung von Pädagogik und Therapie: aufgabenorientiertes Üben ist der wirksamste Weg.",
    link: "https://link.springer.com/article/10.1186/s40798-025-00833-w",
    date: "2026-07-28"
  },
  {
    title: "Beyond the Classroom: Investigating the Relationship between Psychomotor Development and Academic Achievement in 4–12-Year-Olds",
    authors: "Amorim, Marques & Santos, 2024 · PMC",
    topic: "Psychomotorik & Schulleistung",
    method: "Querschnittstudie mit 350 Kindern (4–12 J., Portugal); Instrumente: NPmot.pt, PRE, SLSB; Korrelations- und Regressionsanalysen.",
    findings: "Im Vorschulalter erklärt die psychomotorische Entwicklung 58 % der Varianz der Leistungen (r = 0,30–0,82); stärkste Prädiktoren: Tonus, Grobmotorik, Rhythmus. Im Schulalter sinkt die Varianzaufklärung auf 5,2 %.",
    relevance: "Kernbotschaft für Elternabende und Fortbildungen: Das Zeitfenster Kindergarten/Vorschule ist entscheidend – genau dort setzt Psychomotorik an.",
    link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11352431/",
    date: "2026-07-28"
  }
];
