// /assets/js/main.js
(() => {
  // ----------------------------
  // Year (supports multiple #year occurrences)
  // ----------------------------
  const years = document.querySelectorAll("#year");
  const y = String(new Date().getFullYear());
  years.forEach((el) => (el.textContent = y));

  // ----------------------------
  // Topbar border polish on scroll
  // ----------------------------
  const topbar = document.querySelector(".topbar");
  const onScroll = () => {
    if (!topbar) return;
    topbar.style.borderBottomColor =
      window.scrollY > 4 ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.08)";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ----------------------------
  // Reduced motion respect
  // ----------------------------
  const prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    document.documentElement.style.scrollBehavior = "auto";
  }

  // ----------------------------
  // Active nav link highlighting (only for in-page anchors on index)
  // ----------------------------
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

  // ----------------------------
  // Smooth anchor scroll (only if not reduced motion)
  // ----------------------------
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

  // ----------------------------
  // Mobile Drawer Navigation
  // ----------------------------
  const drawer = document.querySelector('[data-drawer="true"]');
  const overlay = document.querySelector('[data-drawer-overlay="true"]');
  const toggleBtn = document.querySelector('[data-nav-toggle="true"]');
  const closeBtn = document.querySelector('[data-drawer-close="true"]');

  if (drawer && overlay && toggleBtn) {
    const setOpen = (open) => {
      drawer.classList.toggle("is-open", open);
      overlay.classList.toggle("is-open", open);

      drawer.setAttribute("aria-hidden", open ? "false" : "true");
      overlay.setAttribute("aria-hidden", open ? "false" : "true");
      toggleBtn.setAttribute("aria-expanded", open ? "true" : "false");

      // lock scroll when open
      document.documentElement.classList.toggle("no-scroll", open);
      document.body.classList.toggle("no-scroll", open);

      // focus handling
      if (open) {
        // focus first link for accessibility
        const firstLink = drawer.querySelector("a, button");
        if (firstLink && firstLink instanceof HTMLElement) firstLink.focus();
      } else {
        if (toggleBtn instanceof HTMLElement) toggleBtn.focus();
      }
    };

    const openDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);

    toggleBtn.addEventListener("click", () => {
      const isOpen = drawer.classList.contains("is-open");
      setOpen(!isOpen);
    });

    if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
    overlay.addEventListener("click", closeDrawer);

    // close on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) closeDrawer();
    });

    // close drawer when clicking any drawer link
    drawer.addEventListener("click", (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const link = t.closest("a");
      if (!link) return;
      closeDrawer();
    });

    // safety: close if resized to desktop
    window.addEventListener(
      "resize",
      () => {
        if (window.innerWidth > 980 && drawer.classList.contains("is-open")) {
          closeDrawer();
        }
      },
      { passive: true }
    );
  }
})();

