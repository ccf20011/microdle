/* Daily Groups puzzles for the Microdle Groups tab, played in order: puzzle 1 on Groups #1, and so on, then repeating.

   Each puzzle is 4 groups, listed easiest (level 1) to trickiest (level 4). Each group:
     label  the connection, shown when the group is solved
     items  exactly 4 tiles. Keep them short (about 20 characters at most).
     why    one sentence teaching point, shown with the solved group

   Hard rule: every tile must fit ONLY its own group. A tile may look like it belongs elsewhere
   (that is the fun), but if it truly fits two labels, the puzzle has two answers. Rewrite it.
   Never edit or reorder puzzles that have already been played. Add new ones to the end.
*/
const GROUPS = [
  // 1
  [
    { label: 'Live attenuated vaccines', items: ['Measles', 'Varicella', 'Rotavirus', 'Yellow fever'],
      why: 'Live vaccines are avoided in pregnancy and in people with severely weakened immune systems.' },
    { label: '___ fever', items: ['Q', 'Valley', 'Scarlet', 'Rat-bite'],
      why: 'Coxiella, Coccidioides, Group A strep toxin, and Streptobacillus or Spirillum.' },
    { label: 'Gram-positive rods', items: ['Listeria', 'Bacillus', 'Clostridium', 'Corynebacterium'],
      why: 'Add Actinomyces, Nocardia, and Gardnerella (Gram-variable) to round out the list.' },
    { label: 'Big risks after splenectomy', items: ['S. pneumoniae', 'N. meningitidis', 'H. influenzae', 'Babesia'],
      why: 'Without a spleen, encapsulated bacteria and red-cell parasites cause overwhelming infection.' },
  ],
  // 2
  [
    { label: 'Dimorphic fungi', items: ['Histoplasma', 'Blastomyces', 'Coccidioides', 'Sporothrix'],
      why: 'Mold in the cold (soil), yeast in the heat (body). Coccidioides forms spherules instead of yeast.' },
    { label: 'Toxins that raise cAMP', items: ['Cholera toxin', 'Heat-labile toxin', 'Pertussis toxin', 'Edema factor'],
      why: 'Cholera and E. coli heat-labile toxin activate Gs, pertussis toxin disables Gi, and anthrax edema factor is itself an adenylate cyclase.' },
    { label: 'Urease-positive', items: ['Proteus', 'H. pylori', 'Ureaplasma', 'S. saprophyticus'],
      why: 'Urease splits urea into ammonia, which alkalinizes urine (struvite stones) or buffers stomach acid.' },
    { label: 'Named after scientists', items: ['Escherichia', 'Salmonella', 'Neisseria', 'Listeria'],
      why: 'Theodor Escherich, Daniel Salmon, Albert Neisser, and Joseph Lister.' },
  ],
  // 3
  [
    { label: 'Spread by mosquitoes', items: ['Dengue', 'Chikungunya', 'Malaria', 'Yellow fever'],
      why: 'Aedes carries dengue, chikungunya, and yellow fever. Anopheles carries malaria.' },
    { label: 'DNA viruses', items: ['Parvovirus B19', 'Hepatitis B', 'HPV', 'Adenovirus'],
      why: 'Parvovirus is the only single-stranded DNA virus. Hepatitis B is a DNA virus that uses reverse transcriptase.' },
    { label: 'Atypical pneumonia', items: ['Mycoplasma', 'Legionella', 'C. pneumoniae', 'C. psittaci'],
      why: 'None of these show up on a Gram stain, and beta-lactams do not treat them.' },
    { label: 'Named after places', items: ['Lyme', 'Ebola', 'Coxsackie', 'Marburg'],
      why: 'A Connecticut town, a river in Congo, a town in New York, and a city in Germany.' },
  ],
  // 4
  [
    { label: 'Bloody diarrhea', items: ['Shigella', 'Campylobacter', 'E. coli O157:H7', 'Entamoeba'],
      why: 'These invade or damage the gut lining. Antibiotics are avoided in E. coli O157:H7 because they raise the risk of HUS.' },
    { label: 'Colorful colonies', items: ['Serratia', 'Pseudomonas', 'S. aureus', 'P. melaninogenica'],
      why: 'Red, blue-green, golden, and black pigments.' },
    { label: 'Cover Pseudomonas', items: ['Cefepime', 'Piperacillin-tazobactam', 'Aztreonam', 'Ciprofloxacin'],
      why: 'Others include ceftazidime, meropenem, imipenem, levofloxacin, and the aminoglycosides.' },
    { label: 'Bind the 50S subunit', items: ['Azithromycin', 'Clindamycin', 'Linezolid', 'Chloramphenicol'],
      why: 'Aminoglycosides and tetracyclines bind 30S. "Buy AT 30, CCEL at 50."' },
  ],
  // 5
  [
    { label: 'Herpesviruses', items: ['EBV', 'CMV', 'HHV-8', 'VZV'],
      why: 'All herpesviruses stay latent for life: EBV in B cells, CMV in monocytes, VZV in sensory ganglia.' },
    { label: 'Acid-fast, at least partly', items: ['M. tuberculosis', 'M. leprae', 'Nocardia', 'Cryptosporidium'],
      why: 'Mycolic acids hold the stain. Nocardia is weakly acid-fast, and Cryptosporidium oocysts take a modified acid-fast stain.' },
    { label: 'Spread by fleas', items: ['Y. pestis', 'R. typhi', 'B. henselae', 'R. felis'],
      why: 'Plague, murine typhus, cat scratch disease (fleas spread it between cats), and flea-borne spotted fever.' },
    { label: 'Treated with praziquantel', items: ['Schistosoma', 'Clonorchis', 'Paragonimus', 'Taenia saginata'],
      why: 'Praziquantel treats flukes and adult tapeworms. Most roundworms get albendazole or ivermectin.' },
  ],
  // 6
  [
    { label: 'Gram-negative cocci', items: ['N. gonorrhoeae', 'N. meningitidis', 'M. catarrhalis', 'Veillonella'],
      why: 'Neisseria and Moraxella are diplococci. Veillonella is a mouth and gut anaerobe.' },
    { label: 'Come from animal bites', items: ['Pasteurella', 'Capnocytophaga', 'Rabies', 'Streptobacillus'],
      why: 'Cats and dogs, dogs (deadly without a spleen), many mammals including bats, and rats.' },
    { label: 'Superantigens', items: ['TSST-1', 'SpeA', 'SpeC', 'Enterotoxin B'],
      why: 'They bind MHC II and the T-cell receptor outside the groove, activating huge numbers of T cells at once.' },
    { label: '___ bodies', items: ['Negri', 'Councilman', 'Cowdry A', 'Guarnieri'],
      why: 'Rabies, yellow fever and viral hepatitis, herpes viruses, and smallpox or vaccinia.' },
  ],
  // 7
  [
    { label: 'Molds', items: ['Aspergillus', 'Mucor', 'Rhizopus', 'Fusarium'],
      why: 'Molds grow as hyphae. Mucor and Rhizopus have wide hyphae with few septa; Aspergillus and Fusarium have thin septate hyphae.' },
    { label: 'Yeasts', items: ['Candida', 'Cryptococcus', 'Malassezia', 'Saccharomyces'],
      why: 'Single budding cells. Cryptococcus has a thick capsule, and Malassezia causes tinea versicolor.' },
    { label: 'Block ergosterol synthesis', items: ['Fluconazole', 'Itraconazole', 'Voriconazole', 'Terbinafine'],
      why: 'Azoles block 14-alpha-demethylase. Terbinafine blocks squalene epoxidase, an earlier step.' },
    { label: 'Antifungals that work another way', items: ['Amphotericin B', 'Caspofungin', 'Flucytosine', 'Griseofulvin'],
      why: 'Ampho binds ergosterol, echinocandins block beta-glucan, flucytosine disrupts DNA and RNA, and griseofulvin disrupts microtubules.' },
  ],
  // 8
  [
    { label: 'Mainly tick-borne in the US', items: ['Ehrlichia', 'Anaplasma', 'Francisella', 'R. rickettsii'],
      why: 'Lone star tick, deer tick, several ticks (plus rabbits), and dog ticks.' },
    { label: 'Caught from farm animals', items: ['Brucella', 'Coxiella', 'Y. enterocolitica', 'E. coli O157:H7'],
      why: 'Unpasteurized dairy, sheep and goat birth products, raw pork intestines, and cattle feces.' },
    { label: 'Protozoa', items: ['Giardia', 'Leishmania', 'Naegleria', 'Entamoeba'],
      why: 'Single-celled parasites, unlike helminths, which are worms.' },
    { label: 'Named for their shape', items: ['Staphylococcus', 'Streptococcus', 'Helicobacter', 'Spirillum'],
      why: 'A bunch of grapes, a twisted chain, a helix, and a coil.' },
  ],
  // 9
  [
    { label: 'Cystic fibrosis lungs', items: ['Pseudomonas', 'B. cepacia', 'S. aureus', 'Aspergillus'],
      why: 'Thick mucus traps bacteria. Aspergillus causes allergic bronchopulmonary aspergillosis.' },
    { label: 'Numbered childhood rashes', items: ['Measles', 'Scarlet fever', 'Rubella', 'Roseola'],
      why: 'First, second, third, and sixth disease. Fifth disease is parvovirus B19.' },
    { label: 'Anaerobes', items: ['Bacteroides', 'C. perfringens', 'Fusobacterium', 'Prevotella'],
      why: 'They thrive without oxygen, smell foul, and form abscesses. Metronidazole covers them all.' },
    { label: 'Hemolysis in G6PD deficiency', items: ['Primaquine', 'Dapsone', 'Nitrofurantoin', 'Tafenoquine'],
      why: 'Check G6PD before primaquine or tafenoquine. Sulfonamides can also trigger hemolysis.' },
  ],
  // 10
  [
    { label: "Travelers' diarrhea", items: ['ETEC', 'Giardia', 'Norovirus', 'Shigella'],
      why: 'ETEC is the most common cause. Giardia often lingers for weeks after travel.' },
    { label: 'Cause flaccid paralysis', items: ['Poliovirus', 'West Nile virus', 'Enterovirus D68', 'C. botulinum'],
      why: 'The viruses attack anterior horn cells. Botulinum toxin blocks acetylcholine release, causing descending weakness.' },
    { label: 'Beta-lactamase inhibitors', items: ['Clavulanate', 'Sulbactam', 'Tazobactam', 'Avibactam'],
      why: 'Paired with amoxicillin, ampicillin, piperacillin, and ceftazidime.' },
    { label: 'Classic lab reactions', items: ['Quellung', 'Elek', 'Weil-Felix', 'Nagler'],
      why: 'Capsule swelling (pneumococcus), diphtheria toxin, rickettsial antibodies, and C. perfringens alpha toxin.' },
  ],
  // 11
  [
    { label: 'Protozoa that cause diarrhea', items: ['Giardia', 'Cryptosporidium', 'Cyclospora', 'Entamoeba'],
      why: 'Cryptosporidium is chlorine-resistant and dangerous in advanced HIV. Cyclospora comes on imported produce.' },
    { label: 'Roundworms (nematodes)', items: ['Ascaris', 'Enterobius', 'Necator', 'Trichuris'],
      why: 'Mostly treated with albendazole or mebendazole.' },
    { label: 'Flukes (trematodes)', items: ['Schistosoma', 'Clonorchis', 'Fasciola', 'Paragonimus'],
      why: 'Flukes are treated with praziquantel, except Fasciola, which gets triclabendazole.' },
    { label: 'Tapeworms (cestodes)', items: ['Taenia', 'Echinococcus', 'Diphyllobothrium', 'Hymenolepis'],
      why: 'Diphyllobothrium (fish tapeworm) can cause B12 deficiency.' },
  ],
  // 12
  [
    { label: 'HACEK organisms', items: ['Aggregatibacter', 'Cardiobacterium', 'Eikenella', 'Kingella'],
      why: 'Slow-growing Gram-negatives from the mouth that cause endocarditis. Treated with ceftriaxone.' },
    { label: 'Grown on their own special media', items: ['Legionella', 'Bordetella', 'C. diphtheriae', 'M. tuberculosis'],
      why: 'Buffered charcoal yeast extract, Bordet-Gengou or Regan-Lowe, tellurite or Loeffler, and Lowenstein-Jensen.' },
    { label: 'Caught by wading or swimming in fresh water', items: ['Leptospira', 'Naegleria', 'Aeromonas', 'Schistosoma'],
      why: 'Floods and animal urine, warm lakes, wounds in fresh water, and snail-infested water.' },
    { label: 'Segmented RNA genomes', items: ['Influenza', 'Rotavirus', 'Hantavirus', 'Lassa'],
      why: 'Segments can swap between strains (reassortment), which is how pandemic flu strains arise.' },
  ],
  // 13
  [
    { label: 'Spirochetes', items: ['B. burgdorferi', 'Leptospira', 'Treponema', 'B. recurrentis'],
      why: 'Spirochetes are too thin to see well on Gram stain, so darkfield microscopy or serology is used instead.' },
    { label: 'Aminoglycosides', items: ['Gentamicin', 'Tobramycin', 'Amikacin', 'Streptomycin'],
      why: 'They need oxygen-dependent transport to enter bacteria, so they do nothing against anaerobes.' },
    { label: 'Picornaviruses', items: ['Echovirus', 'Coxsackievirus', 'Hepatitis A', 'Rhinovirus'],
      why: 'Small, non-enveloped, positive-sense RNA viruses: "PERCH" is polio, echo, rhino, coxsackie, and hep A.' },
    { label: 'Species named for a color', items: ['S. aureus', 'Viridans strep', 'P. aeruginosa', 'C. albicans'],
      why: 'Aureus means golden, viridans green, aeruginosa copper rust (blue-green), and albicans whitish.' },
  ],
  // 14
  [
    { label: 'Cause genital ulcers', items: ['T. pallidum', 'H. ducreyi', 'HSV-2', 'K. granulomatis'],
      why: 'Syphilis and donovanosis ulcers are painless; chancroid and herpes ulcers hurt.' },
    { label: 'Non-beta-lactam cell wall blockers', items: ['Vancomycin', 'Bacitracin', 'Fosfomycin', 'Cycloserine'],
      why: 'Vancomycin binds D-Ala-D-Ala, bacitracin blocks lipid carrier recycling, fosfomycin blocks MurA, and cycloserine blocks D-alanine steps.' },
    { label: 'Cause myocarditis', items: ['Coxsackie B', 'T. cruzi', 'C. diphtheriae', 'Trichinella'],
      why: 'Coxsackie B is the classic viral cause; diphtheria toxin and migrating Trichinella larvae also injure heart muscle, and Chagas causes cardiomyopathy.' },
    { label: 'Syndromes named after people', items: ['Lemierre', 'Fitz-Hugh-Curtis', 'Ramsay Hunt', 'Guillain-Barré'],
      why: 'Fusobacterium jugular vein clots, perihepatitis after PID, VZV of the facial nerve, and post-Campylobacter paralysis. (Ducrey and Cruz were people too, but those tiles are organisms.)' },
  ],
  // 15
  [
    { label: 'Negative-sense RNA viruses', items: ['Influenza', 'Measles', 'Rabies', 'RSV'],
      why: 'Negative-sense genomes must carry their own RNA-dependent RNA polymerase into the cell.' },
    { label: 'Penicillinase-resistant penicillins', items: ['Nafcillin', 'Oxacillin', 'Dicloxacillin', 'Methicillin'],
      why: 'A bulky side chain shields the beta-lactam ring from staph penicillinase, but they do not cover MRSA.' },
    { label: 'Caught from undercooked pork', items: ['Taenia solium', 'Trichinella', 'Y. enterocolitica', 'Hepatitis E'],
      why: 'Pork tapeworm, trichinosis, chitterlings, and pork liver. Hepatitis E is a positive-sense RNA virus.' },
    { label: 'Disulfiram-like reaction', items: ['Metronidazole', 'Tinidazole', 'Cefotetan', 'Griseofulvin'],
      why: "Cefotetan's N-methylthiotetrazole side chain is what makes it the odd cephalosporin here." },
  ],
  // 16
  [
    { label: 'Integrase inhibitors', items: ['Raltegravir', 'Dolutegravir', 'Bictegravir', 'Cabotegravir'],
      why: 'They block HIV DNA from inserting into the host genome. Cabotegravir comes as a long-acting injection.' },
    { label: 'NNRTIs', items: ['Efavirenz', 'Nevirapine', 'Rilpivirine', 'Doravirine'],
      why: 'They bind reverse transcriptase away from the active site, so unlike NRTIs they need no phosphorylation.' },
    { label: 'HIV protease inhibitors', items: ['Darunavir', 'Atazanavir', 'Lopinavir', 'Ritonavir'],
      why: 'Ritonavir is now used mainly in low doses to boost other drugs by blocking CYP3A4.' },
    { label: 'Treat chronic hepatitis B', items: ['Entecavir', 'Tenofovir', 'Lamivudine', 'Adefovir'],
      why: 'Entecavir and tenofovir are first-line. Lamivudine and adefovir breed resistance and are rarely used now.' },
  ],
  // 17
  [
    { label: 'Fluoroquinolones', items: ['Ciprofloxacin', 'Levofloxacin', 'Moxifloxacin', 'Delafloxacin'],
      why: 'They block DNA gyrase and topoisomerase IV, and carry boxed warnings for tendon rupture and neuropathy.' },
    { label: 'Tetracycline family', items: ['Doxycycline', 'Minocycline', 'Tigecycline', 'Omadacycline'],
      why: 'All bind the 30S subunit. The AAP now allows doxycycline courses of 21 days or less at any age because tooth staining is not seen.' },
    { label: 'TORCH infections', items: ['Toxoplasma', 'Rubella', 'CMV', 'HSV'],
      why: 'The "O" (other) adds syphilis, VZV, parvovirus B19, and Zika.' },
    { label: 'Old names, since renamed', items: ['P. carinii', 'Pityrosporum', 'Calymmatobacterium', 'Rochalimaea'],
      why: 'Now Pneumocystis jirovecii (in humans), Malassezia, Klebsiella granulomatis, and Bartonella.' },
  ],
  // 18
  [
    { label: 'Common UTI causes', items: ['E. coli', 'S. saprophyticus', 'Klebsiella', 'Enterococcus'],
      why: 'E. coli causes most cystitis. S. saprophyticus is the second most common cause in young sexually active women.' },
    { label: 'Macrolides', items: ['Azithromycin', 'Clarithromycin', 'Erythromycin', 'Fidaxomicin'],
      why: 'Fidaxomicin is a macrocyclic relative that is barely absorbed, so it stays in the gut to treat C. difficile.' },
    { label: 'Pore-forming toxins', items: ['Streptolysin O', 'Listeriolysin O', 'Pneumolysin', 'PVL'],
      why: 'Listeriolysin O lets Listeria escape the phagosome, and Panton-Valentine leukocidin kills white cells in necrotizing staph infections.' },
    { label: 'Resistance genes', items: ['mecA', 'vanA', 'KPC', 'NDM-1'],
      why: 'mecA makes PBP2a (MRSA), vanA swaps D-Ala-D-Ala for D-Ala-D-Lac (VRE), and KPC and NDM-1 are carbapenemases.' },
  ],
  // 19
  [
    { label: 'Cause a mono-like illness', items: ['EBV', 'CMV', 'Acute HIV', 'Toxoplasma'],
      why: 'When the heterophile (Monospot) test is negative, think CMV, acute HIV, and toxoplasmosis.' },
    { label: 'Antimalarials', items: ['Chloroquine', 'Artemether', 'Mefloquine', 'Primaquine'],
      why: 'Primaquine (or tafenoquine) is added for P. vivax and P. ovale to kill dormant liver hypnozoites.' },
    { label: 'Viral hemorrhagic fevers', items: ['Ebola', 'Lassa', 'Crimean-Congo', 'Hantavirus'],
      why: 'All are RNA viruses. Ribavirin is used for Lassa fever, and Ebola (Zaire) has approved monoclonal antibody treatments.' },
    { label: '___ cells', items: ['Clue', 'Downey', 'Langhans', 'Warthin-Finkeldey'],
      why: 'Gardnerella-coated vaginal cells, atypical lymphocytes in mono, horseshoe-nucleus giant cells in granulomas, and giant cells in measles.' },
  ],
  // 20
  [
    { label: 'Beta-hemolytic on blood agar', items: ['S. pyogenes', 'S. agalactiae', 'S. aureus', 'Listeria'],
      why: 'Complete hemolysis clears the agar. Listeria gives only a narrow zone, which helps tell it from diphtheroids.' },
    { label: 'First-line TB drugs', items: ['Isoniazid', 'Rifampin', 'Pyrazinamide', 'Ethambutol'],
      why: 'RIPE for 2 months, then isoniazid and rifampin for 4. Give pyridoxine with isoniazid to prevent neuropathy.' },
    { label: 'Conjugate vaccines', items: ['Hib', 'PCV20', 'MenACWY', 'PCV15'],
      why: 'Linking a polysaccharide to a protein recruits T-cell help, so infants make lasting antibody.' },
    { label: 'Bacterial vaccines, not conjugates', items: ['PPSV23', 'Typhoid Vi', 'MenB', 'Tdap'],
      why: 'PPSV23 and typhoid Vi are plain polysaccharides, MenB is made of proteins, and Tdap is toxoids plus pertussis proteins.' },
  ],
  // 21
  [
    { label: 'Flu antivirals', items: ['Oseltamivir', 'Zanamivir', 'Peramivir', 'Baloxavir'],
      why: 'The first three block neuraminidase. Baloxavir blocks the cap-dependent endonuclease and is a single dose.' },
    { label: 'Trigger reactive arthritis', items: ['C. trachomatis', 'Shigella', 'Campylobacter', 'Yersinia'],
      why: 'Arthritis, urethritis, and conjunctivitis follow a GU or GI infection, most often in HLA-B27-positive people.' },
    { label: 'Cause aseptic meningitis', items: ['Enterovirus', 'HSV-2', 'Mumps', 'LCMV'],
      why: 'Enteroviruses cause most cases, peaking in summer. LCMV comes from house mouse and pet rodent urine.' },
    { label: 'Names meaning "-loving"', items: ['Haemophilus', 'L. pneumophila', 'A. phagocytophilum', 'A. aphrophilus'],
      why: 'Blood-loving, lung-loving, phagocyte-loving (it lives in neutrophils), and foam-loving.' },
  ],
  // 22
  [
    { label: 'Caught from cats', items: ['Toxoplasma', 'B. henselae', 'P. multocida', 'M. canis'],
      why: 'Microsporum canis means "dog" but is most often caught from cats, causing tinea capitis and corporis.' },
    { label: 'Bird exposures', items: ['C. psittaci', 'Histoplasma', 'Cryptococcus', 'H5N1'],
      why: 'Parrots, bird and bat droppings, pigeon droppings, and poultry or dairy cattle with avian flu.' },
    { label: 'Treat MRSA', items: ['Linezolid', 'Daptomycin', 'Ceftaroline', 'Tedizolid'],
      why: 'Ceftaroline (like the newer ceftobiprole) binds PBP2a, unlike other beta-lactams. Daptomycin is inactivated by surfactant, so never use it for pneumonia.' },
    { label: 'H2S producers (black on TSI)', items: ['Salmonella', 'Proteus', 'Citrobacter', 'Edwardsiella'],
      why: 'Black butt on a triple sugar iron slant separates Salmonella (H2S positive) from Shigella (negative).' },
  ],
  // 23
  [
    { label: 'Hepatitis C antivirals', items: ['Sofosbuvir', 'Ledipasvir', 'Glecaprevir', 'Velpatasvir'],
      why: '-buvir blocks the NS5B polymerase, -asvir blocks NS5A, and -previr blocks the NS3/4A protease.' },
    { label: 'Fungal stains', items: ['GMS', 'PAS', 'Calcofluor white', 'India ink'],
      why: 'Silver (GMS) also shows Pneumocystis cysts, and India ink outlines the Cryptococcus capsule as a clear halo.' },
    { label: 'Detect antibodies', items: ['VDRL', 'Monospot', 'ASO titer', 'FTA-ABS'],
      why: 'VDRL measures antibody to cardiolipin, and Monospot detects heterophile antibodies that agglutinate horse or sheep red cells.' },
    { label: 'Detect antigens', items: ['Galactomannan', 'CrAg', 'p24', 'Urine Legionella'],
      why: 'p24 antigen is why 4th-generation HIV tests turn positive weeks before antibody-only tests.' },
  ],
  // 24
  [
    { label: 'Larvae burrow through skin', items: ['Necator', 'Strongyloides', 'Schistosoma', 'Ancylostoma'],
      why: 'Bare feet on contaminated soil for hookworms and Strongyloides; fresh water with cercariae for Schistosoma.' },
    { label: 'Infect by swallowed eggs', items: ['Ascaris', 'Enterobius', 'Trichuris', 'Toxocara'],
      why: 'Eggs from soil or fingers. Toxocara larvae wander through organs (visceral or ocular larva migrans).' },
    { label: 'Worms spread by insect bites', items: ['Onchocerca', 'Wuchereria', 'Loa loa', 'Brugia'],
      why: 'Black flies, mosquitoes, deer flies, and mosquitoes. Check for Loa loa before giving ivermectin or DEC.' },
    { label: 'Caught from raw fish or crab', items: ['Anisakis', 'Diphyllobothrium', 'Clonorchis', 'Paragonimus'],
      why: 'Sushi, raw freshwater fish, undercooked freshwater fish (bile duct fluke), and raw crab or crayfish (lung fluke).' },
  ],
  // 25
  [
    { label: 'Carbapenems', items: ['Meropenem', 'Imipenem', 'Ertapenem', 'Doripenem'],
      why: 'Ertapenem is the one that misses Pseudomonas and Acinetobacter, and imipenem needs cilastatin.' },
    { label: '3rd-generation cephalosporins', items: ['Ceftriaxone', 'Cefotaxime', 'Ceftazidime', 'Cefpodoxime'],
      why: 'Ceftazidime is the 3rd-generation one that covers Pseudomonas; ceftriaxone is the one that can cause biliary sludge.' },
    { label: 'Prolong the QT interval', items: ['Azithromycin', 'Levofloxacin', 'Bedaquiline', 'Hydroxychloroquine'],
      why: 'Check an ECG and electrolytes before combining them, especially with ondansetron or methadone.' },
    { label: 'Cephalosporins, not 3rd gen', items: ['Cefazolin', 'Cefuroxime', 'Cefepime', 'Ceftaroline'],
      why: 'First, second, fourth, and fifth generation. Cefuroxime and cefepime look like 3rd-generation names but are not.' },
  ],
  // 26
  [
    { label: 'Oncogenic infections', items: ['HTLV-1', 'H. pylori', 'HHV-8', 'S. haematobium'],
      why: 'Adult T-cell leukemia, gastric adenocarcinoma and MALT lymphoma, Kaposi sarcoma, and squamous cell bladder cancer.' },
    { label: 'Prion diseases', items: ['Kuru', 'CJD', 'vCJD', 'FFI'],
      why: 'Misfolded prion protein turns normal protein into beta-sheets; autoclaving at usual settings does not destroy it.' },
    { label: 'Killed whole-virus vaccines', items: ['IPV', 'Hepatitis A', 'Rabies', 'Ixiaro'],
      why: 'Polio (Salk), hepatitis A, rabies, and Japanese encephalitis. None can cause infection, though immune responses may be weaker in immunosuppressed people.' },
    { label: 'Recombinant protein vaccines', items: ['Shingrix', 'MenB', 'Arexvy', 'Novavax'],
      why: 'Shingrix (zoster gE) and Arexvy (RSV F) are proteins, not live virus, so they can be given when live vaccines cannot.' },
  ],
  // 27
  [
    { label: 'Treat C. difficile', items: ['Oral vancomycin', 'Fidaxomicin', 'Vowst', 'Rebyota'],
      why: 'Fidaxomicin is preferred by IDSA; Vowst and Rebyota are microbiome products to prevent recurrence.' },
    { label: 'Treat lice or scabies', items: ['Permethrin', 'Malathion', 'Spinosad', 'Lindane'],
      why: 'Permethrin is first-line for both. Lindane is a last resort because it can cause seizures.' },
    { label: 'Anthelmintics', items: ['Praziquantel', 'Pyrantel', 'DEC', 'Triclabendazole'],
      why: 'Flukes and tapeworms, pinworm (over the counter), filarial worms, and Fasciola.' },
    { label: 'Won a Nobel Prize', items: ['Penicillin', 'Streptomycin', 'Prontosil', 'Artemisinin'],
      why: 'Fleming, Florey and Chain (1945); Waksman (1952); Domagk (1939); and Tu Youyou (2015).' },
  ],
  // 28
  [
    { label: 'Cause newborn conjunctivitis', items: ['N. gonorrhoeae', 'C. trachomatis', 'HSV', 'S. aureus'],
      why: 'Gonococcal disease starts in the first days of life; chlamydia usually starts at 5 to 14 days and is treated with oral erythromycin or azithromycin.' },
    { label: 'Penicillin is the drug of choice', items: ['Syphilis', 'Actinomycosis', 'Strep throat', 'Gas gangrene'],
      why: 'For gas gangrene, penicillin is paired with clindamycin, which shuts down toxin production.' },
    { label: 'Microbial neurotoxins', items: ['Tetanospasmin', 'Botulinum toxin', 'Tetrodotoxin', 'Saxitoxin'],
      why: 'Tetanus and botulinum toxins cleave SNARE proteins; tetrodotoxin (made by bacteria in pufferfish) and saxitoxin (from algae, in shellfish) block sodium channels.' },
    { label: 'Folk names for diseases', items: ['The clap', 'Lockjaw', 'Consumption', 'Ague'],
      why: 'Gonorrhea, tetanus, tuberculosis, and malaria (the shaking fevers and chills).' },
  ],
  // 29
  [
    { label: 'Linked to raw oysters', items: ['V. vulnificus', 'V. parahaemolyticus', 'Norovirus', 'Hepatitis A'],
      why: 'V. vulnificus kills people with liver disease or iron overload within days of eating raw oysters.' },
    { label: 'Form spores', items: ['B. anthracis', 'C. tetani', 'C. botulinum', 'B. cereus'],
      why: 'Spores survive boiling and alcohol hand gel, so soap and water or bleach is needed.' },
    { label: 'US arboviral encephalitis', items: ['West Nile', 'Powassan', 'EEE', 'La Crosse'],
      why: 'Powassan is the one spread by ticks; the others are spread by mosquitoes.' },
    { label: 'Sources of antibiotics', items: ['Streptomyces', 'Penicillium', 'Acremonium', 'Saccharopolyspora'],
      why: 'Streptomyces gave streptomycin and the tetracyclines, Penicillium gave penicillin, Acremonium gave cephalosporins, and Saccharopolyspora makes erythromycin.' },
  ],
  // 30
  [
    { label: 'Coagulase-negative staphylococci', items: ['S. epidermidis', 'S. saprophyticus', 'S. lugdunensis', 'S. hominis'],
      why: 'S. lugdunensis is coagulase-negative but acts like S. aureus, causing aggressive native valve endocarditis.' },
    { label: 'MAC treatment drugs', items: ['Clarithromycin', 'Ethambutol', 'Rifabutin', 'Amikacin'],
      why: 'A macrolide plus ethambutol is the backbone. Rifabutin can cause uveitis.' },
    { label: 'Water or fish-handling wounds', items: ['M. marinum', 'V. vulnificus', 'Aeromonas', 'Erysipelothrix'],
      why: 'Fish tank granuloma, salt water, fresh water, and fish or meat handlers (erysipeloid).' },
    { label: 'Disk or plate tests for gram-positives', items: ['Optochin', 'Bacitracin', 'Novobiocin', 'CAMP test'],
      why: 'Optochin kills pneumococcus, bacitracin kills group A strep, novobiocin spares S. saprophyticus, and CAMP marks group B strep.' },
  ],
  // 31
  [
    { label: 'Non-enveloped DNA viruses', items: ['Adenovirus', 'HPV', 'Parvovirus B19', 'JC virus'],
      why: 'Parvo, adeno, papilloma, and polyoma: naked viruses survive drying and resist alcohol.' },
    { label: 'Enveloped DNA viruses', items: ['HSV-1', 'Hepatitis B', 'Variola', 'EBV'],
      why: 'Herpesviruses, hepadnaviruses, and poxviruses. Herpesviruses take their envelope from the nuclear membrane.' },
    { label: 'Non-enveloped RNA viruses', items: ['Norovirus', 'Rotavirus', 'Hepatitis E', 'Poliovirus'],
      why: 'Without an envelope they survive stomach acid and alcohol gel, which is why they spread fecal-orally.' },
    { label: 'Enveloped RNA viruses', items: ['Hepatitis C', 'Hepatitis D', 'Rubella', 'Rabies'],
      why: 'Hepatitis D borrows its envelope (HBsAg) from hepatitis B, so it can only infect people who also have HBV.' },
  ],
  // 32
  [
    { label: 'Caught from rodents', items: ['Hantavirus', 'LCMV', 'Streptobacillus', 'Lassa'],
      why: 'Deer mouse droppings, house mouse urine, rat bites, and multimammate rats in West Africa.' },
    { label: 'Caught from dogs', items: ['Capnocytophaga', 'Echinococcus', 'Toxocara canis', 'B. canis'],
      why: 'Dog bites, then eggs in dog feces for hydatid cysts and visceral larva migrans, and Brucella canis from breeding kennels.' },
    { label: 'Unpasteurized milk', items: ['B. abortus', 'Listeria', 'M. bovis', 'Campylobacter'],
      why: 'Pasteurization prevents all four. Soft cheeses from raw milk are the classic Listeria risk in pregnancy.' },
    { label: 'Linked to bats', items: ['Histoplasma', 'Nipah', 'Marburg', 'Hendra'],
      why: 'Cave guano, date palm sap, Egyptian fruit bat caves, and horses infected by fruit bats.' },
  ],
  // 33
  [
    { label: 'Media for gut pathogens', items: ['EMB', 'XLD', 'CIN agar', 'TCBS'],
      why: 'EMB shows E. coli as green metallic colonies, XLD shows Salmonella with black centers, CIN grows Yersinia, and TCBS grows Vibrio.' },
    { label: 'Fungal culture media', items: ['Bird seed agar', 'Cornmeal agar', 'Potato dextrose', 'DTM agar'],
      why: 'Cryptococcus turns brown on bird seed agar because of its melanin-making phenol oxidase, and dermatophyte test medium turns red as dermatophytes grow.' },
    { label: 'Gram-negative biochemical tests', items: ['Oxidase', 'Indole', 'Urease', 'Citrate'],
      why: 'Oxidase separates Pseudomonas, Vibrio, and Neisseria (positive) from the Enterobacterales (negative).' },
    { label: 'Media named after people', items: ['Thayer-Martin', 'Bordet-Gengou', 'Löwenstein-Jensen', 'Loeffler'],
      why: 'For Neisseria, Bordetella, mycobacteria, and C. diphtheriae.' },
  ],
];
