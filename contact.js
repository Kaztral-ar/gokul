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

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const GOOGLE_APPS_SCRIPT_ENDPOINT = 'https://script.google.com/macros/s/REPLACE_WITH_DEPLOYMENT_ID/exec';
const hasConfiguredEmailEndpoint =
  GOOGLE_APPS_SCRIPT_ENDPOINT && !GOOGLE_APPS_SCRIPT_ENDPOINT.includes('REPLACE_WITH_DEPLOYMENT_ID');

function openMailClientFallback(name, email, message) {
  const subject = encodeURIComponent('New Message from Kaztral Portfolio');
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nMessage:\n${message}`);
  window.location.href = `mailto:Kaztralgaming@gmail.com?subject=${subject}&body=${body}`;
}

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

    if (!hasConfiguredEmailEndpoint) {
      openMailClientFallback(name, email, message);
      formStatus.textContent = 'No email gateway is configured yet. Your email app was opened instead.';
      return;
    }

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
      openMailClientFallback(name, email, message);
      formStatus.textContent = 'Unable to send from the web form right now. Your email app was opened as a fallback.';
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
      }
    }
  });
}

const year = document.getElementById('year');
if (year) {
  year.textContent = String(new Date().getFullYear());
}
