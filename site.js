document.addEventListener('DOMContentLoaded', () => {
  const storageKey = 'site-theme';
  const html = document.documentElement;
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');

  const getPreferredTheme = () => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored === 'light' || stored === 'dark') return stored;
    return prefersDark && prefersDark.matches ? 'dark' : 'light';
  };

  const applyTheme = (theme) => {
    html.setAttribute('data-theme', theme);
    window.localStorage.setItem(storageKey, theme);

    const button = document.querySelector('.theme-toggle');
    if (button) {
      const isDark = theme === 'dark';
      button.setAttribute('aria-pressed', String(isDark));
      button.setAttribute('aria-label', isDark ? 'Switch to day mode' : 'Switch to night mode');
      button.setAttribute('title', isDark ? 'Switch to day mode' : 'Switch to night mode');
      button.innerHTML = `<span aria-hidden="true">${isDark ? '☀' : '☾'}</span>`;
    }
  };

  const mountThemeToggle = () => {
    const headerInner = document.querySelector('.site-header-inner');
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('site-nav');
    if (!headerInner || !navToggle || !nav) return;

    let controls = headerInner.querySelector('.header-controls');
    if (!controls) {
      controls = document.createElement('div');
      controls.className = 'header-controls';
      headerInner.insertBefore(controls, nav);
      controls.appendChild(navToggle);
    }

    let themeToggle = controls.querySelector('.theme-toggle');
    if (!themeToggle) {
      themeToggle = document.createElement('button');
      themeToggle.className = 'theme-toggle';
      themeToggle.type = 'button';
      controls.insertBefore(themeToggle, navToggle);
      themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        applyTheme(current === 'dark' ? 'light' : 'dark');
      });
    }
  };

  mountThemeToggle();
  applyTheme(getPreferredTheme());

  if (prefersDark && typeof prefersDark.addEventListener === 'function') {
    prefersDark.addEventListener('change', (event) => {
      const stored = window.localStorage.getItem(storageKey);
      if (stored !== 'light' && stored !== 'dark') {
        applyTheme(event.matches ? 'dark' : 'light');
      }
    });
  }

  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('nav-open', isOpen);
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      });
    });
  }

  const setPanelState = (button, panel, isOpen, openText = null, closedText = null) => {
    if (!panel) return;

    if (isOpen) {
      panel.removeAttribute('hidden');
    } else {
      panel.setAttribute('hidden', '');
    }

    if (button) {
      button.setAttribute('aria-expanded', String(isOpen));
      if (openText && closedText) {
        button.textContent = isOpen ? openText : closedText;
      }
    }
  };

  const isInteractiveElement = (element) => {
    return Boolean(
      element.closest(
        '.pub-actions, .mini-btn, .bibtex-wrap, .bibtex-toolbar, .copy-bibtex, a, button:not(.paper-toggle), pre'
      )
    );
  };

  document.querySelectorAll('.pub-item').forEach((item) => {
    const titleButton = item.querySelector('.paper-toggle');
    if (!titleButton) return;

    const abstractId = titleButton.getAttribute('data-target');
    const abstract = abstractId ? document.getElementById(abstractId) : null;
    if (!abstract) return;

    titleButton.setAttribute('aria-controls', abstractId);
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', 'Toggle abstract');

    const syncItemState = () => {
      const isOpen = !abstract.hasAttribute('hidden');
      item.classList.toggle('is-open', isOpen);
      item.setAttribute('aria-expanded', String(isOpen));
      titleButton.setAttribute('aria-expanded', String(isOpen));
    };

    const toggleAbstract = () => {
      const isOpen = abstract.hasAttribute('hidden');
      setPanelState(titleButton, abstract, isOpen);
      syncItemState();
    };

    syncItemState();

    titleButton.addEventListener('click', (event) => {
      event.preventDefault();
      toggleAbstract();
    });

    item.addEventListener('click', (event) => {
      if (isInteractiveElement(event.target)) return;
      if (event.target.closest('.paper-toggle')) return;
      toggleAbstract();
    });

    item.addEventListener('keydown', (event) => {
      if (event.target !== item) return;
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      toggleAbstract();
    });
  });

  document.querySelectorAll('.bibtex-toggle').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const targetId = button.getAttribute('data-target');
      const panel = targetId ? document.getElementById(targetId) : null;
      if (!panel) return;

      const isOpen = panel.hasAttribute('hidden');
      setPanelState(button, panel, isOpen, 'Hide BibTeX', 'BibTeX');
    });
  });

  document.querySelectorAll('.copy-bibtex').forEach((button) => {
    button.addEventListener('click', async (event) => {
      event.stopPropagation();
      const targetId = button.getAttribute('data-target');
      const panel = targetId ? document.getElementById(targetId) : null;
      if (!panel) return;

      const pre = panel.querySelector('pre');
      const status = panel.querySelector('.copy-status');
      if (!pre) return;

      try {
        await navigator.clipboard.writeText(pre.textContent.trim());
        if (status) {
          status.textContent = 'Copied.';
          window.setTimeout(() => {
            status.textContent = '';
          }, 1600);
        }
      } catch (err) {
        if (status) {
          status.textContent = 'Copy failed.';
          window.setTimeout(() => {
            status.textContent = '';
          }, 1600);
        }
      }
    });
  });
});
