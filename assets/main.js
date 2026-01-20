(() => {
  // Year injection: supports #year and .js-year
  const y = String(new Date().getFullYear());
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = y;

  document.querySelectorAll(".js-year").forEach((el) => {
    el.textContent = y;
  });

  // Topbar subtle border polish on scroll
  const topbar = document.querySelector(".topbar");
  const setTopbarBorder = () => {
    if (!topbar) return;
    topbar.style.borderBottomColor =
      window.scrollY > 4 ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.08)";
  };
  window.addEventListener("scroll", setTopbarBorder, { passive: true });
  setTopbarBorder();

  // Active nav link highlight (only for same-page anchors)
  const navLinks = Array.from(document.querySelectorAll(".nav__link"))
    .filter((a) => (a.getAttribute("href") || "").startsWith("#"));

  if (navLinks.length) {
    const sections = navLinks
      .map((a) => document.querySelector(a.getAttribute("href")))
      .filter(Boolean);

    const setActive = () => {
      const scrollY = window.scrollY || 0;
      const offset = 120; // topbar gap
      let activeId = "";

      for (const sec of sections) {
        const top = sec.getBoundingClientRect().top + scrollY - offset;
        if (scrollY >= top) activeId = sec.id || "";
      }

      navLinks.forEach((a) => {
        const isActive = (a.getAttribute("href") || "") === `#${activeId}`;
        a.classList.toggle("is-active", isActive);
        if (isActive) a.setAttribute("aria-current", "page");
        else a.removeAttribute("aria-current");
      });
    };

    window.addEventListener("scroll", setActive, { passive: true });
    window.addEventListener("resize", setActive, { passive: true });
    setActive();
  }

  // Respect reduced motion
  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    document.documentElement.classList.add("reduce-motion");
  }
})();

