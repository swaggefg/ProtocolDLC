const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initTabs();
  initGallery();
  initForms();
  initFAQ();
  initScrollAnimations();
  initSmoothScroll();
  highlightActiveNav();
});

function initMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('nav ul');
  
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      toggle.textContent = nav.classList.contains('active') ? '✕' : '☰';
    });

    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        if (toggle) {
          toggle.textContent = '☰';
        }
      });
    });
  }
}

function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const target = button.dataset.tab;

      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      button.classList.add('active');
      const targetContent = document.getElementById(target);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
}

function initGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.querySelector('.modal');
  const modalImg = document.querySelector('.modal-content img');
  const closeBtn = document.querySelector('.modal-close');
  const prevBtn = document.querySelector('.modal-prev');
  const nextBtn = document.querySelector('.modal-next');
  
  let currentIndex = 0;
  const images = Array.from(galleryItems).map(item => {
    const img = item.querySelector('img');
    return {
      src: img.src,
      alt: img.alt
    };
  });

  function openModal(index) {
    currentIndex = index;
    if (modal && modalImg && images[currentIndex]) {
      modalImg.src = images[currentIndex].src;
      modalImg.alt = images[currentIndex].alt;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    if (modalImg && images[currentIndex]) {
      modalImg.src = images[currentIndex].src;
      modalImg.alt = images[currentIndex].alt;
    }
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    if (modalImg && images[currentIndex]) {
      modalImg.src = images[currentIndex].src;
      modalImg.alt = images[currentIndex].alt;
    }
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openModal(index));
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', showNext);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', showPrev);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (modal && modal.classList.contains('active')) {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowRight') {
        showNext();
      } else if (e.key === 'ArrowLeft') {
        showPrev();
      }
    }
  });
}

function initForms() {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const inputs = form.querySelectorAll('input[required], textarea[required]');

      inputs.forEach(input => {
        const errorElement = input.parentElement.querySelector('.form-error');
        
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('input-error');
          if (errorElement) {
            errorElement.textContent = 'Это поле обязательно для заполнения';
            errorElement.classList.add('active');
          }
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
          isValid = false;
          input.classList.add('input-error');
          if (errorElement) {
            errorElement.textContent = 'Введите корректный email адрес';
            errorElement.classList.add('active');
          }
        } else {
          input.classList.remove('input-error');
          if (errorElement) {
            errorElement.classList.remove('active');
          }
        }
      });

      if (isValid) {
        showSuccessMessage(form);
        form.reset();
      }
    });

    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('input-error');
        const errorElement = input.parentElement.querySelector('.form-error');
        if (errorElement) {
          errorElement.classList.remove('active');
        }
      });
    });
  });
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showSuccessMessage(form) {
  const message = document.createElement('div');
  message.textContent = 'Форма успешно отправлена!';
  message.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #9333ea, #06b6d4);
    color: white;
    padding: 1rem 2rem;
    border-radius: 8px;
    z-index: 9999;
    animation: fadeInUp 0.3s ease;
  `;
  document.body.appendChild(message);
  
  setTimeout(() => {
    message.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => message.remove(), 300);
  }, 3000);
}

function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        faqItems.forEach(faq => faq.classList.remove('active'));
        
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
}

function highlightActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', throttle(() => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > 100) {
    document.querySelector('header')?.classList.add('scrolled');
  } else {
    document.querySelector('header')?.classList.remove('scrolled');
  }
}, 100));
