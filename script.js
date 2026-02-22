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
const roles = ['Full-Stack Engineer', 'Automation Architect', 'Product-Focused Builder'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function runTyping() {
  if (!typingText) return;

  const role = roles[roleIndex];

  if (!isDeleting) {
    charIndex += 1;
    typingText.textContent = role.slice(0, charIndex);
    if (charIndex === role.length) {
      isDeleting = true;
      setTimeout(runTyping, 1200);
      return;
    }
  } else {
    charIndex -= 1;
    typingText.textContent = role.slice(0, charIndex);

    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(runTyping, isDeleting ? 45 : 75);
}

runTyping();

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

// Garage filters
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    projectCards.forEach((card) => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.style.display = match ? '' : 'none';
    });
  });
});

// Contact success message
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm && formSuccess) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    formSuccess.textContent = 'Signal received. I will get back to you shortly.';
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
