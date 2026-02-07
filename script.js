document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const navLinkElements = document.querySelectorAll('.nav-link');
  const contactForm = document.getElementById('contact-form');
  const sections = document.querySelectorAll('section[id]');

  // ========================
  // Navbar scroll effect
  // ========================
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // ========================
  // Mobile hamburger toggle
  // ========================
  hamburger.addEventListener('click', () => {
    const isActive = hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isActive);
  });

  // Close mobile menu when clicking a link
  navLinkElements.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  // ========================
  // Scroll animations
  // ========================
  const animatedElements = document.querySelectorAll('[data-animate]');

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add staggered delay for service cards
        const card = entry.target;
        if (card.classList.contains('service-card')) {
          const cards = [...document.querySelectorAll('.service-card')];
          const index = cards.indexOf(card);
          card.style.transitionDelay = `${index * 0.1}s`;
        }

        card.classList.add('visible');
        animationObserver.unobserve(card);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => animationObserver.observe(el));

  // ========================
  // Active nav highlighting
  // ========================
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkElements.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80}px 0px 0px 0px`
  });

  sections.forEach(section => navObserver.observe(section));

  // ========================
  // Contact form
  // ========================
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    console.log('Form submission:', data);

    const submitBtn = contactForm.querySelector('.btn-submit');
    const originalHTML = submitBtn.innerHTML;

    submitBtn.innerHTML = '<span>Изпратено!</span><i class="fa-solid fa-check"></i>';
    submitBtn.classList.add('success');
    submitBtn.disabled = true;

    contactForm.reset();

    setTimeout(() => {
      submitBtn.innerHTML = originalHTML;
      submitBtn.classList.remove('success');
      submitBtn.disabled = false;
    }, 3000);
  });
});
