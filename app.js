(() => {
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }



  const scrollWheel = document.querySelector('.scroll-wheel');
  const siteShell = document.querySelector('.site-shell');
  if (scrollWheel && siteShell) {
    let wheelCloseTimeout;
    const openWheelNav = () => {
      window.clearTimeout(wheelCloseTimeout);
      siteShell.classList.add('is-wheel-open');
    };
    const closeWheelNav = () => {
      window.clearTimeout(wheelCloseTimeout);
      wheelCloseTimeout = window.setTimeout(() => siteShell.classList.remove('is-wheel-open'), 200);
    };
    scrollWheel.addEventListener('mouseenter', openWheelNav);
    scrollWheel.addEventListener('mouseleave', closeWheelNav);
    scrollWheel.addEventListener('focusin', openWheelNav);
    scrollWheel.addEventListener('focusout', (event) => {
      if (!scrollWheel.contains(event.relatedTarget)) closeWheelNav();
    });
  }
  const menuButton = document.querySelector('[data-menu-toggle]');
  const mainNav = document.querySelector('.main-nav');
  if (menuButton && mainNav) {
    const closeMenu = () => {
      mainNav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
    };
    menuButton.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
    });
    mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('click', (event) => {
      if (!mainNav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMenu();
    });
  }

  const viewer = document.getElementById('cardSwapViewer');
  const dotsWrap = document.getElementById('swapDots');
  if (!viewer || !dotsWrap || !window.gsap) return;

  const panels = Array.from(viewer.querySelectorAll('.swap-panel'));
  const dots = Array.from(dotsWrap.querySelectorAll('.swap-dots__dot'));
  let active = 0;
  let intervalId;
  let animating = false;

  panels.forEach((panel, index) => {
    gsap.set(panel, { autoAlpha: index === 0 ? 1 : 0, xPercent: index === 0 ? 0 : 8, yPercent: index === 0 ? 0 : 4, rotateX: index === 0 ? 0 : 8, scale: index === 0 ? 1 : 0.96, zIndex: index === 0 ? 3 : 1 });
  });

  const showPanel = (next) => {
    if (animating || next === active) return;
    animating = true;
    dots.forEach((dot, index) => dot.classList.toggle('is-active', index === next));
    const currentPanel = panels[active];
    const nextPanel = panels[next];
    const timeline = gsap.timeline({ onComplete: () => { active = next; animating = false; } });
    timeline.set(nextPanel, { zIndex: 4, autoAlpha: 1 });
    timeline.to(currentPanel, { autoAlpha: 0, xPercent: -10, yPercent: 6, rotateX: -10, scale: 0.94, duration: 0.55, ease: 'power2.inOut' }, 0);
    timeline.fromTo(nextPanel, { autoAlpha: 0, xPercent: 10, yPercent: 4, rotateX: 10, scale: 0.96 }, { autoAlpha: 1, xPercent: 0, yPercent: 0, rotateX: 0, scale: 1, duration: 0.75, ease: 'power3.out' }, 0.08);
    timeline.set(currentPanel, { zIndex: 1 });
    timeline.set(nextPanel, { zIndex: 3 });
  };

  const startAuto = () => { intervalId = window.setInterval(() => showPanel((active + 1) % panels.length), 3600); };
  const stopAuto = () => window.clearInterval(intervalId);
  dots.forEach((dot, index) => dot.addEventListener('click', () => { stopAuto(); showPanel(index); startAuto(); }));
  viewer.addEventListener('mouseenter', stopAuto);
  viewer.addEventListener('mouseleave', startAuto);
  startAuto();
})();





