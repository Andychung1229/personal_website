"use strict";
(() => {
  const $ = (id) => document.getElementById(id);
  const routeButtons = [...document.querySelectorAll('[data-route]')];
  routeButtons.forEach(button => button.addEventListener('click', () => {
    const extended = button.dataset.route === 'extended';
    routeButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    $('city-count').textContent = extended ? '4 CITIES' : '3 CITIES';
    $('salzburg-map').setAttribute('visibility', extended ? 'visible' : 'hidden');
    $('return-route').setAttribute('d', extended ? 'M98 97L215 218Q360 323 510 228' : 'M98 97Q297 355 510 228');
    $('map-title').textContent = `路線示意：布達佩斯往維也納，再到慕尼黑${extended ? '，再經薩爾斯堡' : ''}，最後返回布達佩斯。非按比例地圖。`;
    $('route-description').textContent = extended ? '適合多一至兩晚：慕尼黑 → 薩爾斯堡 → 維也納方向 → 布達佩斯。先核對返程餘裕。' : '較簡單嘅版本：布達佩斯 → 維也納 → 慕尼黑 → 布達佩斯。返程車次另按日期核對。';
    $('last-number').textContent = extended ? '04' : '↩';
    $('last-city').textContent = extended ? '薩爾斯堡，再回程' : '返程前回到布達佩斯';
    $('last-description').textContent = extended ? '11 月 1 日起可考慮加一至兩晚山城；經維也納方向返布達佩斯，未必要再喺維也納住一晚。' : '預留國際航班前一晚喺布達佩斯，減低長途火車延誤影響接機嘅風險。';
  }));
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  function selectTab(tab, focus = false) {
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      $(item.getAttribute('aria-controls')).hidden = !selected;
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', event => {
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      selectTab(tabs[next], true);
    });
  });
  const boxes = [...document.querySelectorAll('[data-task]')];
  const storageKey = 'europe-guide-checklist-v1';
  function storageError() { $('storage-note').textContent = '本機資料讀取或儲存失敗，今次勾選未必可以保留。'; }
  function updateChecks() {
    const selected = boxes.filter(box => box.checked);
    $('check-count').textContent = `${selected.length} / ${boxes.length}`;
    $('check-progress').style.width = `${selected.length / boxes.length * 100}%`;
    boxes.forEach(box => box.closest('label').classList.toggle('checked', box.checked));
    return selected.map(box => box.dataset.task);
  }
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (!Array.isArray(saved)) throw new Error('Invalid checklist data');
    boxes.forEach(box => { box.checked = saved.includes(box.dataset.task); });
  } catch { storageError(); }
  updateChecks();
  boxes.forEach(box => box.addEventListener('change', () => {
    const selected = updateChecks();
    try { localStorage.setItem(storageKey, JSON.stringify(selected)); } catch { storageError(); }
  }));
  const menu = $('menu-toggle');
  function closeMenu() {
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', '開啟導覽');
    menu.textContent = '☰';
    $('main-navigation').classList.remove('nav-open');
  }
  menu.addEventListener('click', () => {
    if (menu.getAttribute('aria-expanded') === 'true') return closeMenu();
    menu.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-label', '關閉導覽');
    menu.textContent = '×';
    $('main-navigation').classList.add('nav-open');
  });
  document.querySelectorAll('#main-navigation a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
  $('print-guide').addEventListener('click', () => window.print());
})();
