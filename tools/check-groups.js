#!/usr/bin/env node
/* Groups puzzle checker. Run from the site folder:  node tools/check-groups.js
   Fails (exit 1) if any puzzle is broken. Also reports how many days of puzzles are left.
   It cannot judge whether a tile fits two groups. That needs a human (or careful AI) read. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'data', 'groups.js'), 'utf8'), ctx, { filename: 'groups.js' });
const GROUPS = vm.runInContext('GROUPS', ctx);

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const errors = [];
const warnings = [];

GROUPS.forEach((p, i) => {
  const err = (m) => errors.push(`puzzle ${i + 1}: ${m}`);
  if (!Array.isArray(p) || p.length !== 4) return err('needs exactly 4 groups');
  const seen = {};
  p.forEach((g, j) => {
    if (!g.label) err(`group ${j + 1} has no label`);
    if (!g.why) err(`group ${j + 1} has no why`);
    if (!Array.isArray(g.items) || g.items.length !== 4) return err(`group ${j + 1} needs exactly 4 items`);
    g.items.forEach((t) => {
      if (!t || typeof t !== 'string') return err(`group ${j + 1} has an empty item`);
      if (t.length > 24) warnings.push(`puzzle ${i + 1}: "${t}" is long for a tile`);
      const n = norm(t);
      if (seen[n] !== undefined) err(`"${t}" appears twice`);
      seen[n] = j;
    });
  });
  const labels = new Set(p.map((g) => norm(g.label || '')));
  if (labels.size !== 4) err('two groups share a label');
});

// Runway
const appSrc = fs.readFileSync(path.join(root, 'groups', 'app.js'), 'utf8');
const m = appSrc.match(/EPOCH = \[(\d+), (\d+), (\d+)\]/);
if (m) {
  const now = new Date();
  const today = Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(+m[1], +m[2], +m[3])) / 864e5);
  const left = GROUPS.length - (today + 1);
  console.log(`Today is Groups #${today + 1}. ${GROUPS.length} puzzles written, ${left} days of new puzzles left.`);
}
warnings.forEach((w) => console.log('warning: ' + w));
if (errors.length) { errors.forEach((e) => console.log('ERROR: ' + e)); process.exit(1); }
console.log('All puzzles pass.');
