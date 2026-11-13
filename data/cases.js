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
    accept: ['brucella'],
    dx: 'Brucellosis with sacroiliitis',
    clues: [
      ['Presentation', 'A 41-year-old man presents with 3 weeks of fevers.'],
      ['Symptoms', 'He also has drenching sweats, fatigue, and aching joints.'],
      ['History', 'He spends every summer with family in rural northern Mexico.'],
      ['Exam', 'T 38.9 °C. His liver and spleen are mildly enlarged, and his right sacroiliac joint is tender.'],
      ['Labs', 'WBC 3,900 and ALT 95. On his last trip he ate a lot of fresh, unpasteurized goat cheese.'],
      ['Microbiology', 'Blood cultures, held for an extended time, grow small Gram-negative coccobacilli.'],
    ],
    rx: {
      prompt: 'He has no signs of endocarditis or brain involvement. What do you start?',
      best: [['doxycycline', ['rifampin', 'gentamicin']]],
      okay: [['tmp-smx', 'rifampin']],
      inadequate: [
        [['doxycycline'], 'Doxycycline alone leads to frequent relapse. Brucellosis needs two drugs.'],
      ],
      notes: {
        'tmp-smx': 'TMP-SMX plus rifampin is the option for children and pregnancy. Adults get doxycycline plus rifampin or gentamicin.',
        rifampin: 'Rifampin alone leads to resistance and relapse. Pair it with doxycycline.',
        ceftriaxone: 'Beta-lactams cannot reach Brucella, which lives inside cells.',
        ciprofloxacin: 'Fluoroquinolones alone relapse often and are not first-line.',
      },
      outcome: {
        best: 'His fevers faded over 2 weeks. Because his sacroiliac joint was involved, he finished 3 months of treatment without relapse.',
        okay: 'He recovered, but adults do better on doxycycline plus rifampin or gentamicin.',
        poor: 'He seemed better, then relapsed 2 months later.',
      },
      standard: 'Doxycycline plus rifampin for 6 weeks (or doxycycline plus gentamicin for the first 1 to 2 weeks). At least 3 months when bones or joints are involved. Warn the lab before sending cultures.',
    },
    pearl: 'Brucellosis comes from unpasteurized dairy or contact with livestock. Warn the lab, since it is one of the most common lab-acquired infections.',
  },

  // 2
  {
    accept: ['cocci'],
    dx: 'Primary pulmonary coccidioidomycosis (valley fever)',
    clues: [
      ['Presentation', 'A 26-year-old woman presents with 2 weeks of cough and fevers.'],
      ['Symptoms', 'She also has chest pain, fatigue, and achy joints.'],
      ['History', 'She moved to Phoenix for a new job 2 months ago.'],
      ['Exam', 'She has tender red nodules on both shins.'],
      ['Labs', 'Eosinophils 12%. Chest X-ray shows a right lower lobe infiltrate with enlarged hilar lymph nodes. She did not improve on azithromycin.'],
      ['Microbiology', 'Serology is positive, and sputum shows large spherules filled with endospores.'],
    ],
    rx: {
      prompt: 'She is healthy and not pregnant, and her symptoms are mild and slowly improving. What do you do?',
      best: [['supportive']],
      okay: [[['fluconazole', 'itraconazole']]],
      notes: {
        fluconazole: 'Fluconazole is reasonable for significant symptoms, but mild disease in a healthy person usually clears without antifungals.',
        itraconazole: 'Itraconazole is reasonable for significant symptoms, but mild disease in a healthy person usually clears without antifungals.',
        ampho: 'Amphotericin is for severe or disseminated disease.',
        micafungin: 'Echinocandins do not reliably treat this fungus.',
        caspofungin: 'Echinocandins do not reliably treat this fungus.',
        azithromycin: 'Antibiotics do not treat fungal infections, and azithromycin already failed.',
        levofloxacin: 'Antibiotics do not treat fungal infections.',
        doxycycline: 'Antibiotics do not treat fungal infections.',
      },
      outcome: {
        best: 'With rest and follow-up visits, her cough and the shin nodules faded over 6 weeks, and her antibody levels fell.',
        okay: 'She improved. The antifungal was reasonable but probably not needed for mild disease.',
        poor: 'Her illness ran its course, but the medicine did nothing for it.',
      },
      standard: 'Mild primary infection in a healthy person: observe without antifungals, with follow-up every few months. Fluconazole for significant symptoms, pregnancy, immunosuppression, or spread beyond the lungs.',
    },
    pearl: 'Tender shin nodules (erythema nodosum) in valley fever are a good sign: they mean a strong immune response and a low risk of the infection spreading.',
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

  // 13
  {
    accept: ['pasteurella'],
    dx: 'Cat bite cellulitis',
    clues: [
      ['Presentation', 'A 9-year-old girl is brought in with a red, swollen right hand.'],
      ['Symptoms', 'The pain and swelling came on quickly and are spreading toward her wrist.'],
      ['History', 'It all started only about 8 hours after a small injury to the back of her hand.'],
      ['Exam', 'T 37.8 °C. Two small puncture wounds on the back of her hand, with warm red skin and a little cloudy drainage. She can move all her fingers fully.'],
      ['Imaging', 'X-ray shows no fracture or foreign body. The wounds came from the family\'s new cat.'],
      ['Microbiology', 'Wound culture grows a small, oxidase-positive Gram-negative coccobacillus with bipolar staining that grows on blood agar but not on MacConkey agar.'],
    ],
    rx: {
      prompt: 'She looks well, has no drug allergies, and will go home with close follow-up. What do you prescribe?',
      best: [['amox-clav']],
      okay: [
        ['amp-sulb'],
        ['doxycycline'],
        ['moxifloxacin'],
        ['tmp-smx', ['clindamycin', 'metronidazole']],
        [['cefuroxime', 'ceftriaxone', 'cefotaxime'], ['clindamycin', 'metronidazole']],
      ],
      notes: {
        'amp-sulb': 'IV ampicillin-sulbactam is the right coverage, but she is well enough for the oral version, amoxicillin-clavulanate.',
        doxycycline: 'Doxycycline covers Pasteurella and is a fine short course for a penicillin allergy, but she has no allergy.',
        moxifloxacin: 'Moxifloxacin covers the bite organisms, but fluoroquinolones are avoided in children when a safer option exists.',
        cephalexin: 'Cephalexin and other first-generation cephalosporins have poor activity against Pasteurella, a classic cause of failure after cat bites.',
        cefazolin: 'First-generation cephalosporins have poor activity against Pasteurella.',
        dicloxacillin: 'Anti-staph penicillins like dicloxacillin miss Pasteurella.',
        clindamycin: 'Clindamycin covers staph, strep, and mouth anaerobes but not Pasteurella. It needs a partner such as TMP-SMX.',
        'tmp-smx': 'TMP-SMX covers Pasteurella but misses mouth anaerobes. It needs a partner such as clindamycin.',
        cefuroxime: 'Cefuroxime covers Pasteurella but misses mouth anaerobes. It needs a partner such as clindamycin or metronidazole.',
        ceftriaxone: 'Ceftriaxone covers Pasteurella but misses mouth anaerobes, and she does not need a shot.',
        metronidazole: 'Metronidazole covers only anaerobes.',
        ciprofloxacin: 'Ciprofloxacin misses mouth anaerobes, and fluoroquinolones are avoided in children.',
        levofloxacin: 'Levofloxacin misses some mouth anaerobes, and fluoroquinolones are avoided in children.',
        azithromycin: 'Azithromycin is not a recommended choice for an infected bite.',
        erythromycin: 'Erythromycin is unreliable against Pasteurella.',
        amoxicillin: 'Amoxicillin covers Pasteurella but misses the staph and beta-lactamase-producing anaerobes from a bite. Add clavulanate.',
      },
      outcome: {
        best: 'The redness pulled back within 2 days and her hand healed without complications.',
        okay: 'She recovered, but amoxicillin-clavulanate was the simpler and better choice.',
        poor: 'The swelling spread, and she was admitted for IV antibiotics and a check for tendon infection.',
      },
      standard: 'Amoxicillin-clavulanate. For penicillin allergy, doxycycline, or TMP-SMX or a second- or third-generation cephalosporin plus clindamycin or metronidazole. Hand bites need close follow-up for tendon or joint infection.',
    },
    pearl: 'Pasteurella causes cellulitis within hours of a cat or dog bite, much faster than staph or strep. Cephalexin, dicloxacillin, and clindamycin alone all miss it.',
  },

  // 14
  {
    accept: ['parvo'],
    dx: 'Parvovirus B19 arthritis',
    clues: [
      ['Presentation', 'A 31-year-old woman presents with 5 days of painful, stiff hands.'],
      ['Symptoms', 'Both wrists, her knuckles, and both knees ache, worst in the morning.'],
      ['History', 'She teaches first grade. A week before the joint pain, she had a low fever and felt achy for a few days.'],
      ['Exam', 'Mild, symmetric swelling of the small joints of both hands. A faint, net-like pink rash on her thighs.'],
      ['Labs', 'Hemoglobin 11.2, ESR 30. Rheumatoid factor and anti-CCP are negative. Several children in her class were sent home last month with bright red cheeks.'],
      ['Microbiology', 'IgM antibodies to a small, non-enveloped, single-stranded DNA virus are positive.'],
    ],
    rx: {
      prompt: 'She is not pregnant, has no blood disorder, and has a normal immune system. What do you recommend?',
      best: [['supportive']],
      okay: [],
      notes: {
        prednisone: 'Steroids are not needed. This arthritis settles on its own within weeks.',
        methylprednisolone: 'Steroids are not needed. This arthritis settles on its own within weeks.',
        doxycycline: 'Antibiotics do nothing for a virus.',
        ceftriaxone: 'Antibiotics do nothing for a virus.',
        amoxicillin: 'Antibiotics do nothing for a virus.',
        acyclovir: 'Antivirals for herpesviruses do not work against this virus.',
        valacyclovir: 'Antivirals for herpesviruses do not work against this virus.',
      },
      outcome: {
        best: 'NSAIDs eased her pain, and her joints were back to normal in 3 weeks.',
        okay: 'She recovered.',
        poor: 'Her joints settled on their own in a few weeks, but the medicine was unnecessary.',
      },
      standard: 'Supportive care with NSAIDs. The arthritis usually resolves within weeks. Ask about pregnant contacts and contacts with sickle cell disease or weak immune systems.',
    },
    pearl: 'In adults, especially women, parvovirus B19 often causes a symmetric small-joint arthritis that mimics early rheumatoid arthritis. The slapped-cheek rash is mostly a childhood finding.',
  },

  // 15
  {
    accept: ['strongy'],
    dx: 'Strongyloides hyperinfection',
    clues: [
      ['Presentation', 'A 64-year-old man presents with 4 days of fever and shortness of breath.'],
      ['Symptoms', 'He also has belly pain, vomiting, and diarrhea.'],
      ['History', 'He grew up in rural Ecuador and moved to the US 30 years ago. He has taken high-dose prednisone for 6 weeks for a COPD flare.'],
      ['Exam', 'T 38.9 °C, RR 30. Wheezes and crackles in both lungs. A purple, net-like rash spreads out from his navel.'],
      ['Labs', 'Blood cultures grow E. coli. Chest X-ray shows patchy shadows in both lungs. His eosinophil count is normal.'],
      ['Microbiology', 'Sputum and stool both contain many motile worm larvae.'],
    ],
    rx: {
      prompt: 'He is in the ICU and already on IV ceftriaxone for the E. coli. What do you add?',
      best: [['ivermectin']],
      okay: [],
      extras: ['ceftriaxone', 'cefepime', 'meropenem', 'pip-tazo', 'ertapenem', 'albendazole'],
      harm: {
        prednisone: 'More steroids drive the hyperinfection. Steroids should be lowered as far as is safe.',
        methylprednisolone: 'More steroids drive the hyperinfection. Steroids should be lowered as far as is safe.',
        dexamethasone: 'More steroids drive the hyperinfection. Steroids should be lowered as far as is safe.',
      },
      notes: {
        albendazole: 'Albendazole is much less effective than ivermectin and is not enough on its own for hyperinfection.',
        praziquantel: 'Praziquantel treats flukes and tapeworms, not this roundworm.',
        metronidazole: 'Metronidazole treats protozoa and anaerobes, not worms.',
        hydrocortisone: 'He may need stress-dose steroids after 6 weeks of prednisone, but steroids do not treat the worms.',
        ceftriaxone: 'Antibiotics treat the gut bacteria in his blood, but the worms dragging them there need ivermectin.',
        meropenem: 'Antibiotics treat the gut bacteria in his blood, but the worms dragging them there need ivermectin.',
      },
      outcome: {
        best: 'Larvae cleared from his sputum and stool after about 2 weeks of daily ivermectin, and his prednisone was tapered.',
        okay: 'He recovered, but this was not the ideal regimen.',
        poor: 'The larvae kept migrating, carrying more gut bacteria into his blood, and he went into shock.',
      },
      standard: 'Ivermectin daily until stool and sputum have been negative for 2 weeks, antibiotics for the enteric bacteremia, and reduction of immunosuppression.',
    },
    pearl: 'Strongyloides can reproduce inside the body for decades. Steroids can trigger hyperinfection, and the larvae carry gut bacteria into the blood. Screen people from endemic areas before long steroid courses.',
  },

  // 16
  {
    accept: ['listeria'],
    dx: 'Listeriosis in pregnancy',
    clues: [
      ['Presentation', 'A 29-year-old woman at 30 weeks of pregnancy presents with 2 days of fever.'],
      ['Symptoms', 'She also has muscle aches, a mild headache, and low back pain.'],
      ['History', 'Her pregnancy has been normal. Her urine, flu, and COVID tests are negative.'],
      ['Exam', 'T 38.6 °C. Her neck is supple and her uterus is not tender. The fetal heart rate is 175.'],
      ['Labs', 'WBC 15,000. Two weeks ago she ate soft cheese made from unpasteurized milk, bought at a farmers market.'],
      ['Microbiology', 'Blood cultures grow short Gram-positive rods that tumble when viewed live and can grow at refrigerator temperature.'],
    ],
    rx: {
      prompt: 'She is admitted to labor and delivery. She has no drug allergies. What do you start?',
      best: [[['ampicillin', 'pen-g']]],
      okay: [['meropenem'], ['tmp-smx']],
      extras: ['gentamicin'],
      notes: {
        meropenem: 'Meropenem covers Listeria but is far broader than needed.',
        'tmp-smx': 'TMP-SMX is the backup for a serious penicillin allergy. She has none, and it is best avoided late in pregnancy.',
        ceftriaxone: 'Listeria is naturally resistant to all cephalosporins.',
        cefotaxime: 'Listeria is naturally resistant to all cephalosporins.',
        cefepime: 'Listeria is naturally resistant to all cephalosporins.',
        cefazolin: 'Listeria is naturally resistant to all cephalosporins.',
        'vanc-iv': 'Vancomycin is not reliable for invasive Listeria.',
        gentamicin: 'Gentamicin is only a partner drug. Ampicillin is the backbone.',
        azithromycin: 'Azithromycin does not treat invasive Listeria.',
        amoxicillin: 'Right drug family, but a bloodstream infection in pregnancy needs IV ampicillin.',
      },
      outcome: {
        best: 'Her fever broke in 2 days and the fetal heart rate settled. She finished 2 weeks of IV ampicillin and delivered a healthy baby at 38 weeks.',
        okay: 'She recovered, but IV ampicillin was the right choice.',
        poor: 'She went into preterm labor, and her newborn was born with sepsis.',
      },
      standard: 'IV ampicillin (or penicillin G), with or without gentamicin, for at least 14 days for bacteremia. TMP-SMX for severe penicillin allergy. Cephalosporins never work.',
    },
    pearl: 'In pregnancy, Listeria often looks like a mild flu, but it crosses the placenta and can cause miscarriage, stillbirth, or newborn sepsis. Draw blood cultures in a pregnant woman with an unexplained fever.',
  },

  // 17
  {
    accept: ['blasto'],
    dx: 'Blastomycosis of the lung and skin',
    clues: [
      ['Presentation', 'A 45-year-old man presents with 6 weeks of cough.'],
      ['Symptoms', 'He also has low fevers, night sweats, and has lost 5 kg.'],
      ['History', 'He lives in northern Wisconsin and is otherwise healthy. Two courses of antibiotics did not help.'],
      ['Exam', 'Two raised, crusted, wart-like plaques on his face and shin, with tiny pustules at their edges.'],
      ['Imaging', 'CT shows a right upper lobe mass that looks like cancer. He spends his weekends tearing out beaver dams along a river.'],
      ['Microbiology', 'Biopsy of a skin lesion shows large, thick-walled yeasts, each with a single bud attached by a broad base.'],
    ],
    rx: {
      prompt: 'He is not short of breath and has no brain lesions. He will be treated as an outpatient. What do you start?',
      best: [['itraconazole']],
      okay: [['fluconazole'], ['voriconazole'], ['posaconazole'], ['isavuconazole'], ['ampho']],
      notes: {
        fluconazole: 'Fluconazole works but is less effective. It is the backup if he cannot take itraconazole.',
        voriconazole: 'Voriconazole has good activity and is used for brain involvement, but itraconazole is first-line here.',
        posaconazole: 'Posaconazole has activity, but itraconazole is first-line for mild to moderate disease.',
        isavuconazole: 'Isavuconazole has activity, but there is far less experience with it than with itraconazole.',
        ampho: 'Amphotericin is for severe disease or brain involvement. He does not need its toxicity.',
        micafungin: 'Echinocandins have poor activity against this fungus.',
        caspofungin: 'Echinocandins have poor activity against this fungus.',
        anidulafungin: 'Echinocandins have poor activity against this fungus.',
        levofloxacin: 'Two antibiotic courses already failed. This is not a bacterial infection.',
        doxycycline: 'Two antibiotic courses already failed. This is not a bacterial infection.',
        rifampin: 'This is not TB.',
      },
      outcome: {
        best: 'His skin lesions flattened and the lung mass shrank over a year of itraconazole, with blood levels checked.',
        okay: 'He improved, but itraconazole is the drug of choice.',
        poor: 'The lung mass grew and new skin lesions appeared.',
      },
      standard: 'Itraconazole for 6 to 12 months for mild to moderate lung or skin disease, with drug levels checked. Amphotericin first for severe disease or brain involvement.',
    },
    pearl: 'Blastomyces lives in moist soil and rotting wood near rivers and lakes in the upper Midwest. It loves the skin, and its wart-like lesions and lung masses are often mistaken for cancer.',
  },

  // 18
  {
    accept: ['ngon'],
    dx: 'Disseminated gonococcal infection',
    clues: [
      ['Presentation', 'A 23-year-old woman presents with 3 days of pain in her right wrist and left ankle.'],
      ['Symptoms', 'She also has fevers and chills.'],
      ['History', 'She is healthy. Her period ended 4 days before the pain began.'],
      ['Exam', 'T 38.3 °C. Swelling and tenderness along the tendons on the back of her wrist. Six small pustules on red bases on her hands and feet.'],
      ['Labs', 'WBC 12,000. Blood cultures show no growth so far. She has had a new sexual partner for 2 months, and they do not use condoms.'],
      ['Microbiology', 'A cervical nucleic acid amplification test is positive for a Gram-negative diplococcus that is grown on selective chocolate agar.'],
    ],
    rx: {
      prompt: 'She is admitted. She has no drug allergies and is not pregnant. Her chlamydia test is still pending. What do you start?',
      best: [['ceftriaxone']],
      okay: [['cefotaxime']],
      extras: ['doxycycline', 'azithromycin'],
      notes: {
        cefotaxime: 'Cefotaxime is an alternative. Ceftriaxone is first-line.',
        azithromycin: 'Azithromycin alone no longer treats gonorrhea reliably.',
        doxycycline: 'Doxycycline treats the chlamydia she may also have, but not the gonorrhea.',
        ciprofloxacin: 'Gonorrhea in the US is widely resistant to fluoroquinolones.',
        levofloxacin: 'Gonorrhea in the US is widely resistant to fluoroquinolones.',
        'pen-g': 'Most gonorrhea is resistant to penicillin.',
        cefazolin: 'Cefazolin covers skin bacteria, not gonorrhea.',
        nafcillin: 'Nafcillin covers staph only.',
        'vanc-iv': 'Vancomycin has no activity against Gram-negative bacteria.',
      },
      outcome: {
        best: 'Her fever and joint pain improved within 2 days. She finished 7 days of treatment, and her partner was treated too.',
        okay: 'She recovered, but ceftriaxone is first-line.',
        poor: 'Her wrist swelled up with pus and needed to be washed out in the operating room.',
      },
      standard: 'Ceftriaxone 1 g IV daily, switching to an oral drug guided by susceptibilities after improvement, for at least 7 days. Treat chlamydia unless excluded, and treat partners.',
    },
    pearl: 'Disseminated gonorrhea pairs inflamed tendons, a few pustules on the hands and feet, and joint pain, often right after a period. Swab the cervix, urethra, throat, and rectum, since blood cultures are often negative.',
  },

  // 19
  {
    accept: ['cmv'],
    dx: 'CMV colitis after kidney transplant',
    clues: [
      ['Presentation', 'A 52-year-old man presents with 10 days of watery diarrhea.'],
      ['Symptoms', 'He also has low fevers and crampy lower belly pain.'],
      ['History', 'He had a kidney transplant 5 months ago.'],
      ['Exam', 'T 38.2 °C. Mild tenderness across his lower abdomen.'],
      ['Labs', 'WBC 2,800 and stool C. diff testing is negative. His donor carried a latent virus that he had never caught, and his preventive antiviral pills stopped 6 weeks ago.'],
      ['Microbiology', 'Colon biopsy shows enlarged cells with dense nuclear inclusions surrounded by a clear halo. Blood PCR shows a high viral load.'],
    ],
    rx: {
      prompt: 'He is admitted. He is eating but has frequent diarrhea. What do you start?',
      best: [['ganciclovir']],
      okay: [['valganciclovir'], ['foscarnet'], ['cidofovir']],
      notes: {
        valganciclovir: 'Oral valganciclovir works for mild disease, but with frequent diarrhea his absorption is uncertain. Start IV and step down.',
        foscarnet: 'Foscarnet is for ganciclovir-resistant virus. It is hard on a transplanted kidney.',
        cidofovir: 'Cidofovir is for resistant virus. It is very hard on a transplanted kidney.',
        acyclovir: 'Acyclovir is too weak against CMV to treat disease.',
        valacyclovir: 'Valacyclovir is too weak against CMV to treat disease.',
        'vanc-po': 'His C. diff test is negative.',
        metronidazole: 'His C. diff test is negative.',
        ciprofloxacin: 'This is not a bacterial colitis.',
      },
      outcome: {
        best: 'His diarrhea stopped within a week. He switched to oral valganciclovir and stopped once his viral load was undetectable.',
        okay: 'He recovered, but IV ganciclovir was the better start.',
        poor: 'His colitis worsened and he developed a bleeding colon ulcer.',
      },
      standard: 'IV ganciclovir, stepping down to oral valganciclovir once he improves, until symptoms resolve and the viral load is undetectable (at least 2 weeks). Lower immunosuppression if possible.',
    },
    pearl: 'CMV is the classic infection 1 to 6 months after transplant, especially when a seropositive donor gives an organ to a seronegative recipient. Disease often appears soon after prophylaxis ends.',
  },

  // 20
  {
    accept: ['pvivax', 'povale'],
    dx: 'Relapsing malaria',
    clues: [
      ['Presentation', 'A 26-year-old man presents with 4 days of fever.'],
      ['Symptoms', 'The fevers come with shaking chills, then drenching sweats.'],
      ['History', 'He had a similar fever 4 months ago that went away on its own after a week.'],
      ['Exam', 'T 39.8 °C. Mildly yellow eyes and a palpable spleen tip.'],
      ['Labs', 'Hemoglobin 11.0, platelets 85,000, bilirubin 2.4. Eight months ago he spent 6 weeks in rural India, taking atovaquone-proguanil prevention exactly as prescribed.'],
      ['Microbiology', 'Blood smear shows enlarged red cells with fine red stippling, some holding irregular, ameboid ring forms. 0.5% of red cells are infected.'],
    ],
    rx: {
      prompt: 'He is alert, eating, and his G6PD level is normal. What do you give?',
      best: [[['chloroquine', 'artemether-lumefantrine', 'atovaquone-proguanil'], 'primaquine']],
      okay: [['quinine', ['doxycycline', 'clindamycin'], 'primaquine'], ['artesunate', 'primaquine']],
      inadequate: [
        [[['chloroquine', 'artemether-lumefantrine', 'atovaquone-proguanil', 'quinine', 'artesunate']], 'This clears the blood stage, but without primaquine the dormant liver forms will wake up and cause yet another relapse.'],
      ],
      notes: {
        primaquine: 'Primaquine kills the dormant liver forms but is too weak against the blood stage making him sick now. He needs both.',
        doxycycline: 'Doxycycline is too slow to use alone for malaria.',
        artesunate: 'IV artesunate is for severe malaria. He can take pills.',
      },
      outcome: {
        best: 'His fever broke in 2 days. After 14 days of primaquine, he never had another episode.',
        okay: 'He recovered, but this was not the simplest regimen.',
        poor: 'His fever cleared, but it came back 3 months later.',
      },
      standard: 'Chloroquine (where the parasite is still sensitive), artemether-lumefantrine, or atovaquone-proguanil for the blood stage, plus primaquine for 14 days (or tafenoquine) for the liver stage after a normal G6PD test.',
    },
    pearl: 'P. vivax and P. ovale leave dormant liver forms that can relapse months later. Standard preventive pills, including atovaquone-proguanil, do not kill them.',
  },

  // 21
  {
    accept: ['spyo'],
    dx: 'Necrotizing fasciitis',
    clues: [
      ['Presentation', 'A 38-year-old man presents with 1 day of severe pain in his left thigh.'],
      ['Symptoms', 'He also has a fever and feels dizzy when he stands.'],
      ['History', 'He is healthy. Two days ago he strained the thigh moving furniture, without any cut or scrape.'],
      ['Exam', 'T 39.5 °C, HR 125, BP 88/50. The thigh is swollen, tense, and dusky. The pain is far worse than the skin looks, and the tenderness extends beyond the redness.'],
      ['Labs', 'WBC 24,000, Na 128, creatinine 2.3, CK 2,400. His daughter had a sore throat last week.'],
      ['Microbiology', 'Tissue culture grows Gram-positive cocci in chains with complete clearing around colonies on blood agar. They are bacitracin-sensitive and PYR-positive.'],
    ],
    rx: {
      prompt: 'Surgery confirmed dead fascia, and the tissue culture is back. What is the full plan now?',
      best: [['debride', 'pen-g', 'clindamycin']],
      okay: [
        ['debride', ['ampicillin', 'ceftriaxone', 'cefazolin', 'pip-tazo', 'meropenem', 'imipenem', 'amp-sulb', 'vanc-iv', 'linezolid', 'daptomycin'], 'clindamycin'],
        ['debride', ['pen-g', 'ampicillin', 'ceftriaxone', 'cefazolin', 'pip-tazo', 'meropenem', 'imipenem', 'amp-sulb', 'vanc-iv', 'linezolid', 'daptomycin']],
      ],
      inadequate: [
        [['debride', 'clindamycin'], 'Clindamycin shuts off toxin production, but clindamycin resistance in this organism is now common, so it is never used alone. Pair it with penicillin.'],
        [[['pen-g', 'clindamycin', 'ampicillin', 'ceftriaxone', 'cefazolin', 'pip-tazo', 'meropenem', 'imipenem', 'amp-sulb', 'vanc-iv', 'linezolid', 'daptomycin']], 'Antibiotics cannot reach dead tissue. Without repeated surgery, necrotizing fasciitis keeps spreading.'],
      ],
      notes: {
        debride: 'Surgery is essential, but he also needs penicillin plus clindamycin.',
      },
      outcome: {
        best: 'He went back to the operating room twice more, came off pressors on day 3, and walked out of the hospital 3 weeks later.',
        okay: 'He survived, but once Group A strep is confirmed the ideal pair is penicillin to kill it and clindamycin to shut off its toxins.',
        poor: 'The infection spread to his hip and flank, and he developed multi-organ failure.',
      },
      standard: 'Emergency surgical debridement (repeated as needed) plus IV penicillin and clindamycin. Before cultures: vancomycin plus piperacillin-tazobactam (or a carbapenem) plus clindamycin. IVIG is sometimes added for toxic shock.',
    },
    pearl: 'Group A strep can cause necrotizing fasciitis after a bruise or muscle strain with no break in the skin. Pain out of proportion to the exam is the warning sign. Clindamycin is added to stop toxin production.',
  },

  // 22
  {
    accept: ['bartonella'],
    dx: 'Bacillary angiomatosis in advanced HIV',
    clues: [
      ['Presentation', 'A 36-year-old man presents with 2 months of new bumps on his skin.'],
      ['Symptoms', 'He also has fevers, night sweats, and weight loss.'],
      ['History', 'He has HIV and stopped his medicines 2 years ago. His CD4 count is 40.'],
      ['Exam', 'About a dozen round, bright red to purple, dome-shaped bumps on his arms and chest. One bleeds easily when bumped.'],
      ['Labs', 'Alkaline phosphatase 420. CT shows a liver dotted with small blood-filled spaces. He has two young cats.'],
      ['Microbiology', 'Skin biopsy shows a tangle of small new blood vessels with clumps of bacilli that stain black with a silver stain. Staining for HHV-8 is negative.'],
    ],
    rx: {
      prompt: 'He is admitted. What do you start for the skin and liver lesions?',
      best: [[['doxycycline', 'erythromycin']]],
      okay: [[['azithromycin', 'clarithromycin']]],
      extras: ['rifampin'],
      notes: {
        azithromycin: 'Azithromycin is an alternative. Doxycycline or erythromycin is first-line.',
        clarithromycin: 'Clarithromycin is an alternative. Doxycycline or erythromycin is first-line.',
        art: 'He needs HIV medicines soon, but the infection itself needs an antibiotic.',
        'tmp-smx': 'TMP-SMX does not treat this infection.',
        ceftriaxone: 'Beta-lactams do not reliably clear this bacterium, which hides inside cells.',
        'pen-g': 'Beta-lactams do not reliably clear this bacterium, which hides inside cells.',
        ganciclovir: 'This is not a viral tumor. The biopsy shows bacteria.',
        'vanc-iv': 'Vancomycin does not treat this Gram-negative bacterium.',
      },
      outcome: {
        best: 'The skin lesions faded within weeks. He took doxycycline for 3 months and restarted HIV medicines.',
        okay: 'He improved, but doxycycline or erythromycin is first-line.',
        poor: 'More lesions appeared and his liver function worsened.',
      },
      standard: 'Doxycycline or erythromycin for at least 3 months (add rifampin for severe disease), plus antiretroviral therapy.',
    },
    pearl: 'Bacillary angiomatosis looks like Kaposi sarcoma, but the biopsy shows bacteria on silver stain, and it melts away with doxycycline or erythromycin. B. henselae comes from cats; B. quintana from body lice.',
  },

  // 23
  {
    accept: ['franc'],
    dx: 'Ulceroglandular tularemia',
    clues: [
      ['Presentation', 'A 47-year-old man presents with 4 days of high fever.'],
      ['Symptoms', 'He also has a headache, chills, and a painful lump in his right armpit.'],
      ['History', 'He lives in rural Arkansas and is otherwise healthy.'],
      ['Exam', 'T 39.8 °C. A painful 1 cm ulcer with a dark base on his right index finger, and a large, tender lymph node in his right armpit.'],
      ['Labs', 'WBC 11,000, AST 70. Five days ago he skinned and cleaned rabbits he had shot.'],
      ['Microbiology', 'Lymph node aspirate grows a tiny Gram-negative coccobacillus only on cysteine-enriched media, and the lab warns staff about the infection risk.'],
    ],
    rx: {
      prompt: 'He is admitted because of his high fever. He is not in shock. What do you start?',
      best: [['gentamicin']],
      okay: [[['ciprofloxacin', 'levofloxacin']], ['doxycycline']],
      extras: ['ciprofloxacin', 'levofloxacin', 'doxycycline'],
      notes: {
        ciprofloxacin: 'A fluoroquinolone is a good choice for mild disease at home. A patient sick enough to admit gets an aminoglycoside.',
        levofloxacin: 'A fluoroquinolone is a good choice for mild disease at home. A patient sick enough to admit gets an aminoglycoside.',
        doxycycline: 'Doxycycline works for mild disease but relapses more often.',
        tobramycin: 'Tobramycin has poor activity against this bacterium. Gentamicin or streptomycin is used.',
        ceftriaxone: 'Beta-lactams fail against this bacterium.',
        'amp-sulb': 'Beta-lactams fail against this bacterium.',
        'pen-g': 'Beta-lactams fail against this bacterium.',
        cefazolin: 'Beta-lactams fail against this bacterium.',
        azithromycin: 'Macrolides are not reliable for this infection.',
        clindamycin: 'Clindamycin does not treat this infection.',
      },
      outcome: {
        best: 'His fever broke in 2 days. He finished 10 days of treatment, and the lymph node slowly shrank.',
        okay: 'He recovered, but a patient sick enough to admit should get gentamicin.',
        poor: 'The lymph node filled with pus and needed drainage, and his fevers dragged on.',
      },
      standard: 'Gentamicin (or streptomycin) for about 10 days for patients sick enough to admit. Ciprofloxacin, levofloxacin, or doxycycline for mild disease. Warn the lab.',
    },
    pearl: 'Tularemia from skinning rabbits causes an ulcer where the skin was broken and large, painful lymph nodes downstream. It is a dangerous lab hazard, so warn the lab before sending cultures.',
  },

  // 24
  {
    accept: ['histo'],
    dx: 'Disseminated histoplasmosis',
    clues: [
      ['Presentation', 'A 47-year-old woman presents with 3 weeks of fevers.'],
      ['Symptoms', 'She has lost 6 kg and has a painful sore inside her cheek.'],
      ['History', 'She has rheumatoid arthritis treated with infliximab and methotrexate.'],
      ['Exam', 'T 38.8 °C, BP 96/58. A shallow 1 cm ulcer on her inner cheek. Her liver and spleen are both enlarged.'],
      ['Labs', 'WBC 2,400, platelets 60,000, AST 140, ferritin 6,000. She lives in the Ohio River Valley and cleared out an old chicken coop 2 months ago.'],
      ['Microbiology', 'Bone marrow shows small oval yeasts packed inside macrophages, and a urine antigen test is strongly positive.'],
    ],
    rx: {
      prompt: 'She is admitted. Her blood pressure is low and her counts are falling. What do you start?',
      best: [['ampho']],
      okay: [['itraconazole']],
      notes: {
        itraconazole: 'Itraconazole is right for mild disease and for step-down after amphotericin. She is too sick to start with it.',
        fluconazole: 'Fluconazole is the weakest azole against this fungus and is not used for severe disease.',
        voriconazole: 'Newer azoles are second-line backups for mild disease, not a start for severe disease.',
        posaconazole: 'Newer azoles are second-line backups for mild disease, not a start for severe disease.',
        isavuconazole: 'Newer azoles are second-line backups for mild disease, not a start for severe disease.',
        micafungin: 'Echinocandins do not work against this fungus.',
        caspofungin: 'Echinocandins do not work against this fungus.',
        anidulafungin: 'Echinocandins do not work against this fungus.',
        isoniazid: 'TB was a fair worry on a TNF inhibitor, but the marrow shows yeasts, not bacteria.',
        rifampin: 'TB was a fair worry on a TNF inhibitor, but the marrow shows yeasts, not bacteria.',
      },
      outcome: {
        best: 'After 2 weeks of amphotericin she was afebrile and her counts recovered. She stepped down to itraconazole for a year, and infliximab was stopped.',
        okay: 'She recovered slowly, but severe disease should start with amphotericin.',
        poor: 'She developed shock and needed the ICU.',
      },
      standard: 'Liposomal amphotericin B for 1 to 2 weeks, then itraconazole for at least 12 months. Hold the TNF inhibitor.',
    },
    pearl: 'TNF inhibitors raise the risk of TB and endemic fungi. Disseminated histoplasmosis causes fever, low counts, a big liver and spleen, mouth ulcers, and very high ferritin. Urine antigen is the fastest test.',
  },

  // 25
  {
    accept: ['wnv'],
    dx: 'Neuroinvasive West Nile virus with flaccid paralysis',
    clues: [
      ['Presentation', 'A 68-year-old man presents with 4 days of fever and headache.'],
      ['Symptoms', 'Since this morning, his right arm has gone weak and floppy.'],
      ['History', 'It is late August in Colorado. He has diabetes.'],
      ['Exam', 'T 38.7 °C. Mild neck stiffness and a tremor of both hands. His right arm is limp with no reflexes, but sensation is normal.'],
      ['CSF', 'WBC 150 (mostly lymphocytes), protein 95, glucose normal. He gardens at dusk without repellent, and dead crows have turned up on his street.'],
      ['Microbiology', 'CSF IgM antibodies to a mosquito-borne flavivirus are positive.'],
    ],
    rx: {
      prompt: 'He is admitted. CSF PCR for herpes simplex is negative. What do you give?',
      best: [['supportive']],
      okay: [],
      notes: {
        acyclovir: 'Acyclovir is reasonable until herpes is ruled out, but his PCR is negative and it does nothing for this virus.',
        ceftriaxone: 'His CSF is viral. Antibiotics do nothing.',
        'vanc-iv': 'His CSF is viral. Antibiotics do nothing.',
        ampicillin: 'His CSF is viral. Antibiotics do nothing.',
        dexamethasone: 'Steroids have no proven benefit.',
        methylprednisolone: 'Steroids have no proven benefit.',
      },
      outcome: {
        best: 'Supportive care, physical therapy, and fall precautions. His tremor faded, but his arm only partly recovered over the next year.',
        okay: 'He recovered.',
        poor: 'His course was the same, but the medicine was unnecessary.',
      },
      standard: 'Supportive care. No antiviral works. Rehabilitation for weakness.',
    },
    pearl: 'West Nile virus can attack the anterior horn cells like polio, causing sudden, asymmetric, limp weakness with normal sensation. Older adults are at highest risk of neuroinvasive disease.',
  },

  // 26
  {
    accept: ['babesia'],
    dx: 'Babesiosis in an asplenic patient',
    clues: [
      ['Presentation', 'A 66-year-old man presents with 1 week of fever and fatigue.'],
      ['Symptoms', 'He also has drenching sweats, muscle aches, and dark urine.'],
      ['History', 'His spleen was removed after a car accident 10 years ago. He has never left the US.'],
      ['Exam', 'T 39.1 °C, HR 112. Mild jaundice. No rash.'],
      ['Labs', 'Hemoglobin 8.4, LDH 980, haptoglobin undetectable, platelets 70,000. He lives on an island off Massachusetts and did yard work all of July.'],
      ['Microbiology', 'Blood smear shows small rings inside 4% of red cells, some arranged in groups of four in a cross shape.'],
    ],
    rx: {
      prompt: 'He is admitted. He is alert, and his kidneys and lungs are working well. What do you start?',
      best: [['atovaquone', 'azithromycin']],
      okay: [['clindamycin', 'quinine']],
      extras: ['doxycycline'],
      notes: {
        atovaquone: 'Atovaquone alone lets resistance develop. It needs azithromycin.',
        azithromycin: 'Azithromycin alone is not enough. It is paired with atovaquone.',
        clindamycin: 'Clindamycin needs quinine as a partner.',
        quinine: 'Quinine needs clindamycin as a partner.',
        doxycycline: 'Doxycycline treats the other infections the same tick carries, but not this parasite.',
        chloroquine: 'Chloroquine does not work against this parasite.',
        artesunate: 'Artesunate is for severe malaria, not this parasite.',
        'atovaquone-proguanil': 'This combination is for malaria. Here atovaquone is paired with azithromycin.',
      },
      outcome: {
        best: 'His parasite level fell below 1% within a week. Because he has no spleen, he stayed on treatment for 6 weeks, until smears had been negative for 2 weeks.',
        okay: 'He recovered, but clindamycin plus quinine has more side effects than atovaquone plus azithromycin.',
        poor: 'His parasite level climbed past 10% and he needed an exchange transfusion in the ICU.',
      },
      standard: 'Atovaquone plus azithromycin (clindamycin plus quinine as the alternative), 7 to 10 days in healthy hosts and at least 6 weeks in asplenic or immunocompromised patients. Exchange transfusion for parasitemia over 10% or organ failure.',
    },
    pearl: 'Babesia is spread by the same deer tick as Lyme disease. People without a spleen get the most severe disease. Groups of four parasites in one red cell are not seen in malaria.',
  },

  // 27
  {
    accept: ['kleb'],
    dx: 'Liver abscess with spread to the eye',
    clues: [
      ['Presentation', 'A 58-year-old man presents with 5 days of fever and chills.'],
      ['Symptoms', 'He has a dull ache under his right ribs. Since yesterday his left eye is red, painful, and blurry.'],
      ['History', 'He moved from Taiwan 2 years ago and has poorly controlled diabetes.'],
      ['Exam', 'T 39.3 °C. Tender liver edge. His left eye has hazy fluid in the front chamber and reduced vision.'],
      ['Imaging', 'CT shows a single 6 cm abscess in the right lobe of the liver, with no gallstones or bowel disease.'],
      ['Microbiology', 'Blood cultures grow a Gram-negative rod with a thick capsule. A colony lifted with a loop stretches into a sticky string more than 5 mm long.'],
    ],
    rx: {
      prompt: 'The isolate is resistant only to ampicillin. Ophthalmology is injecting antibiotics into his eye. What else does he need?',
      best: [['drainage', ['ceftriaxone', 'cefotaxime']]],
      okay: [['drainage', ['meropenem', 'imipenem', 'ertapenem', 'pip-tazo', 'cefepime', 'ceftazidime', 'levofloxacin', 'ciprofloxacin']]],
      extras: ['metronidazole'],
      inadequate: [
        [[['ceftriaxone', 'cefotaxime', 'meropenem', 'imipenem', 'ertapenem', 'pip-tazo', 'cefepime', 'ceftazidime', 'levofloxacin', 'ciprofloxacin']], 'The right antibiotic, but a 6 cm abscess also needs to be drained.'],
      ],
      notes: {
        drainage: 'Drainage is essential, but he also needs IV antibiotics.',
        ampicillin: 'Klebsiella is naturally resistant to ampicillin.',
        amoxicillin: 'Klebsiella is naturally resistant to amoxicillin.',
        'vanc-iv': 'Vancomycin has no activity against Gram-negative rods.',
        metronidazole: 'Metronidazole treats amebic and anaerobic abscesses, not this Gram-negative rod.',
      },
      outcome: {
        best: 'The drain put out thick pus for a week. His fevers settled and he finished 6 weeks of antibiotics, but his left eye never fully recovered.',
        okay: 'He recovered, but a third-generation cephalosporin was all he needed.',
        poor: 'He kept spiking fevers and the abscess grew until it was drained.',
      },
      standard: 'Percutaneous drainage plus a third-generation cephalosporin for about 4 to 6 weeks. Look for spread to the eye, brain, and lungs.',
    },
    pearl: 'Hypervirulent Klebsiella causes liver abscesses in otherwise healthy people, especially people of East Asian descent and people with diabetes. It can seed the eye, brain, and lungs.',
  },

  // 28
  {
    accept: ['tpallidum'],
    dx: 'Ocular syphilis',
    clues: [
      ['Presentation', 'A 34-year-old man presents with 1 week of blurry vision in both eyes.'],
      ['Symptoms', 'He also sees floaters and his eyes are sensitive to light.'],
      ['History', 'He has sex with men and takes HIV pre-exposure medicine, but he has missed his last two clinic visits.'],
      ['Exam', 'Inflammation in the back of both eyes on dilated exam. Scaly, reddish-brown spots on his palms and soles.'],
      ['Labs', 'HIV test is negative. CSF has 25 white cells (mostly lymphocytes) and protein 70.'],
      ['Microbiology', 'Serum RPR is positive at 1:256, and a treponemal antibody test is positive.'],
    ],
    rx: {
      prompt: 'He has no drug allergies. What do you start?',
      best: [['pen-g']],
      okay: [['ceftriaxone']],
      inadequate: [
        [['bpg'], 'Benzathine penicillin does not reach high enough levels in the eye or brain. Eye involvement is treated like neurosyphilis, with IV penicillin.'],
      ],
      notes: {
        ceftriaxone: 'Ceftriaxone is the alternative for penicillin allergy. IV penicillin is the standard.',
        doxycycline: 'Doxycycline is a backup for early syphilis without eye or brain involvement, not for this.',
        azithromycin: 'Resistance makes azithromycin unreliable, and it does not treat eye disease.',
        prednisone: 'Steroids may be added for the eye inflammation, but they do not treat the infection.',
        acyclovir: 'This is not a viral retinitis.',
        valacyclovir: 'This is not a viral retinitis.',
        ganciclovir: 'This is not a viral retinitis.',
      },
      outcome: {
        best: 'His vision cleared over 2 weeks of IV penicillin, and his RPR fell fourfold by 6 months.',
        okay: 'He recovered, but IV penicillin is the standard.',
        poor: 'His vision kept worsening and he was left with permanent damage in one eye.',
      },
      standard: 'Treat as neurosyphilis: IV aqueous penicillin G for 10 to 14 days (ceftriaxone if penicillin-allergic). Test for other STIs and notify partners.',
    },
    pearl: 'Syphilis can attack the eye at any stage, often alongside the rash of secondary syphilis. Eye syphilis is treated exactly like neurosyphilis, with IV penicillin, not a single shot.',
  },

  // 29
  {
    accept: ['vzv'],
    dx: 'Herpes zoster ophthalmicus',
    clues: [
      ['Presentation', 'A 72-year-old woman presents with 3 days of burning pain on the right side of her forehead.'],
      ['Symptoms', 'Yesterday a rash appeared there, and now her right eye is red and watery.'],
      ['History', 'She has high blood pressure and takes no immune-suppressing medicines.'],
      ['Exam', 'Clusters of small blisters on red skin over her right forehead, scalp, and the tip of her nose. The rash stops sharply at the midline.'],
      ['Background', 'As a child she had a feverish illness with itchy blisters all over her body.'],
      ['Microbiology', 'PCR of fluid from a blister detects a herpesvirus. Testing for herpes simplex is negative.'],
    ],
    rx: {
      prompt: 'She is well enough to go home, and an ophthalmologist will see her today. What do you prescribe?',
      best: [['valacyclovir']],
      okay: [['acyclovir']],
      notes: {
        acyclovir: 'Acyclovir works, but she does not need IV treatment, and oral acyclovir means 5 doses a day. Valacyclovir is simpler.',
        prednisone: 'Oral steroids do not prevent lasting nerve pain and are not needed.',
        ganciclovir: 'Ganciclovir is for CMV.',
        cephalexin: 'The rash is viral, not bacterial.',
        doxycycline: 'The rash is viral, not bacterial.',
      },
      outcome: {
        best: 'The rash crusted over in a week, and the ophthalmologist treated the eye inflammation. Her vision was saved.',
        okay: 'She recovered, but oral valacyclovir was the simpler choice.',
        poor: 'The eye inflammation progressed and scarred her cornea.',
      },
      standard: 'Oral valacyclovir (or acyclovir or famciclovir) for 7 days, started within 72 hours of the rash, plus urgent ophthalmology. IV acyclovir for vision-threatening disease or a weak immune system. Offer the recombinant zoster vaccine after recovery.',
    },
    pearl: 'Blisters on the tip of the nose mean the nasociliary branch is involved, which raises the chance of eye disease. Everyone with zoster on the forehead needs an eye exam.',
  },

  // 30
  {
    accept: ['aspergillus'],
    dx: 'Invasive pulmonary aspergillosis',
    clues: [
      ['Presentation', 'A 59-year-old man presents with 3 days of fever and a dry cough.'],
      ['Symptoms', 'Today he has sharp chest pain when he breathes in, and he coughed up a little blood.'],
      ['History', 'He is in the hospital getting chemotherapy for acute myeloid leukemia, and his neutrophil count has been near zero for 16 days.'],
      ['Exam', 'T 39.0 °C despite a week of broad-spectrum antibiotics. A few crackles over the left upper lung.'],
      ['Imaging', 'CT shows several nodules in both lungs, the largest surrounded by a hazy rim. Serum galactomannan is positive.'],
      ['Microbiology', 'Bronchoscopy shows thin, septate hyphae that branch at acute angles.'],
    ],
    rx: {
      prompt: 'He stays on cefepime. What antifungal do you start?',
      best: [['voriconazole']],
      okay: [['isavuconazole'], ['posaconazole'], ['ampho']],
      extras: ['cefepime', 'vanc-iv', 'pip-tazo', 'meropenem'],
      notes: {
        isavuconazole: 'Isavuconazole works about as well with fewer side effects and is an accepted alternative. Voriconazole is still the guideline first choice.',
        posaconazole: 'Posaconazole is an accepted alternative, but voriconazole is the guideline first choice.',
        ampho: 'Liposomal amphotericin is the alternative when azoles cannot be used.',
        micafungin: 'Echinocandins are for salvage or combination therapy, not the main treatment.',
        caspofungin: 'Echinocandins are for salvage or combination therapy, not the main treatment.',
        anidulafungin: 'Echinocandins are for salvage or combination therapy, not the main treatment.',
        fluconazole: 'Fluconazole has no activity against molds.',
        itraconazole: 'Itraconazole is not used to start treatment of invasive disease.',
      },
      outcome: {
        best: 'His fever broke once his neutrophils recovered, and the nodules shrank on voriconazole with blood levels checked.',
        okay: 'He improved, but voriconazole is the guideline first choice.',
        poor: 'The nodules grew and he had a large bleed into his lung.',
      },
      standard: 'Voriconazole (isavuconazole, posaconazole, or liposomal amphotericin as alternatives) for at least 6 to 12 weeks, with drug levels and recovery of neutrophils.',
    },
    pearl: 'In prolonged neutropenia, a lung nodule with a hazy halo is Aspergillus until proven otherwise. Thin hyphae branching at acute angles separate it from Mucor, which voriconazole does not cover.',
  },

  // 31
  {
    accept: ['tsolium'],
    dx: 'Neurocysticercosis',
    clues: [
      ['Presentation', 'A 24-year-old man is brought in after his first seizure.'],
      ['Symptoms', 'He has had mild headaches for a month. He is now awake and back to normal.'],
      ['History', 'He grew up in a rural village in Guatemala and moved to the US 6 months ago.'],
      ['Exam', 'Normal neurologic exam. No fever, rash, or neck stiffness.'],
      ['Imaging', 'MRI shows a single 1 cm cyst in the right frontal lobe with a bright dot inside it, a thin enhancing rim, and mild surrounding swelling. His family kept pigs that roamed near the latrine.'],
      ['Microbiology', 'Serum immunoblot detects antibodies to the larval stage of a tapeworm.'],
    ],
    rx: {
      prompt: 'Neurology has started an antiseizure medicine. His eye exam is normal. What else do you give?',
      best: [['albendazole', STEROID]],
      okay: [['albendazole']],
      notes: {
        albendazole: 'Albendazole is right, but steroids should go with it to blunt the swelling as the cyst dies.',
        praziquantel: 'Praziquantel is added only when there are more than 2 cysts. Albendazole is the backbone.',
        ivermectin: 'Ivermectin does not treat tapeworm cysts.',
        prednisone: 'Steroids calm the swelling but do not kill the cyst.',
        dexamethasone: 'Steroids calm the swelling but do not kill the cyst.',
        methylprednisolone: 'Steroids calm the swelling but do not kill the cyst.',
        supportive: 'A single living cyst should be treated, which helps it clear faster and lowers the chance of more seizures.',
      },
      outcome: {
        best: 'The cyst was gone on an MRI 6 months later, and he had no more seizures.',
        okay: 'The cyst cleared, but he had worse headaches during treatment without steroids.',
        poor: 'He had more seizures over the next year.',
      },
      standard: 'Albendazole for 10 to 14 days plus steroids (add praziquantel for more than 2 cysts), with an antiseizure medicine. Check the eyes first, and screen for latent TB and Strongyloides before steroids.',
    },
    pearl: 'Neurocysticercosis is a leading cause of adult-onset epilepsy worldwide. People get it by swallowing pork tapeworm eggs shed by a human carrier, not by eating undercooked pork.',
  },

  // 32
  {
    accept: ['vvulnificus'],
    dx: 'Vibrio vulnificus sepsis',
    clues: [
      ['Presentation', 'A 61-year-old man presents with 1 day of fever and severe pain in both legs.'],
      ['Symptoms', 'He had vomiting and diarrhea the night before.'],
      ['History', 'He has cirrhosis from alcohol.'],
      ['Exam', 'T 39.4 °C, BP 82/46. Both lower legs are swollen and purple, with large blisters full of dark fluid.'],
      ['Labs', 'Lactate 6.1, platelets 40,000. Two days ago in Louisiana he ate a dozen raw oysters.'],
      ['Microbiology', 'Blood cultures grow a curved, oxidase-positive Gram-negative rod that needs salt to grow and ferments lactose.'],
    ],
    rx: {
      prompt: 'He is in the ICU on norepinephrine, and surgery is exploring his legs. What antibiotics do you give?',
      best: [['doxycycline', ['ceftriaxone', 'ceftazidime', 'cefotaxime']]],
      okay: [[['levofloxacin', 'ciprofloxacin']]],
      extras: ['vanc-iv'],
      notes: {
        levofloxacin: 'A fluoroquinolone alone is an accepted alternative, but doxycycline plus a third-generation cephalosporin is first-line.',
        ciprofloxacin: 'A fluoroquinolone alone is an accepted alternative, but doxycycline plus a third-generation cephalosporin is first-line.',
        doxycycline: 'Doxycycline is half the regimen. In septic shock it is paired with a third-generation cephalosporin.',
        ceftriaxone: 'A cephalosporin alone is weaker than the combination with doxycycline.',
        ceftazidime: 'A cephalosporin alone is weaker than the combination with doxycycline.',
        cefazolin: 'Cefazolin covers skin bacteria, not Vibrio.',
        nafcillin: 'Nafcillin covers staph only.',
        'vanc-iv': 'Vancomycin has no activity against Gram-negative rods.',
        clindamycin: 'Clindamycin has no activity against Gram-negative rods.',
      },
      outcome: {
        best: 'He needed debridement of both calves and weeks in the hospital, but he survived.',
        okay: 'He survived, but doxycycline plus a cephalosporin is first-line.',
        poor: 'He died within 48 hours.',
      },
      standard: 'Doxycycline plus a third-generation cephalosporin (or a fluoroquinolone alone), with urgent surgical debridement of dead tissue.',
    },
    pearl: 'People with liver disease, especially iron overload, can die within a day of eating raw oysters or getting seawater in a wound. Vibrio vulnificus is the leading cause of seafood-related death in the US.',
  },

  // 33
  {
    accept: ['pertussis'],
    dx: 'Pertussis in a young infant',
    clues: [
      ['Presentation', 'A 3-week-old boy is brought in for episodes of turning blue.'],
      ['Symptoms', 'For a week he has had a runny nose and coughing fits, followed by gagging.'],
      ['History', 'He was born at term and has had no fever.'],
      ['Exam', 'T 37.2 °C. Between fits he looks well and his lungs are clear. During one fit his face turns red, then blue, and he stops breathing for 15 seconds.'],
      ['Labs', 'WBC 34,000 with 78% lymphocytes. His 14-year-old brother has had a cough for 3 weeks.'],
      ['Microbiology', 'Nasopharyngeal PCR detects a small Gram-negative coccobacillus.'],
    ],
    rx: {
      prompt: 'He is admitted to the pediatric ward for monitoring. What do you start?',
      best: [['azithromycin']],
      okay: [['erythromycin']],
      harm: {
        'tmp-smx': 'TMP-SMX is contraindicated under 2 months of age because it can cause kernicterus.',
      },
      notes: {
        erythromycin: 'Erythromycin works, but in babies under 1 month it is linked to pyloric stenosis. Azithromycin is preferred.',
        clarithromycin: 'Clarithromycin is not recommended under 1 month of age.',
        amoxicillin: 'Beta-lactams do not treat pertussis.',
        ampicillin: 'Beta-lactams do not treat pertussis.',
        ceftriaxone: 'Beta-lactams do not treat pertussis.',
        supportive: 'Young infants with pertussis are always treated, because they can die of it and treatment limits spread.',
      },
      outcome: {
        best: 'He needed oxygen during fits for a week but never needed a ventilator. His whole household took azithromycin too.',
        okay: 'He recovered, but azithromycin is preferred under 1 month of age.',
        poor: 'His pauses in breathing got longer and he needed the ICU.',
      },
      standard: 'Azithromycin for 5 days in infants under 1 month. Azithromycin prophylaxis for all household contacts. Vaccinate during every pregnancy.',
    },
    pearl: 'Young infants with pertussis often do not whoop. They have apnea, turn blue, and have very high lymphocyte counts. Older siblings and adults with a lingering cough are the usual source.',
  },
];
