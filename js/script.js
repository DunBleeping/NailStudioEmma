// ============================================
// Emma NailStudio - Main JavaScript
// ============================================

// Global state
let appData = {
  language: 'nl',
  translations: null,
  settings: null,
  services: null,
  gallery: null,
  currentGalleryIndex: 0,
  currentPhotoIndex: 0,
  activeCategory: 'all',
  searchQuery: '',
  cart: [],
  cartExtras: [],
  cartExtrasDeclined: []
};

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initializeLanguage();
  loadAppData();
  initializeAccessibility();
});

async function loadAppData() {
  try {
    // Load all JSON data
    appData.settings = await fetchJSON('./data/settings.json');
    appData.services = await fetchJSON('./data/services.json');
    appData.gallery = await fetchJSON('./data/gallery.json');
    appData.translations = await fetchJSON('./data/translations.json');
    translatePage();

    // Initialize components
    initializeHeader();
    initializeHero();
    initializeServices();
    initializePricing();
    initializeGallery();
    initializeGalleryModal();
    initializeAbout();
    initializeContact();
    initializeFooter();
    initializeWhatsAppButton();

    // Initialize NEW Features (after data is loaded)
    initializeLogoLink();
    initializeFontSizeControls();
    initializeToggleImages();
    initializeCategoriesNav();
    setupCategoryLinks();
    initializeCategoriesScrollSpy();
    initializeServiceSearch();
    initializeCart();
    document.getElementById('language-select').disabled = false;

    console.log('✓ EmStudio website loaded successfully');
  } catch (error) {
    console.error('Error loading app data:', error);
    showErrorMessage(appData.language === 'en'
      ? 'An error occurred while loading the website.'
      : 'Er is een fout opgetreden bij het laden van de website.');
  }
}

// ============================================
// Utility Functions
// ============================================

const pageTranslations = [];
const missingTranslations = new Set();

function t(text, values = {}, language = appData.language) {
  let translated = text;
  if (language === 'en' && text && appData.translations) {
    if (Object.hasOwn(appData.translations.en, text)) {
      translated = appData.translations.en[text];
    } else if (!missingTranslations.has(text)) {
      console.warn(`Missing English translation: ${text}`);
      missingTranslations.add(text);
    }
  }
  return translated.replace(/\{(\w+)\}/g, (match, key) =>
    Object.hasOwn(values, key) ? String(values[key]) : match);
}

function localizeContent(item, language = appData.language) {
  const localized = { ...item };
  ['name', 'description', 'duration', 'category', 'note', 'title', 'alt', 'caption'].forEach((key) => {
    if (typeof item[key] === 'string') localized[key] = t(item[key], {}, language);
  });
  return localized;
}

function initializeLanguage() {
  try {
    appData.language = localStorage.getItem('language') === 'en' ? 'en' : 'nl';
  } catch (error) {
    console.warn('Could not read language preference:', error);
  }

  document.querySelectorAll('[data-i18n], [data-i18n-attrs]').forEach((element) => {
    if (element.hasAttribute('data-i18n')) {
      pageTranslations.push({ element, text: element.textContent.replace(/\s+/g, ' ').trim() });
    }
    (element.dataset.i18nAttrs || '').split(',').filter(Boolean).forEach((attribute) => {
      pageTranslations.push({ element, attribute, text: element.getAttribute(attribute) });
    });
  });
  pageTranslations.push({ element: document.querySelector('title'), text: document.title });
  const description = document.querySelector('meta[name="description"]');
  pageTranslations.push({ element: description, attribute: 'content', text: description.content });

  const select = document.getElementById('language-select');
  select.value = appData.language;
  select.addEventListener('change', () => {
    appData.language = select.value;
    translatePage();
    initializeHero();
    initializeServices();
    initializePricing();
    initializeGallery();
    updateGalleryModal();
    initializeAbout();
    initializeContact();
    initializeCategoriesNav();
    setupCategoryLinks();
    setActiveCategory(appData.activeCategory);
    applyServiceFilters();
    renderCart();
    try {
      localStorage.setItem('language', appData.language);
    } catch (error) {
      console.warn('Could not save language preference:', error);
      showErrorMessage(t('Taalvoorkeur kon niet worden opgeslagen.'));
    }
    announceToScreenReader(t('Taal gewijzigd naar Nederlands'));
  });
}

function translatePage() {
  document.documentElement.lang = appData.language;
  pageTranslations.forEach(({ element, attribute, text }) => {
    if (attribute) element.setAttribute(attribute, t(text));
    else element.textContent = t(text);
  });
  updatePhotoToggleButton();
  const interior = document.querySelector('.about-image img');
  const label = t('Salon Interieur');
  interior.alt = t('Emma NailStudio salon');
  interior.onerror = () => {
    interior.onerror = null;
    interior.src = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect fill="#8b7355" width="400" height="400"/><text x="200" y="200" font-size="48" fill="white" text-anchor="middle" dominant-baseline="central">${escapeHtml(label)}</text></svg>`)}`;
  };
  interior.src = './images/about/interieur.jpg';
}

async function fetchJSON(url) {
  try {
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function showErrorMessage(message) {
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = `
    background: #f8d7da;
    color: #721c24;
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 5px;
    border: 1px solid #f5c6cb;
  `;
  errorDiv.textContent = message;
  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.insertBefore(errorDiv, mainContent.firstChild);
  }
}

// ============================================
// Header & Navigation
// ============================================

function initializeHeader() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.getElementById('main-navigation');
  const header = document.querySelector('header');
  const controls = header.querySelector('.header-controls');
  const preferences = header.querySelector('.menu-preferences');
  const language = header.querySelector('.language-control');
  const fontSizes = header.querySelector('.font-size-controls');
  const mobile = window.matchMedia('(max-width: 767px)');
  const setMenuOpen = (open) => {
    nav.classList.toggle('active', open);
    mobileMenuToggle.setAttribute('aria-expanded', String(open));
  };
  const updatePreferences = () => {
    if (mobile.matches) {
      header.querySelector('.container').append(language);
      preferences.append(fontSizes);
    } else {
      controls.prepend(language);
      controls.insertBefore(fontSizes, document.getElementById('toggle-images-btn'));
      setMenuOpen(false);
    }
  };
  updatePreferences();
  mobile.addEventListener('change', updatePreferences);

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      setMenuOpen(!nav.classList.contains('active'));
    });
  }

  // Close menu when a link is clicked
  const navLinks = nav.querySelectorAll('a');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      setMenuOpen(false);
    });
  });
  header.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('active')) {
      setMenuOpen(false);
      mobileMenuToggle.focus();
    }
  });
}

// ============================================
// Accessibility Features
// ============================================

function initializeAccessibility() {
  const accessibilityToggle = document.getElementById('accessibility-toggle');
  
  if (!accessibilityToggle) return;

  // Check if user has previously enabled grayscale
  const savedPreference = localStorage.getItem('emstudio-grayscale');
  if (savedPreference === 'enabled') {
    document.body.classList.add('grayscale');
    accessibilityToggle.classList.add('active');
  }

  // Toggle grayscale on click
  accessibilityToggle.addEventListener('click', () => {
    document.body.classList.toggle('grayscale');
    accessibilityToggle.classList.toggle('active');

    // Save preference
    const isEnabled = document.body.classList.contains('grayscale');
    localStorage.setItem('emstudio-grayscale', isEnabled ? 'enabled' : 'disabled');
  });

  // Announce to screen readers
  accessibilityToggle.addEventListener('click', function() {
    const isActive = this.classList.contains('active');
    const message = t(isActive ? 'Grijswaarden modus ingeschakeld' : 'Grijswaarden modus uitgeschakeld');
    announceToScreenReader(message);
  });
}

function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}

// ============================================
// Hero Section
// ============================================

function initializeHero() {
  if (!appData.settings) return;

  const heroSection = document.getElementById('home');
  if (!heroSection) return;

  // Update hero title and tagline
  const heroTitle = heroSection.querySelector('h1');
  const heroTagline = heroSection.querySelector('.hero-tagline');
  const heroDesc = heroSection.querySelector('.hero-description');

  if (heroTitle) {
    heroTitle.textContent = t('Welkom bij {name}', { name: appData.settings.salon.name });
  }

  if (heroTagline) {
    heroTagline.textContent = t(appData.settings.salon.tagline);
  }

  if (heroDesc) {
    heroDesc.textContent = t(appData.settings.salon.description);
  }

  const banner = heroSection.querySelector('.hero-nail-banner');
  const cover = appData.gallery?.images
    .find((album) => album.folder === 'customdesigns')
    ?.photos?.find((photo) => /\/design-1\.jpg(?:\?|$)/i.test(photo.src));
  if (banner) {
    banner.hidden = !cover;
    if (cover) {
      banner.src = cover.src;
      banner.alt = t('Eigen nageldesign van Emma NailStudio');
    } else {
      banner.removeAttribute('src');
    }
  }

  heroSection.querySelectorAll('[data-social]').forEach((link) => {
    const url = appData.settings.social[link.dataset.social];
    if (url) {
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.removeAttribute('aria-disabled');
      if (link.dataset.social === 'instagram') link.textContent = 'Instagram';
    }
  });

  // Setup WhatsApp button in hero
  setupWhatsAppButton(
    heroSection.querySelector('[data-whatsapp]')
  );
}

// ============================================
// Services Section
// ============================================

function initializeServices() {
  if (!appData.services) return;

  const servicesGrid = document.getElementById('services-grid');
  if (!servicesGrid) return;

  servicesGrid.innerHTML = '';

  appData.services.services.forEach((service) => {
    const card = createServiceCard(service);
    servicesGrid.appendChild(card);
  });
}

function createServiceCard(service) {
  const card = document.createElement('div');
  card.className = 'service-card';
  card.setAttribute('data-category', service.category);
  card.setAttribute('data-id', service.id);
  const english = localizeContent(service, 'en');
  card.setAttribute('data-search', normalizeSearchText(
    `${service.name} ${service.category} ${service.description} ${english.name} ${english.category} ${english.description}`
  ));
  service = localizeContent(service);

  let serviceImage = '';
  if (service.image) {
    serviceImage = `<img src="${escapeHtml(service.image)}" alt="${escapeHtml(service.name)}" loading="lazy">`;
  } else {
    serviceImage = `<p style="margin:0;">${escapeHtml(t('Afbeelding beschikbaar'))}</p>`;
  }

  let noteHtml = '';
  if (service.note) {
    noteHtml = `<span class="service-note">${escapeHtml(service.note)}</span>`;
  }

  card.innerHTML = `
    <div class="service-image">
      ${serviceImage}
    </div>
    <div class="service-content">
      <span class="service-category">${escapeHtml(service.category)}</span>
      <h3>${escapeHtml(service.name)}</h3>
      <p>${escapeHtml(service.description)}</p>
      <div class="service-details">
        <div>
          <span class="service-price">€${service.price.toFixed(2)}</span>
          <span class="service-duration">${escapeHtml(service.duration)}</span>
          ${noteHtml}
        </div>
      </div>
      <button type="button" class="add-to-cart-btn" data-id="${escapeHtml(service.id)}" aria-pressed="false">${escapeHtml(t('+ dit wil ik'))}</button>
    </div>
  `;

  return card;
}

// ============================================
// Pricing Section
// ============================================

function renderDurationClock(service) {
  const duration = /^(\d+)(\+)? minuten$/.exec(service.duration);
  if (!duration) {
    throw new Error(`Invalid treatment duration for ${service.id}: ${service.duration}`);
  }

  const roundedMinutes = Math.ceil(Number(duration[1]) / 15) * 15;
  const clocks = [];
  for (let remaining = roundedMinutes; remaining > 0; remaining -= 60) {
    const minutes = Math.min(remaining, 60);
    const angle = minutes * 6;
    const fill = minutes === 60
      ? '<circle cx="20" cy="20" r="18" class="duration-clock-fill"/>'
      : `<path class="duration-clock-fill" d="M20 20 L20 2 A18 18 0 ${angle > 180 ? 1 : 0} 1 ${20 + 18 * Math.sin(angle * Math.PI / 180)} ${20 - 18 * Math.cos(angle * Math.PI / 180)} Z"/>`;
    clocks.push(`
      <svg class="duration-clock-face" viewBox="0 0 40 40" aria-hidden="true" focusable="false" data-minutes="${minutes}">
        <circle cx="20" cy="20" r="18" class="duration-clock-background"/>
        ${fill}
        <circle cx="20" cy="20" r="18" class="duration-clock-outline"/>
        <path d="M20 2v4 M38 20h-4 M20 38v-4 M2 20h4" class="duration-clock-markings"/>
        <path d="M20 20V11" transform="rotate(${minutes / 2} 20 20)" class="duration-clock-hand"/>
        <path d="M20 20V6" transform="rotate(${angle} 20 20)" class="duration-clock-hand"/>
        <circle cx="20" cy="20" r="1.5" fill="currentColor"/>
      </svg>
    `);
  }
  return `
    <span class="duration-clock" role="img" aria-label="${escapeHtml(t(service.duration))}" title="${escapeHtml(t(service.duration))}">
      ${clocks.join('')}
      ${duration[2] ? '<span aria-hidden="true">+</span>' : ''}
    </span>
  `;
}

function initializePricing() {
  if (!appData.services) return;

  const tableBody = document.getElementById('pricing-table');
  if (!tableBody) return;

  tableBody.innerHTML = '';

  // Add services
  appData.services.services.forEach((service) => {
    const durationClock = renderDurationClock(service);
    service = localizeContent(service);
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${escapeHtml(service.name)}</strong></td>
      <td class="duration">${durationClock}</td>
      <td class="price">€${service.price.toFixed(2)}</td>
      <td class="pricing-action">
        <button type="button" class="add-to-cart-btn" data-id="${escapeHtml(service.id)}" aria-pressed="false">${escapeHtml(t('+ dit wil ik'))}</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  // Add extras section header if extras exist
  if (appData.services.extras && appData.services.extras.length > 0) {
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
      <td colspan="4" style="background: #f5f0eb; font-weight: 600; padding: 1rem;">${escapeHtml(t('Toeslagen'))}</td>
    `;
    tableBody.appendChild(headerRow);

    appData.services.extras.forEach((extra) => {
      extra = localizeContent(extra);
      const row = document.createElement('tr');
      const priceSign = extra.price < 0 ? '-' : '+';
      const priceClass = extra.price < 0 ? 'discount' : 'price';
      row.innerHTML = `
        <td colspan="4" class="pricing-extra">
          <div class="pricing-extra-heading">
            <strong>${escapeHtml(extra.name)}</strong>
            <span class="${priceClass}">${priceSign}€${Math.abs(extra.price).toFixed(2)}</span>
          </div>
          <p>${escapeHtml(extra.description)}</p>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }
}

// ============================================
// Gallery Section
// ============================================

function initializeGallery() {
  if (!appData.gallery) return;

  const galleryGrid = document.getElementById('gallery-grid');
  if (!galleryGrid) return;

  galleryGrid.innerHTML = '';

  appData.gallery.images.forEach((image, index) => {
    if (!Array.isArray(image.photos) || image.photos.length === 0) return;
    const photoCount = getAlbumPhotos(image).length;
    image = localizeContent(image);

    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', t('{title} - bekijk album', { title: image.title }));
    item.onclick = (e) => {
      e.preventDefault();
      openGalleryModal(index);
    };
    item.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openGalleryModal(index);
      }
    };

    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.alt;
    img.loading = 'lazy';

    const badgeText = t(photoCount === 1 ? '📷 {count} foto' : "📷 {count} foto's", { count: photoCount });

    const overlay = document.createElement('div');
    overlay.className = 'gallery-overlay';
    overlay.innerHTML = `
      <h3>${escapeHtml(image.title)}</h3>
      <p>${escapeHtml(image.description)}</p>
      <span class="gallery-badge">${escapeHtml(badgeText)}</span>
    `;

    item.appendChild(img);
    item.appendChild(overlay);
    galleryGrid.appendChild(item);
  });
}

function initializeGalleryModal() {
  const modal = document.getElementById('gallery-modal');
  const closeBtn = document.querySelector('.modal-close');
  const prevBtn = document.querySelector('.modal-prev');
  const nextBtn = document.querySelector('.modal-next');

  if (closeBtn) {
    closeBtn.onclick = closeGalleryModal;
  }

  if (prevBtn) {
    prevBtn.onclick = () => navigateGallery(-1);
  }

  if (nextBtn) {
    nextBtn.onclick = () => navigateGallery(1);
  }

  if (modal) {
    modal.onclick = (event) => {
      if (event.target === modal) {
        closeGalleryModal();
      }
    };

    let touchStartX = null;
    let touchStartY = null;
    modal.addEventListener('touchstart', (event) => {
      touchStartX = event.changedTouches[0].clientX;
      touchStartY = event.changedTouches[0].clientY;
    }, { passive: true });
    modal.addEventListener('touchend', (event) => {
      if (touchStartX === null) return;
      const dx = event.changedTouches[0].clientX - touchStartX;
      const dy = event.changedTouches[0].clientY - touchStartY;
      touchStartX = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        navigateGallery(dx < 0 ? 1 : -1);
      }
    }, { passive: true });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (event) => {
    if (!appData.gallery) return;

    const modal = document.getElementById('gallery-modal');
    if (!modal || !modal.classList.contains('active')) return;

    if (event.key === 'ArrowLeft') {
      navigateGallery(-1);
    } else if (event.key === 'ArrowRight') {
      navigateGallery(1);
    } else if (event.key === 'Escape') {
      closeGalleryModal();
    }
  });
}

// The generated cover (src) is the first photo in the album.
function getAlbumPhotos(item) {
  return Array.isArray(item.photos) ? item.photos.filter((p) => p && p.src) : [];
}

function openGalleryModal(index) {
  if (!appData.gallery || index < 0 || index >= appData.gallery.images.length) {
    return;
  }
  if (getAlbumPhotos(appData.gallery.images[index]).length === 0) return;

  appData.currentGalleryIndex = index;
  appData.currentPhotoIndex = 0;
  updateGalleryModal();

  const modal = document.getElementById('gallery-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeGalleryModal() {
  const modal = document.getElementById('gallery-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

function navigateGallery(direction) {
  if (!appData.gallery) return;

  const album = getAlbumPhotos(appData.gallery.images[appData.currentGalleryIndex]);
  if (album.length < 2) return;

  appData.currentPhotoIndex = (appData.currentPhotoIndex + direction + album.length) % album.length;
  updateGalleryModal();
}

function updateGalleryModal() {
  if (!appData.gallery) return;

  const original = appData.gallery.images[appData.currentGalleryIndex];
  if (!original || getAlbumPhotos(original).length === 0) return;
  const item = localizeContent(original);
  const album = getAlbumPhotos(original);
  const photo = localizeContent(album[appData.currentPhotoIndex] || album[0]);
  const modalImage = document.querySelector('.modal-image');
  const modalTitle = document.querySelector('.modal-info h3');
  const modalDesc = document.querySelector('.modal-info p');

  if (modalImage) {
    modalImage.src = photo.src;
    modalImage.alt = photo.alt || item.alt || item.title;
  }

  if (modalTitle) {
    modalTitle.textContent = item.title;
  }

  if (modalDesc) {
    modalDesc.textContent = photo.caption || item.description;
  }

  const hasMultiple = album.length > 1;
  document.querySelectorAll('.modal-nav').forEach((btn) => {
    btn.style.display = hasMultiple ? '' : 'none';
  });

  const counter = document.querySelector('.modal-counter');
  if (counter) {
    counter.textContent = hasMultiple
      ? t('Foto {current} van {total}', { current: appData.currentPhotoIndex + 1, total: album.length })
      : '';
  }
}

// ============================================
// About Section
// ============================================

function initializeAbout() {
  if (!appData.settings) return;

  const aboutSection = document.getElementById('about');
  if (!aboutSection) return;

  const aboutText = aboutSection.querySelector('.about-text');
  if (aboutText) {
    const descParagraph = aboutText.querySelector('p');
    if (descParagraph) {
      descParagraph.textContent = t(appData.settings.salon.description);
    }
  }
}

// ============================================
// Contact Section
// ============================================

function initializeContact() {
  if (!appData.settings) return;

  const contactSection = document.getElementById('contact');
  if (!contactSection) return;

  document.getElementById('show-phone').onclick = revealContactPhone;

  // Email - VERWIJDERD
  const emailItem = contactSection.querySelector('[data-type="email"]');
  if (emailItem) {
    emailItem.remove();
  }

  // WhatsApp button
  const whatsappItem = contactSection.querySelector('[data-type="whatsapp"]');
  if (whatsappItem) {
    setupWhatsAppButton(whatsappItem.querySelector('a'));
  }

  // Opening hours
  const hoursContainer = contactSection.querySelector('[data-type="hours"] .hours-list');
  if (hoursContainer && appData.settings.hours) {
    hoursContainer.innerHTML = '';

    const hoursKeys = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday'
    ];
    const dayNames = [
      'Maandag',
      'Dinsdag',
      'Woensdag',
      'Donderdag',
      'Vrijdag',
      'Zaterdag',
      'Zondag'
    ];

    hoursKeys.forEach((day, index) => {
      const hours = appData.settings.hours[day];
      if (hours) {
        const div = document.createElement('div');
        div.innerHTML = `
          <span class="day">${escapeHtml(t(dayNames[index]))}</span>
          <span class="time">${escapeHtml(t(hours))}</span>
        `;
        hoursContainer.appendChild(div);
      }
    });
  }
}

const contactAccess = {
  phone: null,
  channel: 'phone',
  widget: null,
  generation: 0,
  controller: null,
  script: null
};

function displayContactPhone() {
  const phone = contactAccess.phone;
  const container = document.getElementById('contact-phone');
  const link = container.querySelector('a');
  link.href = `tel:${phone.replace(/[^\d+]/g, '')}`;
  link.textContent = phone;
  container.hidden = false;
  const button = document.getElementById('show-phone');
  button.setAttribute('aria-expanded', 'true');
  button.hidden = true;
}

function revealContactPhone() {
  requestContactAccess('phone');
}

function contactFailure() {
  document.getElementById('verification-status').textContent = t('De contactcontrole is niet gelukt. Probeer opnieuw. Lokaal is een Pages-server nodig.');
  document.getElementById('verification-retry').hidden = false;
}

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve();
  if (contactAccess.script) return contactAccess.script;
  contactAccess.script = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const timer = setTimeout(() => {
      script.remove();
      reject(new Error('Turnstile loading timed out'));
    }, 15000);
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = () => {
      clearTimeout(timer);
      if (window.turnstile) resolve();
      else reject(new Error('Turnstile API unavailable'));
    };
    script.onerror = () => {
      clearTimeout(timer);
      script.remove();
      reject(new Error('Turnstile loading failed'));
    };
    document.head.append(script);
  }).catch((error) => {
    contactAccess.script = null;
    throw error;
  });
  return contactAccess.script;
}

function clearContactChallenge() {
  contactAccess.generation++;
  contactAccess.controller?.abort();
  contactAccess.controller = null;
  if (contactAccess.widget !== null && window.turnstile) {
    window.turnstile.remove(contactAccess.widget);
    contactAccess.widget = null;
  }
}

function showContactContinuation() {
  displayContactPhone();
  const link = document.getElementById('verification-continue');
  const channel = contactAccess.channel;
  link.textContent = t(channel === 'whatsapp' ? 'Open WhatsApp' : channel === 'sms' ? 'Open SMS' : 'Bel mij');
  link.href = channel === 'whatsapp' ? buildWhatsAppUrl()
    : channel === 'sms' ? buildSmsUrl() : `tel:${contactAccess.phone}`;
  link.target = channel === 'whatsapp' ? '_blank' : '_self';
  link.rel = 'noopener noreferrer';
  link.hidden = false;
  link.onclick = () => {
    link.href = channel === 'whatsapp' ? buildWhatsAppUrl()
      : channel === 'sms' ? buildSmsUrl() : `tel:${contactAccess.phone}`;
  };
  document.getElementById('verification-status').textContent = t('Controle geslaagd. Je kunt nu contact opnemen.');
  link.focus();
}

async function requestContactAccess(channel) {
  const dialog = document.getElementById('contact-verification');
  clearContactChallenge();
  contactAccess.channel = channel;
  document.getElementById('verification-continue').hidden = true;
  document.getElementById('verification-retry').hidden = true;
  document.getElementById('verification-close').onclick = () => dialog.close();
  dialog.onclose = clearContactChallenge;
  document.getElementById('verification-retry').onclick = () => requestContactAccess(channel);
  if (!dialog.open) dialog.showModal();
  if (contactAccess.phone) {
    showContactContinuation();
    return;
  }
  document.getElementById('verification-status').textContent = t('Beveiligingscontrole laden…');
  const generation = contactAccess.generation;
  try {
    await loadTurnstile();
    if (!dialog.open || generation !== contactAccess.generation) return;
    contactAccess.widget = window.turnstile.render('#turnstile-widget', {
      sitekey: '0x4AAAAAAFfSBMoZL4Cla1OW',
      action: 'contact',
      language: appData.language,
      size: window.innerWidth < 360 ? 'compact' : 'flexible',
      callback: async (token) => {
        if (!dialog.open || generation !== contactAccess.generation) return;
        document.getElementById('verification-status').textContent = t('Contactgegevens controleren…');
        const controller = new AbortController();
        contactAccess.controller = controller;
        const timer = setTimeout(() => controller.abort(), 12000);
        try {
          const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
            cache: 'no-store',
            signal: controller.signal
          });
          if (!response.ok) throw new Error(`Contact verification HTTP ${response.status}`);
          const result = await response.json();
          if (!/^\+[1-9]\d{7,14}$/.test(result.phone || '')) throw new Error('Invalid contact response');
          if (!dialog.open || generation !== contactAccess.generation) return;
          contactAccess.phone = result.phone;
          window.turnstile.remove(contactAccess.widget);
          contactAccess.widget = null;
          showContactContinuation();
        } catch (error) {
          if (dialog.open && generation === contactAccess.generation) {
            console.error('Contact verification failed:', error);
            contactFailure();
          }
        } finally {
          clearTimeout(timer);
        }
      },
      'error-callback': () => {
        if (dialog.open && generation === contactAccess.generation) contactFailure();
      },
      'timeout-callback': () => {
        if (dialog.open && generation === contactAccess.generation) {
          clearContactChallenge();
          contactFailure();
        }
      },
      'expired-callback': () => {
        if (dialog.open && generation === contactAccess.generation) {
          clearContactChallenge();
          contactFailure();
        }
      }
    });
  } catch (error) {
    if (dialog.open && generation === contactAccess.generation) {
      console.error('Could not load contact verification:', error);
      contactFailure();
    }
  }
}

function setupWhatsAppButton(element) {
  if (!element || !appData.settings) return;

  element.href = '#';
  element.target = '_blank';
  element.rel = 'noopener noreferrer';
  element.onclick = (event) => {
    if (contactAccess.phone) {
      displayContactPhone();
      element.href = buildWhatsAppUrl();
    } else {
      event.preventDefault();
      requestContactAccess('whatsapp');
    }
  };
}

function buildWhatsAppUrl() {
  if (!contactAccess.phone) throw new Error('Contact verification required');
  const whatsappNumber = contactAccess.phone.replace(/\D/g, '');
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(buildBookingMessage())}`;
}

function buildSmsUrl() {
  if (!contactAccess.phone) throw new Error('Contact verification required');
  const number = contactAccess.phone;
  // iOS uses &body; Android and other clients use ?body.
  const isApple = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent);
  return `sms:${number}${isApple ? '&' : '?'}body=${encodeURIComponent(buildBookingMessage())}`;
}

// Uses the cart contents when the visitor selected treatments, otherwise the default message
function buildBookingMessage() {
  const items = getCartServices();
  const languages = appData.language === 'en' ? ['en', 'nl'] : ['nl'];
  return languages.map((language) => {
    if (items.length === 0) return t(appData.settings.contact.whatsapp.message, {}, language);
    const lines = [
      ...(languages.length > 1 ? [language === 'en' ? 'English' : 'Nederlands'] : []),
      t('Hallo {name}, ik wil graag een afspraak maken voor:', { name: appData.settings.salon.name }, language)
    ];
    items.forEach((item) => {
      const service = localizeContent(item, language);
      lines.push(`- ${service.name} (${formatPrice(service.price)}, ${service.duration})`);
    });
    getActiveCartExtras().forEach((item) => {
      const extra = localizeContent(item, language);
      lines.push(`- ${t('Toeslag:', {}, language)} ${extra.name} (+${formatPrice(extra.price)})`);
    });
    lines.push(`${t('Totaal:', {}, language)} ${formatPrice(getCartTotal())}`);
    lines.push('');
    lines.push(t('Mijn voorkeur voor datum en tijd:', {}, language));
    return lines.join('\n');
  }).join('\n\n---\n\n');
}

// ============================================
// Footer & Social Links
// ============================================

function initializeFooter() {
  if (!appData.settings) return;

  // Update salon name
  const salonNameElements = document.querySelectorAll('[data-salon-name]');
  salonNameElements.forEach((el) => {
    el.textContent = appData.settings.salon.name;
  });

  // Social links
  const socialLinks = document.querySelector('.social-links');
  if (socialLinks) {
    socialLinks.innerHTML = '';

    const links = [
      {
        name: 'Instagram',
        url: appData.settings.social.instagram,
        icon: '📷'
      },
      {
        name: 'Facebook',
        url: appData.settings.social.facebook,
        icon: 'f'
      },
      {
        name: 'WhatsApp',
        url: appData.settings.social.whatsappBusiness ? '#' : '',
        icon: '💬'
      }
    ];

    links.forEach((link) => {
      if (link.url) {
        const a = document.createElement('a');
        a.href = link.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.title = link.name;
        a.textContent = link.icon;
        if (link.name === 'WhatsApp') {
          a.setAttribute('data-whatsapp', '');
          setupWhatsAppButton(a);
        }
        socialLinks.appendChild(a);
      }
    });
  }
}

// ============================================
// WhatsApp Floating Button
// ============================================

function initializeWhatsAppButton() {
  if (!appData.settings) return;

  const whatsappBtn = document.getElementById('whatsapp-floating-btn');
  if (whatsappBtn) {
    setupWhatsAppButton(whatsappBtn);
  }

  document.querySelectorAll('[data-whatsapp]').forEach(setupWhatsAppButton);
}

// ============================================
// Smooth Scroll Behavior
// ============================================

document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (link) {
    const href = link.getAttribute('href');
    // Skip if it's just "#" (logo link)
    if (href === '#') return;
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      if (target.id === 'service-search') {
        target.focus({ preventScroll: true });
      }
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }
});

// ============================================
// Categories Filter - Setup Event Listeners
// ============================================

function setupCategoryLinks() {
  document.querySelectorAll('.category-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const category = link.getAttribute('data-category');
      setActiveCategory(category);
      filterServicesByCategory(category);
    });
  });
}

function setActiveCategory(category) {
  document.querySelectorAll('.category-link').forEach((link) => {
    link.classList.toggle('active', link.getAttribute('data-category') === category);
  });
}

function initializeCategoriesScrollSpy() {
  const servicesGrid = document.getElementById('services-grid');
  if (!servicesGrid) return;

  let updatePending = false;
  const updateActiveCategory = () => {
    updatePending = false;
    const activationY = Math.min(window.innerHeight * 0.4, 400);
    const gridBounds = servicesGrid.getBoundingClientRect();
    if (gridBounds.top > activationY || gridBounds.bottom < activationY) return;

    const currentCard = [...servicesGrid.querySelectorAll('.service-card')]
      .filter((card) => card.style.display !== 'none')
      .map((card) => ({ card, bounds: card.getBoundingClientRect() }))
      .filter(({ bounds }) => bounds.top <= activationY && bounds.bottom >= activationY)
      .sort((a, b) => {
        const aCenter = a.bounds.left + a.bounds.width / 2;
        const bCenter = b.bounds.left + b.bounds.width / 2;
        return Math.abs(aCenter - window.innerWidth / 2) - Math.abs(bCenter - window.innerWidth / 2);
      })[0]?.card;

    if (currentCard) {
      setActiveCategory(currentCard.getAttribute('data-category'));
    }
  };

  const scheduleUpdate = () => {
    if (updatePending) return;
    updatePending = true;
    window.requestAnimationFrame(updateActiveCategory);
  };

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  scheduleUpdate();
}

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.service-card, .gallery-item, .contact-item').forEach((el) => {
    observer.observe(el);
  });
});

// ============================================
// NEW FEATURES: Categories, Font Size, Logo Link, Toggle Images
// ============================================

// 1. Make Logo Clickable - Scroll to Top
function initializeLogoLink() {
  const logoLink = document.getElementById('logo-link');
  const headerLogoLink = document.getElementById('header-logo-link');
  // A limited download deterrent, not protection against screenshots or direct image access.
  [logoLink, headerLogoLink].filter(Boolean).forEach((link) => {
    link.addEventListener('contextmenu', (event) => event.preventDefault());
    link.addEventListener('dragstart', (event) => event.preventDefault());
  });
  
  const handleLogoClick = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  if (logoLink) {
    logoLink.addEventListener('click', handleLogoClick);
  }
  
  if (headerLogoLink) {
    headerLogoLink.addEventListener('click', handleLogoClick);
  }
}

// 2. Font Size Controls
function initializeFontSizeControls() {
  const fontSizeButtons = document.querySelectorAll('.font-size-btn');
  const savedFontSize = localStorage.getItem('fontSize') || 'small';

  // Set saved font size on load
  applyFontSize(savedFontSize);

  fontSizeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const size = btn.getAttribute('data-size');
      applyFontSize(size);
      localStorage.setItem('fontSize', size);
    });
  });
}

function applyFontSize(size) {
  const allowed = ['small', 'medium', 'large', 'xlarge'];
  if (!allowed.includes(size)) size = 'small';
  const classes = allowed.map((s) => `font-size-${s}`);

  // Applied to <html> so rem units scale; body keeps the class for backwards compatibility
  [document.documentElement, document.body].forEach((el) => {
    el.classList.remove(...classes);
    el.classList.add(`font-size-${size}`);
  });

  // Update active button
  document.querySelectorAll('.font-size-btn').forEach((btn) => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-size') === size) {
      btn.classList.add('active');
    }
  });
}

// 3. Toggle Images
function updatePhotoToggleButton() {
  const button = document.getElementById('toggle-images-btn');
  if (!button) return;
  const hidden = document.body.classList.contains('images-hidden');
  const label = t(hidden ? "Foto's tonen" : "Foto's verbergen");
  button.querySelector('.photo-toggle-label').textContent = label;
  button.classList.toggle('images-hidden', hidden);
  button.setAttribute('aria-pressed', String(!hidden));
  button.setAttribute('aria-label', label);
  button.title = label;
}

function initializeToggleImages() {
  const toggleImagesBtn = document.getElementById('toggle-images-btn');
  // New visitors (no saved choice) start with images hidden
  const savedImageState = localStorage.getItem('imagesHidden') !== 'false';

  document.body.classList.toggle('images-hidden', savedImageState);
  updatePhotoToggleButton();

  if (toggleImagesBtn) {
    toggleImagesBtn.addEventListener('click', () => {
      const header = document.querySelector('header');
      const viewportTop = getComputedStyle(header).position === 'sticky'
        ? header.getBoundingClientRect().bottom : 0;
      const candidates = [...document.querySelectorAll('main h1, main h2, main h3, main p, main td strong, main .service-meta, main .add-to-cart-btn, main .gallery-item')];
      const anchor = candidates.find((element) => {
        const rect = element.getBoundingClientRect();
        return !element.closest('.photo-tip, .services-sidebar, .gallery-overlay')
          && rect.height > 0 && rect.top >= viewportTop && rect.top < window.innerHeight;
      });
      const anchorTop = anchor ? anchor.getBoundingClientRect().top : 0;
      const scrollTop = window.scrollY;
      const isHidden = document.body.classList.toggle('images-hidden');
      updatePhotoToggleButton();
      localStorage.setItem('imagesHidden', isHidden);
      // Keep the same visible text in place, rather than the old document scroll offset.
      if (anchor && scrollTop > 0) {
        window.scrollBy({ top: anchor.getBoundingClientRect().top - anchorTop, behavior: 'instant' });
      }
    });
  }
}

// 4. Categories Sidebar Navigation
function initializeCategoriesNav() {
  if (!appData.services) return;

  // Get unique categories
  const categories = [...new Set(appData.services.services.map((s) => s.category))].sort();

  const categoriesList = document.getElementById('categories-list');
  if (!categoriesList) return;

  categoriesList.innerHTML = '';

  // Add "Alle behandelingen" option
  const allItem = document.createElement('li');
  allItem.innerHTML = `
    <a href="#" class="category-link active" data-category="all">
      ${escapeHtml(t('✨ Alle behandelingen'))}
    </a>
  `;
  categoriesList.appendChild(allItem);

  // Add category items
  categories.forEach((category) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <a href="#" class="category-link" data-category="${escapeHtml(category)}">
        ${escapeHtml(t(category))}
      </a>
    `;
    categoriesList.appendChild(li);
  });

}

function filterServicesByCategory(category) {
  appData.activeCategory = category;
  applyServiceFilters();
}

function normalizeSearchText(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

// Category and search filters combined; every search word must match
function applyServiceFilters() {
  const servicesGrid = document.getElementById('services-grid');
  if (!servicesGrid) return;

  const category = appData.activeCategory || 'all';
  const words = normalizeSearchText(appData.searchQuery).split(/\s+/).filter(Boolean);
  let visibleCount = 0;

  servicesGrid.querySelectorAll('.service-card').forEach((card) => {
    const categoryMatch = category === 'all' || card.getAttribute('data-category') === category;
    const haystack = card.getAttribute('data-search') || '';
    const searchMatch = words.every((w) => haystack.includes(w));

    if (categoryMatch && searchMatch) {
      visibleCount++;
      card.style.display = '';
      setTimeout(() => {
        card.classList.add('fade-in');
      }, 10);
    } else {
      card.style.display = 'none';
      card.classList.remove('fade-in');
    }
  });

  const noResults = document.getElementById('services-no-results');
  if (noResults) noResults.hidden = visibleCount > 0;
}

function initializeServiceSearch() {
  const input = document.getElementById('service-search');
  if (!input) return;

  input.addEventListener('input', () => {
    appData.searchQuery = input.value;
    // Searching covers all categories so a match is never hidden by an earlier category click
    if (input.value.trim() && appData.activeCategory && appData.activeCategory !== 'all') {
      appData.activeCategory = 'all';
      setActiveCategory('all');
    }
    applyServiceFilters();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      input.blur();
    }
  });
}

// ============================================
// Treatment cart -> WhatsApp request
// ============================================

function loadStoredArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch (e) {
    return [];
  }
}

function formatPrice(amount) {
  return `€${Number(amount).toFixed(2)}`;
}

function getCartServices() {
  if (!appData.services) return [];
  return appData.cart
    .map((id) => appData.services.services.find((s) => s.id === id))
    .filter(Boolean);
}

// Surcharges only apply to treatments that carry a note (new sets)
function cartAllowsExtras() {
  return getCartServices().some((s) => s.note);
}

function getActiveCartExtras() {
  if (!appData.services || !appData.services.extras || !cartAllowsExtras()) return [];
  return appData.services.extras.filter((e) => appData.cartExtras.includes(e.id));
}

function applyDefaultCartExtras() {
  if (!cartAllowsExtras()) {
    appData.cartExtras = [];
    appData.cartExtrasDeclined = [];
    return;
  }
  (appData.services.extras || []).forEach((extra) => {
    if (extra.defaultSelected && !appData.cartExtrasDeclined.includes(extra.id)
      && !appData.cartExtras.includes(extra.id)) {
      appData.cartExtras.push(extra.id);
    }
  });
}

function getCartTotal() {
  const services = getCartServices().reduce((sum, s) => sum + s.price, 0);
  const extras = getActiveCartExtras().reduce((sum, e) => sum + e.price, 0);
  return services + extras;
}

function getCartDuration() {
  return getCartServices().reduce((total, service) => {
    const duration = /^(\d+)(\+)? minuten$/.exec(service.duration);
    if (!duration) {
      throw new Error(`Invalid treatment duration for ${service.id}: ${service.duration}`);
    }
    return {
      minutes: total.minutes + Number(duration[1]),
      hasMinimum: total.hasMinimum || Boolean(duration[2])
    };
  }, { minutes: 0, hasMinimum: false });
}

function saveCart() {
  try {
    localStorage.setItem('cart', JSON.stringify(appData.cart));
    localStorage.setItem('cartExtras', JSON.stringify(appData.cartExtras));
    localStorage.setItem('cartExtrasDeclined', JSON.stringify(appData.cartExtrasDeclined));
  } catch (e) {
    // Storage may be unavailable (private mode); the cart still works for this visit
  }
}

function initializeCart() {
  if (!appData.services) return;

  const validIds = new Set(appData.services.services.map((s) => s.id));
  appData.cart = [...new Set(loadStoredArray('cart'))].filter((id) => validIds.has(id));
  appData.cartExtras = loadStoredArray('cartExtras');
  appData.cartExtrasDeclined = loadStoredArray('cartExtrasDeclined');
  applyDefaultCartExtras();
  saveCart();

  document.querySelectorAll('#services-grid, #pricing-table').forEach((container) => {
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.add-to-cart-btn');
      if (!btn) return;
      toggleCartItem(btn.getAttribute('data-id'));
    });
  });

  const cartBtn = document.getElementById('cart-btn');
  const panel = document.getElementById('cart-panel');
  if (cartBtn && panel) {
    cartBtn.addEventListener('click', () => setCartPanelOpen(panel.hidden));
    panel.querySelector('.cart-close').addEventListener('click', () => {
      setCartPanelOpen(false);
      cartBtn.focus();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !panel.hidden) {
        setCartPanelOpen(false);
        cartBtn.focus();
      }
    });

    document.getElementById('cart-items').addEventListener('click', (e) => {
      const btn = e.target.closest('.cart-remove');
      if (btn) toggleCartItem(btn.getAttribute('data-id'));
    });

    document.getElementById('cart-extras').addEventListener('change', (e) => {
      const box = e.target.closest('input[type="checkbox"]');
      if (!box) return;
      const id = box.value;
      appData.cartExtras = appData.cartExtras.filter((x) => x !== id);
      appData.cartExtrasDeclined = appData.cartExtrasDeclined.filter((x) => x !== id);
      if (box.checked) appData.cartExtras.push(id);
      else appData.cartExtrasDeclined.push(id);
      saveCart();
      renderCart();
    });

    document.getElementById('cart-clear-btn').addEventListener('click', () => {
      appData.cart = [];
      appData.cartExtras = [];
      appData.cartExtrasDeclined = [];
      saveCart();
      setCartPanelOpen(false);
      renderCart();
    });
  }

  renderCart();
}

function setCartPanelOpen(open) {
  const panel = document.getElementById('cart-panel');
  const cartBtn = document.getElementById('cart-btn');
  if (!panel || !cartBtn) return;
  panel.hidden = !open;
  cartBtn.setAttribute('aria-expanded', String(open));
  if (open) panel.querySelector('.cart-close').focus();
}

function toggleCartItem(id) {
  if (!id) return;
  if (appData.cart.includes(id)) {
    appData.cart = appData.cart.filter((x) => x !== id);
  } else {
    appData.cart.push(id);
  }
  applyDefaultCartExtras();
  saveCart();
  renderCart();
}

function renderCart() {
  const services = getCartServices().map((service) => localizeContent(service));
  const count = services.length;

  document.querySelectorAll('.add-to-cart-btn').forEach((btn) => {
    const inCart = appData.cart.includes(btn.getAttribute('data-id'));
    btn.classList.toggle('in-cart', inCart);
    btn.setAttribute('aria-pressed', String(inCart));
    btn.textContent = t(inCart ? '✓ In mandje' : '+ dit wil ik');
  });

  const cartBtn = document.getElementById('cart-btn');
  if (cartBtn) {
    cartBtn.hidden = count === 0;
    cartBtn.setAttribute('aria-label', t(count === 1
      ? 'Mandje met {count} behandeling openen'
      : 'Mandje met {count} behandelingen openen', { count }));
    document.getElementById('cart-count').textContent = String(count);
  }

  const itemsList = document.getElementById('cart-items');
  if (itemsList) {
    itemsList.innerHTML = services.map((s) => `
      <li>
        <span class="cart-item-name">${escapeHtml(s.name)}<small>${escapeHtml(s.duration)}</small></span>
        <span class="cart-item-price">${formatPrice(s.price)}</span>
        <button type="button" class="cart-remove" data-id="${escapeHtml(s.id)}" aria-label="${escapeHtml(t('{name} verwijderen', { name: s.name }))}">&times;</button>
      </li>
    `).join('');
  }

  const extrasBox = document.getElementById('cart-extras');
  if (extrasBox) {
    const extras = cartAllowsExtras() && appData.services.extras ? appData.services.extras : [];
    extrasBox.innerHTML = extras.map((extra) => {
      const e = localizeContent(extra);
      return `
      <label>
        <input type="checkbox" value="${escapeHtml(e.id)}" ${appData.cartExtras.includes(e.id) ? 'checked' : ''}>
        <span>${escapeHtml(e.name)} (+${formatPrice(e.price)})<small>${escapeHtml(e.description)}</small></span>
      </label>
    `;
    }).join('');
  }

  const total = document.getElementById('cart-total');
  if (total) total.textContent = formatPrice(getCartTotal());

  const durationTotal = document.getElementById('cart-duration');
  if (durationTotal) {
    const duration = getCartDuration();
    durationTotal.textContent = t('Totale behandeltijd: {minutes} minuten (indicatie)', {
      minutes: `${duration.minutes}${duration.hasMinimum ? '+' : ''}`
    });
  }

  const panel = document.getElementById('cart-panel');
  if (panel && count === 0) setCartPanelOpen(false);

  // Keep every WhatsApp link in sync with the cart contents
  if (appData.settings) {
    const orderBtn = document.getElementById('cart-order-btn');
    if (orderBtn) setupWhatsAppButton(orderBtn);
    const smsBtn = document.getElementById('cart-sms-btn');
    if (smsBtn) {
      smsBtn.href = '#';
      smsBtn.onclick = (event) => {
        if (contactAccess.phone) smsBtn.href = buildSmsUrl();
        else {
          event.preventDefault();
          requestContactAccess('sms');
        }
      };
    }
    initializeWhatsAppButton();
  }
}

// ============================================
// Print Styles (Original - keep this)
// ============================================
