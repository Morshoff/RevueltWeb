/**
 * main.js - Single-viewport full-bleed video-background landing page
 */

document.addEventListener('DOMContentLoaded', () => {
  checkMobileRedirect();
  initBackgroundVideo();
  initStatsCountUp();
  initMobileMenu();
  initNavLinks();
});

function checkMobileRedirect() {
  const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile && !window.location.search.includes('desktop=1')) {
    window.location.replace('/mobile.html');
  }
}

function initBackgroundVideo() {
  const video = document.querySelector('.bg-video');
  if (video) {
    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay may be restricted until user interaction
      });
    }
  }
}

function initStatsCountUp() {
  const statItems = document.querySelectorAll('.stat-item');
  if (!statItems.length) return;

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  let hasStarted = false;

  const startAllCounters = () => {
    if (hasStarted) return;
    hasStarted = true;

    statItems.forEach((el, index) => {
      const target = parseFloat(el.getAttribute('data-target') || '0');
      const suffix = el.getAttribute('data-suffix') || '';
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      const valueEl = el.querySelector('.stat-value');
      if (!valueEl) return;

      const duration = 1500 + index * 80;
      const startOffset = 480 + index * 90;

      setTimeout(() => {
        let startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = easeOutCubic(progress);
          const currentVal = eased * target;

          valueEl.textContent = currentVal.toFixed(decimals) + suffix;

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            valueEl.textContent = target.toFixed(decimals) + suffix;
          }
        }

        requestAnimationFrame(step);
      }, startOffset);
    });
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startAllCounters();
            obs.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    const statsFooter = document.querySelector('.stats-footer');
    if (statsFooter) {
      observer.observe(statsFooter);
    } else {
      startAllCounters();
    }
  } else {
    startAllCounters();
  }
}

function initMobileMenu() {
  const burgerBtn = document.querySelector('.burger-btn');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileSheet = document.getElementById('mobile-menu');
  if (!burgerBtn || !mobileOverlay || !mobileSheet) return;

  const openMenu = () => {
    burgerBtn.setAttribute('aria-expanded', 'true');
    mobileOverlay.removeAttribute('hidden');
    mobileSheet.removeAttribute('hidden');
    mobileSheet.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
  };

  const closeMenu = () => {
    burgerBtn.setAttribute('aria-expanded', 'false');
    mobileOverlay.setAttribute('hidden', '');
    mobileSheet.setAttribute('hidden', '');
    mobileSheet.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  };

  burgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = burgerBtn.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  mobileOverlay.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && burgerBtn.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    }
  });

  const mobileNavLinks = mobileSheet.querySelectorAll('a');
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 720 && burgerBtn.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    }
  });
}

function initNavLinks() {
  const allNavLinks = document.querySelectorAll('.nav-link, .mobile-link');
  allNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const targetHref = link.getAttribute('href');
      if (targetHref && targetHref.startsWith('#')) {
        document.querySelectorAll('.nav-link, .mobile-link').forEach((item) => {
          if (item.getAttribute('href') === targetHref) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  });
}
