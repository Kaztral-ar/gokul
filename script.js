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
    activateHeroCodeBackground();
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
  window.setTimeout(activateHeroCodeBackground, 220);
}

runLoaderSequence();

const heroCodeBg = document.getElementById('heroCodeBg');
const heroCodePre = document.getElementById('heroCodePre');

const heroCodeSnippets = [
  "const buildSession = await bootstrap({ env: 'prod', cache: true });",
  "if (!response.ok) throw new Error(`API ${response.status}: retrying...`);",
  "git checkout -b feat/hero-bg && git commit -m \"chore: refine hero motion\"",
  "curl -s https://api.kaztral.dev/v1/status | jq '.uptime,.region'",
  'npm run lint && npm run test:smoke',
  '[INFO] 14:22:11 websocket connected :: user=kaztral latency=31ms',
  'docker compose up -d gateway worker redis',
  'SELECT service, health, latency_ms FROM runtime_metrics ORDER BY latency_ms ASC;',
  "for branch in $(git branch --format='%(refname:short)'); do echo \"sync:$branch\"; done",
  "fetch('/api/deploy', { method: 'POST', body: JSON.stringify(payload) });",
  '[WARN] auth.refresh token nearing expiry; rotating credentials',
  "ssh prod-node-03 'journalctl -u edge-proxy -n 25 --no-pager'",
  'const queueDepth = metrics.jobs.pending + metrics.jobs.retry;',
  'rsync -az --delete ./dist/ deploy@edge:/srv/www/kaztral/',
  'git log --oneline --decorate --graph -n 12',
  '[TRACE] request_id=8f42d route=/signal method=POST status=202',
  'pnpm dlx playwright test --project=chromium',
  "watch -n 2 'kubectl get pods -n kaztral-stack'",
  'const latencyBudgetMs = 120; // SLO guardrail',
  'bash deploy.sh --region=ap-southeast --canary=15',
  '[API] GET /v1/projects -> 200 (cache hit, 12ms)',
  'git rebase origin/main --rebase-merges',
  'const fallback = primary ?? secondary ?? emergencyMirror;',
  'tar -czf backups/session-$(date +%F-%H%M).tgz ./logs ./config'
];

function randomCodeLine() {
  const randomSnippet = heroCodeSnippets[Math.floor(Math.random() * heroCodeSnippets.length)];
  const pad = ' '.repeat(Math.floor(Math.random() * 14));
  const prefix = Math.random() > 0.5 ? '$ ' : '> ';
  return `${pad}${prefix}${randomSnippet}`;
}

function generateHeroCodeBackground() {
  if (!heroCodePre) return;

  const lineCount = Math.floor(Math.random() * 41) + 80;
  const lines = Array.from({ length: lineCount }, randomCodeLine);
  heroCodePre.textContent = lines.join('\n');
}

function activateHeroCodeBackground() {
  if (!heroCodeBg || !heroCodePre) return;

  generateHeroCodeBackground();

  window.requestAnimationFrame(() => {
    heroCodeBg.classList.add('active');
  });
}

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

// About terminal typing effect
const aboutTerminal = document.getElementById('aboutTerminal');

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function writeTypeLine(element, text, speed = 22) {
  return new Promise((resolve) => {
    let i = 0;
    element.classList.add('is-typing');

    function step() {
      element.textContent = text.slice(0, i);
      i += 1;

      if (i <= text.length) {
        window.setTimeout(step, speed);
      } else {
        element.classList.remove('is-typing');
        resolve();
      }
    }

    step();
  });
}

async function runAboutSequence() {
  if (!aboutTerminal) return;

  const loadingLine = aboutTerminal.querySelector('.about-accent');
  const profileLines = Array.from(aboutTerminal.querySelectorAll('.about-line'));
  const profileContainer = aboutTerminal.querySelector('.about-lines');

  if (!loadingLine || !profileContainer || profileLines.length === 0) return;

  loadingLine.textContent = '';
  profileContainer.classList.remove('is-visible');

  await writeTypeLine(loadingLine, loadingLine.dataset.typeLine || '', 30);

  await wait(1150);

  loadingLine.classList.add('is-clearing');
  await wait(220);
  loadingLine.textContent = '';
  loadingLine.classList.remove('is-clearing');

  await wait(160);
  profileContainer.classList.add('is-visible');

  for (const line of profileLines) {
    line.textContent = '';
    await writeTypeLine(line, line.dataset.typeLine || '', 20);
    await wait(120);
  }
}

if (aboutTerminal) {
  const aboutObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && aboutTerminal.dataset.typingActive !== 'true') {
          aboutTerminal.dataset.typingActive = 'true';
          runAboutSequence();
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

// Core capabilities stacked swipe deck
const capabilitiesDeck = document.getElementById('capabilitiesDeck');

if (capabilitiesDeck) {
  const capabilityCards = Array.from(capabilitiesDeck.querySelectorAll('.arsenal-card'));
  let activeIndex = 0;
  let deckLocked = false;
  let touchStartY = 0;
  let isDeckInteracting = false;

  function setDeckLockState(locked) {
    if (isDeckInteracting === locked) return;
    isDeckInteracting = locked;
    document.body.classList.toggle('deck-interacting', locked);
  }

  function paintDeck() {
    capabilityCards.forEach((card, index) => {
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
    if (nextIndex < 0 || nextIndex >= capabilityCards.length) return false;

    deckLocked = true;
    activeIndex = nextIndex;
    paintDeck();

    window.setTimeout(() => {
      deckLocked = false;
    }, 520);

    return true;
  }

  paintDeck();

  capabilitiesDeck.addEventListener('pointerenter', () => setDeckLockState(true));
  capabilitiesDeck.addEventListener('pointerleave', () => setDeckLockState(false));
  capabilitiesDeck.addEventListener('touchstart', () => setDeckLockState(true), { passive: true });
  capabilitiesDeck.addEventListener('touchend', () => setDeckLockState(false), { passive: true });
  capabilitiesDeck.addEventListener('touchcancel', () => setDeckLockState(false), { passive: true });

  capabilitiesDeck.addEventListener(
    'wheel',
    (event) => {
      if (Math.abs(event.deltaY) < 5) return;

      const moved = event.deltaY > 0 ? shiftDeck(1) : shiftDeck(-1);
      event.preventDefault();
      if (!moved) return;
    },
    { passive: false }
  );

  capabilitiesDeck.addEventListener(
    'touchstart',
    (event) => {
      touchStartY = event.touches[0].clientY;
    },
    { passive: true }
  );

  capabilitiesDeck.addEventListener(
    'touchmove',
    (event) => {
      const delta = touchStartY - event.touches[0].clientY;
      if (Math.abs(delta) < 30) {
        event.preventDefault();
        return;
      }

      const moved = delta > 0 ? shiftDeck(1) : shiftDeck(-1);
      if (moved) {
        touchStartY = event.touches[0].clientY;
      }

      event.preventDefault();
    },
    { passive: false }
  );

  const deckVisibilityObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          setDeckLockState(false);
        }
      });
    },
    { threshold: 0.05 }
  );

  deckVisibilityObserver.observe(capabilitiesDeck);
}

// Projects clean two-sided flip cards
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach((card) => {
  const toggleFlip = () => {
    card.classList.toggle('flipped');
  };

  card.addEventListener('click', (event) => {
    if (event.target.closest('a, button')) return;
    toggleFlip();
  });

  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleFlip();
    }
  });
});

// Contact form email delivery via Google Apps Script
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const GOOGLE_APPS_SCRIPT_ENDPOINT = 'https://script.google.com/macros/s/REPLACE_WITH_DEPLOYMENT_ID/exec';

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    formStatus.textContent = '';

    if (!name || !email || !message) {
      formStatus.textContent = 'Please complete all fields before sending.';
      return;
    }

    const payload = {
      to: 'Kaztralgaming@gmail.com',
      subject: 'New Message from Kaztral Portfolio',
      body: `Name: ${name}
Email: ${email}
Message:
${message}`,
      name,
      email,
      message
    };

    try {
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
      }

      const response = await fetch(GOOGLE_APPS_SCRIPT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.status}`);
      }

      formStatus.textContent = 'Message sent successfully. Kaztral will reply soon.';
      contactForm.reset();
    } catch {
      formStatus.textContent = 'Unable to send message right now. Please try again shortly.';
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
      }
    }
  });
}

// Footer year
const year = document.getElementById('year');
if (year) {
  year.textContent = String(new Date().getFullYear());
}
