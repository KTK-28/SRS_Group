// Navigation & Mobile Drawer
const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.main-nav');
if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

// Sticky Header Docked State
const siteHeader = document.querySelector('.site-header');
if (siteHeader) {
  const updateNavigation = () => siteHeader.classList.toggle('nav-docked', window.scrollY > 90);
  window.addEventListener('scroll', updateNavigation, { passive: true });
  updateNavigation();
}

// Scroll-triggered Reveal Animations
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('shown');
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(item => revealObserver.observe(item));

// "Who We Are" Interactive 3D Card Stack (Click to swap & auto-cycle)
const introVisual = document.querySelector('.showcase-intro-visual');
if (introVisual) {
  const visualImgs = Array.from(introVisual.querySelectorAll('img'));
  let activeVisualIdx = 1; // Default center image is active
  let visualTimer = null;

  const updateVisualStack = () => {
    const total = visualImgs.length;
    visualImgs.forEach((img, idx) => {
      img.classList.remove('pos-left', 'pos-center', 'pos-right');
      const offset = (idx - activeVisualIdx + total) % total;
      if (offset === 0) {
        img.classList.add('pos-center');
      } else if (offset === 1) {
        img.classList.add('pos-right');
      } else {
        img.classList.add('pos-left');
      }
    });
  };

  const startVisualTimer = () => {
    clearInterval(visualTimer);
    visualTimer = setInterval(() => {
      activeVisualIdx = (activeVisualIdx + 1) % visualImgs.length;
      updateVisualStack();
    }, 4000);
  };

  visualImgs.forEach((img, idx) => {
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      activeVisualIdx = idx;
      updateVisualStack();
      startVisualTimer();
    });
  });

  introVisual.addEventListener('mouseenter', () => clearInterval(visualTimer));
  introVisual.addEventListener('mouseleave', () => startVisualTimer());

  updateVisualStack();
  startVisualTimer();
}

// Featured Villas Expanding Accordion Gallery
const cards = [...document.querySelectorAll('.feature-card')];
if (cards.length > 0) {
  let selectedIndex = 0;
  const selectProperty = (index) => {
    selectedIndex = (index + cards.length) % cards.length;
    cards.forEach((card, idx) => {
      const isActive = idx === selectedIndex;
      card.classList.toggle('active', isActive);
      card.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });
  };

  cards.forEach(card => {
    card.addEventListener('click', () => selectProperty(Number(card.dataset.index)));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectProperty(Number(card.dataset.index));
      }
    });
  });

  document.querySelectorAll('.featured-controls button').forEach(button => {
    button.addEventListener('click', () => {
      selectProperty(selectedIndex + Number(button.dataset.move));
    });
  });
}

// Interactive Villa Room Tour
const rooms = [
  { name: 'Living room', file: 'living-room.png', copy: 'A generous, light-filled place to gather, relax and make everyday memories.' },
  { name: 'Bedroom', file: 'bedroom.png', copy: 'A private retreat finished in warm natural textures and calm, considered light.' },
  { name: 'Kitchen', file: 'kitchen.png', copy: 'A refined social kitchen, designed for everyday ease and unhurried family meals.' },
  { name: 'First floor', file: 'first-floor.png', copy: 'An open gallery space that brings light, quiet and connection across both levels.' },
  { name: 'Terrace', file: 'terrace.png', copy: 'A private open-air setting for golden evenings and beautiful Jodhpur views.' }
];

const tourImage = document.querySelector('#tour-image');
const tourVisual = document.querySelector('.tour-visual');
const tourCaption = document.querySelector('.tour-caption');
const tourItems = [...document.querySelectorAll('.tour-item')];

if (tourImage && tourVisual && tourCaption && tourItems.length > 0) {
  tourItems.forEach(item => {
    item.addEventListener('click', () => {
      const index = Number(item.dataset.index);
      const room = rooms[index];
      if (item.classList.contains('active')) return;

      tourItems.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      item.classList.add('active');
      item.setAttribute('aria-selected', 'true');

      tourVisual.classList.add('is-changing');
      setTimeout(() => {
        tourImage.src = `assets/${room.file}`;
        tourImage.alt = `Sai Aashiyana ${room.name}`;
        tourCaption.querySelector('span').textContent = `0${index + 1} / 05`;
        tourCaption.querySelector('h3').textContent = room.name;
        tourCaption.querySelector('p').textContent = room.copy;
        tourVisual.classList.remove('is-changing');
      }, 220);
    });
  });
}

// Site Visit Booking Form Submission Handler (Web3Forms In-Page Submission)
// You can paste your free Access Key from https://web3forms.com below or in index.html (line 310)
const WEB3FORMS_ACCESS_KEY = "YOUR_ACCESS_KEY_HERE";

const visitForm = document.querySelector('#visit-form');
const formSuccess = document.querySelector('#form-success');
const formError = document.querySelector('#form-error');

if (visitForm && formSuccess) {
  visitForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = visitForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Confirm Booking Request <span>↗</span>';

    if (formError) formError.style.display = 'none';
    formSuccess.style.display = 'none';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending request...';
    }

    const formData = new FormData(visitForm);
    let key = formData.get('access_key');
    if ((!key || key === 'YOUR_ACCESS_KEY_HERE') && WEB3FORMS_ACCESS_KEY !== 'YOUR_ACCESS_KEY_HERE') {
      formData.set('access_key', WEB3FORMS_ACCESS_KEY);
      key = WEB3FORMS_ACCESS_KEY;
    }

    // Inform user if access key hasn't been set yet
    if (!key || key === 'YOUR_ACCESS_KEY_HERE') {
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
        if (formError) {
          formError.innerHTML = '⚠️ <strong>Almost ready:</strong> Please paste your free Access Key from <a href="https://web3forms.com" target="_blank" rel="noopener" style="color: #fff; text-decoration: underline;">web3forms.com</a> into <code>index.html</code> (line 310) or <code>script.js</code> (line 109) to receive email notifications.';
          formError.style.display = 'block';
        }
      }, 400);
      return;
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (response.status === 200 && data.success) {
        visitForm.reset();
        formSuccess.style.display = 'block';
        setTimeout(() => {
          formSuccess.style.display = 'none';
        }, 9000);
      } else {
        throw new Error(data.message || 'Submission was not accepted');
      }
    } catch (err) {
      if (formError) {
        formError.innerHTML = `⚠️ Notice: ${err.message}. You can also reach us directly at <a href="tel:+917229977443" style="color: #fff; text-decoration: underline;">+91 72299 77443</a>.`;
        formError.style.display = 'block';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    }
  });
}

// Direct Booking via WhatsApp Handler
const btnWhatsAppBook = document.querySelector('#btn-whatsapp-book');
if (btnWhatsAppBook && visitForm) {
  btnWhatsAppBook.addEventListener('click', () => {
    const nameInput = document.querySelector('#lead-name');
    const phoneInput = document.querySelector('#lead-phone');
    const dateInput = document.querySelector('#lead-date');
    const timeInput = document.querySelector('#lead-time');
    const messageInput = document.querySelector('#lead-message');

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const date = dateInput ? dateInput.value : '';
    const time = timeInput ? timeInput.value : '';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name) {
      if (nameInput) {
        nameInput.focus();
        nameInput.reportValidity();
      }
      return;
    }

    if (!phone) {
      if (phoneInput) {
        phoneInput.focus();
        phoneInput.reportValidity();
      }
      return;
    }

    let text = `Hello Sai Aashiyana, I would like to schedule a site visit!%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}`;
    if (date) text += `%0A*Preferred Date:* ${encodeURIComponent(date)}`;
    if (time) text += `%0A*Preferred Time:* ${encodeURIComponent(time)}`;
    if (message) text += `%0A*Note:* ${encodeURIComponent(message)}`;

    const waUrl = `https://wa.me/917229977443?text=${text}`;
    window.open(waUrl, '_blank');

    if (formSuccess) {
      const originalText = formSuccess.innerHTML;
      formSuccess.innerHTML = '✓ Opening WhatsApp with your booking details...';
      formSuccess.style.display = 'block';
      setTimeout(() => {
        formSuccess.style.display = 'none';
        formSuccess.innerHTML = originalText;
      }, 7000);
    }
  });
}

// Logo Click: Return to Home & Smooth Scroll to Top
document.querySelectorAll('a.brand').forEach(brandLink => {
  brandLink.addEventListener('click', (e) => {
    const isHomePage = window.location.pathname.endsWith('index.html') || 
                       window.location.pathname === '/' || 
                       window.location.pathname.endsWith('/');
    if (isHomePage) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (history.pushState) {
        history.pushState(null, null, window.location.pathname);
      }
    }
  });
});

// Floating Scroll To Top Button Handler
const scrollTopBtn = document.querySelector('#scroll-to-top');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 320) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


