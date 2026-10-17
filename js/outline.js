(function outline() {
  const sections = [...document.querySelectorAll("[data-outline][id]")];
  if (!sections.length) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const READ_LINE = 0.35;
  function h(tag, cls, attrs) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    for (const k in attrs || {}) e.setAttribute(k, attrs[k]);
    return e;
  }
  function entry(s, i, cls) {
    const li = h("li");
    const a = h("a", cls, { href: "#" + s.id, "data-i": i });
    a.innerHTML = '<span class="ol-num">' + String(i + 1).padStart(2, "0") + '</span><span class="ol-text"></span>';
    a.querySelector(".ol-text").textContent = s.getAttribute("data-outline");
    li.appendChild(a);
    return li;
  }
  const rail = h("nav", "ol-rail", { "aria-label": "Case study outline" });
  rail.innerHTML = '<p class="ol-rail__title">Outline</p>';
  const railList = h("ol", "ol-rail__list");
  sections.forEach((s, i) => railList.appendChild(entry(s, i, "ol-link")));
  rail.appendChild(railList);
  const R = 11, C = 2 * Math.PI * R;
  const fab = h("button", "ol-fab", { type: "button", "aria-haspopup": "dialog", "aria-expanded": "false" });
  fab.innerHTML = '<svg class="ol-fab__ring" width="28" height="28" viewBox="0 0 28 28" aria-hidden="true"><circle cx="14" cy="14" r="' + R + '" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="2.5"/><circle class="ol-fab__arc" cx="14" cy="14" r="' + R + '" fill="none" stroke="rgb(254,226,231)" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="' + C + '" stroke-dashoffset="' + C + '" transform="rotate(-90 14 14)"/></svg><span class="ol-fab__label">Outline</span><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 8l4-4 4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const sheet = h("div", "ol-sheet", { role: "dialog", "aria-modal": "true", "aria-label": "Case study outline", hidden: "" });
  sheet.innerHTML = '<div class="ol-sheet__backdrop"></div><div class="ol-sheet__panel"><div class="ol-sheet__head"><p>Outline</p><button type="button" class="ol-sheet__close" aria-label="Close outline">&times;</button></div><ol class="ol-sheet__list"></ol></div>';
  const sheetList = sheet.querySelector(".ol-sheet__list");
  sections.forEach((s, i) => sheetList.appendChild(entry(s, i, "ol-link")));
  document.body.append(rail, fab, sheet);
  const links = [...document.querySelectorAll(".ol-link")];
  const fabLabel = fab.querySelector(".ol-fab__label");
  const fabArc = fab.querySelector(".ol-fab__arc");
  let active = -2;
  function update() {
    const vh = window.innerHeight;
    const docH = document.documentElement.scrollHeight;
    const y = window.scrollY;
    let idx = -1;
    sections.forEach((s, i) => {
      if (s.getBoundingClientRect().top <= vh * READ_LINE) idx = i;
    });
    if (y + vh >= docH - 2) idx = sections.length - 1;
    const progress = Math.min(1, Math.max(0, y / Math.max(1, docH - vh)));
    fabArc.style.strokeDashoffset = String(C * (1 - progress));
    if (idx !== active) {
      active = idx;
      links.forEach((a) => {
        const i = +a.getAttribute("data-i");
        a.classList.toggle("is-active", i === idx);
        a.classList.toggle("is-past", i < idx);
        if (i === idx) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
      fabLabel.textContent = idx >= 0 ? sections[idx].getAttribute("data-outline") : "Outline";
      keepActiveInView();
    }
    const show = idx >= 0;
    rail.classList.toggle("is-on", show);
    fab.classList.toggle("is-on", show);
  }
  function keepActiveInView() {
    const a = sheetList.querySelector(".is-active");
    if (a && !sheet.hidden) a.scrollIntoView({ block: "nearest" });
  }
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      update();
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  window.addEventListener("load", update);
  function go(i) {
    const s = sections[i];
    s.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    try {
      history.replaceState(null, "", "#" + s.id);
    } catch (e) {
    }
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest(".ol-link");
    if (!a) return;
    e.preventDefault();
    go(+a.getAttribute("data-i"));
    if (!sheet.hidden) closeSheet();
  });
  function openSheet() {
    sheet.hidden = false;
    requestAnimationFrame(() => sheet.classList.add("is-open"));
    fab.setAttribute("aria-expanded", "true");
    document.documentElement.classList.add("ol-lock");
    const a = sheetList.querySelector(".is-active") || sheetList.querySelector(".ol-link");
    if (a) {
      a.focus({ preventScroll: true });
      a.scrollIntoView({ block: "center" });
    }
  }
  function closeSheet() {
    sheet.classList.remove("is-open");
    fab.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("ol-lock");
    setTimeout(() => {
      sheet.hidden = true;
    }, 220);
    fab.focus({ preventScroll: true });
  }
  fab.addEventListener("click", () => sheet.hidden ? openSheet() : closeSheet());
  sheet.querySelector(".ol-sheet__backdrop").addEventListener("click", closeSheet);
  sheet.querySelector(".ol-sheet__close").addEventListener("click", closeSheet);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !sheet.hidden) closeSheet();
    if (e.key === "Tab" && !sheet.hidden) {
      const f = [...sheet.querySelectorAll("a, button")];
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
  update();
})();
