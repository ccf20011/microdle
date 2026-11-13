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
    accept: ['mtb'],
    dx: 'Spinal tuberculosis (Pott disease) with a psoas abscess',
    clues: [
      ['Presentation', 'A 44-year-old man presents with 2 months of low back pain.'],
      ['Symptoms', 'He also has evening fevers and has lost 8 kg.'],
      ['History', 'He has no medical history and takes no medications.'],
      ['Exam', 'He is tender over his lower thoracic spine and has a soft, fluctuant swelling in his right groin.'],
      ['Imaging', 'MRI shows destruction of two adjacent vertebrae with a large abscess tracking along the psoas muscle.'],
      ['Microbiology', 'Biopsy shows caseating granulomas with acid-fast bacilli.'],
    ],
    rx: {
      prompt: 'His legs are strong and he has no bladder symptoms. What do you start?',
      best: [['rifampin', 'isoniazid', 'pyrazinamide', 'ethambutol']],
      okay: [['rifampin', 'isoniazid', 'pyrazinamide']],
      notes: {
        rifampin: 'Active TB always needs several drugs at once. Fewer lets resistance develop.',
        isoniazid: 'Isoniazid alone is for latent TB. Active disease needs four drugs to start.',
        levofloxacin: 'Fluoroquinolones are second-line TB drugs.',
        ceftriaxone: 'Standard antibiotics do not treat TB.',
        'vanc-iv': 'Standard antibiotics do not treat TB.',
      },
      outcome: {
        best: 'His back pain eased over months, the abscess shrank, and he never needed spine surgery.',
        okay: 'He recovered, but starting with only three drugs risks resistance until susceptibilities are back.',
        poor: 'The abscess grew and he developed leg weakness from spinal cord compression.',
      },
      standard: 'RIPE (rifampin, isoniazid, pyrazinamide, ethambutol) for 2 months, then rifampin and isoniazid, for 6 to 9 months total (often longer for spine). Add pyridoxine. Surgery for cord compression, instability, or an abscess that does not respond.',
    },
    pearl: 'Spinal TB usually hits the lower thoracic spine, involves two neighboring vertebrae, and can track down the psoas into the groin. The chest X-ray is often normal.',
  },

  // 4
  {
    accept: ['nocardia'],
    dx: 'Disseminated nocardiosis (lung and brain)',
    clues: [
      ['Presentation', 'A 58-year-old man presents with 3 weeks of cough and fevers.'],
      ['Symptoms', 'Now he has headaches and his left hand feels clumsy.'],
      ['History', 'He had a kidney transplant 2 years ago.'],
      ['Exam', 'He has crackles in his right lung and mild weakness of his left arm.'],
      ['Imaging', 'CT shows a cavitating lung nodule, and MRI shows a ring-enhancing brain lesion.'],
      ['Microbiology', 'Sputum shows branching, beaded Gram-positive rods that are weakly acid-fast.'],
    ],
    rx: {
      prompt: 'He is admitted. What do you start?',
      best: [['tmp-smx', ['imipenem', 'ceftriaxone', 'amikacin']]],
      okay: [['tmp-smx'], ['linezolid'], [['imipenem', 'meropenem']]],
      notes: {
        'tmp-smx': 'TMP-SMX is the backbone, but brain involvement calls for a second IV drug at first.',
        linezolid: 'Linezolid works against almost all Nocardia, but long courses are toxic, so it is a backup.',
        imipenem: 'Imipenem is a good partner drug, but the regimen should include TMP-SMX.',
        meropenem: 'A carbapenem is a reasonable partner drug, but the regimen should include TMP-SMX.',
        'pen-g': 'Penicillin treats Actinomyces, the anaerobic look-alike, not Nocardia.',
        ampho: 'Nocardia is a bacterium, not a fungus.',
        voriconazole: 'Nocardia is a bacterium, not a fungus.',
      },
      outcome: {
        best: 'Both lesions shrank on follow-up scans. He switched to oral TMP-SMX and finished a year of treatment.',
        okay: 'He improved, but this was not the strongest starting regimen for brain involvement.',
        poor: 'The brain abscess grew and needed neurosurgical drainage.',
      },
      standard: 'TMP-SMX plus imipenem (or ceftriaxone or amikacin) to start for brain involvement, then oral TMP-SMX for at least 12 months. Image the brain in anyone with lung Nocardia.',
    },
    pearl: 'Nocardia is aerobic, weakly acid-fast, and treated with sulfonamides. Actinomyces is anaerobic, not acid-fast, and treated with penicillin.',
  },

  // 5
  {
    accept: ['coxiella'],
    dx: 'Acute Q fever (hepatitis and pneumonia)',
    clues: [
      ['Presentation', 'A 34-year-old man presents with 10 days of high fever.'],
      ['Symptoms', 'He also has a severe headache and muscle aches.'],
      ['History', 'He is otherwise healthy.'],
      ['Exam', 'His liver edge is palpable and he has a few crackles at the bases.'],
      ['Labs', 'AST 160, ALT 190, platelets 110,000, and blood cultures are negative. He works on a sheep farm where lambs were born last month.'],
      ['Microbiology', 'Serology shows high antibodies to an obligate intracellular bacterium spread by animal birth products.'],
    ],
    rx: {
      prompt: 'He is well enough to go home. What do you prescribe?',
      best: [['doxycycline']],
      okay: [['tmp-smx'], [['levofloxacin', 'moxifloxacin', 'ciprofloxacin']], [['clarithromycin', 'azithromycin']]],
      notes: {
        'tmp-smx': 'TMP-SMX is the option for pregnancy and young children. Doxycycline is first-line for adults.',
        levofloxacin: 'Fluoroquinolones have some activity, but doxycycline is first-line.',
        moxifloxacin: 'Fluoroquinolones have some activity, but doxycycline is first-line.',
        ciprofloxacin: 'Fluoroquinolones have some activity, but doxycycline is first-line.',
        clarithromycin: 'Macrolides are a weaker alternative to doxycycline.',
        azithromycin: 'Macrolides are a weaker alternative to doxycycline.',
        amoxicillin: 'Beta-lactams cannot reach this bacterium, which lives inside cells.',
        ceftriaxone: 'Beta-lactams cannot reach this bacterium, which lives inside cells.',
        supportive: 'Acute Q fever can settle on its own, but treatment shortens it. Symptomatic patients should be treated.',
      },
      outcome: {
        best: 'His fever was gone in 3 days. Follow-up serology at 6 months checked for chronic infection.',
        okay: 'He improved, but doxycycline would have been the better choice.',
        poor: 'His fever dragged on for weeks.',
      },
      standard: 'Doxycycline for 14 days. Check for heart valve disease, since chronic Q fever causes culture-negative endocarditis.',
    },
    pearl: 'Q fever spreads by inhaling dust contaminated with birth products from sheep, goats, and cattle. It is a classic cause of culture-negative endocarditis.',
  },

  // 6
  {
    accept: ['noro'],
    dx: 'Viral gastroenteritis outbreak',
    clues: [
      ['Presentation', 'A 79-year-old woman presents with sudden vomiting that started last night.'],
      ['Symptoms', 'She also has watery diarrhea and crampy belly pain.'],
      ['History', 'She lives in an assisted living facility.'],
      ['Exam', 'T 37.9 °C. Dry mouth and mild diffuse abdominal tenderness.'],
      ['Labs', 'Stool has no blood and no white cells. Eleven other residents and three staff got sick within the same 24 hours.'],
      ['Microbiology', 'Stool PCR detects a non-enveloped, single-stranded RNA virus.'],
    ],
    rx: {
      prompt: 'Her BUN is mildly up, but she can keep down small sips. What do you order?',
      best: [['supportive']],
      okay: [],
      notes: {
        ciprofloxacin: 'Antibiotics do nothing against a virus and raise her risk of C. diff.',
        azithromycin: 'Antibiotics do nothing against a virus and raise her risk of C. diff.',
        metronidazole: 'Antibiotics do nothing against a virus and raise her risk of C. diff.',
        nitazoxanide: 'Nitazoxanide is not a standard treatment here.',
      },
      outcome: {
        best: 'Fluids and an antiemetic got her through, and she felt normal in 2 days. The facility isolated sick residents and cleaned with bleach.',
        okay: 'She recovered.',
        poor: 'She recovered in 2 days on her own, but the medicine was unnecessary. A week later she developed C. diff.',
      },
      standard: 'Supportive care: oral or IV fluids and antiemetics. Contact precautions, handwashing with soap and water, and bleach cleaning.',
    },
    pearl: 'Norovirus causes explosive outbreaks in nursing homes, cruise ships, and schools. Alcohol hand gel does not reliably kill it. Soap and water does.',
  },

  // 7
  {
    accept: ['salmonella'],
    dx: 'Osteomyelitis in sickle cell disease',
    clues: [
      ['Presentation', 'A 10-year-old boy presents with 5 days of pain in his left leg.'],
      ['Symptoms', 'He also has fevers and is limping.'],
      ['History', 'He has sickle cell disease.'],
      ['Exam', 'T 39 °C. One spot on his left shin is swollen, warm, and very tender.'],
      ['Labs', 'WBC 19,000 and CRP 140. MRI shows infection in the shaft of the tibia. He had a few days of diarrhea last month.'],
      ['Microbiology', 'Bone culture grows a Gram-negative rod that does not ferment lactose and produces hydrogen sulfide.'],
    ],
    rx: {
      prompt: 'He is admitted and the bone culture is back. What do you give?',
      best: [[['ceftriaxone', 'cefotaxime']]],
      okay: [[['ciprofloxacin', 'levofloxacin']], ['tmp-smx'], ['ampicillin']],
      extras: ['vanc-iv'],
      notes: {
        ciprofloxacin: 'Fluoroquinolones work and are used in adults, but a cephalosporin is preferred in children.',
        levofloxacin: 'Fluoroquinolones work, but a cephalosporin is preferred in children.',
        'tmp-smx': 'TMP-SMX can work if the isolate is susceptible, but it is not first-line for bone infection.',
        ampicillin: 'Ampicillin works only if the isolate is susceptible, and resistance is common.',
        cefazolin: 'Cefazolin covers staph but is not reliable for Salmonella.',
        nafcillin: 'Nafcillin covers staph only.',
        'vanc-iv': 'Vancomycin has no activity against Gram-negative rods.',
        clindamycin: 'Clindamycin has no activity against Gram-negative rods.',
      },
      outcome: {
        best: 'His fever settled in 4 days and he finished 6 weeks of antibiotics.',
        okay: 'He recovered, but a third-generation cephalosporin was the better choice.',
        poor: 'The infection spread along the bone and he needed surgery to clean it out.',
      },
      standard: 'A third-generation cephalosporin (a fluoroquinolone in adults) for 4 to 6 weeks, based on susceptibilities. Surgery for abscesses or dead bone.',
    },
    pearl: 'S. aureus causes most osteomyelitis overall, but Salmonella is classic in sickle cell disease, because a damaged spleen and bowel let it into the blood.',
  },

  // 8
  {
    accept: ['sgallo'],
    dx: 'Endocarditis linked to colon cancer',
    clues: [
      ['Presentation', 'A 71-year-old man presents with 3 weeks of fatigue and low-grade fevers.'],
      ['Symptoms', 'He also has night sweats and a poor appetite.'],
      ['History', 'He has never had a colonoscopy.'],
      ['Exam', 'T 38.2 °C. A new diastolic murmur at the left sternal border, and pale conjunctivae.'],
      ['Labs', 'Hemoglobin 9.1 with a low MCV and low ferritin. Echo shows a vegetation on the aortic valve.'],
      ['Microbiology', 'Blood cultures grow non-hemolytic streptococci that grow in bile but not in 6.5% salt.'],
    ],
    rx: {
      prompt: 'The isolate is highly sensitive to penicillin. What do you give?',
      best: [[['pen-g', 'ceftriaxone']]],
      okay: [['vanc-iv']],
      extras: ['gentamicin'],
      notes: {
        'vanc-iv': 'Vancomycin is for beta-lactam allergy. A penicillin-sensitive strep should get penicillin or ceftriaxone.',
        amoxicillin: 'Endocarditis is treated with IV antibiotics, at least at first.',
        'pen-v': 'Endocarditis is treated with IV antibiotics, at least at first.',
      },
      outcome: {
        best: 'His fevers cleared. Colonoscopy found a 3 cm colon cancer, which was removed at an early stage.',
        okay: 'He recovered, but the drug choice was broader than needed.',
        poor: 'His blood cultures stayed positive and the valve was damaged further.',
      },
      standard: 'IV penicillin G or ceftriaxone for 4 weeks. Colonoscopy for every patient, because this organism is strongly linked to colon cancer.',
    },
    pearl: 'Streptococcus gallolyticus (formerly S. bovis) in the blood means colonoscopy. His iron-deficiency anemia was a clue.',
  },

  // 9
  {
    accept: ['ebv'],
    dx: 'Infectious mononucleosis',
    clues: [
      ['Presentation', 'A 19-year-old woman presents with a week of sore throat.'],
      ['Symptoms', 'She also has fevers and is extremely tired.'],
      ['History', 'She is a college sophomore on the volleyball team.'],
      ['Exam', 'T 38.6 °C. Exudative tonsils, swollen nodes at the back of her neck, and a palpable spleen tip.'],
      ['Labs', 'WBC 13,000 with 60% lymphocytes, many of them atypical. ALT 110. Rapid strep test negative.'],
      ['Microbiology', 'Heterophile antibody test is positive.'],
    ],
    rx: {
      prompt: 'She can swallow and breathe without trouble. What do you do?',
      best: [['supportive']],
      okay: [],
      harm: {
        amoxicillin: 'Amoxicillin does nothing for a virus, and in mono it causes a widespread itchy rash in most patients. She broke out from head to toe.',
        ampicillin: 'Ampicillin does nothing for a virus, and in mono it causes a widespread itchy rash in most patients. She broke out from head to toe.',
      },
      notes: {
        prednisone: 'Steroids are only for complications like airway obstruction or severe hemolysis.',
        dexamethasone: 'Steroids are only for complications like airway obstruction or severe hemolysis.',
        acyclovir: 'Antivirals do not change the course of mono.',
        valacyclovir: 'Antivirals do not change the course of mono.',
        azithromycin: 'Antibiotics do nothing for a virus.',
        'pen-v': 'Antibiotics do nothing for a virus.',
      },
      outcome: {
        best: 'Rest, fluids, and acetaminophen. She felt better over 3 weeks and went back to volleyball once her spleen was back to normal size.',
        okay: 'She recovered.',
        poor: 'Her illness ran its course, but the medicine was unnecessary.',
      },
      standard: 'Supportive care. No contact sports for at least 3 to 4 weeks because of the risk of splenic rupture. Steroids only for airway compromise or other severe complications.',
    },
    pearl: 'Posterior neck nodes, a big spleen, and atypical lymphocytes point to EBV. Athletes stay out of contact sports until the spleen shrinks.',
  },

  // 10
  {
    accept: ['lepto'],
    dx: 'Severe leptospirosis (Weil disease)',
    clues: [
      ['Presentation', 'A 32-year-old man presents with 5 days of high fever.'],
      ['Symptoms', 'He also has a severe headache and intense pain in his calves.'],
      ['History', 'He is otherwise healthy.'],
      ['Exam', 'T 39.7 °C. His eyes are red without discharge, and he is jaundiced.'],
      ['Labs', 'Bilirubin 12, creatinine 3.1, platelets 50,000, with only mildly raised AST. Two weeks ago he swam in a flooded river during a triathlon.'],
      ['Microbiology', 'PCR detects a thin spirochete with hooked ends.'],
    ],
    rx: {
      prompt: 'He is admitted to the step-down unit. What do you start?',
      best: [[['pen-g', 'ceftriaxone', 'cefotaxime']]],
      okay: [['doxycycline'], ['azithromycin']],
      notes: {
        doxycycline: 'Doxycycline is first-line for mild disease. Severe disease is usually treated with IV penicillin or ceftriaxone.',
        azithromycin: 'Azithromycin is an option for mild disease, not for jaundice and kidney failure.',
        'vanc-iv': 'Vancomycin has no activity against spirochetes.',
      },
      outcome: {
        best: 'He had a brief spike of fever and chills after the first dose (a Jarisch-Herxheimer reaction), then steadily improved. His kidneys recovered without dialysis.',
        okay: 'He recovered, but severe disease is better treated with IV penicillin or ceftriaxone.',
        poor: 'His kidneys failed and he started bleeding into his lungs.',
      },
      standard: 'IV penicillin G or ceftriaxone for severe disease. Doxycycline or azithromycin for mild disease. Supportive care for kidney failure.',
    },
    pearl: 'Leptospirosis spreads through water contaminated by animal urine. Red eyes without pus, calf pain, jaundice, and kidney injury is the classic pattern.',
  },

  // 11
  {
    accept: ['actino'],
    dx: 'Cervicofacial actinomycosis',
    clues: [
      ['Presentation', 'A 52-year-old man presents with a lump on his jaw for 6 weeks.'],
      ['Symptoms', 'It is only mildly painful, but it keeps slowly growing.'],
      ['History', 'He has poor dental hygiene and drinks heavily.'],
      ['Exam', 'There is a firm, woody swelling over the angle of his left jaw with a small opening in the skin that drains.'],
      ['Course', 'A course of cephalexin did not help. The drainage contains tiny yellow grains.'],
      ['Microbiology', 'Culture grows an anaerobic, branching Gram-positive rod that is not acid-fast.'],
    ],
    rx: {
      prompt: 'He is otherwise well. What do you start?',
      best: [[['pen-g', 'amoxicillin']]],
      okay: [[['doxycycline', 'ceftriaxone', 'clindamycin']]],
      notes: {
        doxycycline: 'Doxycycline is the backup for penicillin allergy.',
        ceftriaxone: 'Ceftriaxone works, but penicillin is the drug of choice.',
        clindamycin: 'Clindamycin is the backup for penicillin allergy.',
        'tmp-smx': 'TMP-SMX treats Nocardia, the aerobic look-alike, not Actinomyces.',
        metronidazole: 'Actinomyces is resistant to metronidazole, even though it is an anaerobe.',
        cephalexin: 'Cephalexin already failed.',
      },
      outcome: {
        best: 'The swelling softened and the draining tract closed over several months of treatment.',
        okay: 'He improved, but penicillin is the drug of choice.',
        poor: 'The infection kept burrowing and opened new draining tracts.',
      },
      standard: 'High-dose penicillin (IV, then oral amoxicillin) for months, with drainage of abscesses. Mild jaw infections can be treated with oral amoxicillin.',
    },
    pearl: 'Actinomyces ignores tissue planes and drains through the skin. The yellow "sulfur granules" in the pus are clumps of the bacteria.',
  },

  // 12
  {
    accept: ['ehrlichia'],
    dx: 'Human monocytic ehrlichiosis',
    clues: [
      ['Presentation', 'A 58-year-old man presents with 4 days of fever.'],
      ['Symptoms', 'He also has a headache, chills, and muscle aches.'],
      ['History', 'He lives in rural Missouri.'],
      ['Exam', 'T 39.4 °C. No rash. He is mildly confused.'],
      ['Labs', 'WBC 2,100, platelets 65,000, AST 240, ALT 210. He pulled a tick off his leg 10 days ago.'],
      ['Microbiology', 'Blood smear shows clusters of bacteria inside monocytes.'],
    ],
    rx: {
      prompt: 'He is admitted. What do you start?',
      best: [['doxycycline']],
      okay: [['rifampin']],
      notes: {
        rifampin: 'Rifampin is an option in pregnancy or doxycycline allergy. Doxycycline is first-line for everyone else.',
        ceftriaxone: 'Beta-lactams have no activity against this intracellular bacterium.',
        amoxicillin: 'Beta-lactams have no activity against this intracellular bacterium.',
        azithromycin: 'Azithromycin is not reliable for ehrlichiosis.',
        ciprofloxacin: 'Fluoroquinolones are not reliable for ehrlichiosis.',
      },
      outcome: {
        best: 'Afebrile within 48 hours. His counts and liver tests recovered.',
        okay: 'He recovered, but doxycycline is first-line.',
        poor: 'He developed respiratory failure and needed the ICU.',
      },
      standard: 'Doxycycline for 7 to 14 days (at least 3 days after the fever breaks), started as soon as the disease is suspected.',
    },
    pearl: 'Fever after a tick bite with low white cells, low platelets, and high liver enzymes is ehrlichiosis or anaplasmosis. Clusters in monocytes mean Ehrlichia; in neutrophils, Anaplasma.',
  },
];
