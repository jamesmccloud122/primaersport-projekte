/* Datenbasis der Wissensdatenbank.
   Neue Studien werden von der täglichen Automatik OBEN eingefügt.
   Feldreihenfolge bitte beibehalten: title, authors, topic, method,
   findings, relevance, link, date. */
const studies = [
  {
    title: "Optimizing Cognitive and Physical Gains in Older Adults: Benefits of a Psychomotor Intervention Program Based on Functional Level",
    authors: "Rosado et al., 2025 · Medicina (MDPI)",
    topic: "Motogeragogik",
    method: "51 ältere Erwachsene (75,4 ± 5,6 Jahre, 42 Frauen, 9 Männer, Portugal); einfach-blinde RCT mit 24-wöchiger Intervention und 12-wöchiger Follow-up-Phase; drei Gruppen: funktionell niedrige Experimentalgruppe (LFG, n=16), funktionell höhere Experimentalgruppe (HFG, n=16) und Kontrollgruppe (n=19); 3×/Woche 75 Min kognitive-motorische Doppelaufgaben mit progressiver Komplexität.",
    findings: "LFG verbesserte Verarbeitungsgeschwindigkeit um −29,3 s (TMT-A, p<0,05, ES=0,40–0,62) und exekutive Funktionen um −66,6 s (TMT-B, p<0,05, großer Effekt); Körperkraft +6,9 Wdh. (p<0,05, ES=0,57–0,62); Gleichgewicht +5,9 Punkte (FAB, p<0,05). HFG zeigte kleinere, aber signifikante Verbesserungen. Kognitive Gewinne blieben beim Follow-up erhalten, körperliche Verbesserungen bildeten sich zurück.",
    relevance: "Für die motogeragogische Praxis: Kognitive Gewinne durch psychomotorisches Training bleiben auch nach Trainingsende erhalten – ein starkes Argument für regelmäßige, niederschwellige psychomotorische Programme in der Seniorenarbeit.",
    link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12471732/",
    date: "2026-08-02"
  },
  {
    title: "The effects of aquatic and land-based interventions on children with developmental coordination disorder",
    authors: "Ferreira et al., 2025 · Frontiers in Human Neuroscience",
    topic: "Motorische Förderung bei DCD",
    method: "66 Kinder mit DCD (39 Jungen, 27 Mädchen, Ø 7,6 ± 1,0 Jahre, Brasilien); RCT mit vier Gruppen: Aquatik-DCD, Terrestrisch-DCD, Kontroll-DCD und typische Entwicklung; 18 Wochen, 3×/Woche 60 Min aufgabenorientiertes Training (Stabilisierung, Lokomotion, Manipulation) im Wasser bzw. an Land; 6-Monats-Follow-up.",
    findings: "Beide Interventionsgruppen verbesserten den MABC-2-Gesamtwert signifikant gegenüber der Kontroll-DCD-Gruppe (p<0,05; d=0,85–0,92); Zeiteffekte von prä zu Follow-up groß (d=1,14–2,2). Beim 6-Monats-Follow-up näherten sich beide Gruppen dem Niveau typisch entwickelter Kinder an (d=1,65–1,72). Aquatik- und Landtraining zeigten vergleichbare Effekte.",
    relevance: "Für die DCD-Förderung gilt: Sowohl Aquatik- als auch Landprogramme mit aufgabenorientiertem Ansatz sind gleich wirksam – eine wichtige Planungshilfe für Einrichtungen ohne Schwimmbadzugang.",
    link: "https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2025.1638987/full",
    date: "2026-08-02"
  },
  {
    title: "The association between motor coordination, physical fitness, and cognitive function in preschool children: physical fitness as a key bridge between motor coordination and executive function",
    authors: "Zhang et al., 2026 · Frontiers in Public Health",
    topic: "Motorik & exekutive Funktionen",
    method: "Querschnittstudie mit 713 Vorschulkindern (386 Jungen, 327 Mädchen; 3–6 Jahre, China); Erhebung von Motorkoordination, körperlicher Fitness (PFI) und drei Bereichen exekutiver Funktionen (kognitive Flexibilität, Inhibitionskontrolle, Arbeitsgedächtnis) mit anschließender Mediationsanalyse.",
    findings: "Motorkoordination und körperliche Fitness korrelierten moderat (r = 0,443, p < 0,01). Körperliche Fitness mediierte den Zusammenhang zwischen Motorkoordination und exekutiver Funktion: vollständige Mediation beim Arbeitsgedächtnis (indirekter Effektanteil 46,9 %), partielle Mediation bei kognitiver Flexibilität (28,7 %) und Inhibitionskontrolle (31,5 %). MC und PFI sagten kognitive Flexibilität (β = 0,141 bzw. 0,106, p < 0,05) und Inhibitionskontrolle (β = 0,120 bzw. 0,098, p < 0,05) unabhängig voraus.",
    relevance: "Körperliche Fitness vermittelt den Zusammenhang zwischen Motorik und Denkvermögen im Vorschulalter – ein starkes Argument für integrierte Bewegungsangebote, die Koordination und Ausdauer/Kraft gleichermaßen fördern.",
    link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC13099747/",
    date: "2026-08-01"
  },
  {
    title: "Effects of video game-based interventions on executive functions and motor skills in children and adolescents with neurodevelopmental disorders: a systematic review and meta-analysis",
    authors: "Gao et al., 2026 · Frontiers in Rehabilitation Sciences",
    topic: "Motorik & exekutive Funktionen",
    method: "Systematisches Review und Meta-Analyse von 20 RCTs; 878 Kinder und Jugendliche (3–18 Jahre; 591 ADHS, 216 DCD, 71 Autismus-Spektrum-Störung); Interventionstypen: aktive Videospiele (Nintendo Wii, Microsoft Kinect) und sedentäre kognitiv-motorische Computerprogramme; Dauer 3–14 Wochen, 1–10 Einheiten/Woche à 10–65 Minuten.",
    findings: "Signifikante Verbesserungen der Inhibitionskontrolle (SMD = −0,41, 95 % KI: −0,58 bis −0,25, p < 0,001), kognitiven Flexibilität (SMD = −0,33, 95 % KI: −0,50 bis −0,15, p < 0,001) und des Arbeitsgedächtnisses (SMD = 0,42, 95 % KI: 0,27–0,58, p < 0,001). Grobmotorik verbessert (SMD = 0,45, 95 % KI: 0,07–0,82, p < 0,05); Feinmotorik nicht signifikant. Aktive Spiele wirkten stärker auf kognitive Flexibilität, sedentäre Programme stärker auf das Arbeitsgedächtnis.",
    relevance: "Aktive Videospiele können als ergänzendes Fördermedium bei Kindern mit ADHS, DCD oder Autismus eingesetzt werden und verbessern sowohl exekutive Funktionen als auch die Grobmotorik.",
    link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12982429/",
    date: "2026-08-01"
  },
  {
    title: "Physical activity intervention improves executive function in children with autism spectrum disorder: a meta-analysis",
    authors: "Li et al., 2026 · Frontiers in Pediatrics",
    topic: "Motorik & exekutive Funktionen",
    method: "Meta-Analyse von 14 randomisierten kontrollierten Studien; Kinder mit Autismus-Spektrum-Störung (DSM-5), Altersbereich 5,11–14,42 Jahre; Interventionstypen: Fundamentales Bewegungstraining, digitale Bewegungsspiele, Basketball/Tischtennis, Kampfsport, Wassergymnastik und Mind-Body-Übungen.",
    findings: "Signifikante Verbesserung aller exekutiven Funktionen: Gesamteffekt SMD = 0,76 (95 % KI: 0,36–1,17); Inhibitionskontrolle SMD = 0,66 (95 % KI: 0,44–0,89); Arbeitsgedächtnis SMD = 0,61 (95 % KI: 0,34–0,88); kognitive Flexibilität SMD = 0,41 (95 % KI: 0,09–0,72). Größter Effekt bei fundamentalem Bewegungstraining 4×/Woche über 18 Wochen (SMD = 2,62, 95 % KI: 1,50–3,74).",
    relevance: "Für die Arbeit mit Kindern im Autismus-Spektrum gilt: Strukturiertes Bewegungstraining, besonders fundamentale Bewegungsmuster, verbessert alle drei exekutiven Funktionsbereiche messbar — ein starkes Argument für inklusive Bewegungsangebote.",
    link: "https://www.frontiersin.org/journals/pediatrics/articles/10.3389/fped.2026.1693801/full",
    date: "2026-07-31"
  },
  {
    title: "Enhancing interoceptive awareness in community-dwelling older adults: effects of a psychomotor intervention mediated by creative dance",
    authors: "Rosado et al., 2025 · Frontiers in Psychology",
    topic: "Motogeragogik",
    method: "34 ältere Erwachsene (17 Interventionsgruppe, 17 Kontrollgruppe), Ø 74,6 ± 6,6 Jahre, Portugal; quasi-experimentelle Studie, 12 Wochen, 3×/Woche 60-minütige psychomotorische Einheiten mit kreativem Tanz (Körperwahrnehmung, Atemübungen, Muskelspannung, choreografische Phasen) vs. gewöhnliche Aktivitäten.",
    findings: "Signifikante Verbesserungen in der Interventionsgruppe: Aufmerksamkeitsregulation +57,4 % (p < 0,001, r = 0,62), emotionales Gewahrsein +38,8 % (p < 0,001, r = 0,60), Selbstregulation +39,3 % (p < 0,001, r = 0,59), Wahrnehmen +39,4 % (p = 0,002, r = 0,53), Nicht-Sorgen +19,9 % (p = 0,024, r = 0,39). Signifikante Gruppenunterschiede nach Intervention (p < 0,001, r = 0,57–0,72).",
    relevance: "Kreative Tanzelemente in psychomotorischen Einheiten stärken bei älteren Menschen nachweislich die Körperwahrnehmung und emotionale Selbstregulation — ein praxisnahes Argument für ressourcenorientierte Motogeragogik.",
    link: "https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2025.1515393/full",
    date: "2026-07-31"
  },
  {
    title: "Effects of different physical activity modalities on executive function in children with attention deficit hyperactivity disorder: a systematic review and meta-analysis",
    authors: "Chen et al., 2026 · Frontiers in Psychiatry",
    topic: "Motorik & exekutive Funktionen",
    method: "Systematisches Review und Meta-Analyse von 21 RCTs mit insgesamt 915 Kindern (6–18 J.); Bewegungsmodalitäten: Ausdauertraining, Krafttraining, kognitiv angereicherte Aktivitäten, Kampfsport, Schwimmen; Interventionsdauer 3–72 Wochen; Länder: China, USA, Tunesien, Iran, Schweiz.",
    findings: "Alle drei exekutiven Funktionen signifikant verbessert: Inhibitionskontrolle (SMD = −0,69, 95 % KI: −0,84 bis −0,54, p < 0,00001), kognitive Flexibilität (SMD = −0,53, 95 % KI: −0,71 bis −0,35, p < 0,00001), Arbeitsgedächtnis (SMD = −0,43, 95 % KI: −0,59 bis −0,26, p < 0,00001); optimale Wirkung bei ≥ 6 Wochen Dauer und moderat-hoher Intensität.",
    relevance: "Regelmäßige Bewegung verbessert nachweislich alle drei zentralen exekutiven Funktionen bei Kindern mit ADHS — ein starkes Argument für Bewegungsangebote als fester Bestandteil multimodaler ADHS-Förderung.",
    link: "https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2026.1824121/full",
    date: "2026-07-30"
  },
  {
    title: "Time-course effects of cognitively engaging physical activity on executive function and self-control in younger school-aged children: a randomized controlled trial",
    authors: "Xu et al., 2025 · Frontiers in Psychology",
    topic: "Motorik & exekutive Funktionen",
    method: "203 Schulkinder (8–10 J., Polen/China); Cluster-RCT mit 3 Messzeitpunkten: 10 Wochen, 3×/Woche 45 Min kognitiv angereicherte Bewegungseinheiten (Teamspiele, Gedächtnisübungen, schnelle Entscheidungsaufgaben) vs. regulärer Sportunterricht.",
    findings: "Signifikante Verbesserungen in Inhibitionskontrolle (p = 0,020, d = 0,66) und Arbeitsgedächtnis (p = 0,002, d = 0,80); kognitive Flexibilität nicht signifikant (p = 0,077); besonders ausgeprägte Effekte auf Selbstkontrolle gesamt (+26,38 %, d = 1,98) und soziale Interaktion (+48,31 %, d = 2,06).",
    relevance: "Kognitiv angereicherte Bewegungseinheiten stärken nach 10 Wochen gezielt Arbeitsgedächtnis und Selbstkontrolle bei Schulkindern — ein praxisnahes Format, das sich direkt in psychomotorische Gruppenangebote übertragen lässt.",
    link: "https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2025.1628814/full",
    date: "2026-07-30"
  },
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
