(function flowStory() {
  const wide = window.matchMedia("(min-width: 900px)");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const STEP_VH = 60;
  const flows = [...document.querySelectorAll(".ufs")];
  if (!flows.length) return;
  const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v15M5 13l7 7 7-7"/></svg>';
  function build(flow) {
    const steps = [...flow.querySelectorAll(".ufs-step")];
    const total = steps.length;
    const track = document.createElement("div");
    track.className = "ufs-track";
    track.innerHTML = '<div class="ufs-stage"><div class="ufs-left"></div><div class="ufs-right"></div></div>';
    const label = flow.getAttribute("data-label");
    const left = track.querySelector(".ufs-left");
    const right = track.querySelector(".ufs-right");
    steps.forEach((s, i) => {
      const t = document.createElement("div");
      t.className = "ufs-txt";
      const cnt = document.createElement("span");
      cnt.className = "ufs-cnt";
      cnt.textContent = label + " \xB7 " + String(i + 1).padStart(2, "0") + " / " + String(total).padStart(2, "0");
      t.appendChild(cnt);
      [...s.children].forEach((c) => {
        if (!c.classList.contains("ufs-fig")) t.appendChild(c.cloneNode(true));
      });
      left.appendChild(t);
      const shot = document.createElement("div");
      shot.className = "ufs-shot";
      shot.appendChild(s.querySelector(".ufs-fig").cloneNode(true));
      right.appendChild(shot);
    });
    const skip = document.createElement("a");
    skip.className = "ufs-skip";
    skip.href = flow.getAttribute("data-skip");
    skip.innerHTML = flow.getAttribute("data-skip-label") + " " + arrow;
    track.querySelector(".ufs-stage").appendChild(skip);
    skip.addEventListener("click", (e) => {
      const target = document.querySelector(flow.getAttribute("data-skip"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
    flow.appendChild(track);
    flow.classList.add("ufs--on");
    const texts = [...left.children];
    const shots = [...right.children];
    let cur = -1;
    function set(i) {
      if (i === cur) return;
      cur = i;
      texts.forEach((e, k) => e.classList.toggle("on", k === i));
      shots.forEach((e, k) => e.classList.toggle("on", k === i));
    }
    function size() {
      track.style.height = total * STEP_VH + 40 + "vh";
    }
    function update() {
      const r = track.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = Math.min(0.999, Math.max(0, -r.top / Math.max(1, span)));
      set(Math.floor(p * total));
    }
    size();
    set(0);
    update();
    flow._ufs = { track, size, update };
  }
  function teardown(flow) {
    if (!flow._ufs) return;
    flow._ufs.track.remove();
    flow.classList.remove("ufs--on");
    flow._ufs = null;
  }
  function apply() {
    flows.forEach((f) => wide.matches ? f._ufs || build(f) : teardown(f));
  }
  function onScroll() {
    flows.forEach((f) => f._ufs && f._ufs.update());
  }
  apply();
  wide.addEventListener("change", apply);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => flows.forEach((f) => f._ufs && (f._ufs.size(), f._ufs.update())));
})();
