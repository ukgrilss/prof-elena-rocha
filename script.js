/* ======================================
   SCRIPT — Kit Setembro Amarelo 2026
   ====================================== */

// ========== CAROUSEL ==========
(function initCarousel() {
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsContainer = document.getElementById('carouselDots');

  if (!track) return;

  const slides = track.querySelectorAll('.carousel-slide');
  let current = 0;
  let autoInterval;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function updateDots() {
    dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
  nextBtn.addEventListener('click', () => { next(); resetAuto(); });

  // Touch / Swipe support
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    resetAuto();
  });

  function startAuto() {
    autoInterval = setInterval(next, 4500);
  }

  function resetAuto() {
    clearInterval(autoInterval);
    startAuto();
  }

  startAuto();
})();


// ========== SCROLL ANIMATIONS (AOS-like) ==========
(function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-aos]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Stagger children if multiple siblings
        const siblings = entry.target.parentElement.querySelectorAll('[data-aos]');
        let delay = 0;
        siblings.forEach((el, i) => {
          if (el === entry.target) delay = i * 80;
        });
        setTimeout(() => {
          entry.target.classList.add('aos-active');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
})();


// ========== SCARCITY BAR ANIMATION ==========
(function initScarcityBar() {
  const bars = document.querySelectorAll('.scarcity-bar-inner');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = '92%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => {
    bar.style.width = '0%';
    bar.style.transition = 'width 2.5s ease-out';
    observer.observe(bar);
  });
})();


// ========== DYNAMIC CITY COUNT (Social Proof) ==========
(function initCityCount() {
  const cityEl = document.querySelector('.city-num');
  if (!cityEl) return;

  // Randomly fluctuate the count by ±1 occasionally to feel live
  const base = parseInt(cityEl.textContent) || 319;
  let current = base;

  setInterval(() => {
    const delta = Math.random() < 0.3 ? 1 : 0;
    current = Math.min(current + delta, base + 12);
    cityEl.textContent = current;
  }, 8000);
})();


// ========== COUNTDOWN — Urgency (optional visual) ==========
(function initCountdown() {
  // Find if there's a countdown element — if not, skip
  const el = document.getElementById('countdown');
  if (!el) return;

  let seconds = 15 * 60; // 15 minutes

  function update() {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    el.textContent = `${m}:${s}`;
    if (seconds > 0) seconds--;
  }

  update();
  setInterval(update, 1000);
})();


// ========== STICKY TOP BAR HIDE ON SCROLL UP ==========
(function initTopbar() {
  const topbar = document.getElementById('topbar');
  if (!topbar) return;
  let lastY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    if (currentY < lastY || currentY < 80) {
      topbar.style.transform = 'translateY(0)';
    } else {
      topbar.style.transform = 'translateY(-100%)';
    }
    lastY = currentY;
  }, { passive: true });

  topbar.style.transition = 'transform 0.3s ease';
})();


// ========== UTM TRACKING — Pass UTMs to all CTA links ==========
(function passUTMs() {
  const params = new URLSearchParams(window.location.search);
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'src'];

  const utmParams = [];
  utmKeys.forEach(key => {
    if (params.has(key)) utmParams.push(`${key}=${encodeURIComponent(params.get(key))}`);
  });

  if (utmParams.length === 0) return;

  document.querySelectorAll('a[href*="hotmart.com"], a[href*="pay.hotmart"]').forEach(link => {
    const separator = link.href.includes('?') ? '&' : '?';
    link.href = link.href + separator + utmParams.join('&');
  });
})();


// ========== SMOOTH SCROLL for internal anchors ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ========== CTA Click Tracking (console log for analytics) ==========
(function trackClicks() {
  const ctaBtns = document.querySelectorAll('.btn-cta');
  ctaBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const id = this.id || 'unknown-cta';
      console.log(`[CTA Click] Button ID: ${id} | Time: ${new Date().toISOString()}`);
      // If using Google Analytics (gtag):
      // gtag('event', 'click', { event_category: 'CTA', event_label: id });
    });
  });
})();
