"use strict";
(() => {
  const $ = (id) => document.getElementById(id);
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
