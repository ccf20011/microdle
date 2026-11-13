#!/usr/bin/env node
/* Microdle case checker. Run from the site folder:  node tools/check.js
   Fails (exit 1) if any case is broken. Also reports how many days of cases are left. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const ctx = {};
vm.createContext(ctx);
for (const f of ['organisms.js', 'drugs.js', 'cases.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, 'data', f), 'utf8'), ctx, { filename: f });
}
const { ORGANISMS, DRUGS, CASES } = vm.runInContext('({ ORGANISMS, DRUGS, CASES })', ctx);
const { microdleGrade } = require(path.join(root, 'grade.js'));

const ORG = Object.fromEntries(ORGANISMS.map((o) => [o.id, o]));
const DRUG = Object.fromEntries(DRUGS.map((d) => [d.id, d]));
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9+]+/g, ' ').trim();
const errors = [];
const warnings = [];

// Unique ids and search names
for (const [label, list] of [['organism', ORGANISMS], ['drug', DRUGS]]) {
  const ids = new Set();
  const names = {};
  for (const it of list) {
    if (ids.has(it.id)) errors.push(`duplicate ${label} id "${it.id}"`);
    ids.add(it.id);
    for (const k of [it.name, ...(it.aka || [])]) {
      const n = norm(k);
      if (names[n] && names[n] !== it.id) errors.push(`${label} name "${k}" is used by both ${names[n]} and ${it.id}`);
      names[n] = it.id;
    }
  }
}

const first = (slot) => (Array.isArray(slot) ? slot[0] : slot);
const slotIds = (reg) => reg.flatMap((s) => (Array.isArray(s) ? s : [s]));

CASES.forEach((c, i) => {
  const tag = `case ${i + 1}`;
  const err = (m) => errors.push(`${tag}: ${m}`);
  if (!Array.isArray(c.accept) || !c.accept.length) return err('no accept list');
  c.accept.forEach((id) => ORG[id] || err(`unknown organism "${id}"`));
  if (!c.dx) err('missing dx');
  if (!c.pearl) err('missing pearl');
  if (!Array.isArray(c.clues) || c.clues.length !== 6) err('needs exactly 6 clues');
  (c.clues || []).forEach((cl, j) => { if (!Array.isArray(cl) || cl.length !== 2 || !cl[0] || !cl[1]) err(`clue ${j + 1} malformed`); });

  // The answer must not appear in its own clues
  const clueText = ' ' + norm((c.clues || []).map((cl) => cl[1]).join(' ')) + ' ';
  for (const id of c.accept) {
    const o = ORG[id];
    if (!o) continue;
    for (const k of [o.name, ...(o.aka || [])]) {
      const n = norm(k);
      if (n.length >= 4 && clueText.includes(' ' + n + ' ')) err(`clues give away the answer ("${k}")`);
    }
  }

  const rx = c.rx || {};
  if (!rx.prompt || !rx.standard) err('rx needs prompt and standard');
  if (!rx.outcome || !rx.outcome.best || !rx.outcome.okay || !rx.outcome.poor) err('rx.outcome needs best, okay, poor');
  if (!Array.isArray(rx.best) || !rx.best.length) return err('rx.best is empty');
  const allIds = [
    ...(rx.best || []).flatMap(slotIds), ...(rx.okay || []).flatMap(slotIds),
    ...(rx.inadequate || []).flatMap(([r]) => slotIds(r)),
    ...(rx.extras || []), ...Object.keys(rx.harm || {}), ...Object.keys(rx.notes || {}), ...Object.keys(rx.downgrade || {}),
  ];
  const bad = allIds.filter((id) => !DRUG[id]);
  if (bad.length) return err(`unknown drug ids: ${[...new Set(bad)].join(', ')}`);

  // Grading sanity: every listed regimen grades the way the case says it should
  const g = (sel) => microdleGrade(c, sel, DRUG).grade;
  rx.best.forEach((r, j) => { const s = r.map(first); if (g(s) !== 'best') err(`best regimen ${j + 1} (${s}) grades "${g(s)}"`); });
  (rx.okay || []).forEach((r, j) => { const s = r.map(first); if (g(s) !== 'okay') err(`okay regimen ${j + 1} (${s}) grades "${g(s)}"`); });
  (rx.inadequate || []).forEach(([r], j) => { const s = r.map(first); if (g(s) !== 'poor') err(`inadequate regimen ${j + 1} (${s}) grades "${g(s)}"`); });
  Object.keys(rx.harm || {}).forEach((id) => { if (g([id]) !== 'bad') err(`harm drug ${id} alone grades "${g([id])}"`); });
  if (g(['supportive']) === 'best' && !rx.noAntimicrobials && !slotIds(rx.best[0]).includes('supportive')) err('supportive care alone grades ideal');
});

// Repeats: the same organism twice within 30 days
const lastSeen = {};
CASES.forEach((c, i) => {
  const id = c.accept[0];
  if (lastSeen[id] !== undefined && i - lastSeen[id] < 30) warnings.push(`case ${i + 1}: ${id} repeats only ${i - lastSeen[id]} days after case ${lastSeen[id] + 1}`);
  lastSeen[id] = i;
});

// Runway
const appSrc = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const m = appSrc.match(/EPOCH = \[(\d+), (\d+), (\d+)\]/);
if (m) {
  const now = new Date();
  const today = Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(+m[1], +m[2], +m[3])) / 864e5);
  const left = CASES.length - (today + 1);
  console.log(`Today is Microdle #${today + 1}. ${CASES.length} cases written, ${left} days of new cases left.`);
}
console.log(`${ORGANISMS.length} organisms, ${DRUGS.length} drugs.`);
warnings.forEach((w) => console.log('warning: ' + w));
if (errors.length) { errors.forEach((e) => console.log('ERROR: ' + e)); process.exit(1); }
console.log('All cases pass.');
