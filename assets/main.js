// /assets/js/main.js
(() => {
  // Year (supports multiple occurrences)
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
  if (prefersReducedMotion) document.documentElement.style.scrollBehavior = "auto";

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

  // Mobile nav drawer
  const drawer = document.getElementById("mobileNav");
  const toggle = document.querySelector(".nav-toggle");
  if (drawer && toggle) {
    const closeButtons = Array.from(drawer.querySelectorAll("[data-nav-close]"));
    const panel = drawer.querySelector(".navdrawer__panel");

    const setOpen = (open) => {
      drawer.classList.toggle("is-open", open);
      drawer.setAttribute("aria-hidden", open ? "false" : "true");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
      if (open) {
        setTimeout(() => {
          const firstLink = drawer.querySelector(".navdrawer__link");
          if (firstLink) firstLink.focus();
        }, 30);
      } else {
        toggle.focus();
      }
    };

    toggle.addEventListener("click", () => {
      const isOpen = drawer.classList.contains("is-open");
      setOpen(!isOpen);
    });

    closeButtons.forEach((btn) => btn.addEventListener("click", () => setOpen(false)));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) setOpen(false);
    });

    // click outside panel closes (safe guard)
    drawer.addEventListener("click", (e) => {
      if (!(e.target instanceof Element)) return;
      if (!panel) return;
      const clickedInside = panel.contains(e.target);
      if (!clickedInside) setOpen(false);
    });
  }
})();

