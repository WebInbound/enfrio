const revealItems = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -42px 0px'
  }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 22, 260)}ms`;
  observer.observe(item);
});

const topbar = document.querySelector('.topbar');
const progress = document.querySelector('.scroll-progress');

function onScroll() {
  const y = window.scrollY || document.documentElement.scrollTop;

  if (topbar) {
    topbar.classList.toggle('is-solid', y > 36);
  }

  if (progress) {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const ratio = max > 0 ? y / max : 0;
    progress.style.transform = `scaleX(${Math.min(Math.max(ratio, 0), 1)})`;
  }

  const heroImg = document.querySelector('.page-hero-media img');
  if (heroImg) {
    const zoom = Math.min(y / 1800, 0.05);
    heroImg.style.transform = `scale(${1 + zoom})`;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const page = document.body.getAttribute('data-page');
if (page) {
  document.querySelectorAll('[data-nav]').forEach((link) => {
    if (link.getAttribute('data-nav') === page) {
      link.classList.add('active');
    }
  });
}

const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const interactiveCards = document.querySelectorAll('.card, .panel, .stat, .info, .contact-item, .cta, .process-step');
interactiveCards.forEach((card) => {
  card.classList.add('interactive');

  card.addEventListener('pointermove', (event) => {
    const r = card.getBoundingClientRect();
    const x = event.clientX - r.left;
    const y = event.clientY - r.top;
    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
  });
});

const menuBtn = document.querySelector('.menu-toggle');
const menuWrap = document.querySelector('.topbar');
const menuNav = document.getElementById('site-menu');

function closeMenu() {
  if (!menuBtn || !menuWrap) return;
  menuWrap.classList.remove('menu-open');
  document.body.classList.remove('menu-opened');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.setAttribute('aria-label', 'Open menu');
}

if (menuBtn && menuWrap && menuNav) {
  menuBtn.addEventListener('click', () => {
    const open = menuWrap.classList.toggle('menu-open');
    document.body.classList.toggle('menu-opened', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  menuNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) closeMenu();
  });

  document.addEventListener('click', (event) => {
    if (!menuWrap.contains(event.target)) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

const processSteps = document.querySelectorAll('.process-step[data-image]');
const processImages = document.querySelectorAll('.process-visual img[data-id]');

function activateProcess(id) {
  processSteps.forEach((step) => {
    step.classList.toggle('active', step.getAttribute('data-image') === id);
  });

  processImages.forEach((img) => {
    img.classList.toggle('active', img.getAttribute('data-id') === id);
  });
}

if (processSteps.length && processImages.length) {
  processSteps.forEach((step) => {
    step.addEventListener('mouseenter', () => activateProcess(step.getAttribute('data-image')));
    step.addEventListener('focus', () => activateProcess(step.getAttribute('data-image')));
    step.addEventListener('click', () => activateProcess(step.getAttribute('data-image')));
  });
}

const wowBlocks = document.querySelectorAll('[data-wow]');

wowBlocks.forEach((block) => {
  const items = block.querySelectorAll('.wow-item[data-id]');
  const images = block.querySelectorAll('.wow-media img[data-id]');
  if (!items.length || !images.length) return;

  let index = 0;
  let timer = null;

  function activateByIndex(i) {
    index = (i + items.length) % items.length;
    const id = items[index].getAttribute('data-id');

    items.forEach((item) => {
      item.classList.toggle('active', item.getAttribute('data-id') === id);
    });

    images.forEach((img) => {
      img.classList.toggle('active', img.getAttribute('data-id') === id);
    });
  }

  function next() {
    activateByIndex(index + 1);
  }

  function start() {
    stop();
    timer = setInterval(next, 3600);
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      activateByIndex(i);
      start();
    });
    item.addEventListener('mouseenter', () => {
      activateByIndex(i);
      stop();
    });
    item.addEventListener('mouseleave', start);
  });

  block.addEventListener('mouseenter', stop);
  block.addEventListener('mouseleave', start);

  activateByIndex(0);
  start();
});

function classifyImageRatios() {
  const images = document.querySelectorAll('.page-hero-media img, .photo-card img, .editorial-rail img, .media img, .dominant-cluster img, .wow-media img, .madrid-auto img');

  images.forEach((img) => {
    const applyRatioClass = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      if (!w || !h) return;

      const ratio = w / h;
      let ratioClass = 'ratio-standard';
      if (ratio < 1.1) ratioClass = 'ratio-portrait';
      if (ratio > 1.72) ratioClass = 'ratio-wide';

      img.classList.remove('ratio-portrait', 'ratio-standard', 'ratio-wide');
      img.classList.add(ratioClass);

      const frame = img.closest('.auto-lux-card, .photo-card, .editorial-rail figure, .panel.media, .madrid-auto .photo-card');
      if (frame) {
        frame.classList.remove('ratio-portrait', 'ratio-standard', 'ratio-wide');
        frame.classList.add(ratioClass);
      }
    };

    if (img.complete) {
      applyRatioClass();
    } else {
      img.addEventListener('load', applyRatioClass, { once: true });
    }
  });
}

classifyImageRatios();

