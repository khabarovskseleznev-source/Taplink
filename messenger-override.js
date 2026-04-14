/* messenger-override.js
   Заменяет все mailto-кнопки на dropdown с мессенджерами */
(function () {
  'use strict';

  var TELEGRAM = 'https://t.me/seleznev_ev';
  var WHATSAPP = 'https://wa.me/79141802211';
  var MAX      = 'https://vk.me/id711488491';

  /* ── Стили ─────────────────────────────────────────────────────── */
  var css = `
    /* Dropdown — position:fixed, вылетает вправо от кнопки */
    .ev-drop {
      position: fixed;
      min-width: 240px;
      background: rgba(4,4,4,0.97);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(0,255,255,0.18);
      border-radius: 4px;
      padding: 6px;
      opacity: 0;
      pointer-events: none;
      box-shadow: 20px 0 60px rgba(0,0,0,0.9), 0 0 30px rgba(0,255,255,0.08);
      z-index: 99999;
      transform: translateY(-50%) scaleX(0.88);
      transform-origin: left center;
      transition: opacity 0.22s ease, transform 0.22s ease;
    }
    /* Стрелка-указатель слева от dropdown */
    .ev-drop::before {
      content: '';
      position: absolute;
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
      border: 6px solid transparent;
      border-right-color: rgba(0,255,255,0.18);
    }
    .ev-drop::after {
      content: '';
      position: absolute;
      right: calc(100% - 1px);
      top: 50%;
      transform: translateY(-50%);
      border: 6px solid transparent;
      border-right-color: rgba(4,4,4,0.97);
    }
    .ev-drop.ev-open {
      opacity: 1;
      transform: translateY(-50%) scaleX(1);
      pointer-events: auto;
    }
    .ev-drop-head {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      letter-spacing: 0.22em;
      color: rgba(255,255,255,0.28);
      text-transform: uppercase;
      padding: 6px 14px 5px;
    }
    .ev-drop-line {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(0,255,255,0.45), transparent);
      margin-bottom: 4px;
    }
    .ev-drop-link {
      display: flex !important;
      align-items: center;
      gap: 12px;
      padding: 10px 14px !important;
      border-radius: 3px;
      text-decoration: none !important;
      font-size: 13px !important;
      font-family: 'DM Sans', sans-serif !important;
      color: rgba(255,255,255,0.65) !important;
      transition: background 0.18s, color 0.18s, padding-left 0.18s, border-left-color 0.18s !important;
      border-left: 2px solid transparent !important;
      cursor: none;
      background: transparent !important;
    }
    .ev-drop-link:hover {
      background: rgba(0,255,255,0.07) !important;
      color: #fff !important;
      padding-left: 18px !important;
      border-left-color: rgba(0,255,255,0.6) !important;
    }
    .ev-drop-ico {
      width: 30px; height: 30px;
      border-radius: 50%;
      border: 1px solid rgba(0,255,255,0.28);
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; color: #00FFFF;
      flex-shrink: 0;
      background: rgba(0,255,255,0.05);
      font-family: 'JetBrains Mono', monospace;
    }
    .ev-drop-arr {
      margin-left: auto; color: #00FFFF;
      font-size: 12px; opacity: 0;
      transform: translateX(-4px);
      transition: opacity 0.18s, transform 0.18s;
    }
    .ev-drop-link:hover .ev-drop-arr { opacity: 1; transform: translateX(0); }

    /* Nav-вставки (Telegram / WhatsApp / Max вместо «Написать на email») */
    .ev-nav-link {
      display: flex !important;
      align-items: center;
      justify-content: space-between;
      padding: 9px 12px !important;
      border-radius: 3px;
      text-decoration: none !important;
      font-size: 12px !important;
      font-family: 'DM Sans', sans-serif !important;
      letter-spacing: 0.03em;
      cursor: none;
      color: rgba(255,255,255,0.55) !important;
      transition: background 0.18s, color 0.18s, padding-left 0.18s, border-left-color 0.18s !important;
      border-left: 2px solid transparent !important;
      background: transparent !important;
    }
    .ev-nav-link:hover {
      background: rgba(0,255,255,0.07) !important;
      color: #fff !important;
      padding-left: 16px !important;
      border-left-color: rgba(0,255,255,0.6) !important;
    }
    .ev-nav-arr {
      color: #00FFFF; font-size: 11px;
      opacity: 0; transform: translateX(-4px);
      transition: opacity 0.18s, transform 0.18s;
    }
    .ev-nav-link:hover .ev-nav-arr { opacity: 1; transform: translateX(0); }
  `;
  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── Данные мессенджеров ────────────────────────────────────────── */
  var ITEMS = [
    { label: 'Telegram', ico: '✈', href: TELEGRAM },
    { label: 'WhatsApp', ico: '✆', href: WHATSAPP },
    { label: 'Max',      ico: 'М', href: MAX },
  ];

  /* ── Создать и прикрепить dropdown к кнопке ────────────────────── */
  function attachDropdown(btn) {
    if (btn.dataset.evDone) return; // уже обработано
    btn.dataset.evDone = '1';

    /* Dropdown кладём прямо в body — обходим overflow:hidden родителей */
    var drop = document.createElement('div');
    drop.className = 'ev-drop';
    document.body.appendChild(drop);

    var head = document.createElement('div');
    head.className = 'ev-drop-head';
    head.textContent = 'Messenger';
    drop.appendChild(head);

    var line = document.createElement('div');
    line.className = 'ev-drop-line';
    drop.appendChild(line);

    ITEMS.forEach(function (item) {
      var a = document.createElement('a');
      a.href = item.href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'ev-drop-link';
      a.innerHTML =
        '<span class="ev-drop-ico">' + item.ico + '</span>' +
        '<span>' + item.label + '</span>' +
        '<span class="ev-drop-arr">→</span>';
      drop.appendChild(a);
    });

    var closeTimer;

    function openDrop() {
      var rect = btn.getBoundingClientRect();
      drop.style.left = (rect.right + 16) + 'px';
      drop.style.top  = (rect.top + rect.height / 2) + 'px';
      drop.classList.add('ev-open');
    }
    function closeDrop() { drop.classList.remove('ev-open'); }
    function startClose() { closeTimer = setTimeout(closeDrop, 180); }
    function cancelClose() { clearTimeout(closeTimer); }

    /* Открытие по клику */
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      drop.classList.contains('ev-open') ? closeDrop() : openDrop();
    });

    /* Закрытие при уходе мышки с кнопки или с самого dropdown */
    btn.addEventListener('mouseleave', startClose);
    btn.addEventListener('mouseenter', cancelClose);
    drop.addEventListener('mouseenter', cancelClose);
    drop.addEventListener('mouseleave', startClose);

    /* Закрытие при клике вне */
    document.addEventListener('click', function (e) {
      if (!btn.contains(e.target) && !drop.contains(e.target)) closeDrop();
    });

    /* Закрытие при скролле страницы */
    window.addEventListener('scroll', closeDrop, true);
  }

  /* ── 1. Большая кнопка «neon-btn» с mailto ──────────────────────── */
  function patchCollabButton() {
    document.querySelectorAll('a.neon-btn[href*="mailto:"]').forEach(function (btn) {
      // Меняем текст спана с email-адресом
      btn.querySelectorAll('span').forEach(function (s) {
        if (s.textContent.indexOf('@') !== -1) s.textContent = 'Написать Евгению';
      });
      btn.removeAttribute('href');
      attachDropdown(btn);
    });
  }

  /* ── 2. Nav-дропдаун: «Написать на email» → три ссылки ─────────── */
  function patchNavItem() {
    var nav = document.querySelector('.site-nav');
    if (!nav) return;

    nav.querySelectorAll('a[href*="mailto:"]').forEach(function (oldLink) {
      var container = oldLink.parentNode;
      ITEMS.forEach(function (item) {
        var a = document.createElement('a');
        a.href = item.href;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'ev-nav-link';
        a.innerHTML =
          '<span>' + item.label + '</span>' +
          '<span class="ev-nav-arr">→</span>';
        container.insertBefore(a, oldLink);
      });
      oldLink.remove();
    });
  }

  /* ── 3. Кружок Email → кружок Max ──────────────────────────────── */
  function patchEmailCircle() {
    document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
      if (a.classList.contains('neon-btn')) return; // уже обработано выше
      // Заменяем иконку ✉ → М, подпись Email → Max
      a.querySelectorAll('div, span').forEach(function (el) {
        if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
          var t = el.textContent.trim();
          if (t === '✉') el.textContent = 'М';
          if (t === 'Email') el.textContent = 'Max';
        }
      });
      a.href = MAX;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    });
  }

  /* ── 4. Убрать три кружка (Max/Telegram/Instagram) в #collab ───── */
  function patchRemoveCircles() {
    var collab = document.getElementById('collab');
    if (!collab) return;
    // Ищем по уникальному instagram-линку внутри collab
    var instLink = collab.querySelector('a[href*="instagram.com"]');
    if (!instLink) return;
    // Родитель — flex-контейнер со всеми тремя кружками
    var container = instLink.parentNode;
    if (container) container.style.display = 'none';
  }

  /* ── Запуск после рендера React ─────────────────────────────────── */
  function patch() {
    patchCollabButton();
    patchNavItem();
    patchEmailCircle();
    patchRemoveCircles();
  }

  function waitForReact() {
    if (document.querySelector('footer') && document.querySelector('.neon-btn')) {
      patch();
      return;
    }
    var observer = new MutationObserver(function () {
      if (document.querySelector('footer') && document.querySelector('.neon-btn')) {
        observer.disconnect();
        patch();
      }
    });
    observer.observe(document.body || document.documentElement,
      { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForReact);
  } else {
    waitForReact();
  }
})();
