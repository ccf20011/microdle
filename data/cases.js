/* Daily cases, played in order: case 1 on Microdle #1, case 2 on #2, and so on, then repeating.

   Each case:
     accept   organism ids (from organisms.js) that count as correct; the first is shown as the answer
     dx       the diagnosis, shown with the answer
     clues    6 [label, text] pairs, from vague to giveaway
     rx       the treatment answer key:
       prompt     the clinical setting for the treatment question
       best       regimens graded "ideal"; okay = regimens graded "acceptable"
                  A regimen is a list of slots. Each slot is one drug id, or an array of
                  interchangeable ids (any one of them fills the slot). Extra drugs are allowed,
                  but 2+ unneeded antimicrobials downgrade "ideal" to "acceptable".
                  Anything matching neither list is graded "inadequate".
       extras     antimicrobials that are reasonable add-ons and never count as unneeded
       inadequate [[regimen, text], ...] near-miss regimens graded "inadequate" with their own explanation
       harm       { drugId: text } choosing this drug grades "harmful"
       noAntimicrobials  text; if set, any antimicrobial grades "harmful"
       downgrade  { drugId: text } turns an "ideal" into "acceptable" with this explanation
       notes      { drugId: text } explanation shown when this drug led to "acceptable" or "inadequate"
       outcome    { best, okay, poor } default outcome text for ideal, acceptable, inadequate
       standard   one-line standard of care, always shown
     pearl    one teaching point, shown at the end
*/
const STEROID = ['prednisone', 'methylprednisolone', 'dexamethasone', 'hydrocortisone'];
const ECHINO = ['micafungin', 'caspofungin', 'anidulafungin'];
const NO_PSEUDO = 'This drug has no reliable activity against Pseudomonas.';

const CASES = [
  // 1
  {
    accept: ['spneumo'],
    dx: 'Lobar pneumonia',
    clues: [
      ['Presentation', 'A 67-year-old man has had 2 days of fever, shaking chills, and a productive cough.'],
      ['History', 'He has COPD and still smokes. He had a cold last week and is behind on his adult vaccines.'],
      ['Exam', 'T 39.4 °C, RR 28. Dullness to percussion and bronchial breath sounds over the right lower lung. His sputum is rust-colored.'],
      ['Labs', 'WBC 18,000 with a left shift. Procalcitonin is elevated.'],
      ['Imaging', 'Chest X-ray shows dense right lower lobe consolidation with air bronchograms.'],
      ['Microbiology', 'Sputum Gram stain: Gram-positive, lancet-shaped diplococci. Alpha-hemolytic, optochin-sensitive, and bile-soluble. Urine antigen positive.'],
    ],
    rx: {
      prompt: 'He is admitted to the medical floor, not the ICU. What do you start?',
      best: [[['ceftriaxone', 'cefotaxime', 'amp-sulb']], [['levofloxacin', 'moxifloxacin']], [['pen-g']]],
      okay: [[['amoxicillin', 'amox-clav']], ['vanc-iv']],
      extras: ['azithromycin', 'doxycycline', 'clarithromycin'],
      notes: {
        azithromycin: 'Macrolide resistance in pneumococcus is now over 30% in the US. As monotherapy for a hospitalized patient it is not enough.',
        doxycycline: 'Doxycycline alone is only for healthy outpatients. He kept spiking fevers on the floor.',
        'vanc-iv': 'Vancomycin covers him, but there is no reason for it in a non-severe pneumonia without MRSA risk factors.',
        amoxicillin: 'Oral amoxicillin covers pneumococcus well, but an inpatient regimen should be IV until he improves.',
        'amox-clav': 'It covers pneumococcus, but an inpatient regimen should be IV until he improves.',
      },
      outcome: {
        best: 'Afebrile by day 3, switched to oral antibiotics, and home on day 4.',
        okay: 'He recovered, but this was not the ideal regimen.',
        poor: 'He kept spiking fevers and needed his antibiotics changed on day 3.',
      },
      standard: 'Inpatient CAP: ceftriaxone plus azithromycin (or doxycycline), or a respiratory fluoroquinolone alone. Narrow to penicillin or ceftriaxone once pneumococcus is confirmed.',
    },
    pearl: 'Rusty sputum and a lobar consolidation after a viral illness is classic pneumococcus. Optochin-sensitive and bile-soluble separates it from viridans strep.',
  },

  // 2
  {
    accept: ['giardia'],
    dx: 'Giardiasis',
    clues: [
      ["Presentation", "A 28-year-old woman presents with 2 weeks of watery diarrhea."],
      ["Symptoms", "She also has bloating, a lot of gas, and has lost 4 kg."],
      ["Stool", "Her stools are greasy, foul-smelling, and float."],
      ["History", "Three weeks before her symptoms began, she went backpacking and drank untreated stream water."],
      ["Labs", "Stool studies show no blood and no white blood cells."],
      ["Microbiology", "Stool microscopy shows pear-shaped flagellated trophozoites with two nuclei."],
    ],
    rx: {
      prompt: 'She is well enough to go home. What do you prescribe?',
      best: [[['tinidazole', 'metronidazole', 'nitazoxanide']]],
      okay: [['albendazole']],
      notes: {
        albendazole: 'Albendazole has some activity against Giardia, but cure rates are lower than with tinidazole or metronidazole.',
        ciprofloxacin: 'Ciprofloxacin covers bacterial diarrhea, not protozoa.',
        supportive: 'Giardia can linger for weeks and cause malabsorption. She should be treated.',
      },
      outcome: {
        best: 'Her diarrhea stopped within a week and the bloating went away.',
        okay: 'She improved slowly and needed a second course a month later.',
        poor: 'Two weeks later she is still bloated and losing weight.',
      },
      standard: 'Tinidazole single dose, metronidazole for 5 to 7 days, or nitazoxanide for 3 days.',
    },
    pearl: 'Giardia causes non-bloody, fatty diarrhea with no fecal leukocytes because it sits on the gut surface and does not invade. Temporary lactose intolerance afterward is common.',
  },

  // 3
  {
    accept: ['rrickettsii'],
    dx: 'Rocky Mountain spotted fever',
    clues: [
      ["Presentation", "A 9-year-old boy presents with 3 days of high fever and headache."],
      ["Symptoms", "He also has muscle aches and vomiting."],
      ["History", "He lives in North Carolina and spends his summer days playing in the woods."],
      ["Exam", "A rash that began on his wrists and ankles has spread to his trunk, palms, and soles."],
      ["Labs", "Labs show low platelets and low sodium."],
      ["Microbiology", "Skin biopsy shows obligate intracellular Gram-negative bacteria in the walls of small blood vessels."],
    ],
    rx: {
      prompt: 'Serology will not be back for days. What do you start now?',
      best: [['doxycycline']],
      okay: [['chloramphenicol']],
      harm: {
        'tmp-smx': 'Sulfa drugs do not treat rickettsiae and are linked to worse outcomes in RMSF. He progressed to shock.',
      },
      notes: {
        chloramphenicol: 'Chloramphenicol works but has higher mortality than doxycycline and risks aplastic anemia. It is reserved for rare cases.',
        ceftriaxone: 'Beta-lactams have no activity against Rickettsia.',
        amoxicillin: 'Beta-lactams have no activity against Rickettsia.',
        azithromycin: 'Azithromycin is not reliable for RMSF.',
      },
      outcome: {
        best: 'Afebrile within 48 hours and back to school the next week.',
        okay: 'He recovered, but with a rockier course.',
        poor: 'He developed multi-organ failure and was moved to the PICU. Delayed doxycycline is the main cause of RMSF deaths.',
      },
      standard: 'Doxycycline right away for anyone with suspected RMSF, including young children. Do not wait for serology.',
    },
    pearl: 'Doxycycline is first-line for RMSF at any age. A short course does not stain teeth, and waiting for confirmation is what kills people.',
  },

  // 4
  {
    accept: ['listeria'],
    dx: 'Bacterial meningitis',
    clues: [
      ["Presentation", "A 74-year-old woman presents with fever and confusion."],
      ["Symptoms", "She also has a severe headache and a stiff neck."],
      ["History", "She takes prednisone daily for polymyalgia rheumatica."],
      ["Diet", "She eats deli meats and soft cheeses almost every day."],
      ["CSF", "CSF shows a high white count, low-normal glucose, and high protein."],
      ["Microbiology", "CSF Gram stain shows Gram-positive rods that have tumbling motility."],
    ],
    rx: {
      prompt: 'She is in the ED with a positive CSF Gram stain. What do you give?',
      best: [[['ampicillin', 'pen-g']]],
      okay: [['tmp-smx']],
      extras: ['gentamicin', 'vanc-iv', 'ceftriaxone', 'cefotaxime'],
      notes: {
        'tmp-smx': 'TMP-SMX is the backup for penicillin allergy. It works, but ampicillin is preferred.',
        ceftriaxone: 'Cephalosporins have no activity against Listeria. Every elderly or immunosuppressed meningitis patient needs ampicillin added.',
        cefepime: 'Cephalosporins have no activity against Listeria.',
        meropenem: 'Meropenem has activity, but ampicillin is the drug of choice.',
      },
      outcome: {
        best: 'Her fever broke on day 3 and her confusion cleared over the following week.',
        okay: 'She recovered, but this was the backup regimen.',
        poor: 'She got worse over 48 hours until ampicillin was added.',
      },
      standard: 'Ampicillin (often with gentamicin) for 3 weeks. Empiric meningitis therapy in anyone over 50 or immunosuppressed adds ampicillin to vancomycin and ceftriaxone.',
    },
    pearl: 'Listeria is a Gram-positive rod that grows in the cold and is naturally resistant to all cephalosporins. Think of it in pregnancy, newborns, the elderly, and the immunosuppressed.',
  },

  // 5
  {
    accept: ['cdiff'],
    dx: 'Severe C. difficile colitis',
    clues: [
      ["Presentation", "An 81-year-old woman presents with 4 days of watery diarrhea."],
      ["Symptoms", "She also has lower abdominal cramping and a low-grade fever."],
      ["History", "She lives in a nursing home."],
      ["Meds", "She recently finished a course of clindamycin for a dental infection."],
      ["Labs", "Her white count is 22,000 and her creatinine is rising."],
      ["Microbiology", "Stool PCR detects a toxin gene from a spore-forming, Gram-positive anaerobe."],
    ],
    rx: {
      prompt: 'She is admitted. What do you start?',
      best: [[['vanc-po', 'fidaxomicin']]],
      okay: [],
      harm: {
        loperamide: 'Slowing the gut traps the toxin. She developed toxic megacolon.',
      },
      notes: {
        metronidazole: 'Metronidazole is no longer recommended for a first episode, and never for severe disease (WBC over 15,000 or rising creatinine).',
        'vanc-iv': 'IV vancomycin does not get into the colon. It only works for C. diff when given by mouth.',
      },
      outcome: {
        best: 'Her stools slowed by day 4 and her white count came down.',
        okay: 'She improved.',
        poor: 'She kept having diarrhea and her creatinine climbed.',
      },
      standard: 'Oral vancomycin or fidaxomicin for 10 days. Stop the offending antibiotic. Avoid antimotility drugs.',
    },
    pearl: 'Severe C. diff is defined by WBC of at least 15,000 or creatinine over 1.5. Oral vancomycin works only because it stays in the gut.',
  },

  // 6
  {
    accept: ['crypto'],
    dx: 'Cryptococcal meningitis',
    clues: [
      ["Presentation", "A 34-year-old man presents with 3 weeks of worsening headache."],
      ["Symptoms", "He also has low-grade fevers and blurry vision."],
      ["History", "He has HIV, stopped his medications a year ago, and his CD4 count is 35."],
      ["Exam", "Exam shows bilateral papilledema and mild neck stiffness."],
      ["LP", "Lumbar puncture shows an opening pressure of 38 cm H2O."],
      ["Microbiology", "India ink stain of the CSF shows round budding yeast with a thick clear capsule."],
    ],
    rx: {
      prompt: 'He is admitted. What is your initial treatment?',
      best: [['ampho', 'flucytosine']],
      okay: [['ampho', 'fluconazole'], ['fluconazole', 'flucytosine']],
      downgrade: {
        art: 'Antifungals were right, but starting ART in the first weeks of cryptococcal meningitis raises the risk of deadly IRIS. Wait 4 to 6 weeks.',
      },
      notes: {
        fluconazole: 'Fluconazole alone is too weak for induction. It is used later for consolidation and maintenance.',
        ampho: 'Amphotericin alone works, but adding flucytosine clears the CSF faster and saves lives.',
        art: 'Starting ART in the first weeks raises the risk of deadly IRIS.',
      },
      outcome: {
        best: 'With serial LPs for pressure, his headache resolved and his CSF cleared in 2 weeks.',
        okay: 'He survived, but this regimen clears the yeast more slowly.',
        poor: 'His pressures kept rising and his vision got worse.',
      },
      standard: 'Induction with liposomal amphotericin B plus flucytosine, then fluconazole. Serial LPs for high opening pressure. Start ART after 4 to 6 weeks.',
    },
    pearl: 'High opening pressure kills in cryptococcal meningitis. Drain CSF with repeat LPs, and hold off on ART to avoid IRIS.',
  },

  // 7
  {
    accept: ['spyo'],
    dx: 'Scarlet fever (strep pharyngitis)',
    clues: [
      ["Presentation", "A 7-year-old boy presents with a sore throat and fever."],
      ["Symptoms", "He also has a headache and a stomachache, but no cough."],
      ["History", "Several of his classmates have been out sick this week."],
      ["Exam", "Exam shows tonsillar exudates and tender lymph nodes in the front of his neck."],
      ["Skin", "He has a fine red rash that feels like sandpaper and a bright red, bumpy tongue."],
      ["Microbiology", "Rapid antigen test is positive, and culture grows beta-hemolytic, bacitracin-sensitive cocci in chains."],
    ],
    rx: {
      prompt: 'He has no allergies. What do you prescribe?',
      best: [[['amoxicillin', 'pen-v', 'bpg']]],
      okay: [[['cephalexin', 'azithromycin', 'clindamycin', 'cefuroxime']]],
      notes: {
        azithromycin: 'Azithromycin is for penicillin allergy, and some strains are resistant.',
        cephalexin: 'Cephalexin works, but it is the backup for mild penicillin allergy.',
        clindamycin: 'Clindamycin works, but it is the backup for penicillin allergy.',
        cefuroxime: 'It works, but it is broader than needed.',
        'tmp-smx': 'TMP-SMX does not reliably clear group A strep from the throat.',
        ciprofloxacin: 'Fluoroquinolones are not used for strep throat.',
        supportive: 'Untreated strep throat can lead to rheumatic fever. Treat it.',
      },
      outcome: {
        best: 'Back to school after 24 hours on antibiotics. Rash faded in a week.',
        okay: 'He got better, but there was a better first choice.',
        poor: 'He recovered, but without proper treatment he is at risk of rheumatic fever.',
      },
      standard: 'Amoxicillin or penicillin V for 10 days, or one dose of IM benzathine penicillin.',
    },
    pearl: 'Treating strep throat within 9 days prevents rheumatic fever. It does not prevent post-strep glomerulonephritis.',
  },

  // 8
  {
    accept: ['legionella'],
    dx: "Legionnaires' disease",
    clues: [
      ["Presentation", "A 63-year-old man presents with 3 days of high fever and dry cough."],
      ["Symptoms", "He also has diarrhea and new confusion."],
      ["History", "He is a heavy smoker who just got back from a cruise where he used the hot tub every day."],
      ["Exam", "His temperature is 40 °C, but his heart rate is only 88."],
      ["Labs", "His sodium is 127 and his liver enzymes are mildly elevated."],
      ["Microbiology", "Urine antigen is positive, and the organism grows on buffered charcoal yeast extract agar."],
    ],
    rx: {
      prompt: 'He is admitted to a step-down unit. What do you start?',
      best: [[['azithromycin', 'levofloxacin', 'moxifloxacin']]],
      okay: [[['doxycycline', 'clarithromycin', 'erythromycin', 'ciprofloxacin']]],
      extras: ['ceftriaxone', 'cefotaxime', 'amp-sulb'],
      notes: {
        doxycycline: 'Doxycycline has activity, but azithromycin or levofloxacin are preferred.',
        clarithromycin: 'It works, but azithromycin has fewer drug interactions.',
        ciprofloxacin: 'Ciprofloxacin works but has weaker data than levofloxacin.',
        ceftriaxone: 'Beta-lactams cannot reach Legionella, which lives inside cells. That is why the amoxicillin failed.',
        'pip-tazo': 'Beta-lactams cannot reach Legionella, which lives inside cells.',
      },
      outcome: {
        best: 'His fever broke on day 3 and his sodium corrected.',
        okay: 'He recovered, a little more slowly.',
        poor: 'He kept getting worse and needed the ICU.',
      },
      standard: 'Azithromycin or levofloxacin. Beta-lactams alone do not work.',
    },
    pearl: 'High fever with a slow pulse, diarrhea, hyponatremia, and confusion in a pneumonia patient should make you think of Legionella. It lives in water systems like hot tubs and cooling towers.',
  },

  // 9
  {
    accept: ['toxo'],
    dx: 'Cerebral toxoplasmosis',
    clues: [
      ["Presentation", "A 41-year-old woman presents after her first seizure."],
      ["Symptoms", "She also reports a week of headache and low-grade fever."],
      ["History", "She has HIV, is not on treatment, and her CD4 count is 60."],
      ["Exam", "Exam shows mild weakness in her right arm."],
      ["Imaging", "MRI shows multiple ring-enhancing lesions in the basal ganglia and at the gray-white junction."],
      ["Microbiology", "Serum IgG is positive for an obligate intracellular protozoan spread by cats."],
    ],
    rx: {
      prompt: 'You treat empirically before considering biopsy. What do you start?',
      best: [['pyrimethamine', 'sulfadiazine', 'leucovorin']],
      okay: [['tmp-smx'], ['pyrimethamine', 'clindamycin', 'leucovorin'], ['pyrimethamine', 'sulfadiazine'], ['pyrimethamine', 'atovaquone']],
      extras: ['dexamethasone'],
      downgrade: {
        art: 'The antiparasitic regimen was right. ART should start, but usually about 2 weeks into toxo treatment.',
      },
      notes: {
        'tmp-smx': 'TMP-SMX is an accepted alternative with similar results, but not the classic first choice.',
        pyrimethamine: 'Pyrimethamine without leucovorin causes bone marrow suppression.',
        clindamycin: 'This is the alternative for sulfa allergy.',
      },
      outcome: {
        best: 'Repeat MRI at 2 weeks showed the lesions shrinking, which confirmed the diagnosis.',
        okay: 'Her lesions shrank, but the regimen was not the standard one.',
        poor: 'Her weakness got worse and the lesions grew.',
      },
      standard: 'Pyrimethamine plus sulfadiazine plus leucovorin for at least 6 weeks. Start ART within about 2 weeks.',
    },
    pearl: 'Multiple ring-enhancing lesions with CD4 under 100 means toxo until proven otherwise. A single lesion that is positive on thallium SPECT points to CNS lymphoma.',
  },

  // 10
  {
    accept: ['borrelia'],
    dx: 'Early disseminated Lyme disease',
    clues: [
      ["Presentation", "A 35-year-old woman presents with fever, fatigue, and joint aches."],
      ["Symptoms", "This morning she noticed the right side of her face drooping."],
      ["History", "She lives in Connecticut and went hiking in the woods in July."],
      ["Exam", "Exam shows weakness of her whole right face, including the forehead."],
      ["Skin", "She has three expanding red patches with central clearing on her trunk and thigh."],
      ["Microbiology", "Two-tier serology is positive for a spirochete carried by Ixodes ticks."],
    ],
    rx: {
      prompt: 'She is an outpatient. What do you prescribe?',
      best: [['doxycycline']],
      okay: [[['amoxicillin', 'cefuroxime', 'ceftriaxone']], ['azithromycin']],
      notes: {
        amoxicillin: 'Amoxicillin works, but doxycycline is preferred because it also covers anaplasma and gets into the CNS.',
        cefuroxime: 'It works, but doxycycline is first-line.',
        ceftriaxone: 'IV ceftriaxone works, but isolated facial palsy does not need IV therapy.',
        azithromycin: 'Macrolides are a third-line option and less effective.',
        cephalexin: 'First-generation cephalosporins do not treat Lyme.',
      },
      outcome: {
        best: 'Her rash faded within a week and her face recovered fully over two months.',
        okay: 'She recovered, but there was a better option.',
        poor: 'Two months later she developed arthritis in her knee.',
      },
      standard: 'Oral doxycycline for 14 days for Lyme facial palsy.',
    },
    pearl: 'Multiple erythema migrans lesions mean the spirochete has spread through the blood. Facial palsy, carditis, and meningitis are the classic early disseminated findings.',
  },

  // 11
  {
    accept: ['pseudo'],
    dx: 'Malignant (necrotizing) otitis externa',
    clues: [
      ["Presentation", "A 72-year-old man presents with 3 weeks of severe left ear pain."],
      ["Symptoms", "He also has ear drainage that has not improved with ear drops."],
      ["History", "He has poorly controlled type 2 diabetes."],
      ["Exam", "Exam shows granulation tissue in the ear canal and a new left facial droop."],
      ["Imaging", "CT shows erosion of the temporal bone at the skull base."],
      ["Microbiology", "Culture grows an oxidase-positive, non-lactose-fermenting Gram-negative rod with a blue-green pigment."],
    ],
    rx: {
      prompt: 'He is admitted. What do you start?',
      best: [[['cefepime', 'ceftazidime', 'pip-tazo', 'meropenem', 'imipenem', 'ciprofloxacin']]],
      okay: [[['levofloxacin', 'aztreonam']]],
      extras: ['tobramycin', 'gentamicin', 'amikacin', 'vanc-iv'],
      notes: {
        levofloxacin: 'Levofloxacin covers Pseudomonas, but ciprofloxacin is more potent against it.',
        aztreonam: 'Aztreonam works but is usually saved for beta-lactam allergy.',
        ceftriaxone: NO_PSEUDO,
        ertapenem: 'Ertapenem is the one carbapenem that does not cover Pseudomonas.',
        'amox-clav': NO_PSEUDO,
        'tmp-smx': NO_PSEUDO,
        cefazolin: NO_PSEUDO,
      },
      outcome: {
        best: 'His pain eased over 2 weeks and he went home on a 6-week course.',
        okay: 'He improved, but there was a stronger option.',
        poor: 'The infection spread along the skull base and he needed surgery.',
      },
      standard: 'An anti-pseudomonal agent (ciprofloxacin, cefepime, ceftazidime, or pip-tazo) for 6 to 8 weeks, plus tight glucose control.',
    },
    pearl: 'Severe ear pain with granulation tissue in an elderly diabetic is Pseudomonas skull base osteomyelitis until proven otherwise. Cranial nerve palsies mean it is spreading.',
  },

  // 12
  {
    accept: ['pfalc'],
    dx: 'Severe malaria',
    clues: [
      ["Presentation", "A 29-year-old man presents with 4 days of fever and chills."],
      ["Symptoms", "Today he has become confused."],
      ["History", "He got back 10 days ago from visiting family in Nigeria and took no preventive pills."],
      ["Exam", "Exam shows jaundice and an enlarged spleen."],
      ["Labs", "Labs show anemia, low platelets, low blood sugar, and kidney injury."],
      ["Microbiology", "Blood smear shows 8% of red cells infected and banana-shaped gametocytes."],
    ],
    rx: {
      prompt: 'He meets criteria for severe disease. What do you start?',
      best: [['artesunate']],
      okay: [],
      extras: ['artemether-lumefantrine', 'atovaquone-proguanil', 'doxycycline'],
      notes: {
        'artemether-lumefantrine': 'Oral drugs are for uncomplicated malaria. A confused patient with organ failure needs IV artesunate.',
        'atovaquone-proguanil': 'Oral drugs are for uncomplicated malaria. A confused patient with organ failure needs IV artesunate.',
        chloroquine: 'Falciparum from West Africa is chloroquine-resistant.',
        primaquine: 'Primaquine kills liver-stage parasites in vivax and ovale. It does nothing for a falciparum blood infection.',
      },
      outcome: {
        best: 'Parasitemia dropped under 1% in 24 hours and he woke up on day 2.',
        okay: 'He survived.',
        poor: 'His parasitemia kept climbing and he went into multi-organ failure.',
      },
      standard: 'IV artesunate, followed by a full oral course (artemether-lumefantrine or atovaquone-proguanil) once parasitemia is low and he can take pills.',
    },
    pearl: 'Severe malaria means altered mental status, over 5% parasitemia, hypoglycemia, kidney injury, or acidosis. Any one of these means IV artesunate.',
  },

  // 13
  {
    accept: ['saureus'],
    answer: 'Staphylococcus aureus (MRSA)',
    dx: 'Right-sided endocarditis with septic pulmonary emboli',
    clues: [
      ["Presentation", "A 31-year-old man presents with a week of fever."],
      ["Symptoms", "He also has sharp chest pain when he breathes in."],
      ["History", "He injects heroin and sometimes reuses needles."],
      ["Exam", "Exam shows a holosystolic murmur at the left lower sternal border that gets louder with inspiration."],
      ["Imaging", "Chest CT shows multiple cavitating nodules at the edges of both lungs."],
      ["Microbiology", "Blood cultures grow coagulase-positive Gram-positive cocci in clusters that are resistant to oxacillin."],
    ],
    rx: {
      prompt: 'He is admitted. What do you start?',
      best: [[['vanc-iv', 'daptomycin']]],
      okay: [[['ceftaroline', 'linezolid']]],
      extras: ['ceftriaxone', 'cefepime', 'pip-tazo', 'gentamicin', 'rifampin'],
      notes: {
        ceftaroline: 'Ceftaroline covers MRSA but is a salvage option for bacteremia.',
        linezolid: 'Linezolid is bacteriostatic and not first-line for MRSA bacteremia or endocarditis.',
        cefazolin: 'The isolate is oxacillin-resistant, so cefazolin and nafcillin will not work.',
        nafcillin: 'The isolate is oxacillin-resistant, so nafcillin will not work.',
        oxacillin: 'The isolate is oxacillin-resistant.',
        'tmp-smx': 'TMP-SMX is not reliable for endocarditis.',
      },
      outcome: {
        best: 'Blood cultures cleared on day 4. He finished 6 weeks of IV therapy and was connected with addiction care.',
        okay: 'His cultures cleared, but more slowly.',
        poor: 'His blood cultures stayed positive for a week and he developed new emboli.',
      },
      standard: 'IV vancomycin or daptomycin for 6 weeks for MRSA endocarditis. Repeat blood cultures until clear.',
    },
    pearl: 'Tricuspid endocarditis with septic lung emboli in someone who injects drugs is classic S. aureus. Daptomycin is fine for endocarditis but fails in pneumonia because lung surfactant inactivates it.',
  },

  // 14
  {
    accept: ['flu'],
    dx: 'Influenza with hypoxemia',
    clues: [
      ["Presentation", "A 76-year-old woman presents with sudden fever and body aches."],
      ["Symptoms", "She also has a dry cough and feels exhausted."],
      ["History", "It is January, and she skipped all her vaccines this fall."],
      ["Exam", "Her oxygen saturation is 91% on room air."],
      ["Tests", "Chest X-ray shows no consolidation, and procalcitonin is low."],
      ["Microbiology", "Nasal PCR detects a segmented RNA virus with hemagglutinin and neuraminidase."],
    ],
    rx: {
      prompt: 'She is admitted for oxygen. What do you start?',
      best: [['oseltamivir']],
      okay: [[['peramivir', 'zanamivir', 'baloxavir']]],
      extras: ['ceftriaxone', 'azithromycin'],
      notes: {
        peramivir: 'IV peramivir works, but oral oseltamivir is preferred in hospitalized patients who can swallow.',
        zanamivir: 'Inhaled zanamivir can trigger bronchospasm and is not preferred in hospitalized patients.',
        baloxavir: 'Baloxavir is approved for outpatients. There is less data in hospitalized patients.',
        amantadine: 'Circulating influenza A is resistant to amantadine.',
        acyclovir: 'Acyclovir does not treat influenza.',
      },
      outcome: {
        best: 'She was off oxygen by day 3 and home on day 4.',
        okay: 'She recovered.',
        poor: 'She developed a secondary bacterial pneumonia on day 5.',
      },
      standard: 'Oseltamivir for anyone hospitalized with influenza, even after 48 hours of symptoms.',
    },
    pearl: 'The 48-hour window applies to healthy outpatients. Hospitalized and high-risk patients get oseltamivir no matter how long they have been sick.',
  },

  // 15
  {
    accept: ['histo'],
    dx: 'Disseminated histoplasmosis',
    clues: [
      ["Presentation", "A 38-year-old man presents with 6 weeks of fever and night sweats."],
      ["Symptoms", "He has also lost a lot of weight."],
      ["History", "He has HIV with a CD4 count of 25 and recently cleaned out an old chicken coop in Ohio."],
      ["Exam", "Exam shows a painful ulcer on his palate and an enlarged liver and spleen."],
      ["Labs", "Labs show low counts in all three blood cell lines and a very high LDH."],
      ["Microbiology", "Bone marrow biopsy shows tiny yeasts packed inside macrophages."],
    ],
    rx: {
      prompt: 'He is admitted and looks sick. What do you start?',
      best: [['ampho']],
      okay: [['itraconazole']],
      downgrade: {
        art: 'Antifungals were right. ART should start soon, but usually after antifungal therapy is underway.',
      },
      notes: {
        itraconazole: 'Itraconazole is for mild disease or step-down. A sick, pancytopenic patient needs amphotericin first.',
        fluconazole: 'Fluconazole is much weaker than itraconazole against Histoplasma.',
        micafungin: 'Echinocandins do not treat Histoplasma.',
        caspofungin: 'Echinocandins do not treat Histoplasma.',
      },
      outcome: {
        best: 'He defervesced in a week and stepped down to itraconazole.',
        okay: 'He improved, but slowly.',
        poor: 'He became hypotensive and needed the ICU.',
      },
      standard: 'Liposomal amphotericin B for 1 to 2 weeks, then itraconazole for at least a year.',
    },
    pearl: 'Histoplasma lives in bird and bat droppings in the Ohio and Mississippi River valleys. It is a tiny yeast that hides inside macrophages.',
  },

  // 16
  {
    accept: ['tpallidum'],
    dx: 'Secondary syphilis',
    clues: [
      ["Presentation", "A 26-year-old man presents with a new rash."],
      ["Symptoms", "He also feels run-down and has swollen lymph nodes."],
      ["History", "He has had several new male sexual partners this year."],
      ["Exam", "The rash is scaly and copper-colored and covers his palms and soles."],
      ["More history", "Two months ago he had a painless genital sore that healed on its own."],
      ["Microbiology", "RPR is positive at 1:64, and dark-field microscopy shows corkscrew-shaped organisms."],
    ],
    rx: {
      prompt: 'He has no allergies. What do you give?',
      best: [['bpg']],
      okay: [[['doxycycline', 'ceftriaxone']]],
      notes: {
        doxycycline: 'Doxycycline is the alternative for penicillin allergy.',
        ceftriaxone: 'Ceftriaxone works, but benzathine penicillin is the standard.',
        azithromycin: 'Many strains are now resistant to macrolides.',
        'pen-v': 'Oral penicillin does not reach the levels needed for syphilis.',
        amoxicillin: 'Oral amoxicillin is not used for syphilis.',
      },
      outcome: {
        best: 'He had fevers and chills for a few hours after the shot (Jarisch-Herxheimer reaction), then the rash faded. His RPR dropped 4-fold by 6 months.',
        okay: 'He was cured, but there was a better first choice.',
        poor: 'His RPR did not fall, and a year later he developed neurologic symptoms.',
      },
      standard: 'One dose of benzathine penicillin G 2.4 million units IM.',
    },
    pearl: 'A rash on the palms and soles has a short list: secondary syphilis, RMSF, coxsackie (hand-foot-mouth), and drug reactions.',
  },

  // 17
  {
    accept: ['ehec', 'ecoli'],
    answer: 'Escherichia coli O157:H7 (EHEC)',
    dx: 'Hemolytic uremic syndrome',
    clues: [
      ["Presentation", "A 6-year-old girl presents with 3 days of diarrhea and abdominal cramps."],
      ["Symptoms", "Today her diarrhea has turned bloody."],
      ["History", "She ate an undercooked hamburger at a cookout last week."],
      ["Exam", "She has no fever."],
      ["Labs", "Two days later she is pale, with schistocytes, low platelets, and a rising creatinine."],
      ["Microbiology", "Stool grows a Gram-negative rod that does not ferment sorbitol and makes Shiga toxin."],
    ],
    rx: {
      prompt: 'She is admitted to the pediatric floor. What do you do?',
      best: [['supportive']],
      okay: [],
      noAntimicrobials: 'Antibiotics can make the bacteria release more Shiga toxin. Her kidney injury got worse and she needed dialysis.',
      harm: {
        loperamide: 'Antimotility drugs keep the toxin in the gut longer and raise the risk of HUS.',
      },
      outcome: {
        best: 'With careful fluids and monitoring, her kidney function recovered over 2 weeks without dialysis.',
        okay: 'She recovered.',
        poor: 'She did not get the supportive care she needed.',
      },
      standard: 'Supportive care: IV fluids, monitoring, transfusion and dialysis if needed. No antibiotics, no antimotility drugs.',
    },
    pearl: 'Bloody diarrhea without fever after undercooked beef is EHEC. Antibiotics raise the risk of HUS, so do not give them.',
  },

  // 18
  {
    accept: ['aspergillus'],
    dx: 'Invasive pulmonary aspergillosis',
    clues: [
      ["Presentation", "A 58-year-old man presents with fever despite 5 days of broad-spectrum antibiotics."],
      ["Symptoms", "He also has a new cough and pleuritic chest pain."],
      ["History", "He has AML and is 14 days out from chemotherapy with no neutrophils."],
      ["Course", "He has started coughing up small amounts of blood."],
      ["Imaging", "Chest CT shows a nodule surrounded by a halo of ground glass, and serum galactomannan is positive."],
      ["Microbiology", "Bronchoscopy shows septate hyphae that branch at acute angles."],
    ],
    rx: {
      prompt: 'What antifungal do you start?',
      best: [[['voriconazole', 'isavuconazole']]],
      okay: [[['ampho', 'posaconazole']], [ECHINO]],
      extras: ['cefepime', 'meropenem', 'pip-tazo', 'vanc-iv'],
      notes: {
        ampho: 'Liposomal amphotericin works, but voriconazole has better survival data.',
        posaconazole: 'Posaconazole is a reasonable alternative but not first-line.',
        micafungin: 'Echinocandins are salvage therapy for Aspergillus.',
        caspofungin: 'Echinocandins are salvage therapy for Aspergillus.',
        anidulafungin: 'Echinocandins are salvage therapy for Aspergillus.',
        fluconazole: 'Fluconazole has no activity against Aspergillus.',
      },
      outcome: {
        best: 'His fevers settled, and the nodule shrank once his neutrophils came back.',
        okay: 'He stabilized, but this was not the first-line choice.',
        poor: 'The infection spread to both lungs.',
      },
      standard: 'Voriconazole (or isavuconazole) for at least 6 to 12 weeks.',
    },
    pearl: 'The halo sign in a neutropenic patient is classic invasive aspergillosis. Septate hyphae at acute angles is Aspergillus; broad hyphae without septa at right angles is Mucor.',
  },

  // 19
  {
    accept: ['nmen'],
    dx: 'Meningococcal meningitis',
    clues: [
      ["Presentation", "A 19-year-old man presents with fever, headache, and vomiting that started this morning."],
      ["Symptoms", "He also has a stiff neck and sensitivity to light."],
      ["History", "He is a college freshman who lives in a dorm."],
      ["Exam", "Exam shows non-blanching petechiae on his legs that are spreading."],
      ["CSF", "CSF shows 2,400 white cells, mostly neutrophils, and a very low glucose."],
      ["Microbiology", "CSF Gram stain shows Gram-negative diplococci that ferment maltose."],
    ],
    rx: {
      prompt: 'He is in the ED. What do you give him?',
      best: [[['ceftriaxone', 'cefotaxime']]],
      okay: [['pen-g']],
      extras: ['vanc-iv', 'ampicillin'],
      notes: {
        'pen-g': 'Penicillin works once susceptibility is confirmed, but ceftriaxone is the right empiric choice.',
        ciprofloxacin: 'Ciprofloxacin is for prophylaxis of close contacts, not for treating meningitis.',
        rifampin: 'Rifampin is for prophylaxis of close contacts, not for treating meningitis.',
      },
      outcome: {
        best: 'He was in the ICU for 2 days and recovered fully. His roommates got prophylaxis.',
        okay: 'He recovered.',
        poor: 'He developed purpura fulminans and lost two toes.',
      },
      standard: 'Ceftriaxone right away (with vancomycin until the organism is known). Prophylaxis for close contacts with rifampin, ciprofloxacin, or ceftriaxone.',
    },
    pearl: 'Fever with a petechial rash can kill within hours. Give ceftriaxone before the LP if there is any delay.',
  },

  // 20
  {
    accept: ['ehisto'],
    dx: 'Amebic liver abscess',
    clues: [
      ["Presentation", "A 36-year-old man presents with 2 weeks of fever."],
      ["Symptoms", "He also has right upper abdominal pain that gets worse when he breathes deeply."],
      ["History", "He moved from rural Mexico 3 months ago."],
      ["More history", "A few months ago he had several weeks of bloody diarrhea."],
      ["Imaging", "Ultrasound shows a single large round lesion in the right lobe of the liver."],
      ["Microbiology", "Serology is positive for a protozoan whose trophozoites swallow red blood cells."],
    ],
    rx: {
      prompt: 'He is stable. What do you prescribe?',
      best: [[['metronidazole', 'tinidazole'], ['paromomycin', 'iodoquinol']]],
      okay: [[['metronidazole', 'tinidazole']]],
      notes: {
        metronidazole: 'Metronidazole clears the abscess, but cysts left in the gut can cause a relapse. Add a luminal agent like paromomycin.',
        tinidazole: 'Tinidazole clears the abscess, but cysts left in the gut can cause a relapse. Add a luminal agent like paromomycin.',
        paromomycin: 'Paromomycin only works inside the gut. It does not treat the liver abscess.',
      },
      outcome: {
        best: 'His fever broke in 4 days, and the luminal agent cleared the cysts from his gut.',
        okay: 'His abscess resolved, but 6 months later he was back with amebic colitis.',
        poor: 'The abscess kept growing and needed drainage.',
      },
      standard: 'Metronidazole (or tinidazole) for the abscess, then a luminal agent like paromomycin. Drainage is rarely needed.',
    },
    pearl: 'Amebic liver abscess is usually single and in the right lobe. Unlike a bacterial abscess, it usually heals with drugs alone.',
  },

  // 21
  {
    accept: ['hsv1'],
    dx: 'HSV encephalitis',
    clues: [
      ["Presentation", "A 45-year-old woman presents with 2 days of fever and headache."],
      ["Symptoms", "Her husband says she has been acting strangely and smelling burning rubber."],
      ["Course", "She has a seizure in the emergency department."],
      ["Exam", "Exam shows confusion and trouble finding words."],
      ["Tests", "CSF shows lymphocytes and red blood cells, and MRI shows swelling in the left temporal lobe."],
      ["Microbiology", "CSF PCR detects an enveloped DNA virus that lies dormant in the trigeminal ganglion."],
    ],
    rx: {
      prompt: 'She is admitted. What do you start?',
      best: [['acyclovir']],
      okay: [[['foscarnet', 'ganciclovir']]],
      extras: ['vanc-iv', 'ceftriaxone', 'ampicillin'],
      notes: {
        foscarnet: 'Foscarnet is for acyclovir-resistant HSV, and it is hard on the kidneys.',
        ganciclovir: 'Ganciclovir has activity but is more toxic. Acyclovir is the standard.',
        valacyclovir: 'Oral valacyclovir cannot reach high enough levels in the brain. Encephalitis needs IV acyclovir.',
      },
      outcome: {
        best: 'Her confusion cleared over 2 weeks. She has mild memory problems but went home.',
        okay: 'She survived, with a harder course.',
        poor: 'She developed severe memory loss and personality changes. Untreated HSV encephalitis kills about 70% of patients.',
      },
      standard: 'IV acyclovir 10 mg/kg every 8 hours for 14 to 21 days. Start it as soon as you suspect encephalitis.',
    },
    pearl: 'Temporal lobe findings, red cells in the CSF, and smell hallucinations point to HSV-1. Start IV acyclovir before the PCR comes back.',
  },

  // 22
  {
    accept: ['mucor'],
    dx: 'Rhino-orbital-cerebral mucormycosis',
    clues: [
      ["Presentation", "A 47-year-old woman presents with facial pain and headache."],
      ["Symptoms", "She is also confused and has swelling around her right eye."],
      ["History", "She has type 1 diabetes and ran out of insulin a week ago."],
      ["Labs", "Her glucose is 540 and she is in severe ketoacidosis."],
      ["Exam", "Exam shows a black, dead-looking patch on her nasal turbinate."],
      ["Microbiology", "Biopsy shows broad hyphae without septa that branch at right angles."],
    ],
    rx: {
      prompt: 'You have started treating her DKA. What else do you do?',
      best: [['ampho', 'debride']],
      okay: [[['isavuconazole', 'posaconazole'], 'debride']],
      inadequate: [
        [[['ampho', 'isavuconazole', 'posaconazole']], 'The antifungal was right, but drugs cannot reach dead, clotted tissue. Without urgent debridement the infection spread into her brain.'],
      ],
      notes: {
        ampho: 'Amphotericin is right, but mucormycosis needs urgent surgical debridement too.',
        isavuconazole: 'Isavuconazole is an alternative, but amphotericin is first-line.',
        posaconazole: 'Posaconazole is an alternative, but amphotericin is first-line.',
        voriconazole: 'Voriconazole has no activity against Mucorales.',
        fluconazole: 'Fluconazole has no activity against molds.',
        debride: 'Surgery is essential, but she also needs amphotericin.',
      },
      outcome: {
        best: 'After debridement and amphotericin, the infection was controlled. She lost vision in the right eye but survived.',
        okay: 'She survived, but the infection spread further.',
        poor: 'The infection spread into her brain.',
      },
      standard: 'High-dose liposomal amphotericin B plus urgent surgical debridement, and correct the DKA.',
    },
    pearl: 'Mucor loves acidosis and iron. A black eschar in a patient with DKA is a surgical emergency.',
  },

  // 23
  {
    accept: ['mtb'],
    dx: 'Active pulmonary tuberculosis',
    clues: [
      ["Presentation", "A 44-year-old man presents with 3 months of cough."],
      ["Symptoms", "He also has night sweats and has lost 8 kg."],
      ["History", "He moved from the Philippines a year ago."],
      ["Course", "He has started coughing up blood-streaked sputum."],
      ["Imaging", "Chest X-ray shows a cavity in the right upper lobe."],
      ["Microbiology", "Sputum is positive for acid-fast bacilli."],
    ],
    rx: {
      prompt: 'He is in respiratory isolation. What regimen do you start?',
      best: [['rifampin', 'isoniazid', 'pyrazinamide', 'ethambutol']],
      okay: [['rifampin', 'isoniazid', 'pyrazinamide']],
      extras: [],
      notes: {
        rifampin: 'Active TB always needs multiple drugs. Fewer than three lets resistance develop.',
        isoniazid: 'One drug alone is for latent TB. Active TB needs four drugs to start.',
        levofloxacin: 'Fluoroquinolones are second-line for TB.',
      },
      outcome: {
        best: 'His sputum became smear-negative at 6 weeks and he finished 6 months of treatment.',
        okay: 'He was cured, but leaving out ethambutol risks resistance until susceptibilities are back.',
        poor: 'His TB came back resistant to isoniazid.',
      },
      standard: 'RIPE (rifampin, isoniazid, pyrazinamide, ethambutol) for 2 months, then rifampin plus isoniazid for 4 months. Add pyridoxine with isoniazid.',
    },
    pearl: 'Reactivation TB goes to the upper lobes because they have the most oxygen. Give vitamin B6 with isoniazid to prevent neuropathy.',
  },

  // 24
  {
    accept: ['ngon'],
    dx: 'Disseminated gonococcal infection',
    clues: [
      ["Presentation", "A 22-year-old woman presents with 4 days of fever and joint pain."],
      ["Symptoms", "The pain has moved from her knee to her wrist."],
      ["History", "She has a new sexual partner and does not use condoms."],
      ["Exam", "Exam shows inflamed tendons on the back of her hand and a few painless pustules on her arms and legs."],
      ["Labs", "Knee fluid has 45,000 white cells, but blood cultures are negative."],
      ["Microbiology", "Joint fluid grows Gram-negative diplococci on Thayer-Martin agar."],
    ],
    rx: {
      prompt: 'She is admitted. What do you start?',
      best: [['ceftriaxone']],
      okay: [['cefotaxime']],
      extras: ['doxycycline', 'azithromycin'],
      notes: {
        cefotaxime: 'Cefotaxime works, but ceftriaxone is the standard.',
        ciprofloxacin: 'Gonorrhea is widely resistant to fluoroquinolones.',
        azithromycin: 'Azithromycin alone is not enough for gonorrhea.',
        doxycycline: 'Doxycycline treats chlamydia, not gonorrhea.',
      },
      outcome: {
        best: 'Her joints improved within 48 hours. She finished a week of treatment, and her partner was treated too.',
        okay: 'She recovered.',
        poor: 'Her knee developed septic arthritis that needed washout.',
      },
      standard: 'Ceftriaxone 1 g IV daily for at least 7 days. Treat chlamydia with doxycycline unless it has been ruled out. Treat partners.',
    },
    pearl: 'The classic triad of DGI is migratory arthritis, tenosynovitis, and painless pustules. Blood and joint cultures are often negative, so test the genital tract, throat, and rectum.',
  },

  // 25
  {
    accept: ['bartonella'],
    dx: 'Cat scratch disease',
    clues: [
      ["Presentation", "A 12-year-old boy presents with a painful lump in his armpit."],
      ["Symptoms", "It has been there for 3 weeks, along with low-grade fevers."],
      ["History", "His family adopted a kitten last month."],
      ["Exam", "Exam shows a 3 cm tender lymph node in his armpit and a small healing bump on his hand."],
      ["Labs", "His blood count is normal and a monospot is negative."],
      ["Microbiology", "Silver stain of the lymph node shows small, curved Gram-negative bacilli."],
    ],
    rx: {
      prompt: 'He is otherwise healthy. What do you do?',
      best: [['azithromycin']],
      okay: [['supportive'], [['rifampin', 'tmp-smx', 'ciprofloxacin', 'doxycycline']]],
      notes: {
        supportive: 'Most cases go away on their own, but azithromycin shrinks the node faster.',
        rifampin: 'Rifampin has activity, but azithromycin is the standard.',
        'tmp-smx': 'TMP-SMX has some activity, but azithromycin is the standard.',
        ciprofloxacin: 'Ciprofloxacin has activity, but azithromycin is the standard.',
        doxycycline: 'Doxycycline has activity, but azithromycin is the standard.',
        amoxicillin: 'Beta-lactams do not work well against Bartonella.',
        cephalexin: 'Cephalexin does not work against Bartonella.',
      },
      outcome: {
        best: 'The node shrank noticeably within a month.',
        okay: 'The node slowly shrank over a few months.',
        poor: 'The node kept growing and started to drain.',
      },
      standard: 'A 5-day course of azithromycin for lymphadenitis. Mild cases can be watched.',
    },
    pearl: 'Bartonella henselae causes cat scratch disease in healthy people and bacillary angiomatosis in people with advanced HIV.',
  },

  // 26
  {
    accept: ['pcp'],
    dx: 'Pneumocystis pneumonia',
    clues: [
      ["Presentation", "A 39-year-old man presents with 3 weeks of dry cough."],
      ["Symptoms", "He also gets short of breath climbing stairs."],
      ["History", "He was just diagnosed with HIV, and his CD4 count is 90."],
      ["Exam", "His oxygen saturation drops from 95% to 86% when he walks."],
      ["Tests", "LDH is elevated, and CT shows diffuse ground-glass opacities."],
      ["Microbiology", "Silver stain of induced sputum shows cysts shaped like crushed ping-pong balls."],
    ],
    rx: {
      prompt: 'He is admitted. What do you start?',
      best: [['tmp-smx', STEROID]],
      okay: [['tmp-smx'], ['pentamidine', STEROID], ['primaquine', 'clindamycin', STEROID]],
      extras: ['ceftriaxone', 'azithromycin', 'fluconazole', 'nystatin'],
      notes: {
        'tmp-smx': 'TMP-SMX is right, but his PaO2 is under 70. Adding steroids lowers mortality.',
        pentamidine: 'IV pentamidine is a backup for sulfa allergy and has more side effects.',
        primaquine: 'Primaquine plus clindamycin is a backup for sulfa allergy.',
        atovaquone: 'Atovaquone is only for mild PCP. His is moderate to severe.',
        dapsone: 'Dapsone alone is not enough. It is paired with trimethoprim for mild disease.',
      },
      outcome: {
        best: 'His oxygen improved over a week and he started ART 2 weeks into treatment.',
        okay: 'He recovered, but there was a better regimen.',
        poor: 'He needed intubation on day 4.',
      },
      standard: 'TMP-SMX for 21 days, plus prednisone if PaO2 is under 70 or the A-a gradient is 35 or more.',
    },
    pearl: 'Oxygen that drops when walking with a clear chest X-ray, high LDH, and CD4 under 200 is PCP. Steroids help when the PaO2 is under 70.',
  },

  // 27
  {
    accept: ['vvulnificus'],
    dx: 'Necrotizing soft tissue infection with sepsis',
    clues: [
      ["Presentation", "A 61-year-old man presents with fever and a painful leg wound."],
      ["Symptoms", "The redness is spreading visibly by the hour, and his blood pressure is dropping."],
      ["History", "He has alcohol-related cirrhosis."],
      ["More history", "He cut his leg in the Gulf of Mexico yesterday and ate raw oysters that night."],
      ["Exam", "Exam shows large, blood-filled blisters on his leg."],
      ["Microbiology", "Blood cultures grow a curved, oxidase-positive Gram-negative rod that needs salt to grow."],
    ],
    rx: {
      prompt: 'He is in septic shock and surgery is on the way. What do you order?',
      best: [['doxycycline', ['ceftriaxone', 'ceftazidime', 'cefotaxime', 'cefepime'], 'debride']],
      okay: [[['ciprofloxacin', 'levofloxacin'], 'debride'], ['doxycycline', 'debride']],
      inadequate: [
        [['doxycycline', ['ceftriaxone', 'ceftazidime', 'cefotaxime', 'cefepime']], 'The antibiotics were right, but a necrotizing infection needs the dead tissue cut out. Without surgery he died within 48 hours.'],
      ],
      extras: ['vanc-iv', 'pip-tazo', 'meropenem', 'clindamycin'],
      notes: {
        doxycycline: 'Doxycycline is right, but it works best paired with a third-generation cephalosporin.',
        ceftriaxone: 'A cephalosporin alone is not enough. Pair it with doxycycline.',
        debride: 'Debridement is essential, but he also needs doxycycline plus a cephalosporin.',
      },
      outcome: {
        best: 'He went to the OR within hours. With the right antibiotics, he survived and kept his leg.',
        okay: 'He survived, but missing part of the regimen made it closer than it should have been.',
        poor: 'He died within 48 hours. Vibrio vulnificus sepsis is over 50% fatal.',
      },
      standard: 'Doxycycline plus ceftriaxone (or ceftazidime), with urgent surgical debridement.',
    },
    pearl: 'Patients with liver disease have high iron levels, which Vibrio vulnificus thrives on. Raw oysters or a saltwater wound in someone with cirrhosis can be fatal.',
  },

  // 28
  {
    accept: ['calbicans'],
    dx: 'Catheter-related candidemia',
    clues: [
      ["Presentation", "A 66-year-old woman in the ICU develops a new fever."],
      ["Symptoms", "She keeps spiking fevers despite a week of meropenem and vancomycin."],
      ["History", "She is recovering from bowel surgery and gets TPN through a central line."],
      ["Tests", "Bacterial blood cultures and urine cultures are negative."],
      ["Labs", "Beta-D-glucan is positive."],
      ["Microbiology", "Blood cultures grow budding yeast that form germ tubes."],
    ],
    rx: {
      prompt: 'She is hemodynamically stable. What do you do?',
      best: [[ECHINO, 'line-out']],
      okay: [[ECHINO], ['fluconazole', 'line-out'], ['ampho', 'line-out']],
      extras: ['meropenem', 'vanc-iv'],
      notes: {
        micafungin: 'The antifungal is right, but the infected line has to come out.',
        caspofungin: 'The antifungal is right, but the infected line has to come out.',
        anidulafungin: 'The antifungal is right, but the infected line has to come out.',
        fluconazole: 'Fluconazole is fine for step-down once the isolate is susceptible, but an echinocandin is preferred first.',
        ampho: 'Amphotericin works but is more toxic than an echinocandin.',
        'line-out': 'Removing the line is right, but candidemia always needs an antifungal too.',
      },
      outcome: {
        best: 'Her cultures cleared within 48 hours. An eye exam was normal.',
        okay: 'Her cultures cleared, but more slowly.',
        poor: 'Her blood cultures stayed positive and she developed endophthalmitis.',
      },
      standard: 'An echinocandin, removal of the central line, a dilated eye exam, and 14 days of treatment after the first negative culture.',
    },
    pearl: 'Candida in the blood is never a contaminant. Pull the line and get an eye exam.',
  },

  // 29
  {
    accept: ['ctetani'],
    dx: 'Generalized tetanus',
    clues: [
      ["Presentation", "A 70-year-old man presents with jaw stiffness."],
      ["Symptoms", "He also has trouble swallowing."],
      ["History", "He has not had any vaccines in decades."],
      ["Exam", "Exam shows he cannot fully open his mouth and has a fixed grimace."],
      ["Course", "Loud noises trigger painful spasms that arch his back. He stepped on a nail in his garden 10 days ago."],
      ["Microbiology", "Wound culture grows an anaerobic Gram-positive rod with a spore at one end, shaped like a tennis racket."],
    ],
    rx: {
      prompt: 'He is admitted to the ICU. What do you give?',
      best: [['tig', ['metronidazole', 'pen-g']]],
      okay: [['tig']],
      extras: [],
      notes: {
        tig: 'TIG neutralizes circulating toxin, but you also need to kill the bacteria still making it.',
        metronidazole: 'The antibiotic is right, but without immune globulin the toxin in his blood keeps binding nerves.',
        'pen-g': 'The antibiotic is right, but without immune globulin the toxin in his blood keeps binding nerves.',
      },
      outcome: {
        best: 'With benzodiazepines for spasms and wound care, he slowly recovered over 4 weeks. He got his tetanus vaccine before discharge.',
        okay: 'He recovered, but the infection kept making toxin longer than it needed to.',
        poor: 'His spasms got worse and he needed intubation.',
      },
      standard: 'Human tetanus immune globulin, metronidazole, wound debridement, benzodiazepines for spasms, and start the tetanus vaccine series. Having tetanus does not make you immune.',
    },
    pearl: 'Tetanus toxin blocks the release of GABA and glycine from inhibitory neurons. That is why patients spasm while staying fully awake.',
  },

  // 30
  {
    accept: ['cmv'],
    dx: 'CMV retinitis',
    clues: [
      ["Presentation", "A 37-year-old man presents with blurry vision in his right eye."],
      ["Symptoms", "He also sees new floaters, but the eye is not painful or red."],
      ["History", "He has HIV, is not on treatment, and his CD4 count is 22."],
      ["Exam", "Fundus exam shows fluffy white retinal lesions with hemorrhages along the blood vessels."],
      ["Labs", "Plasma PCR shows a high viral load of a herpesvirus."],
      ["Microbiology", "In tissue, this virus makes enlarged cells with owl's-eye inclusions in the nucleus."],
    ],
    rx: {
      prompt: 'Ophthalmology confirms the diagnosis. What do you start?',
      best: [[['valganciclovir', 'ganciclovir']]],
      okay: [[['foscarnet', 'cidofovir']]],
      downgrade: {
        art: 'Antivirals were right. ART should start, but usually within 2 weeks of starting CMV treatment.',
      },
      notes: {
        foscarnet: 'Foscarnet works, but it is hard on the kidneys and saved for resistance.',
        cidofovir: 'Cidofovir works, but it is hard on the kidneys and saved for resistance.',
        acyclovir: 'CMV lacks the enzyme acyclovir needs to activate.',
        valacyclovir: 'CMV lacks the enzyme acyclovir needs to activate.',
      },
      outcome: {
        best: 'The retinitis stopped spreading and his vision stabilized. He started ART 2 weeks later.',
        okay: 'The retinitis was controlled, with more side effects.',
        poor: 'The retinitis kept spreading and he lost vision in that eye.',
      },
      standard: 'Oral valganciclovir (or IV ganciclovir), sometimes with eye injections for sight-threatening lesions. Start ART within 2 weeks.',
    },
    pearl: 'CMV retinitis happens with CD4 under 50. Ganciclovir is activated by a CMV kinase (UL97), and its main side effect is bone marrow suppression.',
  },

  // 31
  {
    accept: ['babesia'],
    dx: 'Babesiosis in an asplenic patient',
    clues: [
      ["Presentation", "A 68-year-old man presents with a week of fever and fatigue."],
      ["Symptoms", "He also has sweats and dark urine."],
      ["History", "His spleen was removed after a car accident."],
      ["More history", "He lives on Cape Cod and gardens every day in the summer."],
      ["Labs", "Labs show hemolytic anemia and low platelets."],
      ["Microbiology", "Blood smear shows ring forms inside red cells, some arranged like a Maltese cross."],
    ],
    rx: {
      prompt: 'He is admitted to the medical floor and is stable. Parasitemia is 4%. What do you start?',
      best: [['atovaquone', 'azithromycin']],
      okay: [['clindamycin', 'quinine']],
      extras: ['doxycycline'],
      notes: {
        atovaquone: 'Atovaquone is right, but alone it lets resistance develop. Pair it with azithromycin.',
        azithromycin: 'Azithromycin is right, but alone it lets resistance develop. Pair it with atovaquone.',
        clindamycin: 'Clindamycin works only when paired with quinine, and that combination is a backup because of its side effects.',
        quinine: 'Clindamycin plus quinine works but causes more side effects (ringing in the ears, GI upset). Atovaquone plus azithromycin is preferred.',
        'atovaquone-proguanil': 'This is a malaria pill. Babesiosis is treated with atovaquone suspension plus azithromycin.',
        doxycycline: 'Doxycycline covers Lyme disease and anaplasmosis, which can come from the same tick bite, but it does nothing for this parasite.',
        chloroquine: 'Malaria drugs do not reliably treat this parasite.',
        artesunate: 'Artesunate is for severe malaria. It is not a recommended treatment here.',
        primaquine: 'Primaquine treats the liver stage of vivax and ovale malaria. It does nothing here.',
      },
      outcome: {
        best: 'His fever broke in 3 days and his parasitemia fell steadily. Because he has no spleen, treatment continued until his smears stayed negative.',
        okay: 'He recovered, but quinine caused ringing in his ears and nausea.',
        poor: 'His parasitemia climbed past 10% and he needed an exchange transfusion in the ICU.',
      },
      standard: 'Atovaquone plus azithromycin, with follow-up blood smears. Treat longer in asplenic or immunocompromised patients. Consider exchange transfusion for parasitemia over 10% or organ failure. Test for Lyme disease and anaplasmosis.',
    },
    pearl: 'The Maltese cross is classic for Babesia. Ring forms without pigment or gametocytes in someone who has not traveled point to Babesia, not malaria. Having no spleen makes it far more severe.',
  },

  // 32
  {
    accept: ['pertussis'],
    dx: 'Infant pertussis',
    clues: [
      ["Presentation", "A 6-week-old girl is brought in after turning blue during a coughing spell."],
      ["Symptoms", "She had a runny nose for a week before the cough started."],
      ["History", "Her mother skipped vaccines during pregnancy, and her teenage brother has had a cough for a month."],
      ["Exam", "She coughs in rapid bursts, briefly stops breathing, and vomits afterward."],
      ["Labs", "Her white count is 34,000, mostly lymphocytes."],
      ["Microbiology", "Nasopharyngeal PCR detects a small Gram-negative coccobacillus."],
    ],
    rx: {
      prompt: 'She is admitted to watch for apnea. She has no allergies. What do you start?',
      best: [['azithromycin']],
      okay: [[['erythromycin', 'clarithromycin']]],
      harm: {
        'tmp-smx': 'TMP-SMX is contraindicated under 2 months of age. Sulfonamides push bilirubin off albumin and can cause kernicterus.',
      },
      notes: {
        erythromycin: 'Erythromycin works, but it needs 14 days, upsets the stomach, and raises the risk of pyloric stenosis in young infants. Azithromycin is preferred.',
        clarithromycin: 'Clarithromycin works, but azithromycin is preferred in young infants.',
        supportive: 'Every infant under 1 year with pertussis should get an antibiotic. It clears the bacteria and protects others, even if the cough lingers.',
        amoxicillin: 'Beta-lactams do not work against this organism.',
        'amox-clav': 'Beta-lactams do not work against this organism.',
        ceftriaxone: 'Cephalosporins do not reliably treat this organism.',
      },
      outcome: {
        best: 'She had a few more spells in the hospital but no more apnea. She went home after a week, and her family got prophylaxis.',
        okay: 'She recovered, though her antibiotic was not the preferred one for her age.',
        poor: 'She kept having apneic spells and needed the ICU.',
      },
      standard: 'Azithromycin for 5 days. Most infants under 4 months are admitted. Give prophylaxis to all household contacts, and vaccinate mothers with Tdap during every pregnancy.',
    },
    pearl: 'Young infants with pertussis often do not whoop. They have apnea and cyanosis instead. A very high lymphocyte count is a clue, and the toxin causes it.',
  },

  // 33
  {
    accept: ['blasto'],
    dx: 'Pulmonary and skin blastomycosis',
    clues: [
      ["Presentation", "A 38-year-old man presents with 6 weeks of cough."],
      ["Symptoms", "He also has fevers, night sweats, and weight loss."],
      ["History", "He lives in northern Wisconsin and spent weeks tearing out beaver dams last fall."],
      ["Exam", "Exam shows a crusted, wart-like plaque on his cheek."],
      ["Tests", "Chest X-ray shows a mass-like consolidation, and sputum AFB smears are negative."],
      ["Microbiology", "Skin biopsy shows large yeast with thick walls and a single broad-based bud."],
    ],
    rx: {
      prompt: 'He is not hypoxic and has no neurologic symptoms. He will be treated as an outpatient. What do you prescribe?',
      best: [['itraconazole']],
      okay: [[['ampho', 'fluconazole', 'voriconazole', 'posaconazole', 'isavuconazole']]],
      notes: {
        ampho: 'Amphotericin works, but it is saved for severe disease or brain involvement. Mild to moderate disease gets oral itraconazole.',
        fluconazole: 'Fluconazole is less effective. It is a backup if itraconazole cannot be used.',
        voriconazole: 'Voriconazole has activity, but itraconazole is the drug of choice.',
        posaconazole: 'Posaconazole has activity, but itraconazole is the drug of choice.',
        isavuconazole: 'Isavuconazole has activity, but itraconazole is the drug of choice.',
        micafungin: 'Echinocandins do not work against the dimorphic fungi.',
        caspofungin: 'Echinocandins do not work against the dimorphic fungi.',
        anidulafungin: 'Echinocandins do not work against the dimorphic fungi.',
        supportive: 'His infection has spread to his skin. All disseminated disease needs treatment.',
        isoniazid: 'This is not TB. His smears were negative and the biopsy shows yeast.',
        rifampin: 'This is not TB, and rifampin lowers itraconazole levels.',
      },
      outcome: {
        best: 'His cough and skin lesion faded over 2 months. He finished a year of itraconazole with levels checked along the way.',
        okay: 'He improved, but this was not the preferred drug.',
        poor: 'His lung lesion grew and new skin lesions appeared.',
      },
      standard: 'Itraconazole for 6 to 12 months for mild to moderate disease, with a blood level checked after 2 weeks. Amphotericin first for severe or CNS disease.',
    },
    pearl: 'Blastomyces is a big yeast with a broad-based bud. It spreads to skin and bone and is common around the Great Lakes and the Ohio and Mississippi river valleys.',
  },
];
