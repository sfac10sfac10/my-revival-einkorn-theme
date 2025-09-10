/* Header dropdown: hover opens on desktop, link click navigates, caret/summary toggles on mobile */
(function () {
  'use strict';

  const MQ_DESKTOP = window.matchMedia('(min-width: 990px) and (pointer: fine)');
  const HOVER_DELAY = 120;

  function bindHoverMenus() {
    const dropdowns = document.querySelectorAll('header-menu details.header-dropdown');

    dropdowns.forEach((dd) => {
      let closeTimer = null;
      const summary = dd.querySelector('summary');
      if (!summary) return;

      // Prevent summary toggle on desktop; allow anchor to navigate
      summary.addEventListener('click', (e) => {
        if (!MQ_DESKTOP.matches) return;
        const anchor = e.target.closest('.header__menu-parent-link');
        if (anchor) {
          e.stopPropagation(); // let navigation happen
          return;
        }
        e.preventDefault(); // block details toggle by summary click on desktop
      });

      const open = () => {
        clearTimeout(closeTimer);
        if (!dd.hasAttribute('open')) dd.setAttribute('open', '');
        summary.setAttribute('aria-expanded', 'true');
      };

      const close = () => {
        clearTimeout(closeTimer);
        dd.removeAttribute('open');
        summary.setAttribute('aria-expanded', 'false');
      };

      // Desktop hover behavior
      dd.addEventListener('mouseenter', () => {
        if (MQ_DESKTOP.matches) open();
      });

      dd.addEventListener('mouseleave', () => {
        if (!MQ_DESKTOP.matches) return;
        closeTimer = setTimeout(close, HOVER_DELAY);
      });

      // A11y: focus opens, ESC closes (desktop)
      summary.addEventListener('focusin', () => {
        if (MQ_DESKTOP.matches) open();
      });

      dd.addEventListener('keyup', (e) => {
        if (MQ_DESKTOP.matches && e.key === 'Escape') close();
      });

      // Reset when switching to mobile
      const onMediaChange = () => {
        if (!MQ_DESKTOP.matches) dd.removeAttribute('open');
      };
      (MQ_DESKTOP.addEventListener || MQ_DESKTOP.addListener).call(
        MQ_DESKTOP,
        'change' in MQ_DESKTOP ? 'change' : onMediaChange,
        onMediaChange
      );
    });
  }

  // Stop details toggle when clicking the parent link inside summary (captures early)
  document.addEventListener(
    'click',
    (e) => {
      const link = e.target.closest('summary .header__menu-parent-link');
      if (link) e.stopPropagation();
    },
    true
  );

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindHoverMenus);
  } else {
    bindHoverMenus();
  }
})();
