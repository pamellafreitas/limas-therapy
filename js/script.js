document.addEventListener('DOMContentLoaded', function() {
  if (window.lucide) {
    lucide.createIcons();
  }

  const toggle = document.getElementById('menuToggle');
  const close = document.getElementById('menuClose');
  const menu = document.getElementById('megaMenu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => menu.classList.add('is-open'));
  }
  if (close && menu) {
    close.addEventListener('click', () => menu.classList.remove('is-open'));
  }
  document.querySelectorAll('.mega-link').forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('is-open'));
  });

  // Click toggle logic for top navbar dropdowns
  const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
  dropdownTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const parent = this.closest('.nav-dropdown');
      const isOpen = parent.classList.contains('is-active');
      
      document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('is-active'));
      
      if (!isOpen) {
        parent.classList.add('is-active');
      }
    });
  });

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav-dropdown')) {
      document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('is-active'));
    }
  });

  // --- INTERSECTION OBSERVER FOR SCROLL REVEAL ANIMATIONS ---
  const revealElements = document.querySelectorAll('.reveal, .reveal-fade-up, .reveal-fade-in, .reveal-slide-left, .reveal-slide-right, .reveal-zoom-out');
  
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.15 // Triggers when 15% of the element is visible
    });

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  }
});
