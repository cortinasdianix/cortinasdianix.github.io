/**
 * CORTINAS DIANIX - INTERACTIVE JAVASCRIPT
 * Manejo de filtros de galería, visor lightbox, generador de mensajes de WhatsApp,
 * agendamiento de visitas, estado de horario en vivo y animaciones de scroll.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Constantes de negocio
  const WHATSAPP_PHONE = '51945271630'; // 945 271 630 en formato internacional

  /* ==========================================================================
     1. NAVEGACIÓN Y MENÚ MÓVIL
     ========================================================================== */
  const headerNav = document.querySelector('.header-nav');
  const navToggle = document.getElementById('navToggle');
  const navClose = document.getElementById('navClose');
  const navMenu = document.getElementById('navMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header en scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      headerNav.classList.add('scrolled');
    } else {
      headerNav.classList.remove('scrolled');
    }
    
    // Botón volver arriba
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  });

  // Abrir y alternar menú móvil
  if (navToggle) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        navMenu.classList.add('open');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  // Cerrar menú móvil
  const closeMenu = () => {
    if (navMenu) navMenu.classList.remove('open');
    if (menuOverlay) menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (navClose) {
    navClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }
  
  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMenu);
  }

  // Cerrar al dar click en cualquier enlace o botón dentro del menú
  if (navMenu) {
    const allNavAnchors = navMenu.querySelectorAll('a');
    allNavAnchors.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
        if (link.classList.contains('nav-link')) {
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    });
  }

  // Cerrar con tecla Escape si el menú está abierto
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  // Botón volver arriba
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     2. ESTADO DE HORARIO EN VIVO (OPEN / CLOSED STATUS)
     ========================================================================== */
  const updateStoreStatus = () => {
    const statusBadges = document.querySelectorAll('.live-status-indicator');
    if (!statusBadges.length) return;

    const now = new Date();
    // Ajustar a hora local (o día de la semana)
    const day = now.getDay(); // 0 = Domingo, 1-6 = Lunes a Sábado
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hour + minutes / 60;

    let isOpen = false;
    let statusText = '';

    if (day >= 1 && day <= 6) {
      // Lunes a Sábado: 9:00 AM - 7:00 PM (9.0 a 19.0)
      if (currentTime >= 9.0 && currentTime < 19.0) {
        isOpen = true;
        statusText = 'Abierto hoy hasta 7:00 PM';
      } else {
        statusText = 'Cerrado ahora · Abre 9:00 AM';
      }
    } else if (day === 0) {
      // Domingo: 9:00 AM - 2:00 PM (9.0 a 14.0)
      if (currentTime >= 9.0 && currentTime < 14.0) {
        isOpen = true;
        statusText = 'Abierto hoy hasta 2:00 PM';
      } else {
        statusText = 'Cerrado ahora · Abre Lunes 9:00 AM';
      }
    }

    statusBadges.forEach(badge => {
      const dot = badge.querySelector('.status-dot');
      const textSpan = badge.querySelector('.status-text');
      if (isOpen) {
        badge.style.background = 'rgba(37, 211, 102, 0.15)';
        badge.style.color = '#4ade80';
        if (dot) dot.style.backgroundColor = '#22c55e';
        if (textSpan) textSpan.textContent = statusText;
      } else {
        badge.style.background = 'rgba(239, 68, 68, 0.15)';
        badge.style.color = '#fca5a5';
        if (dot) dot.style.backgroundColor = '#ef4444';
        if (textSpan) textSpan.textContent = statusText;
      }
    });
  };

  updateStoreStatus();
  setInterval(updateStoreStatus, 60000); // Actualizar cada minuto

  /* ==========================================================================
     3. FILTRADO DE GALERÍA POR CATEGORÍAS
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'flex';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 20);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  /* ==========================================================================
     4. LIGHTBOX MODAL INTERACTIVO
     ========================================================================== */
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxWhatsappBtn = document.getElementById('lightboxWhatsappBtn');
  const lightboxClose = document.getElementById('lightboxClose');

  const openLightbox = (item) => {
    const imgEl = item.querySelector('.gallery-thumb-wrap img');
    const badgeEl = item.querySelector('.gallery-badge');
    const titleEl = item.querySelector('.gallery-title');
    const descEl = item.querySelector('.gallery-desc');

    const imgSrc = imgEl ? imgEl.src : '';
    const category = badgeEl ? badgeEl.textContent.trim() : '';
    const title = titleEl ? titleEl.textContent.trim() : '';
    const desc = descEl ? descEl.textContent.trim() : '';

    if (lightboxImg) lightboxImg.src = imgSrc;
    if (lightboxCategory) lightboxCategory.textContent = category;
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxDesc) lightboxDesc.textContent = desc;

    // Actualizar enlace directo de WhatsApp
    if (lightboxWhatsappBtn) {
      const msg = encodeURIComponent(`Hola Cortinas DIANIX, vi en su sitio web el modelo "${title}" de la categoría "${category}" y deseo cotizar / agendar una visita.`);
      lightboxWhatsappBtn.href = `https://wa.me/${WHATSAPP_PHONE}?text=${msg}`;
    }

    if (lightbox) {
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeLightbox = () => {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // Click en botones de zoom de cada item
  document.querySelectorAll('.btn-zoom').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parentItem = btn.closest('.gallery-item');
      if (parentItem) openLightbox(parentItem);
    });
  });

  // Click en la imagen misma de la tarjeta
  document.querySelectorAll('.gallery-thumb-wrap').forEach(wrap => {
    wrap.addEventListener('click', () => {
      const parentItem = wrap.closest('.gallery-item');
      if (parentItem) openLightbox(parentItem);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Tecla Escape para cerrar Lightbox
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  /* ==========================================================================
     5. AGENDADOR INTERACTIVO DE VISITAS / COTIZADOR POR WHATSAPP
     ========================================================================== */
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('bookName').value.trim();
      const phone = document.getElementById('bookPhone').value.trim();
      const product = document.getElementById('bookProduct').value;
      const windows = document.getElementById('bookWindows').value;
      const district = document.getElementById('bookDistrict').value.trim();
      const date = document.getElementById('bookDate').value;
      const notes = document.getElementById('bookNotes').value.trim();

      let message = `*SOLICITUD DE VISITA A DOMICILIO - CORTINAS DIANIX*\n\n`;
      message += `👤 *Cliente:* ${name}\n`;
      if (phone) message += `📞 *Teléfono:* ${phone}\n`;
      message += `🪟 *Producto de Interés:* ${product}\n`;
      message += `🔢 *N° Aprox. de Ventanas/Espacios:* ${windows}\n`;
      message += `📍 *Distrito / Ubicación:* ${district}\n`;
      if (date) message += `📅 *Fecha Preferida:* ${date}\n`;
      if (notes) message += `📝 *Detalles Adicionales:* ${notes}\n\n`;
      message += `_Deseo coordinar la visita técnica con muestrarios de telas._`;

      const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }

  /* ==========================================================================
     6. FORMULARIO DE CONTACTO RÁPIDO
     ========================================================================== */
  const quickContactForm = document.getElementById('quickContactForm');
  if (quickContactForm) {
    quickContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value.trim();
      const phone = document.getElementById('contactPhone').value.trim();
      const msg = document.getElementById('contactMessage').value.trim();

      let text = `*CONSULTA GENERAL - CORTINAS DIANIX*\n\n`;
      text += `👤 *Nombre:* ${name}\n`;
      text += `📞 *Teléfono:* ${phone}\n`;
      text += `💬 *Mensaje:* ${msg}`;

      window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    });
  }

  /* ==========================================================================
     7. ACORDEÓN DE PREGUNTAS FRECUENTES (FAQS)
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Cerrar los demás acordeones para mantener orden
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });

        // Alternar el actual
        if (isActive) {
          item.classList.remove('active');
        } else {
          item.classList.add('active');
        }
      });
    }
  });

  /* ==========================================================================
     8. ANIMACIONES AL DESPLAZARSE (REVEAL ON SCROLL)
     ========================================================================== */
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-on-scroll').forEach(element => {
    revealObserver.observe(element);
  });
});
