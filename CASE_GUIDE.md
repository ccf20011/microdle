# How to write Microdle cases

This guide is for whoever adds cases, human or AI. The daily case writer follows it exactly.

## The goal

Keep at least **30 days of unplayed cases** in `data/cases.js`. Run `node tools/check.js` to see how many days are left.

## Hard rules

1. **Only add cases to the end of the `CASES` list.** Never edit, reorder, or delete an existing case. The case number is tied to the date, so changing earlier cases changes what people already played, or are playing today.
   - The one exception is a real medical error in a case that hasn't been played yet. Fix it in place and say so in the commit message.
2. **Level:** fair game for someone who passed Step 1 and Step 2 CK, but **not the overplayed textbook version.** Use two levers, about half the cases each:
   - **A famous organism in a less famous presentation.** For example: TB in the spine instead of an upper-lobe cavity, Salmonella osteomyelitis in sickle cell, S. aureus septic arthritis, Listeria in pregnancy as a flu-like illness, syphilis as hepatitis or uveitis.
   - **A less overplayed organism that is still Step 2 material.** For example: Nocardia, Actinomyces, Brucella, Q fever, Leptospira, Ehrlichia, Anaplasma, Coccidioides, Strep gallolyticus, Capnocytophaga, Pasteurella, Strongyloides, Bartonella in HIV.
   - Avoid the most overplayed versions: TB with an apical cavity in an immigrant, lockjaw after a rusty nail, Lyme with a bull's-eye rash, Legionella after a cruise hot tub, and similar one-liners from review books.
   - **About 1 case in 10 should have supportive care as the ideal answer.** Examples: norovirus, mono (amoxicillin is harmful), mild non-typhoidal Salmonella in a healthy adult, parvovirus B19, hand-foot-and-mouth disease, roseola, EHEC (antibiotics are harmful).
3. **Variety:**
   - Don't reuse an organism that appears in the last 30 cases (the checker warns about this).
   - Over each block of 10 cases, mix bacteria, viruses, fungi, and parasites, and mix settings: outpatient, ED, ward, ICU, travel, immunocompromised, pediatric, pregnancy.
   - It's fine to repeat an organism after 30 days if the syndrome is different, like MSSA osteomyelitis after MRSA endocarditis.
4. **Treatment must follow current US guidelines** (IDSA, CDC, AAP, ATS). If guidelines disagree or you are not sure, either pick a case where the answer is clear or leave that case out. Never guess.

## Writing a case

Copy an existing case block and follow the field guide at the top of `data/cases.js`. Look at earlier cases for the right tone.

**Difficulty target:** a player who passed Step 2 should usually get the organism on **clue 4 or 5**. If you could name the answer confidently from clues 1 to 3, the case is too easy. Rewrite it.

**Clues** (exactly 6). Each clue is **one short sentence with one new fact**, or two short sentences at most. Every clue points toward the answer, and each one is more specific than the last. **No red herrings.**
1. **Presentation:** age, sex, and a common complaint, like "A 44-year-old man presents with 2 months of low back pain." Fits many organisms and many non-infectious causes.
2. **Symptoms:** one or two more common symptoms. Still no signature symptom.
3. **History:** background that narrows the field without naming the exposure, like immune status, a transplant, sickle cell, or a home state. Never the signature exposure here.
4. **Exam:** the physical findings, described plainly. No eponyms or memorized phrases.
5. **Labs or imaging, plus the signature exposure** (the farm, the tick, the flooded river, the kitten) if there is one. Use raw numbers ("Na 127"), not labels ("hyponatremia").
6. **Microbiology:** the diagnostic stain, culture, or test. This should pin it down.

Labels can change to fit (for example "Course" or "CSF" instead of "Labs"), but keep the order. Look at cases 3 onward in `data/cases.js` for examples.

Never name the organism, its disease, or a nickname in the clues. The checker catches the obvious ones, but also avoid indirect giveaways like naming the vaccine for that exact organism.

**Writing style:** short, plain sentences. Real units. No abbreviations a student might not know without context.

**Treatment answer key:**
- **`prompt`** sets the scene: outpatient vs admitted, how sick the patient is, allergies if relevant.
- **`best`**: every regimen that is truly first-line for this scenario.
- **`okay`**: regimens that work but aren't first-line, such as allergy alternatives or missing a minor piece.
- **`inadequate`**: near-misses that deserve their own explanation, like the right antibiotic without needed surgery.
- **`harm`**: only for choices that actively hurt the patient, not ones that just don't work.
- **`extras`**: reasonable empiric add-ons (for example vancomycin and ceftriaxone in meningitis) so they don't count as overkill.
- **`notes`**: one sentence explaining why each common wrong or second-line choice falls short. Cover the most likely mistakes.
- **`outcome`** texts: one or two sentences about what happened to the patient.
- **`standard`**: one line with the standard of care, including duration if it matters.

If a case needs a drug or organism that isn't in `data/drugs.js` or `data/organisms.js`, add it there, with common brand names and nicknames in `aka`.

## Self-check before saving (required)

Do this for every new case, as a separate pass after writing all of them:

1. **Re-read the case as a skeptical ID attending.** For each clue, ask whether it is medically true and typical for this organism.
2. **Check the answer key against the guideline you'd cite.** Is every `best` regimen actually first-line here? Is anything first-line missing? Is every `harm` entry truly harmful?
3. **Play it.** Pretend you are a student and pick the 3 most likely treatments. Does each one get a fair grade and a helpful explanation?
4. **Check fairness.** Can the organism be pinned down by clue 6 without guessing between two equally good answers? If two organisms fit, add both ids to `accept` or rewrite the clues.
5. **Run `node tools/check.js`.** It must print "All cases pass." Fix any errors.

If any check fails and you can't fix it confidently, delete that case and write a different one.

## Saving

Commit with a message like `Add cases 31–37 (runway now 30 days)`, listing each new organism, then push to `main`. The site updates by itself within a couple of minutes.
