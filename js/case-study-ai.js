(function fitHero() {
  const HERO_W = 1200;
  function update() {
    const w = document.documentElement.clientWidth;
    document.documentElement.style.setProperty("--hero-zoom", Math.min(1, w / HERO_W).toFixed(3));
  }
  window.addEventListener("resize", update);
  update();
})();
