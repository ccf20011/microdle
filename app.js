/* Microdle game engine. Data lives in data/*.js (ORGANISMS, DRUGS, CASES). */
(function () {
  'use strict';

  // ---- Config ---------------------------------------------------------------
  const MAX_GUESSES = 6;
  // Microdle #1 is this local date (year, month 0-11, day). Change before launch.
  const EPOCH = [2026, 10, 12];
  const GRADES = {
    best: { emoji: '✅', word: 'ideal',      title: '✅ Ideal' },
    okay: { emoji: '🟡', word: 'acceptable', title: '🟡 Acceptable' },
    poor: { emoji: '⚠️', word: 'inadequate', title: '⚠️ Inadequate' },
    bad:  { emoji: '❌', word: 'harmful',    title: '❌ Harmful' },
  };

  // ---- Helpers --------------------------------------------------------------
  const $ = (s) => document.querySelector(s);
  const ORG = Object.fromEntries(ORGANISMS.map((o) => [o.id, o]));
  const DRUG = Object.fromEntries(DRUGS.map((d) => [d.id, d]));
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9+]+/g, ' ').trim();
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } },
  };
  const listNames = (ids) => ids.map((id) => DRUG[id].name).join(', ');
  // A regimen is a list of slots; each slot is one drug id or an array of interchangeable ids.
  const regimenText = (reg) => reg.map((slot) => {
    const opts = (Array.isArray(slot) ? slot : [slot]).map((id) => DRUG[id].name);
    return opts.length > 1 && reg.length > 1 ? '(' + opts.join(' or ') + ')' : opts.join(' or ');
  }).join(' + ');

  // ---- Which case is today --------------------------------------------------
  const params = new URLSearchParams(location.search);
  const preview = params.has('day'); // ?day=N lets you review any case without touching stats
  function todayIndex() {
    const n = new Date();
    const t = Date.UTC(n.getFullYear(), n.getMonth(), n.getDate());
    const e = Date.UTC(EPOCH[0], EPOCH[1], EPOCH[2]);
    return Math.max(0, Math.floor((t - e) / 864e5));
  }
  const dayIdx = preview ? Math.max(0, (parseInt(params.get('day'), 10) || 1) - 1) : todayIndex();
  const puzzleNo = dayIdx + 1;
  const C = CASES[dayIdx % CASES.length];

  // ---- State ----------------------------------------------------------------
  const SKEY = 'microdle-state';
  const STATS_KEY = 'microdle-stats';
  let S = preview ? null : store.get(SKEY, null);
  // If a day's case was swapped after someone played it, start them fresh on the new case.
  const caseKey = C.accept.join(',') + '|' + C.dx;
  if (!S || S.day !== dayIdx || S.caseKey !== caseKey) S = { day: dayIdx, caseKey, guesses: [], status: 'playing', rx: null };
  const save = () => { if (!preview) store.set(SKEY, S); };
  let rxSel = [];
  let lastRevealed = -1;

  function statsGet() {
    return store.get(STATS_KEY, {
      played: 0, wins: 0, streak: 0, maxStreak: 0, dist: [0, 0, 0, 0, 0, 0],
      rxPlayed: 0, cured: 0, lastDay: null, lastWinDay: null, lastRxDay: null,
    });
  }
  function recordEnd(won, n) {
    if (preview) return;
    const st = statsGet();
    if (st.lastDay === dayIdx) return;
    st.played++;
    if (won) {
      st.wins++;
      st.dist[n - 1]++;
      st.streak = st.lastWinDay === dayIdx - 1 ? st.streak + 1 : 1;
      st.maxStreak = Math.max(st.maxStreak, st.streak);
      st.lastWinDay = dayIdx;
    } else {
      st.streak = 0;
    }
    st.lastDay = dayIdx;
    store.set(STATS_KEY, st);
  }
  function recordRx(grade) {
    if (preview) return;
    const st = statsGet();
    if (st.lastRxDay === dayIdx) return;
    st.rxPlayed++;
    if (grade === 'best') st.cured++;
    st.lastRxDay = dayIdx;
    store.set(STATS_KEY, st);
  }

  // ---- Autocomplete ---------------------------------------------------------
  function makeCombo({ input, list, items, exclude, onPick, onEnter }) {
    let matches = [];
    let active = -1;

    function search(raw) {
      const q = norm(raw);
      if (!q) return [];
      const ex = exclude ? exclude() : new Set();
      const out = [];
      for (const it of items) {
        if (ex.has(it.id)) continue;
        let best = 9, via = null;
        const keys = [it.name, ...(it.aka || [])];
        for (let i = 0; i < keys.length; i++) {
          const k = norm(keys[i]);
          let s = 9;
          if (k === q) s = 0;
          else if (k.startsWith(q)) s = 1;
          else if (k.split(' ').some((w) => w.startsWith(q))) s = 2;
          else if (q.length >= 3 && k.includes(q)) s = 3;
          if (s < best) { best = s; via = i === 0 ? null : keys[i]; }
        }
        if (best < 9) out.push({ s: best, it, via });
      }
      out.sort((a, b) => a.s - b.s || a.it.name.localeCompare(b.it.name));
      return out.slice(0, 8);
    }
    function render() {
      list.innerHTML = '';
      matches.forEach((m, i) => {
        const li = document.createElement('li');
        li.setAttribute('role', 'option');
        li.id = list.id + '-' + i;
        li.textContent = m.it.name;
        if (m.via) { const sm = document.createElement('small'); sm.textContent = m.via; li.appendChild(sm); }
        if (i === active) { li.classList.add('active'); li.setAttribute('aria-selected', 'true'); }
        li.addEventListener('mousedown', (e) => { e.preventDefault(); pick(m.it); });
        list.appendChild(li);
      });
      list.hidden = !matches.length;
      input.setAttribute('aria-expanded', String(!!matches.length));
      if (active >= 0 && matches.length) {
        input.setAttribute('aria-activedescendant', list.id + '-' + active);
        const el = list.children[active];
        if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
      } else input.removeAttribute('aria-activedescendant');
    }
    function close() { matches = []; active = -1; render(); }
    function pick(it) { close(); onPick(it); }
    input.addEventListener('input', () => { matches = search(input.value); active = matches.length ? 0 : -1; render(); });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' && matches.length) { e.preventDefault(); active = (active + 1) % matches.length; render(); }
      else if (e.key === 'ArrowUp' && matches.length) { e.preventDefault(); active = (active - 1 + matches.length) % matches.length; render(); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        if (matches.length && active >= 0) pick(matches[active].it);
        else if (onEnter) onEnter();
      } else if (e.key === 'Escape') close();
    });
    input.addEventListener('blur', () => setTimeout(close, 120));
    return {
      resolve() {
        const q = norm(input.value);
        if (!q) return null;
        return items.find((it) => [it.name, ...(it.aka || [])].some((k) => norm(k) === q)) || null;
      },
      close,
    };
  }

  // ---- Guessing -------------------------------------------------------------
  const isCorrect = (id) => C.accept.includes(id);
  const guessInput = $('#guessInput');
  const guessCombo = makeCombo({
    input: guessInput,
    list: $('#guessList'),
    items: ORGANISMS,
    exclude: () => new Set(S.guesses),
    onPick: (it) => { guessInput.value = it.name; flash('#guessMsg', ''); },
    onEnter: submitGuess,
  });
  $('#guessBtn').addEventListener('click', submitGuess);

  function submitGuess() {
    if (S.status !== 'playing') return;
    const it = guessCombo.resolve();
    if (!it) { flash('#guessMsg', 'Pick an organism from the list.'); shake(guessInput); return; }
    if (S.guesses.includes(it.id)) { flash('#guessMsg', 'You already guessed that one.'); shake(guessInput); return; }
    S.guesses.push(it.id);
    guessInput.value = '';
    flash('#guessMsg', '');
    if (isCorrect(it.id)) { S.status = 'won'; recordEnd(true, S.guesses.length); }
    else if (S.guesses.length >= MAX_GUESSES) { S.status = 'lost'; recordEnd(false); }
    save();
    render();
    if (S.status === 'won') setTimeout(() => $('#rxInput').focus(), 50);
    else if (S.status === 'playing') guessInput.focus();
  }

  // ---- Treatment ------------------------------------------------------------
  const rxInput = $('#rxInput');
  makeCombo({
    input: rxInput,
    list: $('#rxList'),
    items: DRUGS,
    exclude: () => new Set(rxSel),
    onPick: addRx,
    onEnter: () => {
      const it = DRUGS.find((d) => [d.name, ...(d.aka || [])].some((k) => norm(k) === norm(rxInput.value)));
      if (it) addRx(it);
      else if (rxInput.value.trim()) { flash('#rxMsg', 'Pick a drug or intervention from the list.'); shake(rxInput); }
    },
  });
  function addRx(it) {
    if (rxSel.includes(it.id)) return;
    if (rxSel.length >= 6) { flash('#rxMsg', 'Six items max. Remove one first.'); return; }
    rxSel.push(it.id);
    rxInput.value = '';
    flash('#rxMsg', '');
    renderChips();
    rxInput.focus();
  }
  function renderChips() {
    const box = $('#rxChips');
    box.innerHTML = '';
    rxSel.forEach((id) => {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.textContent = DRUG[id].name;
      const x = document.createElement('button');
      x.setAttribute('aria-label', 'Remove ' + DRUG[id].name);
      x.textContent = '×';
      x.addEventListener('click', () => { rxSel = rxSel.filter((d) => d !== id); renderChips(); });
      chip.appendChild(x);
      box.appendChild(chip);
    });
    $('#rxBtn').disabled = !rxSel.length;
  }
  $('#rxBtn').addEventListener('click', () => {
    if (!rxSel.length || S.rx) return;
    const g = gradeRx(C, rxSel);
    S.rx = { sel: rxSel.slice(), grade: g.grade, text: g.text };
    recordRx(g.grade);
    save();
    render();
    $('#rxResult').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  const gradeRx = (c, selArr) => microdleGrade(c, selArr, DRUG);

  // ---- Rendering ------------------------------------------------------------
  function render() {
    const done = S.status !== 'playing';
    const revealed = done ? C.clues.length : Math.min(S.guesses.length + 1, C.clues.length);

    // clues
    const ol = $('#clues');
    ol.innerHTML = '';
    C.clues.forEach((cl, i) => {
      const li = document.createElement('li');
      if (i < revealed) {
        li.className = 'clue' + (i > lastRevealed && lastRevealed >= 0 ? ' new' : '');
        const lab = document.createElement('span');
        lab.className = 'label';
        lab.textContent = cl[0];
        li.appendChild(lab);
        li.appendChild(document.createTextNode(cl[1]));
      } else {
        li.className = 'clue locked';
        li.textContent = 'Clue ' + (i + 1);
      }
      ol.appendChild(li);
    });
    lastRevealed = revealed - 1;

    // guess area
    $('#guessArea').hidden = done;
    const left = MAX_GUESSES - S.guesses.length;
    $('#guessesLeft').textContent = left + (left === 1 ? ' guess left' : ' guesses left');

    // history
    const hist = $('#history');
    hist.innerHTML = '';
    S.guesses.forEach((id) => {
      const li = document.createElement('li');
      const ok = isCorrect(id);
      const sq = document.createElement('span');
      sq.className = 'sq ' + (ok ? 'right' : 'wrong');
      sq.textContent = ok ? '✓' : '✕';
      sq.setAttribute('aria-hidden', 'true');
      const nm = document.createElement('span');
      nm.textContent = ORG[id].name;
      if (!ok) nm.className = 'wrongname';
      li.append(sq, nm);
      hist.appendChild(li);
    });

    // answer
    $('#answerCard').hidden = !done;
    if (done) {
      $('#answerHead').textContent = S.status === 'won'
        ? 'Got it in ' + S.guesses.length
        : 'The answer was';
      $('#answerName').textContent = C.answer || ORG[C.accept[0]].name;
      $('#answerDx').textContent = C.dx;
    }

    // treatment
    $('#rxCard').hidden = !(S.status === 'won' && !S.rx);
    $('#rxPrompt').textContent = C.rx.prompt;
    renderChips();
    const showResult = S.status === 'lost' || !!S.rx;
    $('#rxResult').hidden = !showResult;
    if (showResult) {
      if (S.rx) {
        const g = GRADES[S.rx.grade];
        $('#rxGrade').textContent = g.title;
        $('#rxGrade').className = 'grade ' + S.rx.grade;
        $('#rxGiven').innerHTML = '';
        const b = document.createElement('b'); b.textContent = 'You gave: ';
        $('#rxGiven').append(b, listNames(S.rx.sel));
        $('#rxGiven').hidden = false;
        $('#rxOutcome').textContent = S.rx.text;
        $('#rxOutcome').hidden = false;
      } else {
        $('#rxGrade').textContent = 'No treatment round';
        $('#rxGrade').className = 'grade';
        $('#rxGiven').hidden = true;
        $('#rxOutcome').hidden = true;
      }
      // On a miss, show what would have graded ideal (and acceptable, unless they already got that).
      const missed = !!S.rx && S.rx.grade !== 'best';
      const showKey = (sel, label, regs) => {
        const el = $(sel);
        el.innerHTML = '';
        el.hidden = !regs || !regs.length;
        if (el.hidden) return;
        const b = document.createElement('b'); b.textContent = label;
        el.append(b);
        regs.forEach((r, i) => {
          if (regs.length > 1) el.append(document.createElement('br'), '• ');
          el.append(regimenText(r));
        });
      };
      showKey('#rxIdeal', 'Ideal: ', missed ? C.rx.best : null);
      showKey('#rxOkay', 'Acceptable: ', missed && S.rx.grade !== 'okay' ? C.rx.okay : null);
      $('#rxStandard').innerHTML = '';
      const b2 = document.createElement('b'); b2.textContent = 'Standard of care: ';
      $('#rxStandard').append(b2, C.rx.standard);
    }
    $('#pearl').hidden = !showResult;
    $('#pearl').textContent = '💡 ' + C.pearl;

    // end
    const finished = S.status === 'lost' || !!S.rx;
    $('#end').hidden = !finished;
    if (finished) $('#sharePreview').textContent = shareText();
  }

  // ---- Share ----------------------------------------------------------------
  function shareText() {
    const won = S.status === 'won';
    let grid = '';
    for (let i = 0; i < MAX_GUESSES; i++) {
      const id = S.guesses[i];
      if (id === undefined) grid += '⬜️';
      else grid += isCorrect(id) ? '🦠' : '🟥';
    }
    const rx = S.rx ? GRADES[S.rx.grade].emoji + ' ' + GRADES[S.rx.grade].word : '—';
    return 'Microdle #' + puzzleNo + ' 🦠 ' + (won ? S.guesses.length : 'X') + '/' + MAX_GUESSES +
      '\n\n' + grid + '\n\nRx: ' + rx;
  }
  $('#shareBtn').addEventListener('click', async () => {
    const text = shareText();
    try {
      await navigator.clipboard.writeText(text);
      toast('Copied to clipboard');
    } catch (e) {
      const ta = $('#shareFallback');
      ta.hidden = false;
      ta.value = text;
      ta.focus();
      ta.select();
      toast('Copy the text below');
    }
  });

  // ---- Small UI bits --------------------------------------------------------
  function flash(sel, text) { $(sel).textContent = text; }
  function shake(el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }
  let toastTimer;
  function toast(text) {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = text;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 1800);
  }

  function tickCountdown() {
    const el = $('#countdown');
    if (preview) { el.textContent = 'Preview mode. Results are not saved.'; return; }
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const s = Math.max(0, Math.floor((next - now) / 1000));
    const pad = (n) => String(n).padStart(2, '0');
    el.textContent = 'Next case in ' + pad(Math.floor(s / 3600)) + ':' + pad(Math.floor(s / 60) % 60) + ':' + pad(s % 60);
  }
  setInterval(tickCountdown, 1000);
  tickCountdown();

  // dialogs
  function openDlg(d) { if (d.showModal) d.showModal(); else d.setAttribute('open', ''); }
  document.querySelectorAll('dialog').forEach((d) => {
    d.addEventListener('click', (e) => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
  });
  $('#helpBtn').addEventListener('click', () => openDlg($('#helpDlg')));
  $('#statsBtn').addEventListener('click', () => { renderStats(); openDlg($('#statsDlg')); });

  function renderStats() {
    const st = statsGet();
    const streak = st.lastWinDay !== null && st.lastWinDay >= todayIndex() - 1 ? st.streak : 0;
    const cells = [
      [st.played, 'Played'],
      [st.played ? Math.round((st.wins / st.played) * 100) : 0, 'Win %'],
      [streak, 'Streak'],
      [st.rxPlayed ? Math.round((st.cured / st.rxPlayed) * 100) : 0, 'Ideal Rx %'],
    ];
    const grid = $('#statsGrid');
    grid.innerHTML = '';
    cells.forEach(([v, l]) => {
      const d = document.createElement('div');
      const b = document.createElement('b'); b.textContent = v;
      const s = document.createElement('span'); s.textContent = l;
      d.append(b, s);
      grid.appendChild(d);
    });
    const max = Math.max(1, ...st.dist);
    const dist = $('#dist');
    dist.innerHTML = '';
    st.dist.forEach((n, i) => {
      const row = document.createElement('div');
      const lab = document.createElement('span'); lab.textContent = i + 1;
      const bar = document.createElement('i');
      bar.style.width = Math.max(6, (n / max) * 100) + '%';
      bar.textContent = n;
      if (!preview && S.status === 'won' && S.guesses.length === i + 1) bar.className = 'today';
      row.append(lab, bar);
      dist.appendChild(row);
    });
  }

  // ---- Boot -----------------------------------------------------------------
  const today = new Date();
  $('#meta').textContent = '#' + puzzleNo + ' · ' + today.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  if (preview) {
    $('#meta').textContent = '#' + puzzleNo;
    $('#previewNote').hidden = false;
    $('#previewNote').textContent = 'Preview of case ' + puzzleNo + ' of ' + CASES.length + '.';
  }
  render();

  // exposed for testing in the console
  window.__microdle = { gradeRx, C };
})();
