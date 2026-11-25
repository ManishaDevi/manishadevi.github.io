(function fit() {
  const MIN_W = 1100;
  function update() {
    const w = document.documentElement.clientWidth;
    document.documentElement.style.setProperty("--zoom", w < MIN_W ? (w / MIN_W).toFixed(3) : "1");
  }
  window.addEventListener("resize", update);
  update();
})();
(function tabs() {
  document.querySelectorAll(".c-tabs").forEach(function(list) {
    const tabs2 = Array.from(list.querySelectorAll(".c-tab"));
    function show(t) {
      tabs2.forEach(function(x) {
        const on = x === t;
        x.classList.toggle("is-on", on);
        x.setAttribute("aria-selected", on ? "true" : "false");
        x.tabIndex = on ? 0 : -1;
        document.getElementById(x.getAttribute("aria-controls")).hidden = !on;
      });
    }
    tabs2.forEach(function(t, i) {
      t.addEventListener("click", function() {
        show(t);
      });
      t.addEventListener("keydown", function(e) {
        const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (d) {
          const n = tabs2[(i + d + tabs2.length) % tabs2.length];
          show(n);
          n.focus();
          e.preventDefault();
        }
      });
    });
    show(tabs2[0]);
  });
})();
(function lightbox() {
  let box = null, opener = null;
  function close() {
    if (!box) return;
    const b = box;
    box = null;
    b.classList.remove("is-open");
    setTimeout(function() {
      b.remove();
    }, 220);
    document.removeEventListener("keydown", onKey);
    if (opener) opener.focus();
  }
  function onKey(e) {
    if (e.key === "Escape") close();
  }
  document.addEventListener("click", function(e) {
    const z = e.target.closest(".c-zoom");
    if (!z || box) return;
    opener = z;
    box = document.createElement("div");
    box.className = "c-lb";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-label", "Enlarged screen");
    const img = document.createElement("img");
    img.src = z.dataset.src;
    img.alt = z.querySelector("img").alt;
    box.appendChild(img);
    box.addEventListener("click", close);
    document.body.appendChild(box);
    document.addEventListener("keydown", onKey);
    requestAnimationFrame(function() {
      box.classList.add("is-open");
    });
  });
})();
(function() {
  document.querySelectorAll(".fc-sec").forEach(function(sec) {
    var tabs2 = [].slice.call(sec.querySelectorAll(".fc-stage"));
    var panels = [].slice.call(sec.querySelectorAll(".fc-panel"));
    var play = sec.querySelector(".fc-play"), timer = null, cur = 0;
    function show(i, focus) {
      cur = (i + tabs2.length) % tabs2.length;
      tabs2.forEach(function(t, k) {
        var on = k === cur;
        t.classList.toggle("is-on", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        panels[k].hidden = !on;
      });
      if (focus) tabs2[cur].focus();
    }
    function stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      play.setAttribute("aria-pressed", "false");
      play.innerHTML = "&#9654; Play journey";
    }
    function start() {
      play.setAttribute("aria-pressed", "true");
      play.innerHTML = "&#10074;&#10074; Pause";
      if (cur === tabs2.length - 1) show(0);
      timer = setInterval(function() {
        if (cur === tabs2.length - 1) stop();
        else show(cur + 1);
      }, 3200);
    }
    tabs2.forEach(function(t, k) {
      t.addEventListener("click", function() {
        stop();
        show(k);
      });
      t.addEventListener("keydown", function(e) {
        var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (d) {
          e.preventDefault();
          stop();
          show(cur + d, true);
        }
      });
    });
    sec.querySelector(".fc-prev").addEventListener("click", function() {
      stop();
      show(cur - 1);
    });
    sec.querySelector(".fc-next").addEventListener("click", function() {
      stop();
      show(cur + 1);
    });
    play.addEventListener("click", function() {
      if (timer) stop();
      else start();
    });
    show(0);
  });
})();
