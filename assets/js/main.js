const navToggle = document.querySelector('[data-menu-toggle]');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
}

const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
reveals.forEach((el) => io.observe(el));

const yearEl = document.querySelector('[data-year]');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const mailtoForm = document.querySelector('[data-mailto-form]');
if (mailtoForm) {
  mailtoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const fd = new FormData(mailtoForm);
    const to = mailtoForm.dataset.mailtoTo || 'info@lawnsunlimitedia.com';
    const subject = mailtoForm.dataset.mailtoSubject || 'Website inquiry';
    const lines = [
      'Name: ' + (fd.get('name') || ''),
      'Phone: ' + (fd.get('phone') || ''),
      'Email: ' + (fd.get('email') || ''),
      'Property location: ' + (fd.get('location') || ''),
      'Project type: ' + (fd.get('project_type') || ''),
      'Ideal timing: ' + (fd.get('timing') || ''),
      '',
      'Project details:',
      String(fd.get('message') || '')
    ];
    const body = encodeURIComponent(lines.join('\n'));
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${body}`;
  });
}

const parallaxTarget = document.querySelector('[data-parallax]');
if (parallaxTarget && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  window.addEventListener('scroll', () => {
    const y = Math.min(window.scrollY * 0.18, 40);
    parallaxTarget.style.transform = `scale(1.06) translateY(${y}px)`;
  }, { passive: true });
}

const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 900) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * 6;
    const ry = (px - 0.5) * 8;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

const countEls = document.querySelectorAll('[data-count]');
const countIO = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    if (el.dataset.done === 'true') return;
    el.dataset.done = 'true';
    const target = Number(el.dataset.count || '0');
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}, { threshold: 0.45 });
countEls.forEach((el) => countIO.observe(el));

const testimonialSlider = document.querySelector('[data-testimonial-slider]');
if (testimonialSlider) {
  const slides = Array.from(testimonialSlider.querySelectorAll('[data-testimonial-slide]'));
  const dots = Array.from(document.querySelectorAll('[data-testimonial-dot]'));
  const prev = testimonialSlider.querySelector('[data-testimonial-prev]');
  const next = testimonialSlider.querySelector('[data-testimonial-next]');
  let current = 0;
  let timer = null;

  const showSlide = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === current);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === current);
    });
  };

  const startAuto = () => {
    stopAuto();
    timer = window.setInterval(() => showSlide(current + 1), 5000);
  };

  const stopAuto = () => {
    if (timer) window.clearInterval(timer);
  };

  if (prev) {
    prev.addEventListener('click', () => {
      showSlide(current - 1);
      startAuto();
    });
  }

  if (next) {
    next.addEventListener('click', () => {
      showSlide(current + 1);
      startAuto();
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      startAuto();
    });
  });

  testimonialSlider.addEventListener('mouseenter', stopAuto);
  testimonialSlider.addEventListener('mouseleave', startAuto);

  showSlide(0);
  startAuto();
}

const themeButtons = document.querySelectorAll('[data-theme-toggle]');
const themeRoot = document.documentElement;
const savedTheme = window.localStorage.getItem('lawns-theme');

if (savedTheme === 'light') {
  themeRoot.setAttribute('data-theme', 'light');
}

const syncThemeButtons = () => {
  const isLight = themeRoot.getAttribute('data-theme') === 'light';
  themeButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(isLight));
    button.setAttribute('title', isLight ? 'Switch to dark colorway' : 'Switch to white colorway');
  });
};

themeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const isLight = themeRoot.getAttribute('data-theme') === 'light';
    if (isLight) {
      themeRoot.removeAttribute('data-theme');
      window.localStorage.removeItem('lawns-theme');
    } else {
      themeRoot.setAttribute('data-theme', 'light');
      window.localStorage.setItem('lawns-theme', 'light');
    }
    syncThemeButtons();
  });
});

syncThemeButtons();
