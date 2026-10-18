// Mobile navigation toggle
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

// Footer year
const year = document.getElementById('year');
if (year) {
  year.textContent = new Date().getFullYear();
}
