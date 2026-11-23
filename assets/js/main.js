/**
 * THINK SILICON — SAAS COMPANY INTERACTIVE ENGINE
 * Features: Day Mode (White Shade), Scroll Fade In/Out, Single Vertical Stream,
 *           Theme Switcher, 3D Tilt, and Interactive Consultation Form.
 */

document.addEventListener('DOMContentLoaded', () => {
  initDayNightMode();
  initThemeSwitcher();
  initParticleCanvas();
  initNavbarScroll();
  initMobileNav();
  initScrollFadeInOut();
  initProductFilters();
  initCounters();
  init3DTilt();
  initContactForm();
  initCopyActions();
});

/* ==========================================================================
   1. DAY MODE (WHITE SHADE) & NIGHT MODE TOGGLE
   ========================================================================== */
function initDayNightMode() {
  const toggleBtn = document.getElementById('modeToggle');
  const savedMode = localStorage.getItem('ts-mode') || 'night';

  applyMode(savedMode);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentMode = document.documentElement.getAttribute('data-mode') === 'day' ? 'day' : 'night';
      const newMode = currentMode === 'day' ? 'night' : 'day';
      applyMode(newMode);
    });
  }

  function applyMode(mode) {
    if (mode === 'day') {
      document.documentElement.setAttribute('data-mode', 'day');
      if (toggleBtn) {
        toggleBtn.textContent = '🌙';
        toggleBtn.setAttribute('title', 'Switch to Night Mode');
      }
    } else {
      document.documentElement.removeAttribute('data-mode');
      if (toggleBtn) {
        toggleBtn.textContent = '☀️';
        toggleBtn.setAttribute('title', 'Switch to Day Mode (White Shade)');
      }
    }
    localStorage.setItem('ts-mode', mode);
  }
}

/* ==========================================================================
   2. SCROLL FADE IN & FADE OUT FOR VERTICAL TILES
   ========================================================================== */
function initScrollFadeInOut() {
  const items = document.querySelectorAll('.fade-scroll-item');
  if (!items.length) return;

  function handleScroll() {
    const windowHeight = window.innerHeight;

    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      const elementTop = rect.top;
      const elementBottom = rect.bottom;

      // Define visible active zone: element is considered in-view when within 10% to 90% of screen height
      const enterThreshold = windowHeight * 0.92;
      const exitThreshold = windowHeight * 0.08;

      if (elementTop < enterThreshold && elementBottom > exitThreshold) {
        item.classList.add('in-view');
      } else {
        // Smoothly fade out when scrolled far past top or bottom
        item.classList.remove('in-view');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll);
  // Initial check
  setTimeout(handleScroll, 100);
}

/* ==========================================================================
   3. AMBIENT PARTICLES CANVAS
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 150 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  const particleCount = Math.min(Math.floor(window.innerWidth / 20), 65);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.8;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.baseAlpha = Math.random() * 0.5 + 0.2;
      this.alpha = this.baseAlpha;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2.2;
          this.y -= (dy / dist) * force * 2.2;
          this.alpha = Math.min(1, this.baseAlpha + 0.4);
        } else {
          this.alpha = this.baseAlpha;
        }
      }
    }

    draw() {
      const isDay = document.documentElement.getAttribute('data-mode') === 'day';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = isDay ? `rgba(5, 150, 105, ${this.alpha * 0.85})` : `rgba(52, 211, 153, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    const isDay = document.documentElement.getAttribute('data-mode') === 'day';

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = isDay ? `rgba(5, 150, 105, ${0.18 * (1 - dist / 110)})` : `rgba(16, 185, 129, ${0.12 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   4. THEME MOOD PICKER
   ========================================================================== */
function initThemeSwitcher() {
  const themeBtns = document.querySelectorAll('.theme-btn');
  const savedTheme = localStorage.getItem('ts-theme') || 'emerald';

  applyTheme(savedTheme);

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme-set');
      applyTheme(theme);
    });
  });

  function applyTheme(theme) {
    if (theme === 'emerald') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }

    themeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-theme-set') === theme);
    });

    localStorage.setItem('ts-theme', theme);
  }
}

/* ==========================================================================
   5. NAVBAR SCROLL
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 130;
      const height = sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   6. MOBILE NAV DRAWER
   ========================================================================== */
function initMobileNav() {
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    toggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.textContent = '☰';
    });
  });
}

/* ==========================================================================
   7. PRODUCT FILTER TABS
   ========================================================================== */
function initProductFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  const tiles = document.querySelectorAll('.product-tile');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      tiles.forEach(tile => {
        const cat = tile.getAttribute('data-category');
        if (filter === 'all' || cat.includes(filter)) {
          tile.classList.remove('hidden');
          setTimeout(() => {
            tile.classList.add('in-view');
          }, 30);
        } else {
          tile.classList.add('hidden');
          tile.classList.remove('in-view');
        }
      });
    });
  });
}

/* ==========================================================================
   8. METRIC COUNTERS
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.metric-num');
  let started = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'), 10);
          const suffix = counter.getAttribute('data-suffix') || '';
          let count = 0;
          const duration = 1600;
          const stepTime = 25;
          const steps = duration / stepTime;
          const increment = target / steps;

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              counter.textContent = target + suffix;
              clearInterval(timer);
            } else {
              counter.textContent = Math.floor(count) + suffix;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const metricsSection = document.querySelector('.metrics-section');
  if (metricsSection) {
    observer.observe(metricsSection);
  }
}

/* ==========================================================================
   9. 3D TILT EFFECT
   ========================================================================== */
function init3DTilt() {
  const cards = document.querySelectorAll('.glass-card, .brand-showcase-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* ==========================================================================
   10. CONTACT FORM
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('saasContactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const company = document.getElementById('contactCompany').value.trim() || 'Undisclosed';
    const type = document.getElementById('inquiryType').value;
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !message) {
      showToast('⚠️ Please provide all required details.');
      return;
    }

    const subject = `[Think Silicon Inquiry] ${type} - ${company}`;
    const body = `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nInquiry Type: ${type}\n\nProject Scope:\n${message}`;

    const mailto = `mailto:prodiptopantho@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    showToast('🚀 Inquiry ready! Opening email client...');
    form.reset();
  });
}

/* ==========================================================================
   11. COPY & TOAST
   ========================================================================== */
function initCopyActions() {
  const copyButtons = document.querySelectorAll('[data-copy]');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.getAttribute('data-copy');
      navigator.clipboard.writeText(text).then(() => {
        showToast(`✨ Copied: "${text}"`);
      }).catch(() => {
        showToast('❌ Unable to copy');
      });
    });
  });
}

function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
