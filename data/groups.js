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
];
