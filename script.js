// Initial terminal loader
const loaderOverlay = document.getElementById('loaderOverlay');
const pageContent = document.getElementById('pageContent');

function typeLoaderLine(element, text, speed = 40) {
  return new Promise((resolve) => {
    let i = 0;

    function step() {
      element.textContent = text.slice(0, i);
      i += 1;
      if (i <= text.length) {
        window.setTimeout(step, speed);
      } else {
        resolve();
      }
    }

    step();
  });
}

async function runLoaderSequence() {
  if (!loaderOverlay || !pageContent) {
    document.body.classList.add('loaded');
    return;
  }

  const loaderLines = loaderOverlay.querySelectorAll('[data-loader-line]');

  for (const line of loaderLines) {
    const text = line.dataset.loaderLine || '';
    await typeLoaderLine(line, text, 34);
    await new Promise((resolve) => window.setTimeout(resolve, 180));
  }

  await new Promise((resolve) => window.setTimeout(resolve, 1000));
  loaderOverlay.classList.add('hidden');
  document.body.classList.add('loaded');
}

runLoaderSequence();

// Mobile navigation
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navMenu.classList.toggle('open');
  });

  navMenu.addEventListener('click', (event) => {
    if (event.target.classList.contains('nav-link')) {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Typing effect
const typingText = document.getElementById('typingText');
const roles = ['Developer | Web Designer | Bash Tool Builder'];
let charIndex = 0;
let isDeleting = false;

function runTyping() {
  if (!typingText) return;

  const role = roles[0];

  if (!isDeleting) {
    charIndex += 1;
    typingText.textContent = role.slice(0, charIndex);
    if (charIndex === role.length) {
      isDeleting = true;
      setTimeout(runTyping, 1300);
      return;
    }
  } else {
    charIndex -= 1;
    typingText.textContent = role.slice(0, charIndex);

    if (charIndex === 0) {
      isDeleting = false;
    }
  }

  setTimeout(runTyping, isDeleting ? 28 : 52);
}

runTyping();

// About terminal typing effect
const aboutTerminal = document.getElementById('aboutTerminal');

function typeLine(element, text, speed = 24) {
  return new Promise((resolve) => {
    let i = 0;

    function step() {
      element.textContent = text.slice(0, i);
      i += 1;
      if (i <= text.length) {
        window.setTimeout(step, speed);
      } else {
        element.classList.add('typed');
        resolve();
      }
    }

    step();
  });
}

async function runAboutTyping() {
  if (!aboutTerminal || aboutTerminal.dataset.typed === 'true') return;

  const lines = aboutTerminal.querySelectorAll('[data-type-line]');
  aboutTerminal.dataset.typed = 'true';

  for (const line of lines) {
    await typeLine(line, line.dataset.typeLine || '', 24);
    await new Promise((resolve) => window.setTimeout(resolve, 130));
  }
}

if (aboutTerminal) {
  const aboutObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runAboutTyping();
          aboutObserver.disconnect();
        }
      });
    },
    { threshold: 0.35 }
  );

  aboutObserver.observe(aboutTerminal);
}

// Scroll progress bar
const scrollProgress = document.getElementById('scrollProgress');

function updateProgress() {
  if (!scrollProgress) return;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const progress = height > 0 ? (window.scrollY / height) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
}

window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// Section reveal animation
const revealItems = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => revealObserver.observe(item));

// Active nav highlight
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function setActiveNav() {
  const y = window.scrollY + 140;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');

    if (y >= top && y < bottom) {
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}

window.addEventListener('scroll', setActiveNav, { passive: true });
setActiveNav();


// Arsenal stacked swipe deck
const arsenalDeck = document.getElementById('arsenalDeck');

if (arsenalDeck) {
  const arsenalCards = Array.from(arsenalDeck.querySelectorAll('.arsenal-card'));
  let activeIndex = 0;
  let deckLocked = false;
  let touchStartY = 0;

  function paintDeck() {
    arsenalCards.forEach((card, index) => {
      card.classList.remove('is-active', 'is-prev', 'is-next');

      if (index === activeIndex) {
        card.classList.add('is-active');
      } else if (index < activeIndex) {
        card.classList.add('is-prev');
      } else {
        card.classList.add('is-next');
      }
    });
  }

  function shiftDeck(direction) {
    if (deckLocked) return false;

    const nextIndex = activeIndex + direction;
    if (nextIndex < 0 || nextIndex >= arsenalCards.length) return false;

    deckLocked = true;
    activeIndex = nextIndex;
    paintDeck();

    window.setTimeout(() => {
      deckLocked = false;
    }, 520);

    return true;
  }

  paintDeck();

  arsenalDeck.addEventListener(
    'wheel',
    (event) => {
      if (Math.abs(event.deltaY) < 5) return;

      const moved = event.deltaY > 0 ? shiftDeck(1) : shiftDeck(-1);
      if (moved) {
        event.preventDefault();
      }
    },
    { passive: false }
  );

  arsenalDeck.addEventListener(
    'touchstart',
    (event) => {
      touchStartY = event.touches[0].clientY;
    },
    { passive: true }
  );

  arsenalDeck.addEventListener(
    'touchmove',
    (event) => {
      const delta = touchStartY - event.touches[0].clientY;
      if (Math.abs(delta) < 35) return;

      const moved = delta > 0 ? shiftDeck(1) : shiftDeck(-1);
      if (moved) {
        touchStartY = event.touches[0].clientY;
        event.preventDefault();
      }
    },
    { passive: false }
  );
}

// Contact success message
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm && formSuccess) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    formSuccess.textContent = 'Signal received. Kaztral will respond shortly.';
    contactForm.reset();
    window.setTimeout(() => {
      formSuccess.textContent = '';
    }, 2800);
  });
}

// Footer year
const year = document.getElementById('year');
if (year) {
  year.textContent = String(new Date().getFullYear());
}
