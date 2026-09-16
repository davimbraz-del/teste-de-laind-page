(() => {
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const themeToggle = document.getElementById('themeToggle');
  const progressBar = document.getElementById('progressBar');
  const toTop = document.getElementById('toTop');
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  const yearEl = document.getElementById('year');

  // Footer year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme (persisted)
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
  };
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('theme'); } catch (e) {}
  applyTheme(savedTheme || 'dark');

  themeToggle?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  // Mobile menu
  const closeMenu = () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  };
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  // Header scroll state + progress bar + active link
  const sections = document.querySelectorAll('main section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  const onScroll = () => {
    const scrollY = window.scrollY;

    header.classList.toggle('scrolled', scrollY > 20);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = `${progress}%`;

    toTop?.classList.toggle('visible', scrollY > 400);

    let current = sections[0]?.id;
    sections.forEach((section) => {
      const top = section.offsetTop - 160;
      if (scrollY >= top) current = section.id;
    });
    navItems.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Back to top
  toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal, .skill-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el) => observer.observe(el));

  // Contact form (client-side only demo)
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    const name = (data.get('name') || '').toString().trim();

    formNote.style.color = 'var(--accent-2)';
    formNote.textContent = `Obrigado, ${name || 'visitante'}! Sua mensagem foi preparada — conecte este formulário a um serviço de envio (ex: Formspree, EmailJS) para receber os e-mails.`;
    contactForm.reset();
  });
})();
