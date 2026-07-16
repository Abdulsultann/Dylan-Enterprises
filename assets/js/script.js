/* ==========================================================================
   DYLAN ENTERPRISES — Shared Script
   Handles: mobile nav, sticky nav shadow, active link highlighting,
   scroll reveal animations, back-to-top, contact form validation,
   animated counters, FAQ accordion, testimonial slider, gallery
   lightbox, and page loader.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile hamburger menu ---------- */
  const toggle = document.querySelector('.navbar__toggle');
  const links = document.querySelector('.navbar__links');
  const scrim = document.querySelector('.nav-scrim');

  function closeMenu() {
    toggle?.classList.remove('is-open');
    links?.classList.remove('is-open');
    scrim?.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
  }

  function openMenu() {
    toggle?.classList.add('is-open');
    links?.classList.add('is-open');
    scrim?.classList.add('is-open');
    toggle?.setAttribute('aria-expanded', 'true');
  }

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.contains('is-open');
      isOpen ? closeMenu() : openMenu();
    });
    scrim?.addEventListener('click', closeMenu);
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------- Sticky nav shadow on scroll ---------- */
  const navbar = document.querySelector('.navbar');
  function handleNavShadow() {
    if (!navbar) return;
    navbar.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  handleNavShadow();
  window.addEventListener('scroll', handleNavShadow, { passive: true });

  /* ---------- Active page highlighting ---------- */
  const currentPage = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.navbar__links a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });

  /* ---------- Scroll reveal animations ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Back to top button ---------- */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('is-visible', window.scrollY > 500);
    }, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Prefill contact subject from ?subject= query param ---------- */
  const subjectField = document.querySelector('#subject');
  if (subjectField) {
    const params = new URLSearchParams(location.search);
    const key = params.get('subject');
    const map = {
      quote: 'Request a Quote',
      consultation: 'Book a Consultation',
      export: 'Export Services Enquiry',
      import: 'Import Services Enquiry',
      shipping: 'Shipping & Logistics Enquiry',
      hajj: 'Hajj & Umrah Package Enquiry',
      vacation: 'Vacation Trip Enquiry'
    };
    if (key && map[key]) subjectField.value = map[key];
  }

  /* ---------- Contact form validation ---------- */
  const form = document.querySelector('#contact-form');
  if (form) {
    const successBox = document.querySelector('.form-success');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let valid = true;
      const requiredFields = form.querySelectorAll('[required]');

      requiredFields.forEach(field => {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#D64545';
        }
      });

      const emailField = form.querySelector('#email');
      if (emailField && emailField.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailField.value.trim())) {
          valid = false;
          emailField.style.borderColor = '#D64545';
        }
      }

      if (!valid) return;

      // No backend configured yet — show confirmation and reset the form.
      successBox?.classList.add('is-visible');
      form.reset();

      if (successBox) {
        successBox.setAttribute('tabindex', '-1');
        successBox.focus();
        setTimeout(() => successBox.classList.remove('is-visible'), 6000);
      }
    });
  }

  /* ---------- Animated statistic counters ---------- */
  const counters = document.querySelectorAll('[data-counter]');
  if ('IntersectionObserver' in window && counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-counter'));
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1600;
        const start = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
          const value = Math.floor(eased * target);
          el.textContent = value.toLocaleString() + suffix;
          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            el.textContent = target.toLocaleString() + suffix;
          }
        }
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(el => counterObserver.observe(el));
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close any other open items (single-open accordion)
      item.closest('.faq-list')?.querySelectorAll('.faq-item.is-open').forEach(open => {
        if (open !== item) {
          open.classList.remove('is-open');
          open.querySelector('.faq-answer').style.maxHeight = null;
          open.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });

      if (isOpen) {
        item.classList.remove('is-open');
        answer.style.maxHeight = null;
        question.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('is-open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Testimonial slider ---------- */
  const slider = document.querySelector('.testimonial-slider');
  if (slider) {
    const track = slider.querySelector('.testimonial-track');
    const slides = Array.from(slider.querySelectorAll('.testimonial-slide'));
    const dotsWrap = slider.querySelector('.testimonial-dots');
    const prevBtn = slider.querySelector('.testimonial-arrow--prev');
    const nextBtn = slider.querySelector('.testimonial-arrow--next');
    let index = 0;
    let autoplayId;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'testimonial-dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap?.appendChild(dot);
    });
    const dots = dotsWrap ? Array.from(dotsWrap.children) : [];

    function render() {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
    }
    function goTo(i) {
      index = (i + slides.length) % slides.length;
      render();
      restartAutoplay();
    }
    function restartAutoplay() {
      clearInterval(autoplayId);
      autoplayId = setInterval(() => goTo(index + 1), 6000);
    }

    prevBtn?.addEventListener('click', () => goTo(index - 1));
    nextBtn?.addEventListener('click', () => goTo(index + 1));
    render();
    restartAutoplay();
  }

  /* ---------- Gallery lightbox ---------- */
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.querySelector('.lightbox');
  if (galleryItems.length && lightbox) {
    const lightboxImg = lightbox.querySelector('.lightbox__figure img');
    const lightboxCaption = lightbox.querySelector('.lightbox__caption');
    const closeBtn = lightbox.querySelector('.lightbox__close');
    const prevBtn = lightbox.querySelector('.lightbox__prev');
    const nextBtn = lightbox.querySelector('.lightbox__next');
    let current = 0;

    function openLightbox(i) {
      current = i;
      const img = galleryItems[i].querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = img.alt;
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      closeBtn.focus();
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    function showRelative(delta) {
      current = (current + delta + galleryItems.length) % galleryItems.length;
      const img = galleryItems[current].querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = img.alt;
    }

    galleryItems.forEach((item, i) => {
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.addEventListener('click', () => openLightbox(i));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
      });
    });
    closeBtn?.addEventListener('click', closeLightbox);
    prevBtn?.addEventListener('click', () => showRelative(-1));
    nextBtn?.addEventListener('click', () => showRelative(1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    window.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showRelative(-1);
      if (e.key === 'ArrowRight') showRelative(1);
    });
  }

});

/* ---------- Page loader ---------- */
/* Runs outside DOMContentLoaded so it can hide as soon as everything
   (including images/fonts) has actually finished loading. */
window.addEventListener('load', () => {
  const loader = document.querySelector('.loader');
  if (loader) {
    setTimeout(() => loader.classList.add('is-hidden'), 250);
  }
});
