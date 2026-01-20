(() => {
  // Year
  const years = document.querySelectorAll("#year");
  const y = String(new Date().getFullYear());
  years.forEach((el) => (el.textContent = y));

  // Topbar border polish on scroll
  const topbar = document.querySelector(".topbar");
  const onScroll = () => {
    if (!topbar) return;
    topbar.style.borderBottomColor =
      window.scrollY > 4 ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.08)";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Reduced motion respect
  const prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    document.documentElement.style.scrollBehavior = "auto";
  }

  // Active nav link highlighting (for pages with in-page anchors)
  const navLinks = Array.from(document.querySelectorAll('.nav__link[href^="#"]'));
  const sections = navLinks
    .map((a) => {
      const id = a.getAttribute("href").slice(1);
      const el = document.getElementById(id);
      return el ? { id, el, a } : null;
    })
    .filter(Boolean);

  if (sections.length) {
    const setActive = () => {
      let best = null;

      for (const s of sections) {
        const r = s.el.getBoundingClientRect();
        const top = r.top;
        if (top <= 120) best = s;
      }

      navLinks.forEach((a) => a.classList.remove("is-active"));
      if (best) best.a.classList.add("is-active");
    };

    window.addEventListener("scroll", setActive, { passive: true });
    window.addEventListener("resize", setActive, { passive: true });
    setActive();
  }

  // Smooth anchor scroll (only if not reduced motion)
  if (!prefersReducedMotion) {
    document.addEventListener("click", (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;

      const a = t.closest('a[href^="#"]');
      if (!a) return;

      const href = a.getAttribute("href");
      if (!href || href.length < 2) return;

      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top, behavior: "smooth" });
    });
  }

  // -------------------------------------------------------
  // Mobile Drawer Nav
  // -------------------------------------------------------
  const root = document.documentElement;
  const toggle = document.querySelector('[data-nav-toggle="true"]');
  const overlay = document.querySelector('[data-drawer-overlay="true"]');
  const drawer = document.querySelector('[data-drawer="true"]');
  const closeBtn = document.querySelector('[data-drawer-close="true"]');

  if (!toggle || !overlay || !drawer) return;

  const focusableSelector =
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

  let lastFocus = null;

  const setAria = (open) => {
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
  };

  const openNav = () => {
    if (root.classList.contains("nav-open")) return;
    lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    root.classList.add("nav-open");
    setAria(true);

    // focus first link
    const first = drawer.querySelector(focusableSelector);
    if (first instanceof HTMLElement) first.focus();
    document.body.style.overflow = "hidden";
  };

  const closeNav = () => {
    if (!root.classList.contains("nav-open")) return;
    root.classList.remove("nav-open");
    setAria(false);
    document.body.style.overflow = "";

    if (lastFocus && lastFocus instanceof HTMLElement) lastFocus.focus();
  };

  toggle.addEventListener("click", () => {
    if (root.classList.contains("nav-open")) closeNav();
    else openNav();
  });

  if (closeBtn) closeBtn.addEventListener("click", closeNav);
  overlay.addEventListener("click", closeNav);

  // close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();

    // focus trap while open
    if (e.key === "Tab" && root.classList.contains("nav-open")) {
      const focusables = Array.from(drawer.querySelectorAll(focusableSelector))
        .filter((el) => el instanceof HTMLElement);

      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });

  // close on drawer link click (keeps it snappy on mobile)
  drawer.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    const a = t.closest("a");
    if (!a) return;
    closeNav();
  });

  // init ARIA
  setAria(false);
})();

