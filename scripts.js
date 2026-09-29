const clock = document.getElementById('clock');

function updateClock() {
  if (!clock) return;

  const value = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date());

  clock.textContent = value + ' IST';
}

updateClock();
window.setInterval(updateClock, 30000);

const menuButton = document.querySelector('.nav-toggle');
const sidebar = document.querySelector('.sidebar');
const scrim = document.querySelector('.sidebar-scrim');

function setMenu(open) {
  if (!menuButton || !sidebar || !scrim) return;
  menuButton.setAttribute('aria-expanded', String(open));
  sidebar.classList.toggle('open', open);
  scrim.classList.toggle('open', open);
}

if (menuButton && sidebar && scrim) {
  menuButton.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  scrim.addEventListener('click', () => setMenu(false));

  sidebar.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });
}

const panels = Array.from(document.querySelectorAll('.tab-panel'));
const tabLinks = Array.from(document.querySelectorAll('[data-tab]'));
const panelIds = new Set(panels.map((panel) => panel.id));

function activatePanel(id) {
  const safeId = panelIds.has(id) ? id : 'home';

  panels.forEach((panel) => {
    const active = panel.id === safeId;
    panel.classList.toggle('active', active);
    panel.setAttribute('aria-hidden', String(!active));
  });

  tabLinks.forEach((link) => {
    const active = link.dataset.tab === safeId;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

if (panels.length) {
  tabLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const id = link.dataset.tab;
      activatePanel(id);

      if (window.location.hash !== '#' + id) {
        window.history.pushState(null, '', '#' + id);
      }
    });
  });

  window.addEventListener('hashchange', () => {
    activatePanel(window.location.hash.slice(1));
  });

  window.addEventListener('popstate', () => {
    activatePanel(window.location.hash.slice(1));
  });

  activatePanel(window.location.hash.slice(1));
}
