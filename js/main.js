/* ============================================
   SKYVIEW LOUNGE — main.js
   Handles: navbar scroll, mobile menu,
   testimonials, menu tabs, reveal animations,
   back-to-top, gallery lightbox
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- Navbar scroll effect ---- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  /* ---- Hamburger / Mobile menu ---- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close when any nav link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!navbar.contains(e.target)) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      }
    });
  }

  /* ---- Active nav link highlight ---- */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---- Menu tabs ---- */
  document.querySelectorAll('.menu-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = this.dataset.tab;
      document.querySelectorAll('.menu-tab').forEach(function (t) { t.classList.remove('active'); });
      document.querySelectorAll('.menu-panel').forEach(function (p) { p.classList.remove('active'); });
      this.classList.add('active');
      var panel = document.getElementById(target);
      if (panel) panel.classList.add('active');
    });
  });

  /* ---- Testimonials slider ---- */
  var testimonials = document.querySelectorAll('.testimonial');
  var dots         = document.querySelectorAll('.t-dot');
  var currentT     = 0;
  var autoSlide;

  function showTestimonial(n) {
    testimonials.forEach(function (t) { t.classList.remove('active'); });
    dots.forEach(function (d) { d.classList.remove('active'); });
    currentT = (n + testimonials.length) % testimonials.length;
    if (testimonials[currentT]) testimonials[currentT].classList.add('active');
    if (dots[currentT]) dots[currentT].classList.add('active');
  }

  if (testimonials.length > 0) {
    showTestimonial(0);
    autoSlide = setInterval(function () { showTestimonial(currentT + 1); }, 5000);

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        clearInterval(autoSlide);
        showTestimonial(i);
        autoSlide = setInterval(function () { showTestimonial(currentT + 1); }, 5000);
      });
    });
  }

  /* ---- Reveal on scroll ---- */
  var revealEls = document.querySelectorAll('.reveal');

  function checkReveal() {
    revealEls.forEach(function (el) {
      var top = el.getBoundingClientRect().top;
      if (top < window.innerHeight - 80) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', checkReveal);
  checkReveal(); // run on load

  /* ---- Back to top ---- */
  var backTop = document.getElementById('back-to-top');
  if (backTop) {
    window.addEventListener('scroll', function () {
      backTop.classList.toggle('visible', window.scrollY > 400);
    });

    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- Gallery lightbox ---- */
  var lightbox  = document.getElementById('lightbox');
  var lbImg     = document.getElementById('lightbox-img');
  var lbClose   = document.getElementById('lightbox-close');

  document.querySelectorAll('.gallery-item').forEach(function (item) {
    item.addEventListener('click', function () {
      if (!lightbox) return;
      var src = this.dataset.src;
      if (src && lbImg) { lbImg.setAttribute('src', src); }
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (lbClose) {
    lbClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  /* ---- Stat counter animation ---- */
  var statNums = document.querySelectorAll('.stat-number[data-target]');

  function animateCount(el) {
    var target  = parseInt(el.dataset.target, 10);
    var suffix  = el.dataset.suffix || '';
    var duration = 1800;
    var start   = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + eased * (target - start)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  if (statNums.length > 0) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNums.forEach(function (el) { observer.observe(el); });
  }

  /* ---- Reservation / Feedback form validation ---- */
  var forms = document.querySelectorAll('.validated-form');

  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      // Clear previous errors
      form.querySelectorAll('.form-error').forEach(function (err) { err.style.display = 'none'; });
      form.querySelectorAll('.form-control').forEach(function (input) { input.style.borderColor = ''; });

      // Validate required fields
      form.querySelectorAll('[required]').forEach(function (field) {
        var error = form.querySelector('[data-for="' + field.id + '"]');
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#e05c5c';
          if (error) { error.style.display = 'block'; error.textContent = 'This field is required.'; }
        } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) {
          valid = false;
          field.style.borderColor = '#e05c5c';
          if (error) { error.style.display = 'block'; error.textContent = 'Please enter a valid email address.'; }
        } else if (field.type === 'tel' && field.value.trim() && !/^\+?[\d\s\-()]{7,15}$/.test(field.value.trim())) {
          valid = false;
          field.style.borderColor = '#e05c5c';
          if (error) { error.style.display = 'block'; error.textContent = 'Please enter a valid phone number.'; }
        }
      });

      if (valid) {
        var successMsg = form.querySelector('.form-success');
        if (successMsg) {
          successMsg.style.display = 'block';
          form.reset();
          setTimeout(function () { successMsg.style.display = 'none'; }, 6000);
        }
      }
    });

    // Live validation: clear error on input
    form.querySelectorAll('.form-control').forEach(function (field) {
      field.addEventListener('input', function () {
        this.style.borderColor = '';
        var error = form.querySelector('[data-for="' + this.id + '"]');
        if (error) error.style.display = 'none';
      });
    });
  });

}); // end DOMContentLoaded
