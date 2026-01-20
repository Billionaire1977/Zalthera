// /assets/main.js
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
        if (r.top <= 120) best = s;
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

  // ---------------------------
  // Mobile Drawer Navigation
  // ---------------------------
  const toggleBtn = document.querySelector("[data-nav-toggle='true']");
  const drawer = document.querySelector("[data-drawer='true']");
  const overlay = document.querySelector("[data-drawer-overlay='true']");
  const closeBtn = document.querySelector("[data-drawer-close='true']");

  if (toggleBtn && drawer && overlay) {
    const setAria = (open) => {
      toggleBtn.setAttribute("aria-expanded", open ? "true" : "false");
      drawer.setAttribute("aria-hidden", open ? "false" : "true");
      overlay.setAttribute("aria-hidden", open ? "false" : "true");
    };

    const openDrawer = () => {
      drawer.classList.add("is-open");
      overlay.classList.add("is-open");
      document.body.classList.add("no-scroll");
      setAria(true);
    };

    const closeDrawer = () => {
      drawer.classList.remove("is-open");
      overlay.classList.remove("is-open");
      document.body.classList.remove("no-scroll");
      setAria(false);
    };

    // initial state
    setAria(false);

    toggleBtn.addEventListener("click", () => {
      const isOpen = drawer.classList.contains("is-open");
      isOpen ? closeDrawer() : openDrawer();
    });

    if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
    overlay.addEventListener("click", closeDrawer);

    // Close on ESC
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) {
        closeDrawer();
      }
    });

    // Close when clicking a drawer link
    drawer.addEventListener("click", (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const a = t.closest("a");
      if (!a) return;
      closeDrawer();
    });
  }
})();
