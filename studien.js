/* Datenbasis der Wissensdatenbank.
   Neue Studien werden von der täglichen Automatik OBEN eingefügt.
   Feldreihenfolge bitte beibehalten: title, authors, topic, method,
   findings, relevance, link, date. */
const studies = [
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
