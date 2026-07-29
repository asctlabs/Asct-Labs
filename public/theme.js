(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  const stored = (() => {
    try {
      return localStorage.getItem('asctlabs-theme');
    } catch (e) {
      return null;
    }
  })();
  let theme = stored === 'light' ? 'light' : 'dark';
  root.setAttribute('data-theme', theme);

  const persistTheme = () => {
    try {
      localStorage.setItem('asctlabs-theme', theme);
    } catch (e) {}
  };


  const sync = () => {
    root.setAttribute('data-theme', theme);
    toggle?.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    persistTheme();
  };

  sync();

  toggle?.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    sync();
  });
})();

