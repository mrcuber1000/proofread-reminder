(() => {
  /* ── detect Google Docs (top frame or embedded iframe) ── */
  const url = window.location.href;
  if (!/docs\.google\.com\/document\//.test(url)) return;

  /* ── checklist items — edit these to change the list ── */
  const ITEMS = [
    'Read the whole thing out loud',
    'Check spelling & grammar',
    'Make sure you answered the prompt',
    'Check formatting (font, spacing, margins)',
    'Verify your name & date are on it',
  ];

  /* ── state (per-doc, stored in chrome.storage) ── */
  const docId = (url.match(/\/document\/d\/([^/]+)/) || [])[1] || 'unknown';
  const storageKey = 'pr_' + docId;
  let checked = {};

  function saveState() {
    try { chrome.storage.local.set({ [storageKey]: checked }); } catch {}
  }

  function loadState(cb) {
    try {
      chrome.storage.local.get(storageKey, (r) => {
        checked = r[storageKey] || {};
        cb();
      });
    } catch { cb(); }
  }

  /* ── build UI ── */
  function buildPanel() {
    if (document.getElementById('pr-checklist-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'pr-checklist-panel';

    const allDone = () => ITEMS.every((_, i) => checked[i]);
    const remaining = () => ITEMS.filter((_, i) => !checked[i]).length;

    /* header */
    const header = document.createElement('div');
    header.className = 'pr-header';

    const title = document.createElement('span');
    title.textContent = '✓ Proofread Checklist';

    const badge = document.createElement('span');
    badge.className = 'pr-badge';

    const headerBtns = document.createElement('div');
    headerBtns.className = 'pr-header-btns';

    const minBtn = document.createElement('button');
    minBtn.textContent = '−';
    minBtn.title = 'Minimize';

    const resetBtn = document.createElement('button');
    resetBtn.textContent = '↺';
    resetBtn.title = 'Reset checklist';

    headerBtns.append(minBtn, resetBtn);
    header.append(title, badge, headerBtns);

    /* body */
    const body = document.createElement('div');
    body.className = 'pr-body';

    const itemEls = ITEMS.map((text, i) => {
      const wrap = document.createElement('div');
      wrap.className = 'pr-item' + (checked[i] ? ' pr-done' : '');

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.id = 'pr-cb-' + i;
      cb.checked = !!checked[i];

      const label = document.createElement('label');
      label.htmlFor = 'pr-cb-' + i;
      label.textContent = text;

      cb.addEventListener('change', () => {
        checked[i] = cb.checked;
        wrap.classList.toggle('pr-done', cb.checked);
        updateProgress();
        saveState();
      });

      wrap.append(cb, label);
      return wrap;
    });

    const progressWrap = document.createElement('div');
    progressWrap.className = 'pr-progress-wrap';
    const progressBar = document.createElement('div');
    progressBar.className = 'pr-progress-bar';
    progressWrap.appendChild(progressBar);

    const status = document.createElement('div');
    status.className = 'pr-status';

    itemEls.forEach(el => body.appendChild(el));
    body.append(progressWrap, status);

    panel.append(header, body);
    document.body.appendChild(panel);

    /* ── progress update ── */
    function updateProgress() {
      const done = ITEMS.filter((_, i) => checked[i]).length;
      const pct = Math.round((done / ITEMS.length) * 100);
      progressBar.style.width = pct + '%';
      const left = remaining();
      badge.textContent = left === 0 ? '✓' : left;
      badge.classList.toggle('pr-badge-done', left === 0);
      if (done === ITEMS.length) {
        status.textContent = 'All done — safe to submit!';
        status.className = 'pr-status pr-all-done';
      } else {
        status.textContent = done + ' of ' + ITEMS.length + ' checked';
        status.className = 'pr-status';
      }
    }
    updateProgress();

    /* ── minimize / expand ── */
    minBtn.addEventListener('click', () => {
      const min = panel.classList.toggle('pr-minimized');
      minBtn.textContent = min ? '+' : '−';
    });

    /* ── reset ── */
    resetBtn.addEventListener('click', () => {
      if (!confirm('Reset all checkmarks?')) return;
      checked = {};
      itemEls.forEach((wrap, i) => {
        wrap.classList.remove('pr-done');
        wrap.querySelector('input').checked = false;
      });
      updateProgress();
      saveState();
    });

    /* ── drag ── */
    let dragging = false, dx = 0, dy = 0;
    header.addEventListener('mousedown', (e) => {
      dragging = true;
      const rect = panel.getBoundingClientRect();
      dx = e.clientX - rect.left;
      dy = e.clientY - rect.top;
      header.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      panel.style.left = (e.clientX - dx) + 'px';
      panel.style.top = (e.clientY - dy) + 'px';
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
    });
    document.addEventListener('mouseup', () => {
      dragging = false;
      header.style.cursor = 'grab';
    });

    /* ── beforeunload guard ── */
    window.addEventListener('beforeunload', (e) => {
      if (!allDone()) {
        e.preventDefault();
        e.returnValue = '';
      }
    });
  }

  loadState(buildPanel);
})();
