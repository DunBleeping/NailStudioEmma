// ============================================
// Emma NailStudio - Main JavaScript
// ============================================

// Global state
let appData = {
  settings: null,
  services: null,
  gallery: null,
  currentGalleryIndex: 0
};

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  loadAppData();
  initializeAccessibility();
});

async function loadAppData() {
  try {
    // Load all JSON data
    appData.settings = await fetchJSON('./data/settings.json');
    appData.services = await fetchJSON('./data/services.json');
    appData.gallery = await fetchJSON('./data/gallery.json');

    // Initialize components
    initializeHeader();
    initializeHero();
    initializeServices();
    initializePricing();
    initializeGallery();
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

    console.log('✓ EmStudio website loaded successfully');
  } catch (error) {
    console.error('Error loading app data:', error);
    showErrorMessage('Er is een fout opgetreden bij het laden van de website.');
  }
}

// ============================================
// Utility Functions
// ============================================

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
  const nav = document.querySelector('nav');

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
    });
  }

  // Close menu when a link is clicked
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
    });
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
    const message = isActive ? 'Grijswaarden modus ingeschakeld' : 'Grijswaarden modus uitgeschakeld';
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

  const heroSection = document.getElementById('hero');
  if (!heroSection) return;

  // Update hero title and tagline
  const heroTitle = heroSection.querySelector('h1');
  const heroTagline = heroSection.querySelector('.hero-tagline');
  const heroDesc = heroSection.querySelector('.hero-description');

  if (heroTitle) {
    heroTitle.textContent = `Welkom bij ${appData.settings.salon.name}`;
  }

  if (heroTagline) {
    heroTagline.textContent = appData.settings.salon.tagline;
  }

  if (heroDesc) {
    heroDesc.textContent = appData.settings.salon.description;
  }

  // Setup WhatsApp button in hero
  setupWhatsAppButton(
    heroSection.querySelector('.hero-buttons a[href*="whatsapp"]')
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

  let serviceImage = '';
  if (service.image) {
    serviceImage = `<img src="${escapeHtml(service.image)}" alt="${escapeHtml(service.name)}" loading="lazy">`;
  } else {
    serviceImage = `<p style="margin:0;">Afbeelding beschikbaar</p>`;
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
    </div>
  `;

  return card;
}

// ============================================
// Pricing Section
// ============================================

function initializePricing() {
  if (!appData.services) return;

  const tableBody = document.getElementById('pricing-table');
  if (!tableBody) return;

  tableBody.innerHTML = '';

  // Add services
  appData.services.services.forEach((service) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${escapeHtml(service.name)}</strong></td>
      <td class="duration">${escapeHtml(service.duration)}</td>
      <td class="price">€${service.price.toFixed(2)}</td>
    `;
    tableBody.appendChild(row);
  });

  // Add extras section header if extras exist
  if (appData.services.extras && appData.services.extras.length > 0) {
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
      <td colspan="3" style="background: #f5f0eb; font-weight: 600; padding: 1rem;">Optionele toeslagen</td>
    `;
    tableBody.appendChild(headerRow);

    appData.services.extras.forEach((extra) => {
      const row = document.createElement('tr');
      const priceSign = extra.price < 0 ? '-' : '+';
      const priceClass = extra.price < 0 ? 'discount' : 'price';
      row.innerHTML = `
        <td><em>${escapeHtml(extra.name)}</em></td>
        <td>${escapeHtml(extra.description)}</td>
        <td class="${priceClass}">${priceSign}€${Math.abs(extra.price).toFixed(2)}</td>
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
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.onclick = (e) => {
      e.preventDefault();
      openGalleryModal(index);
    };

    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.alt;
    img.loading = 'lazy';

    const overlay = document.createElement('div');
    overlay.className = 'gallery-overlay';
    overlay.innerHTML = `
      <h3>${escapeHtml(image.title)}</h3>
      <p>${escapeHtml(image.description)}</p>
    `;

    item.appendChild(img);
    item.appendChild(overlay);
    galleryGrid.appendChild(item);
  });

  // Initialize modal
  initializeGalleryModal();
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

function openGalleryModal(index) {
  if (!appData.gallery || index < 0 || index >= appData.gallery.images.length) {
    return;
  }

  appData.currentGalleryIndex = index;
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

  let newIndex = appData.currentGalleryIndex + direction;

  // Loop around
  if (newIndex < 0) {
    newIndex = appData.gallery.images.length - 1;
  } else if (newIndex >= appData.gallery.images.length) {
    newIndex = 0;
  }

  appData.currentGalleryIndex = newIndex;
  updateGalleryModal();
}

function updateGalleryModal() {
  if (!appData.gallery) return;

  const image = appData.gallery.images[appData.currentGalleryIndex];
  const modalImage = document.querySelector('.modal-image');
  const modalTitle = document.querySelector('.modal-info h3');
  const modalDesc = document.querySelector('.modal-info p');

  if (modalImage) {
    modalImage.src = image.src;
    modalImage.alt = image.alt;
  }

  if (modalTitle) {
    modalTitle.textContent = image.title;
  }

  if (modalDesc) {
    modalDesc.textContent = image.description;
  }

  // Update counter
  const counter = document.querySelector('.modal-counter');
  if (counter) {
    counter.textContent = `${appData.currentGalleryIndex + 1} / ${appData.gallery.images.length}`;
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
      descParagraph.textContent = appData.settings.salon.description;
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

  // Phone
  const phoneItem = contactSection.querySelector('[data-type="phone"]');
  if (phoneItem && appData.settings.contact.phone) {
    const link = phoneItem.querySelector('a');
    if (link) {
      link.href = `tel:${appData.settings.contact.phone}`;
      link.textContent = appData.settings.contact.phone;
    }
  }

  // Email - VERWIJDERD
  const emailItem = contactSection.querySelector('[data-type="email"]');
  if (emailItem) {
    emailItem.remove();
  }

  // Address
  const addressItem = contactSection.querySelector('[data-type="address"]');
  if (addressItem && appData.settings.contact.address) {
    const link = addressItem.querySelector('a');
    if (link) {
      link.href = appData.settings.contact.mapLink || '#';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = appData.settings.contact.address;
    }
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
          <span class="day">${dayNames[index]}</span>
          <span class="time">${escapeHtml(hours)}</span>
        `;
        hoursContainer.appendChild(div);
      }
    });
  }
}

function setupWhatsAppButton(element) {
  if (!element || !appData.settings) return;

  const whatsappNumber = appData.settings.contact.whatsapp.number.replace(/\D/g, '');
  const message = encodeURIComponent(
    appData.settings.contact.whatsapp.message
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  element.href = whatsappUrl;
  element.target = '_blank';
  element.rel = 'noopener noreferrer';
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
        url: appData.settings.social.whatsappBusiness,
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
  const savedFontSize = localStorage.getItem('fontSize') || 'medium';

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
  // Remove all font size classes
  document.body.classList.remove('font-size-small', 'font-size-medium', 'font-size-large', 'font-size-xlarge');

  // Add selected class
  document.body.classList.add(`font-size-${size}`);

  // Update active button
  document.querySelectorAll('.font-size-btn').forEach((btn) => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-size') === size) {
      btn.classList.add('active');
    }
  });
}

// 3. Toggle Images
function initializeToggleImages() {
  const toggleImagesBtn = document.getElementById('toggle-images-btn');
  // New visitors (no saved choice) start with images hidden
  const savedImageState = localStorage.getItem('imagesHidden') !== 'false';

  document.body.classList.toggle('images-hidden', savedImageState);
  if (toggleImagesBtn) {
    toggleImagesBtn.classList.toggle('images-hidden', savedImageState);
  }

  if (toggleImagesBtn) {
    toggleImagesBtn.addEventListener('click', () => {
      const isHidden = document.body.classList.toggle('images-hidden');
      toggleImagesBtn.classList.toggle('images-hidden');
      localStorage.setItem('imagesHidden', isHidden);
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
      ✨ Alle behandelingen
    </a>
  `;
  categoriesList.appendChild(allItem);

  // Add category items
  categories.forEach((category) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <a href="#" class="category-link" data-category="${escapeHtml(category)}">
        ${escapeHtml(category)}
      </a>
    `;
    categoriesList.appendChild(li);
  });

}

function filterServicesByCategory(category) {
  const servicesGrid = document.getElementById('services-grid');
  const cards = servicesGrid.querySelectorAll('.service-card');

  cards.forEach((card) => {
    const cardCategory = card.getAttribute('data-category');
    if (category === 'all' || cardCategory === category) {
      card.style.display = '';
      setTimeout(() => {
        card.classList.add('fade-in');
      }, 10);
    } else {
      card.style.display = 'none';
      card.classList.remove('fade-in');
    }
  });
}

// ============================================
// Print Styles (Original - keep this)
// ============================================
