const contents = document.querySelector('.article-contents');

if (contents) {
  const disclosure = contents.querySelector('details');
  const links = Array.from(contents.querySelectorAll('a[href^="#"]'));
  const sections = links.map((link) => ({
    link,
    heading: document.getElementById(link.hash.slice(1))
  })).filter((section) => section.heading);
  const compact = window.matchMedia('(max-width: 1200px)');
  let navigationTarget = null;
  let navigationScrollY = null;

  function setContentsLayout() {
    disclosure.open = !compact.matches;
  }

  setContentsLayout();
  compact.addEventListener('change', setContentsLayout);

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      if (compact.matches) disclosure.open = false;
      navigationTarget = sections.find((section) => section.link === link);
      navigationScrollY = null;
      scheduleUpdate();
    });
  });

  let pending = false;

  function updateCurrentSection() {
    pending = false;
    let current = sections[0];
    const offset = window.matchMedia('(max-width: 900px)').matches ? 90 : 44;

    for (const section of sections) {
      if (section.heading.getBoundingClientRect().top > offset) break;
      current = section;
    }

    const atBottom = window.scrollY > 0 &&
      Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 2;
    if (atBottom) current = sections[sections.length - 1];

    // A short final section may not reach the top when its anchor is followed.
    // Keep that link selected until the reader scrolls away from the destination.
    if (navigationTarget) {
      if (navigationScrollY === null) navigationScrollY = window.scrollY;
      if (Math.abs(window.scrollY - navigationScrollY) <= 1) current = navigationTarget;
      else navigationTarget = null;
    }

    sections.forEach((section) => {
      if (section === current) section.link.setAttribute('aria-current', 'location');
      else section.link.removeAttribute('aria-current');
    });
  }

  function scheduleUpdate() {
    if (pending) return;
    pending = true;
    window.requestAnimationFrame(updateCurrentSection);
  }

  function followHash() {
    navigationTarget = sections.find((section) => section.link.hash === window.location.hash);
    navigationScrollY = null;
    scheduleUpdate();
  }

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('hashchange', followHash);
  window.addEventListener('load', followHash);
  updateCurrentSection();
}
