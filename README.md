# Microdle

A daily infectious disease case. Name the organism in 6 guesses, then treat the patient.

## Files

| File | What it is |
|---|---|
| `index.html` | The page and its styles |
| `app.js` | Game logic: picking today's case, guessing, sharing, stats |
| `grade.js` | Treatment grading (ideal / acceptable / inadequate / harmful) |
| `data/cases.js` | The cases and their treatment answer keys |
| `data/organisms.js` | Everything players can guess, with nicknames for search |
| `data/drugs.js` | Everything players can pick in the treatment round |
| `tools/check.js` | Checks every case for errors and reports how many days are left |
| `CASE_GUIDE.md` | Rules for writing new cases, followed by the daily AI case writer |
| `favicon.svg`, `apple-touch-icon.png`, `og.png` | Browser tab icon, home-screen icon, link preview image |

No build step. It's a plain static site.

## How the daily case works

`app.js` has `EPOCH`, the date of Microdle #1 (month is 0-based, so November is `10`). Each day after that is the next case in `data/cases.js`. Everyone gets the same case, and it switches at midnight in their own time zone. If the list ever runs out, it starts over from case 1.

Each player's progress and stats are saved in their own browser. There are no accounts.

## Checking cases

```bash
node tools/check.js
```

To play any case without affecting stats, add `?day=N` to the address, for example `.../microdle/?day=7`.

## Visitor counting (optional)

1. Make a free account at goatcounter.com and pick a code, like `microdle`.
2. Paste this into `index.html` where it says "Visitor counting", using your code:
   ```html
   <script data-goatcounter="https://microdle.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
   ```
3. Your dashboard at `https://microdle.goatcounter.com` shows daily visitors. It uses no cookies, so no cookie banner is needed.

## Hosting

The site is hosted on GitHub Pages from this repository's `main` branch. Any push to `main` updates the live site within a couple of minutes.

To use your own domain, buy it from any registrar, add it under **Settings → Pages → Custom domain**, and update the `og:url` and `og:image` links in `index.html`.
