/* Microdle Groups tab: daily microbiology grouping puzzle. Data lives in ../data/groups.js (GROUPS). */
(function () {
  'use strict';

  // ---- Config ---------------------------------------------------------------
  const MAX_MISTAKES = 4;
  // Groups #1 is this local date (year, month 0-11, day).
  const EPOCH = [2026, 10, 13];
  const EMOJI = ['🟩', '🟧', '🟦', '🟪'];

  // ---- Helpers --------------------------------------------------------------
  const $ = (s) => document.querySelector(s);
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } },
  };
  // Small seeded random, so everyone starts with the same tile order on a given day.
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffle(arr, rand) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  // ---- Which puzzle is today ------------------------------------------------
  const params = new URLSearchParams(location.search);
  const preview = params.has('day'); // ?day=N plays any puzzle without touching stats
  function todayIndex() {
    const n = new Date();
    const t = Date.UTC(n.getFullYear(), n.getMonth(), n.getDate());
    const e = Date.UTC(EPOCH[0], EPOCH[1], EPOCH[2]);
    return Math.max(0, Math.floor((t - e) / 864e5));
  }
  const dayIdx = preview ? Math.max(0, (parseInt(params.get('day'), 10) || 1) - 1) : todayIndex();
  const puzzleNo = dayIdx + 1;
  const P = GROUPS[dayIdx % GROUPS.length];
  // Tiles are identified as "group:item" indexes, e.g. "2:3".
  const ALL = [];
  P.forEach((g, gi) => g.items.forEach((_, ii) => ALL.push(gi + ':' + ii)));
  const groupOf = (t) => +t.split(':')[0];
  const textOf = (t) => { const [g, i] = t.split(':'); return P[g].items[i]; };

  // ---- State ----------------------------------------------------------------
  const SKEY = 'microdle-groups-state';
  const STATS_KEY = 'microdle-groups-stats';
  const puzzleKey = P.map((g) => g.label).join('|');
  let S = preview ? null : store.get(SKEY, null);
  if (!S || S.day !== dayIdx || S.key !== puzzleKey) {
    S = { day: dayIdx, key: puzzleKey, order: shuffle(ALL, rng(puzzleNo * 7919)), solved: [], guesses: [], mistakes: 0, status: 'playing' };
  }
  const save = () => { if (!preview) store.set(SKEY, S); };
  let sel = [];

  function statsGet() {
    return store.get(STATS_KEY, { played: 0, wins: 0, perfect: 0, streak: 0, maxStreak: 0, lastDay: null, lastWinDay: null });
  }
  function recordEnd(won) {
    if (preview) return;
    const st = statsGet();
    if (st.lastDay === dayIdx) return;
    st.played++;
    if (won) {
      st.wins++;
      if (S.mistakes === 0) st.perfect++;
      st.streak = st.lastWinDay === dayIdx - 1 ? st.streak + 1 : 1;
      st.maxStreak = Math.max(st.maxStreak, st.streak);
      st.lastWinDay = dayIdx;
    } else st.streak = 0;
    st.lastDay = dayIdx;
    store.set(STATS_KEY, st);
  }

  // ---- Play -----------------------------------------------------------------
  function toggle(t) {
    if (S.status !== 'playing') return;
    const i = sel.indexOf(t);
    if (i >= 0) sel.splice(i, 1);
    else if (sel.length < 4) sel.push(t);
    render();
  }
  function submit() {
    if (sel.length !== 4 || S.status !== 'playing') return;
    const sig = sel.slice().sort().join(',');
    if (S.guesses.some((g) => g.slice().sort().join(',') === sig)) { toast('Already guessed'); return; }
    S.guesses.push(sel.slice());
    const counts = [0, 0, 0, 0];
    sel.forEach((t) => counts[groupOf(t)]++);
    const hit = counts.indexOf(4);
    if (hit >= 0) {
      S.solved.push(hit);
      S.order = S.order.filter((t) => groupOf(t) !== hit);
      sel = [];
      if (S.solved.length === 4) { S.status = 'won'; recordEnd(true); }
    } else {
      S.mistakes++;
      shake($('#grid'));
      if (S.mistakes >= MAX_MISTAKES) {
        S.status = 'lost';
        sel = [];
        recordEnd(false);
      } else if (Math.max(...counts) === 3) toast('One away…');
    }
    save();
    render();
  }

  // ---- Render ---------------------------------------------------------------
  // Shrink a tile's text until its longest word fits on one line (never below 10px).
  function fit(btn) {
    const span = btn.firstChild;
    let size = 14;
    span.style.fontSize = size + 'px';
    span.textContent = span.textContent.replace(/­/g, '');
    while (size > 10.5 && span.scrollWidth > span.clientWidth + 0.5) {
      size -= 0.5;
      span.style.fontSize = size + 'px';
    }
    // Still too wide at the smallest size: split the longest word with a soft hyphen.
    if (span.scrollWidth > span.clientWidth + 0.5) {
      const words = span.textContent.split(' ');
      const k = words.reduce((m, w, i) => (w.length > words[m].length ? i : m), 0);
      const w = words[k];
      const mid = Math.ceil(w.length / 2);
      words[k] = w.slice(0, mid) + '­' + w.slice(mid);
      span.textContent = words.join(' ');
    }
  }
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => document.querySelectorAll('.tile').forEach(fit), 100);
  });
  // Re-measure once the web font arrives, since it is wider than the fallback.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => document.querySelectorAll('.tile').forEach(fit));
  let rowsShown = 0; // rows already on screen, so only new ones animate
  function solvedRow(gi, pos) {
    const g = P[gi];
    const d = document.createElement('div');
    d.className = 'solved l' + (gi + 1) + (pos >= rowsShown ? ' new' : '');
    const b = document.createElement('b'); b.textContent = g.label;
    const its = document.createElement('span'); its.className = 'its'; its.textContent = g.items.join(', ');
    const why = document.createElement('span'); why.className = 'why'; why.textContent = g.why;
    d.append(b, its, why);
    return d;
  }
  function render() {
    $('#meta').textContent = 'Groups #' + puzzleNo;
    if (preview) { $('#previewNote').hidden = false; $('#previewNote').textContent = 'Preview of puzzle ' + puzzleNo + ' of ' + GROUPS.length + '.'; }

    const rows = $('#solvedRows');
    rows.innerHTML = '';
    const shown = S.status === 'lost' ? S.solved.concat([0, 1, 2, 3].filter((gi) => !S.solved.includes(gi))) : S.solved;
    shown.forEach((gi, pos) => rows.appendChild(solvedRow(gi, pos)));
    rowsShown = shown.length;

    const grid = $('#grid');
    grid.innerHTML = '';
    grid.hidden = S.status !== 'playing';
    S.order.forEach((t) => {
      const b = document.createElement('button');
      b.className = 'tile' + (sel.includes(t) ? ' sel' : '');
      const span = document.createElement('span');
      // Let long hyphenated names wrap after the hyphen, not mid-word.
      span.textContent = textOf(t).replace(/-/g, '-​');
      b.appendChild(span);
      b.setAttribute('aria-pressed', String(sel.includes(t)));
      b.addEventListener('click', () => toggle(t));
      grid.appendChild(b);
    });
    grid.querySelectorAll('.tile').forEach(fit);

    const m = $('#mistakes');
    m.innerHTML = '';
    m.hidden = S.status !== 'playing';
    m.append('Mistakes left:');
    for (let i = 0; i < MAX_MISTAKES; i++) {
      const dot = document.createElement('i');
      if (i >= MAX_MISTAKES - S.mistakes) dot.className = 'used';
      m.appendChild(dot);
    }
    const left = MAX_MISTAKES - S.mistakes;
    m.setAttribute('aria-label', left + (left === 1 ? ' mistake left' : ' mistakes left'));

    $('#controls').hidden = S.status !== 'playing';
    $('#submitBtn').disabled = sel.length !== 4;
    $('#clearBtn').disabled = !sel.length;

    const done = S.status !== 'playing';
    $('#end').hidden = !done;
    if (done) {
      $('#result').textContent = S.status === 'won'
        ? (S.mistakes === 0 ? 'Perfect!' : 'Solved with ' + S.mistakes + (S.mistakes === 1 ? ' mistake' : ' mistakes'))
        : 'Out of mistakes';
      $('#sharePreview').textContent = shareText();
    }
  }

  // ---- Share ----------------------------------------------------------------
  function shareText() {
    const rows = S.guesses.map((g) => g.map((t) => EMOJI[groupOf(t)]).join('')).join('\n');
    return 'Microdle Groups #' + puzzleNo + '\n' + rows;
  }
  $('#shareBtn').addEventListener('click', async () => {
    const text = shareText();
    try {
      await navigator.clipboard.writeText(text);
      toast('Copied to clipboard');
    } catch (e) {
      const ta = $('#shareFallback');
      ta.hidden = false; ta.value = text; ta.focus(); ta.select();
      toast('Copy the text below');
    }
  });

  // ---- Small UI bits --------------------------------------------------------
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
    el.textContent = 'Next puzzle in ' + pad(Math.floor(s / 3600)) + ':' + pad(Math.floor(s / 60) % 60) + ':' + pad(s % 60);
  }
  setInterval(tickCountdown, 1000);
  tickCountdown();

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
      [st.played ? Math.round((st.wins / st.played) * 100) : 0, 'Solved %'],
      [streak, 'Streak'],
      [st.perfect, 'Perfect'],
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
  }

  $('#shuffleBtn').addEventListener('click', () => { S.order = shuffle(S.order, Math.random); save(); render(); });
  $('#clearBtn').addEventListener('click', () => { sel = []; render(); });
  $('#submitBtn').addEventListener('click', submit);

  // First visit: show how to play.
  if (!preview && !store.get('microdle-groups-seen-help', false)) { store.set('microdle-groups-seen-help', true); openDlg($('#helpDlg')); }
  render();
})();
