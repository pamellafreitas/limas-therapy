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

  // --- WEB3FORMS AJAX FORM SUBMISSION ---
  const contactForms = document.querySelectorAll('.contact-form');
  contactForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const submitBtn = form.querySelector('.form-submit-btn') || form.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : 'Enviar Mensagem';

      // Existing status msg removal
      const existingStatus = form.querySelector('.form-status-msg');
      if (existingStatus) {
        existingStatus.remove();
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Enviando...</span>';
      }

      const formData = new FormData(form);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        const statusDiv = document.createElement('div');
        statusDiv.className = 'form-status-msg success';
        statusDiv.style.cssText = 'margin-top: 18px; padding: 14px 20px; background: rgba(26, 54, 38, 0.08); border: 1.5px solid #1A3626; color: #1A3626; border-radius: 8px; font-weight: 600; font-size: 14px; text-align: center; line-height: 1.5;';

        if (data.success) {
          statusDiv.innerHTML = '✓ Mensagem enviada com sucesso! Entraremos em contato em breve.';
          form.reset();
        } else {
          statusDiv.className = 'form-status-msg error';
          statusDiv.style.cssText = 'margin-top: 18px; padding: 14px 20px; background: rgba(217, 83, 79, 0.08); border: 1.5px solid #d9534f; color: #d9534f; border-radius: 8px; font-weight: 600; font-size: 14px; text-align: center; line-height: 1.5;';
          statusDiv.innerHTML = 'Ops! Ocorreu um erro ao enviar: ' + (data.message || 'Por favor, tente novamente.');
        }

        form.appendChild(statusDiv);
      })
      .catch(error => {
        const statusDiv = document.createElement('div');
        statusDiv.className = 'form-status-msg error';
        statusDiv.style.cssText = 'margin-top: 18px; padding: 14px 20px; background: rgba(217, 83, 79, 0.08); border: 1.5px solid #d9534f; color: #d9534f; border-radius: 8px; font-weight: 600; font-size: 14px; text-align: center; line-height: 1.5;';
        statusDiv.innerHTML = 'Ops! Ocorreu um erro de conexão. Por favor, tente novamente ou entre em contato pelo WhatsApp.';
        form.appendChild(statusDiv);
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
          if (window.lucide) {
            lucide.createIcons();
          }
        }
      });
    });
  });

});