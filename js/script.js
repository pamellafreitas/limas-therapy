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

  // --- AJAX FORM SUBMISSION FOR WEB3FORMS ---
  const contactForms = document.querySelectorAll('.contact-form');
  contactForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      if (form.action.includes('web3forms.com')) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('[type="submit"]');
        const originalBtnHTML = submitBtn.innerHTML;
        
        // Disable button and show sending state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Enviando...</span><i class="animate-spin" data-lucide="loader-2"></i>';
        if (window.lucide) lucide.createIcons();
        
        // Remove existing alerts
        const existingAlert = form.querySelector('.form-alert');
        if (existingAlert) existingAlert.remove();
        
        const formData = new FormData(form);
        
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        })
        .then(async (response) => {
          let json = await response.json();
          if (response.status == 200) {
            // Success
            const successDiv = document.createElement('div');
            successDiv.className = 'form-alert success-alert';
            successDiv.innerHTML = `
              <div style="background: rgba(26, 54, 38, 0.08); border: 1px solid #1A3626; color: #1A3626; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-weight: 500; font-size: 15px; display: flex; align-items: center; gap: 10px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #1A3626;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <span>Mensagem enviada com sucesso! Entraremos em contato em breve.</span>
              </div>
            `;
            form.insertBefore(successDiv, form.firstChild);
            form.reset();
          } else {
            // Error from API
            console.log(response);
            const errorDiv = document.createElement('div');
            errorDiv.className = 'form-alert error-alert';
            errorDiv.innerHTML = `
              <div style="background: rgba(220, 38, 38, 0.08); border: 1px solid #DC2626; color: #DC2626; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-weight: 500; font-size: 15px; display: flex; align-items: center; gap: 10px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                <span>Ocorreu um erro: ${json.message || 'Tente novamente.'}</span>
              </div>
            `;
            form.insertBefore(errorDiv, form.firstChild);
          }
        })
        .catch(error => {
          console.log(error);
          const errorDiv = document.createElement('div');
          errorDiv.className = 'form-alert error-alert';
          errorDiv.innerHTML = `
            <div style="background: rgba(220, 38, 38, 0.08); border: 1px solid #DC2626; color: #DC2626; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-weight: 500; font-size: 15px; display: flex; align-items: center; gap: 10px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              <span>Erro de rede. Verifique sua conexão e tente novamente.</span>
            </div>
          `;
          form.insertBefore(errorDiv, form.firstChild);
        })
        .then(() => {
          // Restore button state
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
          if (window.lucide) lucide.createIcons();
        });
      }
    });
  });
});
