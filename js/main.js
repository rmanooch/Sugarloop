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
  '.section-title, .collection, .menu-section > *, .cake-gallery .photo, .split > *, .statement, .cta, .intro, .form-wrap'
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
    if (el.matches('.collection, .cake-gallery .photo')) {
      el.style.transitionDelay = `${(i % 4) * 90}ms`;
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

// Photo viewer: tap a menu photo to see the whole, uncropped picture
const zoomable = [...document.querySelectorAll('img[data-full]')];

if (zoomable.length) {
  const viewer = document.createElement('div');
  viewer.className = 'lightbox';
  viewer.setAttribute('role', 'dialog');
  viewer.setAttribute('aria-modal', 'true');
  viewer.setAttribute('aria-label', 'Photo viewer');
  viewer.hidden = true;
  viewer.innerHTML = `
    <button class="lightbox-close" aria-label="Close">&times;</button>
    <button class="lightbox-prev" aria-label="Previous photo">&lsaquo;</button>
    <figure class="lightbox-figure">
      <img class="lightbox-img" alt="">
      <figcaption class="lightbox-caption"></figcaption>
    </figure>
    <button class="lightbox-next" aria-label="Next photo">&rsaquo;</button>`;
  document.body.appendChild(viewer);

  const img = viewer.querySelector('.lightbox-img');
  const caption = viewer.querySelector('.lightbox-caption');
  const closeBtn = viewer.querySelector('.lightbox-close');
  let current = 0;
  let lastFocus = null;

  const show = (i) => {
    current = (i + zoomable.length) % zoomable.length;
    const thumb = zoomable[current];
    img.src = thumb.dataset.full;
    img.alt = thumb.alt;
    caption.textContent = thumb.alt;
  };

  const open = (i) => {
    lastFocus = document.activeElement;
    show(i);
    viewer.hidden = false;
    document.body.classList.add('lightbox-open');
    closeBtn.focus();
  };

  const close = () => {
    viewer.hidden = true;
    document.body.classList.remove('lightbox-open');
    if (lastFocus) {
      lastFocus.focus();
    }
  };

  zoomable.forEach((thumb, i) => {
    const frame = thumb.closest('.photo');
    frame.classList.add('is-zoomable');
    frame.tabIndex = 0;
    frame.setAttribute('role', 'button');
    frame.setAttribute('aria-label', `View larger photo: ${thumb.alt}`);
    frame.addEventListener('click', () => open(i));
    frame.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(i);
      }
    });
  });

  closeBtn.addEventListener('click', close);
  viewer.querySelector('.lightbox-prev').addEventListener('click', () => show(current - 1));
  viewer.querySelector('.lightbox-next').addEventListener('click', () => show(current + 1));
  // Tapping the dark background (not the photo or buttons) closes the viewer
  viewer.addEventListener('click', (e) => {
    if (e.target === viewer || e.target.classList.contains('lightbox-figure')) {
      close();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (viewer.hidden) {
      return;
    }
    if (e.key === 'Escape') {
      close();
    } else if (e.key === 'ArrowLeft') {
      show(current - 1);
    } else if (e.key === 'ArrowRight') {
      show(current + 1);
    }
  });

  // Swipe left or right on phones
  let touchX = null;
  viewer.addEventListener('touchstart', (e) => {
    touchX = e.touches[0].clientX;
  }, { passive: true });
  viewer.addEventListener('touchend', (e) => {
    if (touchX === null) {
      return;
    }
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) {
      show(current + (dx < 0 ? 1 : -1));
    }
    touchX = null;
  });
}

// Share the menu by text, email, social apps or the phone's own share sheet
const shareBox = document.querySelector('.share-menu');
if (shareBox) {
  const pageUrl = 'https://www.sugarloopco.com/cakes.html';
  const imageUrl = 'https://www.sugarloopco.com/images/full/sugarloop-menu.jpg';
  const message = 'Check out the Sugarloop Co menu: custom cakes, cupcakes, baklava and Swiss rolls!';
  const full = `${message} ${pageUrl}`;
  const status = shareBox.querySelector('.share-status');

  const links = {
    sms: `sms:?&body=${encodeURIComponent(full)}`,
    email: `mailto:?subject=${encodeURIComponent('Sugarloop Co menu')}&body=${encodeURIComponent(`${message}\n\nMenu: ${pageUrl}\nMenu picture: ${imageUrl}`)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(full)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
  };
  shareBox.querySelectorAll('[data-share]').forEach((a) => {
    a.href = links[a.dataset.share];
  });

  // Phones: share the menu picture itself through the native share sheet (Messages, Instagram, etc.)
  const nativeBtn = shareBox.querySelector('.share-native');
  if (navigator.share) {
    nativeBtn.hidden = false;
    nativeBtn.addEventListener('click', async () => {
      try {
        const blob = await fetch('images/full/sugarloop-menu.jpg').then((r) => r.blob());
        const file = new File([blob], 'Sugarloop-Co-Menu.jpg', { type: 'image/jpeg' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: 'Sugarloop Co menu', text: full });
        } else {
          await navigator.share({ title: 'Sugarloop Co menu', text: message, url: pageUrl });
        }
      } catch (e) {
        // Share cancelled or unavailable; the other buttons still work
      }
    });
  }

  shareBox.querySelector('.share-copy').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      status.textContent = 'Link copied!';
    } catch (e) {
      status.textContent = pageUrl;
    }
  });
}

// Footer year
const year = document.getElementById('year');
if (year) {
  year.textContent = new Date().getFullYear();
}
