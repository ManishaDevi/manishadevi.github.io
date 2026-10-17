(function arc() {
  const stage = document.getElementById("arc");
  const cards = [...stage.querySelectorAll(".testimonial")];
  const n = cards.length;
  const STEP_DEG = 10.3;
  const RADIUS = 1450;
  const VISIBLE = 2.6;
  const DRAG_SPEED = 6e-3;
  const AUTO_SPEED = 25e-4;
  let pos = 0;
  let dragging = false, lastX = 0, velocity = 0, hovered = false;
  function render() {
    cards.forEach((card, i) => {
      let d = ((i - pos) % n + n) % n;
      if (d > n / 2) d -= n;
      const angle = d * STEP_DEG;
      const rad = angle * Math.PI / 180;
      const x = Math.sin(rad) * RADIUS;
      const y = (1 - Math.cos(rad)) * RADIUS;
      card.style.transform = `translate(calc(-50% + ${x}px), ${y}px) rotate(${angle}deg)`;
      const dist = Math.abs(d);
      card.style.opacity = dist > VISIBLE ? 0 : Math.max(0.18, 1 - Math.max(0, dist - 1.2) * 0.7);
      card.style.zIndex = String(100 - Math.round(dist * 10));
    });
  }
  function tick() {
    if (!dragging) {
      pos += velocity;
      velocity *= 0.94;
      if (Math.abs(velocity) < 5e-4 && !hovered) pos += AUTO_SPEED;
    }
    render();
    requestAnimationFrame(tick);
  }
  stage.addEventListener("pointerdown", (e) => {
    dragging = true;
    lastX = e.clientX;
    velocity = 0;
    stage.classList.add("is-dragging");
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    pos -= dx * DRAG_SPEED;
    velocity = -dx * DRAG_SPEED;
  });
  const end = () => {
    dragging = false;
    stage.classList.remove("is-dragging");
  };
  stage.addEventListener("pointerup", end);
  stage.addEventListener("pointercancel", end);
  stage.addEventListener("mouseenter", () => hovered = true);
  stage.addEventListener("mouseleave", () => hovered = false);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    render();
    return;
  }
  tick();
})();
(function pill() {
  const pillEl = document.getElementById("pill");
  const intro = document.getElementById("intro");
  const thanks2 = document.getElementById("thanks");
  function update() {
    const vh = window.innerHeight;
    const introTop = intro.getBoundingClientRect().top;
    const thanksTop = thanks2.getBoundingClientRect().top;
    const show = introTop < vh * 0.2 && thanksTop > vh * 0.95;
    pillEl.classList.toggle("is-visible", show);
  }
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
})();
(function thanks() {
  const el = document.getElementById("thanks");
  new IntersectionObserver(([entry]) => {
    el.classList.toggle("in-view", entry.isIntersecting);
  }, { threshold: 0.35 }).observe(el);
})();
