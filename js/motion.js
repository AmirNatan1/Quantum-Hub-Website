/* Quantum-hub — motion.js
   Implements DESIGN-SPEC §5 motion tiers T2–T4 in vanilla JS.
   Single reduced-motion switch: everything degrades to static/final states. */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- T2 · reveals (once, 20% in view) ---------- */
  var revealEls = document.querySelectorAll(".reveal, .reveal-stagger");
  if (reduced) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else if (revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.2 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- header: hide on down, show on up, slim on return ---------- */
  var header = document.querySelector(".site-header");
  var lastY = 0;
  if (header) {
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (y > 200 && y > lastY) header.classList.add("is-hidden");
      else header.classList.remove("is-hidden");
      header.classList.toggle("is-slim", y > 200);
      lastY = y;
    }, { passive: true });
  }

  /* ---------- explore dropdown ---------- */
  var exploreBtn = document.querySelector("[data-explore-toggle]");
  var explorePanel = document.querySelector(".explore-panel");
  if (exploreBtn && explorePanel) {
    exploreBtn.addEventListener("click", function (ev) {
      ev.stopPropagation();
      explorePanel.classList.toggle("is-open");
      exploreBtn.setAttribute("aria-expanded", explorePanel.classList.contains("is-open"));
    });
    document.addEventListener("click", function (ev) {
      if (!explorePanel.contains(ev.target)) explorePanel.classList.remove("is-open");
    });
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") explorePanel.classList.remove("is-open");
    });
  }

  /* ---------- count-ups (once, in view; AT gets final value: it's in the DOM) ---------- */
  var counters = document.querySelectorAll("[data-count]");
  function runCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    if (isNaN(target)) return; // placeholder like "[N]" — leave as-is
    if (reduced) { el.textContent = target + suffix; return; }
    var t0 = null, dur = 1400;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      p = 1 - Math.pow(1 - p, 3); /* ease-out cubic */
      el.textContent = Math.round(target * p) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- T3 · scroll-linked: parallax + word scrub + progress bar ---------- */
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  var claims = Array.prototype.slice.call(document.querySelectorAll(".big-claim"));
  var progress = document.querySelector(".progress");

  /* wrap each word of big claims in a span */
  claims.forEach(function (c) {
    var words = c.textContent.trim().split(/\s+/);
    c.innerHTML = words.map(function (w) { return '<span class="w">' + w + "</span>"; }).join(" ");
    if (reduced) c.querySelectorAll(".w").forEach(function (w) { w.classList.add("on"); });
  });

  /* dark v2.1: glow positions are LERPED toward their scroll target every frame,
     so the background drifts smoothly instead of jumping with the scroll wheel. */
  var blendBg = document.querySelector(".bg");
  if (blendBg && !reduced) {
    var gx = 80, gy = 10;
    (function drift() {
      var doc0 = document.documentElement;
      var sp = doc0.scrollTop / (doc0.scrollHeight - doc0.clientHeight || 1);
      var tx = 80 - sp * 60, ty = 10 + sp * 70;
      gx += (tx - gx) * 0.045;                    /* easing factor: lower = smoother/slower */
      gy += (ty - gy) * 0.045;
      blendBg.style.setProperty("--gx", gx + "%");
      blendBg.style.setProperty("--gy", gy + "%");
      requestAnimationFrame(drift);
    })();
  }

  function onScroll() {
    var vh = window.innerHeight;
    if (!reduced) {
      parallaxEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var mid = r.top + r.height / 2 - vh / 2;         /* px from viewport center */
        var amt = parseFloat(el.getAttribute("data-parallax")) || 20;
        el.style.transform = "translateY(" + (-mid / vh) * amt + "px)";
      });
      claims.forEach(function (c) {
        var r = c.getBoundingClientRect();
        var p = 1 - (r.top - vh * 0.2) / (vh * 0.6);      /* 0→1 as claim crosses viewport */
        p = Math.max(0, Math.min(1, p));
        var ws = c.querySelectorAll(".w");
        var n = Math.round(p * ws.length);
        ws.forEach(function (w, i) { w.classList.toggle("on", i < n); });
      });
    }
    if (progress) {
      var doc = document.documentElement;
      var pct = doc.scrollTop / (doc.scrollHeight - doc.clientHeight);
      progress.style.width = pct * 100 + "%";
    }
  }
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) {
      requestAnimationFrame(function () { onScroll(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  /* ---------- video: play only in viewport ---------- */
  var vids = document.querySelectorAll("video[data-loop]");
  if (vids.length) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.play().catch(function () {});
        else e.target.pause();
      });
    }, { threshold: 0.3 });
    vids.forEach(function (v) { vio.observe(v); });
  }

  /* ---------- audience preference (who-are-you split) ---------- */
  document.querySelectorAll("[data-audience]").forEach(function (el) {
    el.addEventListener("click", function () {
      try { sessionStorage.setItem("qh-audience", el.getAttribute("data-audience")); } catch (e) {}
    });
  });
  /* context CTA swap in header */
  try {
    var aud = sessionStorage.getItem("qh-audience");
    var cta = document.querySelector("[data-context-cta]");
    if (aud === "startup" && cta) { cta.textContent = "Apply to SPARK"; cta.setAttribute("href", "spark.html"); }
  } catch (e) {}

  /* ---------- video moment: frame expands to full screen while pinned ---------- */
  var vms = Array.prototype.slice.call(document.querySelectorAll(".video-moment"));
  function vmUpdate() {
    vms.forEach(function (wrap) {
      var frame = wrap.querySelector(".vm-frame");
      var caption = wrap.querySelector(".vm-caption");
      if (!frame) return;
      var r = wrap.getBoundingClientRect();
      var total = r.height - window.innerHeight;
      var p = Math.max(0, Math.min(1, -r.top / (total || 1)));
      if (reduced || window.innerWidth < 768) p = 1;
      /* expand over the first 45% of the pin, hold full-screen after */
      var e = Math.min(1, p / 0.45);
      e = 1 - Math.pow(1 - e, 3);
      frame.style.width = (62 + 38 * e) + "vw";
      frame.style.height = (60 + 40 * e) + "vh";
      frame.style.borderRadius = (18 * (1 - e)) + "px";
      if (caption) caption.classList.toggle("on", e > 0.85);
    });
  }
  if (vms.length && !(reduced || window.innerWidth < 768)) {
    window.addEventListener("scroll", function () { requestAnimationFrame(vmUpdate); }, { passive: true });
    vmUpdate();
  }

  /* ---------- P7 pinned process rail: steps activate by scroll progress ---------- */
  var railWrap = document.querySelector(".rail-wrap");
  if (railWrap) {
    var steps = railWrap.querySelectorAll(".rail-step");
    var railLine = railWrap.querySelector(".rail-line");
    function railUpdate() {
      var r = railWrap.getBoundingClientRect();
      var total = r.height - window.innerHeight;
      var p = Math.max(0, Math.min(1, -r.top / (total || 1)));
      if (reduced) p = 1;
      var n = Math.max(1, Math.ceil(p * steps.length));
      steps.forEach(function (s, i) { s.classList.toggle("active", i < n); });
      if (railLine) railLine.style.width = (p * 92) + "%";
    }
    if (reduced) railUpdate();
    else { window.addEventListener("scroll", railUpdate, { passive: true }); railUpdate(); }
  }

  /* ---------- case filters (index): chips show/hide tiles ---------- */
  var chips = document.querySelectorAll("[data-filter]");
  if (chips.length) {
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("selected"); });
        chip.classList.add("selected");
        var f = chip.getAttribute("data-filter");
        document.querySelectorAll("[data-case]").forEach(function (tile) {
          tile.classList.toggle("is-hidden", f !== "all" && tile.getAttribute("data-case") !== f);
        });
      });
    });
  }

  /* ---------- accordion: one open at a time ---------- */
  var faqs = document.querySelectorAll("details.faq");
  faqs.forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (d.open) faqs.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ---------- mobile menu: hamburger + overlay built from the existing nav ---------- */
  var headerEl = document.querySelector(".site-header .container");
  var navEl = document.querySelector(".site-header .nav");
  if (headerEl && navEl) {
    var mBtn = document.createElement("button");
    mBtn.className = "menu-btn";
    mBtn.setAttribute("aria-label", "Open menu");
    mBtn.innerHTML = '<i data-lucide="menu" style="width:24px;height:24px;"></i>';
    headerEl.appendChild(mBtn);

    var overlay = document.createElement("div");
    overlay.className = "mobile-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-label", "Menu");
    var links = [
      ["For partners", "for-partners.html"], ["For startups", "for-startups.html"],
      ["SPARK", "spark.html"], ["Industries", "industries.html"],
      ["Case studies", "case-studies.html"], ["About", "about.html"], ["Contact", "contact.html"]
    ];
    overlay.innerHTML = links.map(function (l) {
      return '<a href="' + l[1] + '">' + l[0] + "</a>";
    }).join("") +
      '<a class="btn btn--primary" href="contact.html">Contact us</a>' +
      '<button class="close-btn" aria-label="Close menu"><i data-lucide="x" style="width:26px;height:26px;"></i></button>';
    document.body.appendChild(overlay);
    mBtn.addEventListener("click", function () { overlay.classList.add("is-open"); });
    overlay.querySelector(".close-btn").addEventListener("click", function () { overlay.classList.remove("is-open"); });
    document.addEventListener("keydown", function (ev) { if (ev.key === "Escape") overlay.classList.remove("is-open"); });
  }

  /* ---------- language selector dropdown ---------- */
  var langBtn = document.querySelector(".utility-btn");
  if (langBtn) {
    var wrap = document.createElement("span");
    wrap.className = "lang-wrap";
    langBtn.parentNode.insertBefore(wrap, langBtn);
    wrap.appendChild(langBtn);
    var panel = document.createElement("div");
    panel.className = "lang-panel";
    panel.innerHTML =
      '<button type="button" class="current">English <span>✓</span></button>' +
      '<button type="button" disabled>עברית <span class="soon">soon</span></button>';
    wrap.appendChild(panel);
    langBtn.addEventListener("click", function (ev) {
      ev.stopPropagation();
      panel.classList.toggle("is-open");
    });
    document.addEventListener("click", function (ev) {
      if (!wrap.contains(ev.target)) panel.classList.remove("is-open");
    });
  }

  /* ---------- forms: validate email, swap to success state in place ---------- */
  document.querySelectorAll("form.field").forEach(function (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var email = form.querySelector('input[type="email"]');
      var ok = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
      if (email) email.classList.toggle("invalid", !ok);
      if (!ok) { if (email) email.focus(); return; }
      /* TODO development phase: POST to the form backend here before showing success */
      form.innerHTML =
        '<div class="form-success">' +
        '<h3><span class="dot"></span>Message received</h3>' +
        '<p style="margin-top: var(--space-3);">Thanks — we’ll get back to you shortly at <strong style="color:#fff;">' +
        email.value.replace(/</g, "&lt;") + "</strong>.</p></div>";
    });
  });

  /* ---------- lucide icons ---------- */
  if (window.lucide) window.lucide.createIcons();
})();
