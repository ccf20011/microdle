# How to write Microdle cases

This guide is for whoever adds cases, human or AI. The daily case writer follows it exactly.

## The goal

Keep at least **30 days of unplayed cases** in `data/cases.js`. Run `node tools/check.js` to see how many days are left.

## Hard rules

1. **Only add cases to the end of the `CASES` list.** Never edit, reorder, or delete an existing case. The case number is tied to the date, so changing earlier cases changes what people already played, or are playing today.
   - The one exception is a real medical error in a case that hasn't been played yet. Fix it in place and say so in the commit message.
2. **Level:** general medical knowledge someone who passed Step 1 and Step 2 CK would know. Classic presentations, nothing obscure.
3. **Variety:**
   - Don't reuse an organism that appears in the last 30 cases (the checker warns about this).
   - Over each block of 10 cases, mix bacteria, viruses, fungi, and parasites, and mix settings: outpatient, ED, ward, ICU, travel, immunocompromised, pediatric, pregnancy.
   - It's fine to repeat an organism after 30 days if the syndrome is different, like MSSA osteomyelitis after MRSA endocarditis.
4. **Treatment must follow current US guidelines** (IDSA, CDC, AAP, ATS). If guidelines disagree or you are not sure, either pick a case where the answer is clear or leave that case out. Never guess.

## Writing a case

Copy an existing case block and follow the field guide at the top of `data/cases.js`. Look at earlier cases for the right tone.

**Clues** (exactly 6, from vague to giveaway):
1. Presentation: age, sex, chief complaint. Should fit several organisms.
2. History or exposure
3. Exam
4. Labs, or a more specific exposure
5. Imaging, CSF, or another test
6. Microbiology: stain, culture, or the classic lab finding. Basically gives it away.

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
