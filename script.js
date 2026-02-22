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

function typeLine(element, text, speed = 30) {
  return new Promise((resolve) => {
    let index = 0;

    function step() {
      element.textContent = text.slice(0, index);
      index += 1;
      if (index <= text.length) {
        window.setTimeout(step, speed);
      } else {
        element.classList.add('typed');
        resolve();
      }
    }

    step();
  });
}

async function runTerminalTyping(containerId, threshold = 0.35) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting && container.dataset.typed !== 'true') {
          container.dataset.typed = 'true';
          const lines = container.querySelectorAll('[data-type-line]');

          for (const line of lines) {
            await typeLine(line, line.dataset.typeLine || '', 28);
            await new Promise((resolve) => window.setTimeout(resolve, 160));
          }

          observer.disconnect();
        }
      });
    },
    { threshold }
  );

  observer.observe(container);
}

runTerminalTyping('heroTerminal', 0.2);
runTerminalTyping('aboutTerminal', 0.35);

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

// Contact success message
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm && formSuccess) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    formSuccess.textContent = 'Signal received. Kaztral will get back to you shortly.';
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
