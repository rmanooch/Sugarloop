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

// Inspiration photos: customers can attach a few pictures of treats they love
const MAX_PHOTOS = 3;
const MAX_UPLOAD_BYTES = 9.5 * 1024 * 1024; // FormSubmit accepts up to 10 MB of files per inquiry
const inspirationPhotos = [];
const photoField = document.querySelector('.photo-field');
const photoHint = photoField && photoField.querySelector('.field-hint');
const photoHintText = photoHint ? photoHint.textContent : '';

const setPhotoHint = (text, isError) => {
  if (!photoHint) {
    return;
  }
  photoHint.textContent = text || photoHintText;
  photoHint.classList.toggle('is-error', Boolean(isError));
};

// Phone photos can be several MB each, so large ones are resized to a sharp-enough JPEG before
// sending. If the browser can't read a format (e.g. HEIC outside Safari), the original is sent.
const shrinkPhoto = (file) => new Promise((resolve) => {
  if (file.size < 1.5 * 1024 * 1024 || file.type === 'image/gif') {
    resolve(file);
    return;
  }
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    URL.revokeObjectURL(url);
    const scale = Math.min(1, 2000 / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff'; // transparent PNGs would otherwise turn black as JPEGs
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob || blob.size >= file.size) {
        resolve(file);
        return;
      }
      resolve(new File([blob], `${file.name.replace(/\.[^.]+$/, '') || 'photo'}.jpg`, { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.85);
  };
  img.onerror = () => {
    URL.revokeObjectURL(url);
    resolve(file);
  };
  img.src = url;
});

if (photoField) {
  const picker = photoField.querySelector('input[type=file]');
  const previews = photoField.querySelector('.photo-previews');
  // Without JavaScript the picker posts a single photo itself; here photos are collected
  // in a list instead and attached when the inquiry is sent.
  picker.removeAttribute('name');
  picker.multiple = true;

  const renderPhotos = () => {
    previews.querySelectorAll('img').forEach((img) => URL.revokeObjectURL(img.src));
    previews.innerHTML = '';
    inspirationPhotos.forEach((file, i) => {
      const li = document.createElement('li');
      const img = document.createElement('img');
      img.alt = `Inspiration photo ${i + 1}`;
      img.addEventListener('error', () => li.classList.add('no-preview'));
      img.src = URL.createObjectURL(file);
      const name = document.createElement('span');
      name.className = 'photo-name';
      name.textContent = file.name;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'photo-remove';
      remove.setAttribute('aria-label', `Remove ${file.name}`);
      remove.innerHTML = '&times;';
      remove.addEventListener('click', () => {
        inspirationPhotos.splice(i, 1);
        setPhotoHint();
        renderPhotos();
      });
      li.append(img, name, remove);
      previews.appendChild(li);
    });
    previews.hidden = !inspirationPhotos.length;
    picker.disabled = inspirationPhotos.length >= MAX_PHOTOS;
  };

  picker.addEventListener('change', () => {
    const chosen = Array.from(picker.files).filter((f) => f.type.startsWith('image/') || /\.hei[cf]$/i.test(f.name));
    const room = MAX_PHOTOS - inspirationPhotos.length;
    if (chosen.length < picker.files.length) {
      setPhotoHint('Please choose image files (JPG, PNG or HEIC).', true);
    } else if (chosen.length > room) {
      setPhotoHint(`You can attach up to ${MAX_PHOTOS} photos, so only ${room === 1 ? 'the first one was' : `the first ${room} were`} added.`, true);
    } else {
      setPhotoHint();
    }
    inspirationPhotos.push(...chosen.slice(0, room));
    picker.value = '';
    renderPhotos();
  });
}

// Order builder: pick items, see an estimated total, and send the list with the inquiry
const builder = document.querySelector('.builder');
if (builder) {
  builder.hidden = false;
  const form = builder.closest('form');
  const itemSel = builder.querySelector('#builder-item');
  const flavorSel = builder.querySelector('#builder-flavor');
  const cupcakeSel = builder.querySelector('#builder-cupcake');
  const addonSel = builder.querySelector('#builder-addon');
  const qtyInput = builder.querySelector('#builder-qty');
  const linePrice = builder.querySelector('.builder-line-price');
  const list = builder.querySelector('.order-list');
  const empty = builder.querySelector('.order-empty');
  const totalEl = builder.querySelector('.order-total-amount');
  const itemsField = form.elements['Order items'];
  const totalField = form.elements['Estimated total'];
  const errorEl = form.querySelector('.form-error');
  const ADDON_PRICE = 7;
  const order = [];

  const money = (n) => `$${n}`;

  const current = () => {
    const opt = itemSel.selectedOptions[0];
    const qty = Math.min(20, Math.max(1, parseInt(qtyInput.value, 10) || 1));
    const hasFlavor = opt.hasAttribute('data-flavor');
    const hasAddon = opt.hasAttribute('data-addon');
    const addon = hasAddon ? addonSel.value : '';
    const unit = Number(opt.dataset.price) + (addon ? ADDON_PRICE : 0);
    return {
      name: opt.textContent.split(' — ')[0],
      flavor: hasFlavor ? flavorSel.value : (opt.hasAttribute('data-cupcake') ? cupcakeSel.value : ''),
      addon,
      qty,
      from: opt.hasAttribute('data-from'),
      price: unit * qty,
    };
  };

  const refreshPicker = () => {
    const opt = itemSel.selectedOptions[0];
    builder.querySelector('.builder-flavor').hidden = !opt.hasAttribute('data-flavor');
    builder.querySelector('.builder-cupcake').hidden = !opt.hasAttribute('data-cupcake');
    builder.querySelector('.builder-addon').hidden = !opt.hasAttribute('data-addon');
    const c = current();
    linePrice.textContent = `${c.from ? 'from ' : ''}${money(c.price)}`;
  };

  const describe = (c) => {
    const details = [c.flavor && `${c.flavor} flavor`, c.addon && `${c.addon} add-on`].filter(Boolean).join(', ');
    return { title: `${c.qty} × ${c.name}`, details };
  };

  const render = () => {
    list.innerHTML = '';
    order.forEach((c, i) => {
      const { title, details } = describe(c);
      const li = document.createElement('li');
      li.innerHTML = `<span class="order-name"></span><span class="order-price"></span>
        <button type="button" class="order-remove" aria-label="Remove">&times;</button>`;
      li.querySelector('.order-name').textContent = title;
      if (details) {
        const small = document.createElement('small');
        small.textContent = details;
        li.querySelector('.order-name').appendChild(small);
      }
      li.querySelector('.order-price').textContent = `${c.from ? 'from ' : ''}${money(c.price)}`;
      li.querySelector('.order-remove').addEventListener('click', () => {
        order.splice(i, 1);
        render();
      });
      list.appendChild(li);
    });
    empty.hidden = order.length > 0;
    const total = order.reduce((sum, c) => sum + c.price, 0);
    const anyFrom = order.some((c) => c.from);
    totalEl.textContent = `${anyFrom ? 'from ' : ''}${money(total)}`;
    itemsField.value = order.map((c) => {
      const { title, details } = describe(c);
      return `${title}${details ? ` (${details})` : ''}: ${c.from ? 'from ' : ''}${money(c.price)}`;
    }).join(' | ');
    totalField.value = order.length ? `${anyFrom ? 'from ' : ''}${money(total)} (estimate, to be confirmed)` : '';
  };

  itemSel.addEventListener('change', refreshPicker);
  addonSel.addEventListener('change', refreshPicker);
  qtyInput.addEventListener('input', refreshPicker);
  builder.querySelector('.builder-add').addEventListener('click', () => {
    order.push(current());
    qtyInput.value = 1;
    errorEl.textContent = '';
    refreshPicker();
    render();
  });

  // Ask for at least one item, a description or an inspiration photo before sending
  form.addEventListener('submit', (e) => {
    if (!order.length && !form.elements.message.value.trim() && !inspirationPhotos.length) {
      e.preventDefault();
      e.stopImmediatePropagation();
      errorEl.textContent = 'Please add at least one item to your order, or tell us what you’d like in the box above.';
      builder.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  refreshPicker();
  render();
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

  // Send the inquiry in the background so customers always land on our own thank-you page
  // (FormSubmit's own pages, such as its robot check, are skipped). Without JavaScript the
  // form still posts normally and FormSubmit redirects using the _next field.
  orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = orderForm.querySelector('button[type=submit]');
    const errorEl = orderForm.querySelector('.form-error');
    const thanksUrl = 'thanks.html';

    // Spam bots fill the hidden honeypot field; quietly pretend it worked
    if (orderForm.elements._honey && orderForm.elements._honey.value) {
      window.location.href = thanksUrl;
      return;
    }

    submitBtn.disabled = true;
    const label = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    if (errorEl) {
      errorEl.textContent = '';
    }

    const fail = (detail) => {
      submitBtn.disabled = false;
      submitBtn.textContent = label;
      if (errorEl) {
        errorEl.textContent = `Sorry, your inquiry couldn’t be sent${detail ? ` (${detail})` : ''}. Please try again, or email us at sugarloopcollc@gmail.com.`;
      }
    };

    // With photos attached, post the form normally: FormSubmit's background (AJAX) endpoint
    // doesn't reliably deliver attachments. FormSubmit then redirects to thanks.html via _next.
    if (inspirationPhotos.length) {
      const files = await Promise.all(inspirationPhotos.map(shrinkPhoto));
      const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
      if (totalBytes > MAX_UPLOAD_BYTES) {
        fail('');
        setPhotoHint('Your photos are too large to send together (10 MB max). Please remove one and try again.', true);
        if (errorEl) {
          errorEl.textContent = 'Your photos are too large to send together. Please remove one and try again.';
        }
        return;
      }
      try {
        orderForm.querySelectorAll('.photo-upload').forEach((el) => el.remove());
        files.forEach((file, i) => {
          const input = document.createElement('input');
          input.type = 'file';
          input.name = `attachment${i ? i + 1 : ''}`;
          input.className = 'photo-upload';
          input.hidden = true;
          const transfer = new DataTransfer();
          transfer.items.add(file);
          input.files = transfer.files;
          orderForm.appendChild(input);
        });
        // Skip FormSubmit's robot-check page, as the background send does; the honeypot still applies
        const noCaptcha = document.createElement('input');
        noCaptcha.type = 'hidden';
        noCaptcha.name = '_captcha';
        noCaptcha.value = 'false';
        noCaptcha.className = 'photo-upload';
        orderForm.appendChild(noCaptcha);
        HTMLFormElement.prototype.submit.call(orderForm);
      } catch (err) {
        // Very old browsers can't attach files from script
        orderForm.querySelectorAll('.photo-upload').forEach((el) => el.remove());
        fail('');
        if (errorEl) {
          errorEl.textContent = 'Sorry, your browser couldn’t attach the photos. Please remove them and send your inquiry, then email the photos to sugarloopcollc@gmail.com.';
        }
      }
      return;
    }

    try {
      const endpoint = orderForm.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(orderForm),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && String(data.success) === 'true') {
        window.location.href = thanksUrl;
      } else {
        fail(data.message);
      }
    } catch (err) {
      fail('');
    }
  });

  // If the customer comes back with the browser's Back button, re-enable the form
  const sendLabel = orderForm.querySelector('button[type=submit]').textContent;
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      orderForm.querySelectorAll('.photo-upload').forEach((el) => el.remove());
      const submitBtn = orderForm.querySelector('button[type=submit]');
      submitBtn.disabled = false;
      submitBtn.textContent = sendLabel;
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
  const imageUrl = 'https://www.sugarloopco.com/images/full/sugarloop-menu.jpg?v=2';
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
        const blob = await fetch('images/full/sugarloop-menu.jpg?v=2').then((r) => r.blob());
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
