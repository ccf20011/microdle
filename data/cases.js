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
      ['Presentation', 'A 28-year-old woman has had 2 weeks of watery diarrhea, bloating, and a lot of gas.'],
      ['History', 'She got back from a backpacking trip in the Rockies 3 weeks ago. She drank from mountain streams without a filter.'],
      ['Exam', 'Afebrile. Mild diffuse abdominal tenderness. She has lost 4 kg.'],
      ['Stool', 'Greasy, foul-smelling stools that float. No blood. Fecal leukocytes are negative.'],
      ['Course', 'Her symptoms get worse after dairy, which never bothered her before.'],
      ['Microbiology', 'Stool shows pear-shaped flagellated trophozoites with two nuclei that look like a face. Stool antigen positive.'],
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
      ['Presentation', 'A 9-year-old boy has had 3 days of high fever, severe headache, and muscle aches.'],
      ['History', 'He lives in North Carolina and spent June playing in the woods. His parents pulled a tick off him 10 days ago.'],
      ['Exam', 'Small pink macules that started on his wrists and ankles are spreading to his trunk. They are on his palms and soles too.'],
      ['Labs', 'Platelets 70,000. Sodium 129. AST and ALT are mildly elevated.'],
      ['Course', 'The rash is turning petechial and he is getting confused.'],
      ['Microbiology', 'Skin biopsy immunostain shows an obligate intracellular Gram-negative organism in the blood vessel endothelium.'],
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
      ['Presentation', 'A 74-year-old woman has had a day of fever, headache, and confusion.'],
      ['History', 'She takes prednisone for polymyalgia rheumatica.'],
      ['Exam', 'T 39 °C. Stiff neck with a positive Brudzinski sign. She is disoriented.'],
      ['Diet', 'Her fridge is stocked with deli turkey and queso fresco, which she eats daily.'],
      ['CSF', 'WBC 600 with a mix of neutrophils and lymphocytes. Glucose low-normal. Protein high.'],
      ['Microbiology', 'CSF shows Gram-positive rods. In broth they show tumbling motility, and the organism grows at refrigerator temperature.'],
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
      ['Presentation', 'An 81-year-old nursing home resident has 8 watery stools a day.'],
      ['History', 'She finished a course of clindamycin for a dental infection 10 days ago.'],
      ['Exam', 'T 38.2 °C. Lower abdominal tenderness. No rebound or guarding.'],
      ['Labs', 'WBC 22,000. Creatinine 1.3, up from her baseline of 0.9.'],
      ['Imaging', 'CT shows diffuse colonic wall thickening. No megacolon.'],
      ['Microbiology', 'Stool PCR positive for a toxin gene from a spore-forming, Gram-positive anaerobe.'],
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
      ['Presentation', 'A 34-year-old man has 3 weeks of worsening headache and low-grade fevers.'],
      ['History', 'He has HIV and stopped his antiretrovirals a year ago. His CD4 count is 35.'],
      ['Exam', 'Mild neck stiffness, blurry vision, and bilateral papilledema.'],
      ['LP', 'Opening pressure is 38 cm H2O. CSF has 20 lymphocytes, low glucose, and high protein.'],
      ['Imaging', 'MRI shows small cystic lesions in the basal ganglia.'],
      ['Microbiology', 'India ink shows round budding yeast with a thick clear capsule. CSF antigen is strongly positive.'],
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
      ['Presentation', 'A 7-year-old has had a sore throat and fever since yesterday.'],
      ['History', 'Several classmates are out sick. No cough, no runny nose.'],
      ['Exam', 'T 39 °C. Tonsillar exudates and tender anterior cervical lymph nodes.'],
      ['Skin', 'A fine red rash that feels like sandpaper covers his trunk and is darker in the skin folds. His cheeks are flushed with a pale ring around the mouth.'],
      ['Mouth', 'His tongue is bright red with prominent papillae.'],
      ['Microbiology', 'Rapid antigen test positive. Culture grows beta-hemolytic Gram-positive cocci in chains that are bacitracin-sensitive.'],
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
      ['Presentation', 'A 63-year-old man has 3 days of high fever, dry cough, and diarrhea.'],
      ['History', 'He smokes and came home from a cruise 5 days ago. He spent a lot of time in the hot tub.'],
      ['Exam', 'T 40 °C but heart rate only 88. Crackles at the left base. He is confused.'],
      ['Labs', 'Sodium 127. AST and ALT mildly elevated. Phosphate low.'],
      ['Course', 'Left lower lobe consolidation. He got worse despite 2 days of outpatient amoxicillin.'],
      ['Microbiology', 'Sputum Gram stain has many neutrophils but few organisms. Urine antigen positive. Grows on buffered charcoal yeast extract.'],
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
      ['Presentation', 'A 41-year-old woman is brought in after her first seizure.'],
      ['History', 'She has HIV and is not on treatment. Her CD4 count is 60 and she takes no prophylaxis.'],
      ['Exam', 'Right arm weakness, headache, and a low-grade fever.'],
      ['Home', 'She has three cats and cleans the litter boxes herself.'],
      ['Imaging', 'MRI shows several ring-enhancing lesions at the gray-white junction and in the basal ganglia.'],
      ['Microbiology', 'Serum IgG positive for an obligate intracellular protozoan.'],
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
      ['Presentation', 'A 35-year-old woman has fever, fatigue, and a new facial droop.'],
      ['History', 'She lives in Connecticut and went hiking in July. It is now August.'],
      ['Exam', 'Her right face is weak, including her forehead.'],
      ['Skin', 'She has three expanding red patches with central clearing on her trunk and thigh.'],
      ['Tests', 'ECG shows a normal PR interval. She is not pregnant.'],
      ['Microbiology', 'Two-tier serology (ELISA, then Western blot) is positive for a spirochete carried by Ixodes ticks.'],
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
      ['Presentation', 'A 72-year-old man has had 3 weeks of severe left ear pain and drainage.'],
      ['History', 'He has poorly controlled type 2 diabetes. His A1c is 11%.'],
      ['Exam', 'Granulation tissue on the floor of the ear canal, and a new left facial droop.'],
      ['Labs', 'ESR 95. CRP elevated.'],
      ['Imaging', 'CT shows erosion of the temporal bone at the skull base.'],
      ['Microbiology', 'Culture grows an oxidase-positive, non-lactose-fermenting Gram-negative rod with a blue-green pigment and a grape-like smell.'],
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
      ['Presentation', 'A 29-year-old man has fever, chills, and confusion.'],
      ['History', 'He returned 10 days ago from visiting family in Nigeria. He did not take his travel pills.'],
      ['Exam', 'T 40.1 °C. Jaundiced, with a palpable spleen. GCS 13.'],
      ['Labs', 'Hemoglobin 8. Platelets 45,000. Creatinine 2.4. Glucose 58. Lactate elevated.'],
      ['Smear', '8% of his red cells are infected, many with more than one ring form.'],
      ['Microbiology', 'Banana-shaped gametocytes are seen on the smear.'],
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
      ['Presentation', 'A 31-year-old man has a week of fevers and sharp chest pain when he breathes in.'],
      ['History', 'He injects heroin and sometimes reuses needles.'],
      ['Exam', 'T 39.5 °C. Track marks. A holosystolic murmur at the left lower sternal border that gets louder when he breathes in.'],
      ['Imaging', 'Chest CT shows multiple peripheral nodules, some cavitating.'],
      ['Echo', 'A 1.5 cm vegetation on the tricuspid valve.'],
      ['Microbiology', '4 of 4 blood cultures: Gram-positive cocci in clusters, catalase- and coagulase-positive, resistant to oxacillin.'],
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
      ['Presentation', 'A 76-year-old woman has had sudden fever, body aches, and a dry cough since yesterday.'],
      ['History', 'It is January. Her grandchildren visited sick last week. She skipped her fall vaccines.'],
      ['Exam', 'T 39.2 °C. SpO2 91% on room air. She aches all over.'],
      ['Labs', 'WBC 5,200 with lymphopenia. Procalcitonin is low.'],
      ['Imaging', 'Chest X-ray shows no consolidation.'],
      ['Microbiology', 'Nasal swab PCR positive for a segmented RNA virus with hemagglutinin and neuraminidase on its surface.'],
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
      ['Presentation', 'A 38-year-old man has 6 weeks of fevers, night sweats, and weight loss.'],
      ['History', 'He has HIV with a CD4 count of 25. He lives in Ohio and recently cleaned out an old chicken coop.'],
      ['Exam', 'A painful ulcer on his palate, and an enlarged liver and spleen.'],
      ['Labs', 'Pancytopenia. LDH and ferritin very high. AST elevated.'],
      ['Imaging', 'Diffuse small nodules in both lungs and enlarged mediastinal lymph nodes.'],
      ['Microbiology', 'Urine antigen positive. Bone marrow shows tiny 2 to 4 µm yeasts packed inside macrophages.'],
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
      ['Presentation', 'A 26-year-old man has a new rash and feels run-down.'],
      ['History', 'He has several male partners and uses condoms inconsistently. Two months ago he had a painless genital sore that healed on its own.'],
      ['Exam', 'Copper-colored, scaly spots on his trunk, palms, and soles. Swollen lymph nodes everywhere.'],
      ['More exam', 'Moist gray plaques around the anus and patchy hair loss.'],
      ['Labs', 'RPR positive at 1:64. HIV negative.'],
      ['Microbiology', 'Treponemal test positive. Dark-field microscopy of a lesion shows corkscrew-shaped organisms.'],
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
      ['Presentation', 'A 6-year-old girl has had bloody diarrhea for 3 days.'],
      ['History', 'She ate an undercooked hamburger at a cookout a week ago.'],
      ['Exam', 'Afebrile. Crampy abdominal pain. Mildly dehydrated.'],
      ['Day 5', 'She looks pale and is urinating less.'],
      ['Labs', 'Hemoglobin 7.8 with schistocytes. Platelets 40,000. Creatinine 1.6.'],
      ['Microbiology', 'Stool grows a Gram-negative rod that does not ferment sorbitol. Shiga toxin positive.'],
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
      ['Presentation', 'A 58-year-old man with AML still has fevers after 5 days of broad-spectrum antibiotics.'],
      ['History', 'He is 14 days out from induction chemotherapy. His neutrophil count is zero.'],
      ['Exam', 'New cough, pleuritic chest pain, and a little blood in his sputum.'],
      ['Labs', 'Serum galactomannan is positive.'],
      ['Imaging', 'CT shows a lung nodule surrounded by a ring of ground glass.'],
      ['Microbiology', 'BAL shows septate hyphae that branch at acute (45°) angles.'],
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
      ['Presentation', 'A 19-year-old college freshman has had fever, headache, and vomiting since this morning.'],
      ['History', 'He lives in a dorm. His vaccine records are incomplete.'],
      ['Exam', 'T 39.8 °C. Stiff neck and photophobia.'],
      ['Skin', 'Non-blanching petechiae on his legs that are spreading into purple patches.'],
      ['CSF', 'WBC 2,400 (90% neutrophils). Glucose 18. Protein 260.'],
      ['Microbiology', 'CSF shows Gram-negative diplococci. Oxidase-positive and ferments both maltose and glucose.'],
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
      ['Presentation', 'A 36-year-old man has 2 weeks of fever and right upper quadrant pain.'],
      ['History', 'He moved from rural Mexico 3 months ago. He had bloody diarrhea a few months before that.'],
      ['Exam', 'Tender, enlarged liver. It hurts when he breathes deeply.'],
      ['Labs', 'WBC 16,000. Alkaline phosphatase elevated. No eosinophilia.'],
      ['Imaging', 'Ultrasound shows a single 7 cm round lesion in the right lobe of the liver.'],
      ['Microbiology', 'Serology positive for a protozoan whose trophozoites swallow red blood cells.'],
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
      ['Presentation', 'A 45-year-old woman has 2 days of fever, headache, and strange behavior.'],
      ['History', 'Her husband says she keeps smelling burning rubber and saying odd things.'],
      ['Exam', 'T 38.9 °C. Confused, with trouble finding words. She has a seizure in the ED.'],
      ['CSF', '150 lymphocytes. 400 red cells that do not clear between tubes. High protein, normal glucose.'],
      ['Imaging', 'MRI shows T2 hyperintensity in the left medial temporal lobe.'],
      ['Microbiology', 'CSF PCR positive for an enveloped DNA virus that lies dormant in the trigeminal ganglion.'],
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
      ['Presentation', 'A 47-year-old woman is brought in confused, with a glucose of 540 and pain in her face.'],
      ['History', 'She has type 1 diabetes and ran out of insulin a week ago.'],
      ['Labs', 'pH 7.05, anion gap 28, ketones strongly positive.'],
      ['Exam', 'Swelling around her right eye with proptosis. A black, necrotic patch on her nasal turbinate.'],
      ['Imaging', 'CT shows opacified sinuses with bone eroding into the orbit.'],
      ['Microbiology', 'Biopsy shows broad, ribbon-like hyphae without septa that branch at right angles.'],
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
      ['Presentation', 'A 44-year-old man has 3 months of cough, night sweats, and 8 kg of weight loss.'],
      ['History', 'He moved from the Philippines a year ago. A relative back home had a chronic cough.'],
      ['Exam', 'Low-grade fever and crackles at the right apex. He is coughing up blood-streaked sputum.'],
      ['Labs', 'HIV negative. Interferon-gamma release assay positive.'],
      ['Imaging', 'Chest X-ray shows a cavity in the right upper lobe.'],
      ['Microbiology', 'Sputum is positive for acid-fast bacilli. NAAT positive, with no rifampin resistance gene.'],
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
      ['Presentation', 'A 22-year-old woman has 4 days of fever and joint pain that moved from her knee to her wrist.'],
      ['History', 'She has a new sexual partner and does not use condoms.'],
      ['Exam', 'Swelling and pain along the tendons on the back of her right hand. Her left knee is swollen.'],
      ['Skin', 'A few painless pustules on her arms and legs.'],
      ['Joint fluid', 'Knee aspirate has 45,000 WBCs, mostly neutrophils. Blood cultures are negative.'],
      ['Microbiology', 'Cervical NAAT positive. The joint fluid grows Gram-negative diplococci on Thayer-Martin agar.'],
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
      ['Presentation', 'A 12-year-old boy has had a painful lump in his left armpit for 3 weeks.'],
      ['History', 'His family adopted a kitten last month.'],
      ['Exam', 'A 3 cm tender left axillary lymph node. A small healing bump on the back of his left hand.'],
      ['Labs', 'Mildly elevated ESR. Normal CBC.'],
      ['Course', 'Low-grade fevers, but he mostly feels fine.'],
      ['Microbiology', 'Serology positive for a small, curved Gram-negative rod. Warthin-Starry silver stain of the node shows bacilli.'],
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
      ['Presentation', 'A 39-year-old man has 3 weeks of dry cough and gets short of breath on stairs.'],
      ['History', 'He was diagnosed with HIV this week. CD4 count 90. He is not on any prophylaxis.'],
      ['Exam', 'T 38.3 °C. SpO2 95% at rest but 86% when he walks. Lungs sound clear. Oral thrush.'],
      ['Labs', 'LDH 520. Beta-D-glucan positive. PaO2 62 mmHg on room air.'],
      ['Imaging', 'CT shows diffuse ground-glass opacities in both lungs.'],
      ['Microbiology', 'Induced sputum silver stain shows cysts shaped like crushed ping-pong balls.'],
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
      ['Presentation', 'A 61-year-old man has fever and a painful leg wound that is spreading fast.'],
      ['History', 'He has alcohol-related cirrhosis. Yesterday he went fishing on the Gulf Coast, cut his leg, and ate raw oysters.'],
      ['Exam', 'BP 82/50, HR 120. Large blood-filled blisters on his left leg.'],
      ['Labs', 'Lactate 5. Platelets 60,000. Creatinine rising.'],
      ['Course', 'The redness spreads visibly over a few hours.'],
      ['Microbiology', 'Blood cultures grow a curved, oxidase-positive Gram-negative rod that needs salt to grow.'],
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
      ['Presentation', 'A 66-year-old woman in the ICU develops a new fever on hospital day 12.'],
      ['History', 'She is on TPN through a central line after bowel surgery.'],
      ['Meds', 'She has been on meropenem and vancomycin for a week.'],
      ['Course', 'Bacterial cultures are negative and she keeps spiking fevers.'],
      ['Labs', 'Beta-D-glucan positive.'],
      ['Microbiology', 'Blood cultures grow budding yeast that form germ tubes at 37 °C.'],
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
      ['Presentation', 'A 70-year-old man has had jaw stiffness and trouble swallowing for 2 days.'],
      ['History', 'He stepped on a rusty nail in his garden 10 days ago. He has not had any vaccines in decades.'],
      ['Exam', 'He cannot fully open his mouth and has a fixed, grimacing smile. He is fully alert.'],
      ['Course', 'Loud noises trigger painful whole-body spasms that arch his back.'],
      ['Labs', 'CK mildly elevated. CSF is normal.'],
      ['Microbiology', 'Wound culture grows an anaerobic Gram-positive rod with a spore at one end, shaped like a tennis racket.'],
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
      ['Presentation', 'A 37-year-old man has floaters and blurry vision in his right eye.'],
      ['History', 'He has HIV and is not on treatment. His CD4 count is 22.'],
      ['Exam', 'Painless loss of vision. The eye is not red.'],
      ['Fundus', 'Fluffy white patches of retinal necrosis with hemorrhages along the blood vessels.'],
      ['Labs', 'Plasma PCR shows a high viral load of a herpesvirus.'],
      ['Microbiology', 'In tissue, this virus makes enlarged cells with "owl\'s eye" inclusions in the nucleus.'],
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
];
