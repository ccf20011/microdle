/* Everything players can pick in the treatment round.
   am: true = an antimicrobial (used for "too broad" and "no antibiotics" grading). */
const DRUGS = [
  // Penicillins
  { id: 'pen-g', name: 'Penicillin G (IV)', aka: ['Penicillin', 'PCN', 'Pen G', 'Aqueous penicillin'], am: true },
  { id: 'bpg', name: 'Benzathine penicillin G (IM)', aka: ['Bicillin', 'Benzathine penicillin', 'IM penicillin'], am: true },
  { id: 'pen-v', name: 'Penicillin V (oral)', aka: ['Penicillin VK', 'Pen VK'], am: true },
  { id: 'amoxicillin', name: 'Amoxicillin', aka: ['Amox', 'Amoxil'], am: true },
  { id: 'amox-clav', name: 'Amoxicillin-clavulanate', aka: ['Augmentin', 'Amox-clav', 'Co-amoxiclav'], am: true },
  { id: 'ampicillin', name: 'Ampicillin', aka: ['Amp'], am: true },
  { id: 'amp-sulb', name: 'Ampicillin-sulbactam', aka: ['Unasyn'], am: true },
  { id: 'nafcillin', name: 'Nafcillin', aka: [], am: true },
  { id: 'oxacillin', name: 'Oxacillin', aka: [], am: true },
  { id: 'dicloxacillin', name: 'Dicloxacillin', aka: [], am: true },
  { id: 'pip-tazo', name: 'Piperacillin-tazobactam', aka: ['Zosyn', 'Pip-tazo', 'Piptazo'], am: true },

  // Cephalosporins
  { id: 'cefazolin', name: 'Cefazolin', aka: ['Ancef'], am: true },
  { id: 'cephalexin', name: 'Cephalexin', aka: ['Keflex'], am: true },
  { id: 'cefuroxime', name: 'Cefuroxime', aka: [], am: true },
  { id: 'ceftriaxone', name: 'Ceftriaxone', aka: ['Rocephin', 'CTX'], am: true },
  { id: 'cefotaxime', name: 'Cefotaxime', aka: [], am: true },
  { id: 'ceftazidime', name: 'Ceftazidime', aka: ['Fortaz'], am: true },
  { id: 'cefepime', name: 'Cefepime', aka: ['Maxipime'], am: true },
  { id: 'ceftaroline', name: 'Ceftaroline', aka: ['Teflaro'], am: true },

  // Other beta-lactams
  { id: 'aztreonam', name: 'Aztreonam', aka: [], am: true },
  { id: 'meropenem', name: 'Meropenem', aka: ['Mero'], am: true },
  { id: 'imipenem', name: 'Imipenem-cilastatin', aka: ['Imipenem', 'Primaxin'], am: true },
  { id: 'ertapenem', name: 'Ertapenem', aka: ['Invanz'], am: true },

  // Gram-positive agents
  { id: 'vanc-iv', name: 'Vancomycin (IV)', aka: ['Vancomycin', 'Vanc', 'Vanco', 'IV vancomycin'], am: true },
  { id: 'vanc-po', name: 'Vancomycin (oral)', aka: ['Oral vancomycin', 'PO vancomycin', 'Vanc PO'], am: true },
  { id: 'daptomycin', name: 'Daptomycin', aka: ['Dapto', 'Cubicin'], am: true },
  { id: 'linezolid', name: 'Linezolid', aka: ['Zyvox'], am: true },
  { id: 'clindamycin', name: 'Clindamycin', aka: ['Clinda', 'Cleocin'], am: true },

  // Aminoglycosides
  { id: 'gentamicin', name: 'Gentamicin', aka: ['Gent'], am: true },
  { id: 'tobramycin', name: 'Tobramycin', aka: ['Tobra'], am: true },
  { id: 'amikacin', name: 'Amikacin', aka: [], am: true },

  // Macrolides, tetracyclines, fluoroquinolones, others
  { id: 'azithromycin', name: 'Azithromycin', aka: ['Azithro', 'Zithromax', 'Z-pak'], am: true },
  { id: 'clarithromycin', name: 'Clarithromycin', aka: ['Biaxin'], am: true },
  { id: 'erythromycin', name: 'Erythromycin', aka: [], am: true },
  { id: 'doxycycline', name: 'Doxycycline', aka: ['Doxy'], am: true },
  { id: 'minocycline', name: 'Minocycline', aka: [], am: true },
  { id: 'ciprofloxacin', name: 'Ciprofloxacin', aka: ['Cipro'], am: true },
  { id: 'levofloxacin', name: 'Levofloxacin', aka: ['Levo', 'Levaquin'], am: true },
  { id: 'moxifloxacin', name: 'Moxifloxacin', aka: ['Moxi', 'Avelox'], am: true },
  { id: 'tmp-smx', name: 'Trimethoprim-sulfamethoxazole', aka: ['TMP-SMX', 'Bactrim', 'Septra', 'Cotrimoxazole'], am: true },
  { id: 'nitrofurantoin', name: 'Nitrofurantoin', aka: ['Macrobid'], am: true },
  { id: 'metronidazole', name: 'Metronidazole', aka: ['Flagyl', 'Metro'], am: true },
  { id: 'tinidazole', name: 'Tinidazole', aka: [], am: true },
  { id: 'fidaxomicin', name: 'Fidaxomicin', aka: ['Dificid'], am: true },
  { id: 'chloramphenicol', name: 'Chloramphenicol', aka: [], am: true },
  { id: 'rifampin', name: 'Rifampin', aka: ['Rifampicin', 'Rif'], am: true },

  // TB
  { id: 'isoniazid', name: 'Isoniazid', aka: ['INH'], am: true },
  { id: 'pyrazinamide', name: 'Pyrazinamide', aka: ['PZA'], am: true },
  { id: 'ethambutol', name: 'Ethambutol', aka: ['EMB'], am: true },

  // Antiparasitics
  { id: 'nitazoxanide', name: 'Nitazoxanide', aka: ['Alinia'], am: true },
  { id: 'paromomycin', name: 'Paromomycin', aka: [], am: true },
  { id: 'iodoquinol', name: 'Iodoquinol', aka: [], am: true },
  { id: 'ivermectin', name: 'Ivermectin', aka: [], am: true },
  { id: 'albendazole', name: 'Albendazole', aka: [], am: true },
  { id: 'praziquantel', name: 'Praziquantel', aka: [], am: true },
  { id: 'artesunate', name: 'Artesunate (IV)', aka: ['IV artesunate'], am: true },
  { id: 'artemether-lumefantrine', name: 'Artemether-lumefantrine', aka: ['Coartem', 'Artemether'], am: true },
  { id: 'atovaquone-proguanil', name: 'Atovaquone-proguanil', aka: ['Malarone'], am: true },
  { id: 'chloroquine', name: 'Chloroquine', aka: [], am: true },
  { id: 'primaquine', name: 'Primaquine', aka: [], am: true },
  { id: 'pyrimethamine', name: 'Pyrimethamine', aka: ['Daraprim'], am: true },
  { id: 'sulfadiazine', name: 'Sulfadiazine', aka: [], am: true },
  { id: 'atovaquone', name: 'Atovaquone', aka: ['Mepron'], am: true },
  { id: 'pentamidine', name: 'Pentamidine', aka: [], am: true },
  { id: 'dapsone', name: 'Dapsone', aka: [], am: true },

  // Antifungals
  { id: 'fluconazole', name: 'Fluconazole', aka: ['Diflucan'], am: true },
  { id: 'itraconazole', name: 'Itraconazole', aka: [], am: true },
  { id: 'voriconazole', name: 'Voriconazole', aka: ['Vori'], am: true },
  { id: 'posaconazole', name: 'Posaconazole', aka: [], am: true },
  { id: 'isavuconazole', name: 'Isavuconazole', aka: ['Cresemba', 'Isavuconazonium'], am: true },
  { id: 'ampho', name: 'Amphotericin B (liposomal)', aka: ['Amphotericin', 'Ampho B', 'AmBisome', 'Amphotericin B'], am: true },
  { id: 'flucytosine', name: 'Flucytosine', aka: ['5-FC'], am: true },
  { id: 'micafungin', name: 'Micafungin', aka: [], am: true },
  { id: 'caspofungin', name: 'Caspofungin', aka: [], am: true },
  { id: 'anidulafungin', name: 'Anidulafungin', aka: [], am: true },
  { id: 'nystatin', name: 'Nystatin', aka: [], am: true },

  // Antivirals
  { id: 'acyclovir', name: 'Acyclovir (IV)', aka: ['Acyclovir', 'ACV', 'Zovirax'], am: true },
  { id: 'valacyclovir', name: 'Valacyclovir', aka: ['Valtrex'], am: true },
  { id: 'ganciclovir', name: 'Ganciclovir', aka: [], am: true },
  { id: 'valganciclovir', name: 'Valganciclovir', aka: ['Valcyte'], am: true },
  { id: 'foscarnet', name: 'Foscarnet', aka: [], am: true },
  { id: 'cidofovir', name: 'Cidofovir', aka: [], am: true },
  { id: 'oseltamivir', name: 'Oseltamivir', aka: ['Tamiflu'], am: true },
  { id: 'zanamivir', name: 'Zanamivir', aka: ['Relenza'], am: true },
  { id: 'peramivir', name: 'Peramivir', aka: [], am: true },
  { id: 'baloxavir', name: 'Baloxavir', aka: ['Xofluza'], am: true },
  { id: 'amantadine', name: 'Amantadine', aka: [], am: true },
  { id: 'art', name: 'Start antiretroviral therapy now', aka: ['ART', 'HAART', 'Antiretrovirals', 'HIV meds'], am: false },

  // Not antimicrobials
  { id: 'prednisone', name: 'Prednisone', aka: ['Steroids', 'Corticosteroids'], am: false },
  { id: 'methylprednisolone', name: 'Methylprednisolone', aka: ['Solu-Medrol', 'Methylpred'], am: false },
  { id: 'dexamethasone', name: 'Dexamethasone', aka: ['Dex', 'Decadron'], am: false },
  { id: 'hydrocortisone', name: 'Hydrocortisone', aka: [], am: false },
  { id: 'leucovorin', name: 'Leucovorin', aka: ['Folinic acid'], am: false },
  { id: 'pyridoxine', name: 'Pyridoxine (vitamin B6)', aka: ['B6', 'Vitamin B6'], am: false },
  { id: 'loperamide', name: 'Loperamide', aka: ['Imodium', 'Antidiarrheal'], am: false },
  { id: 'insulin', name: 'Insulin', aka: ['Insulin drip'], am: false },
  { id: 'benzo', name: 'Benzodiazepine (diazepam, lorazepam)', aka: ['Diazepam', 'Lorazepam', 'Valium', 'Ativan', 'Midazolam'], am: false },
  { id: 'tig', name: 'Tetanus immune globulin', aka: ['TIG', 'Antitoxin'], am: false },
  { id: 'td', name: 'Tetanus vaccine (Tdap or Td)', aka: ['Tdap', 'Td', 'Tetanus shot', 'Tetanus toxoid'], am: false },
  { id: 'supportive', name: 'Supportive care only (no antimicrobials)', aka: ['Supportive care', 'IV fluids', 'Fluids', 'No antibiotics', 'Observation', 'Watchful waiting'], am: false },
  { id: 'debride', name: 'Surgical debridement', aka: ['Surgery', 'Debridement', 'Source control', 'OR'], am: false },
  { id: 'drainage', name: 'Drainage (I&D or aspiration)', aka: ['Incision and drainage', 'I&D', 'Drain', 'Aspiration'], am: false },
  { id: 'line-out', name: 'Remove the central line', aka: ['Line removal', 'Remove line', 'Pull the line', 'Catheter removal'], am: false },
];
