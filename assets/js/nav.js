// Mobile menu for the sub-pages (.wk-header). Desktop shows .wk-nav inline and the button is hidden.
(() => {
  const header = document.querySelector(".wk-header");
  const btn = header && header.querySelector(".wk-menu-btn");
  if (!btn) return;

  const set = (open) => {
    header.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", String(open));
  };
  const isOpen = () => header.classList.contains("is-open");

  btn.addEventListener("click", () => set(!isOpen()));
  document.addEventListener("click", (e) => {
    if (isOpen() && !header.contains(e.target)) set(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) {
      set(false);
      btn.focus();
    }
  });
  let y = window.scrollY;
  window.addEventListener(
    "scroll",
    () => {
      if (isOpen() && Math.abs(window.scrollY - y) > 40) set(false);
      if (!isOpen()) y = window.scrollY;
    },
    { passive: true }
  );
  window.matchMedia("(min-width: 768px)").addEventListener("change", () => set(false));
})();
