// Mobile navigation toggle
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
}

// Show a labelled frame for any photo that hasn't been added to images/ yet
document.querySelectorAll('.photo img').forEach((img) => {
  const markMissing = () => {
    img.parentElement.classList.add('is-missing');
    img.parentElement.dataset.src = img.getAttribute('src');
  };
  if (img.complete && img.naturalWidth === 0) {
    markMissing();
  } else {
    img.addEventListener('error', markMissing);
  }
});

// Gently fade sections in as they scroll into view (skipped when the visitor prefers reduced motion)
const revealTargets = document.querySelectorAll(
  '.section-title, .collection, .menu-item, .split > *, .statement, .cta, .intro, .form-wrap'
);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger items that sit side by side in a grid
    if (el.matches('.collection, .menu-item')) {
      el.style.transitionDelay = `${(i % 3) * 90}ms`;
    }
    observer.observe(el);
  });
}

// Remember the customer's first name so the thank-you page can greet them
const orderForm = document.querySelector('.form');
if (orderForm) {
  orderForm.addEventListener('submit', () => {
    const name = (orderForm.elements.name?.value || '').trim().split(/\s+/)[0].slice(0, 30);
    try {
      sessionStorage.setItem('sugarloopName', name);
    } catch (e) {
      // Storage unavailable (private mode); the generic thank-you is shown instead
    }
  });
}

const thanksHeading = document.getElementById('thanks-heading');
if (thanksHeading) {
  let name = '';
  try {
    name = sessionStorage.getItem('sugarloopName') || '';
    sessionStorage.removeItem('sugarloopName');
  } catch (e) {
    // Storage unavailable; keep the generic heading
  }
  if (name) {
    thanksHeading.textContent = `Thank you, ${name}! \u{1F90D}`;
  }
}

// Footer year
const year = document.getElementById('year');
if (year) {
  year.textContent = new Date().getFullYear();
}
