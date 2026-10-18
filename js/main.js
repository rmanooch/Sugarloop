// Mobile navigation toggle
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.innerHTML = open ? '&#10005;' : '&#9776;';
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

// Footer year
const year = document.getElementById('year');
if (year) {
  year.textContent = new Date().getFullYear();
}
