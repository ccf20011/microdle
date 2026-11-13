/* Treatment grading, shared by the game (app.js) and the case checker (tools/check.js). */
// A regimen is a list of slots; each slot is one drug id or an array of interchangeable ids.
function regimenUse(regimen, sel) {
  const used = [];
  for (const slot of regimen) {
    const opts = Array.isArray(slot) ? slot : [slot];
    const hit = opts.filter((id) => sel.has(id));
    if (!hit.length) return null;
    used.push(...hit);
  }
  return used;
}
function microdleGrade(c, selArr, DRUG) {
  const rx = c.rx;
  const sel = new Set(selArr);
  const notes = rx.notes || {};
  // 1. Anything harmful sinks the whole regimen.
  for (const id of selArr) if (rx.harm && rx.harm[id]) return { grade: 'bad', text: rx.harm[id] };
  if (rx.noAntimicrobials && selArr.some((id) => DRUG[id].am)) return { grade: 'bad', text: rx.noAntimicrobials };
  // 2. Best, then okay.
  let tier = null, used = null;
  for (const r of rx.best) { const u = regimenUse(r, sel); if (u) { tier = 'best'; used = u; break; } }
  if (!tier) for (const r of rx.okay || []) { const u = regimenUse(r, sel); if (u) { tier = 'okay'; used = u; break; } }
  if (tier) {
    // For "okay", a drug-specific note only makes sense when one drug carried the regimen.
    let text = tier === 'best' ? rx.outcome.best
      : (used.length === 1 && notes[used[0]]) || rx.outcome.okay;
    if (tier === 'best') {
      const down = selArr.find((id) => rx.downgrade && rx.downgrade[id]);
      if (down) return { grade: 'okay', text: rx.downgrade[down] };
      const allowed = new Set([...used, ...(rx.extras || [])]);
      const extra = selArr.filter((id) => DRUG[id].am && !allowed.has(id));
      if (extra.length >= 2) {
        return { grade: 'okay', text: 'The patient got better, but ' + extra.map((id) => DRUG[id].name).join(', ') +
          ' added side effects and resistance pressure without adding coverage.' };
      }
    }
    return { grade: tier, text };
  }
  // 3. Inadequate. Specific near-miss regimens can carry their own explanation.
  for (const [r, text] of rx.inadequate || []) if (regimenUse(r, sel)) return { grade: 'poor', text };
  const note = selArr.map((id) => notes[id]).find(Boolean);
  return { grade: 'poor', text: note || rx.outcome.poor };
}


if (typeof module !== "undefined") module.exports = { microdleGrade };
