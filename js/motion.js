/* Quantum-hub interaction layer. Motion follows DESIGN-SPEC.md and stops when
   the visitor requests reduced motion. */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var t = function (english) {
    return window.QuantumI18n ? window.QuantumI18n.translate(english) : english;
  };

  /* Reveals */
  var revealEls = document.querySelectorAll(".reveal, .reveal-stagger");
  if (reduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* Header */
  var header = document.querySelector(".site-header");
  var lastY = 0;
  if (header) {
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      header.classList.toggle("is-hidden", y > 200 && y > lastY);
      header.classList.toggle("is-slim", y > 200);
      lastY = y;
    }, { passive: true });
  }

  /* The floating nav's magenta orbit follows the hovered or keyboard-focused link. */
  var navBar = document.querySelector(".site-header .nav");
  if (navBar) {
    var navTargets = [];
    Array.prototype.forEach.call(navBar.children, function (child) {
      if (child.tagName === "A") navTargets.push(child);
      if (child.classList && child.classList.contains("explore")) {
        var exploreLink = child.querySelector("a");
        if (exploreLink) navTargets.push(exploreLink);
      }
    });

    var currentFile = window.location.pathname.split("/").pop() || "index.html";
    var exploreFiles = ["industries.html", "case-studies.html", "case-study-actasys.html", "about.html"];
    navTargets.forEach(function (link) {
      var linkFile = (link.getAttribute("href") || "").split("#")[0];
      var isCurrent = linkFile === currentFile ||
        (link.hasAttribute("data-explore-toggle") && exploreFiles.indexOf(currentFile) !== -1);
      link.classList.toggle("active", isCurrent);
      if (isCurrent) link.setAttribute("aria-current", "page");
    });

    if (!reduced && navTargets.length) {
      var orbit = document.createElement("span");
      orbit.className = "nav-orbit";
      orbit.setAttribute("aria-hidden", "true");
      navBar.insertBefore(orbit, navBar.firstChild);
      var orbitTarget = null;

      function moveOrbit(link) {
        var navRect = navBar.getBoundingClientRect();
        var linkRect = link.getBoundingClientRect();
        navBar.style.setProperty("--nav-orbit-x", (linkRect.left - navRect.left) + "px");
        navBar.style.setProperty("--nav-orbit-w", linkRect.width + "px");
        navBar.classList.add("nav-orbit-on");
        orbitTarget = link;
      }

      navTargets.forEach(function (link) {
        link.addEventListener("mouseenter", function () { moveOrbit(link); });
        link.addEventListener("focus", function () { moveOrbit(link); });
      });
      navBar.addEventListener("mouseleave", function () {
        navBar.classList.remove("nav-orbit-on");
        orbitTarget = null;
      });
      navBar.addEventListener("focusout", function (event) {
        if (!navBar.contains(event.relatedTarget)) {
          navBar.classList.remove("nav-orbit-on");
          orbitTarget = null;
        }
      });
      window.addEventListener("resize", function () {
        if (orbitTarget) window.requestAnimationFrame(function () { moveOrbit(orbitTarget); });
      }, { passive: true });
    }
  }

  /* Explore dropdown */
  var exploreBtn = document.querySelector("[data-explore-toggle]");
  var explorePanel = document.querySelector(".explore-panel");
  if (exploreBtn && explorePanel) {
    exploreBtn.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      explorePanel.classList.toggle("is-open");
      exploreBtn.setAttribute("aria-expanded", String(explorePanel.classList.contains("is-open")));
    });
    document.addEventListener("click", function (event) {
      if (!explorePanel.contains(event.target)) {
        explorePanel.classList.remove("is-open");
        exploreBtn.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        explorePanel.classList.remove("is-open");
        exploreBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* Counters */
  function runCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    if (isNaN(target)) return;
    if (reduced) { el.textContent = target + suffix; return; }
    var started = null;
    function step(now) {
      if (!started) started = now;
      var progress = Math.min((now - started) / 1400, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countObserver.observe(el); });
  }

  /* Scroll-linked moments */
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  var claims = Array.prototype.slice.call(document.querySelectorAll(".big-claim"));
  var progressBar = document.querySelector(".progress");
  claims.forEach(function (claim) {
    var words = claim.textContent.trim().split(/\s+/);
    claim.innerHTML = words.map(function (word) { return '<span class="w">' + word + "</span>"; }).join(" ");
    if (reduced) claim.querySelectorAll(".w").forEach(function (word) { word.classList.add("on"); });
  });

  var blendBg = document.querySelector(".bg");
  var homeVideoBg = document.querySelector(".home-video-bg");
  var homeVideoTransition = document.querySelector(".home-video-transition");

  function onScroll() {
    var viewportHeight = window.innerHeight;
    if (!reduced) {
      parallaxEls.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > viewportHeight) return;
        var middle = rect.top + rect.height / 2 - viewportHeight / 2;
        var amount = parseFloat(el.getAttribute("data-parallax")) || 20;
        el.style.transform = "translateY(" + (-middle / viewportHeight) * amount + "px)";
      });
      claims.forEach(function (claim) {
        var rect = claim.getBoundingClientRect();
        var claimProgress = 1 - (rect.top - viewportHeight * 0.2) / (viewportHeight * 0.6);
        claimProgress = Math.max(0, Math.min(1, claimProgress));
        var words = claim.querySelectorAll(".w");
        var active = Math.round(claimProgress * words.length);
        words.forEach(function (word, index) { word.classList.toggle("on", index < active); });
      });
    }
    if (progressBar) {
      var doc = document.documentElement;
      var pageProgress = doc.scrollTop / (doc.scrollHeight - doc.clientHeight || 1);
      progressBar.style.transform = "scaleX(" + Math.max(0, Math.min(1, pageProgress)) + ")";
    }
    if (blendBg && !reduced) {
      var backgroundDoc = document.documentElement;
      var scrollProgress = backgroundDoc.scrollTop / (backgroundDoc.scrollHeight - backgroundDoc.clientHeight || 1);
      blendBg.style.setProperty("--gx", (80 - scrollProgress * 60) + "%");
      blendBg.style.setProperty("--gy", (10 + scrollProgress * 70) + "%");
    }
    if (homeVideoBg && homeVideoTransition) {
      var transitionRect = homeVideoTransition.getBoundingClientRect();
      var exitProgress = Math.max(0, Math.min(1, -transitionRect.top / Math.max(1, transitionRect.height)));
      homeVideoBg.style.opacity = String(1 - exitProgress);
      homeVideoBg.classList.toggle("is-exited", exitProgress >= 0.999);
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

  /* Video: autoplay while visible, retry after load/interaction, and always expose
     a visible play/pause control. This fixes browsers that ignored the old silent
     play() failure. */
  var videos = document.querySelectorAll("video[data-loop]");
  function updateVideoButton(video, button) {
    var paused = video.paused;
    button.setAttribute("aria-label", t(paused ? "Play video" : "Pause video"));
    button.innerHTML = '<i data-lucide="' + (paused ? "play" : "pause") + '" style="width:15px;height:15px;"></i><span>' + t(paused ? "Play" : "Pause") + "</span>";
    if (window.lucide) window.lucide.createIcons();
  }
  function attemptPlay(video, button) {
    if (reduced || video.dataset.userPaused === "true") return;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    var promise = video.play();
    if (promise && promise.catch) {
      promise.then(function () { updateVideoButton(video, button); }).catch(function () {
        updateVideoButton(video, button);
      });
    }
  }
  videos.forEach(function (video) {
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    if (reduced) {
      video.removeAttribute("autoplay");
      video.pause();
    } else {
      video.setAttribute("autoplay", "");
    }

    var frame = video.parentElement;
    var button = document.createElement("button");
    button.className = "video-control";
    button.type = "button";
    frame.appendChild(button);
    updateVideoButton(video, button);

    button.addEventListener("click", function () {
      if (video.paused) {
        video.dataset.userPaused = "false";
        video.play().catch(function () {});
      } else {
        video.dataset.userPaused = "true";
        video.pause();
      }
    });
    video.addEventListener("play", function () { updateVideoButton(video, button); });
    video.addEventListener("pause", function () { updateVideoButton(video, button); });
    video.addEventListener("canplay", function () {
      if (video.dataset.inView === "true") attemptPlay(video, button);
    }, { once: true });

    if (video.readyState === 0) video.load();
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          video.dataset.inView = String(entry.isIntersecting);
          if (entry.isIntersecting) attemptPlay(video, button);
          else video.pause();
        });
      }, { threshold: 0.2 });
      observer.observe(video);
    } else {
      video.dataset.inView = "true";
      attemptPlay(video, button);
    }
  });
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
      videos.forEach(function (video) {
        var button = video.parentElement.querySelector(".video-control");
        if (button && video.dataset.inView === "true") attemptPlay(video, button);
      });
    }
  });

  /* Audience preference */
  document.querySelectorAll("[data-audience]").forEach(function (el) {
    el.addEventListener("click", function () {
      try { sessionStorage.setItem("qh-audience", el.getAttribute("data-audience")); } catch (error) {}
    });
  });
  try {
    var audience = sessionStorage.getItem("qh-audience");
    var contextCta = document.querySelector("[data-context-cta]");
    if (audience === "startup" && contextCta) {
      contextCta.textContent = t("Apply to SPARK");
      contextCta.setAttribute("href", "spark.html");
    }
  } catch (error) {}

  /* Video moments now remain cinematic without holding the visitor's scroll. */
  var videoMoments = Array.prototype.slice.call(document.querySelectorAll(".video-moment"));
  videoMoments.forEach(function (wrap) {
    var caption = wrap.querySelector(".vm-caption");
    if (caption) caption.classList.add("on");
  });

  /* Process rail is fully readable in normal page flow. */
  var railWrap = document.querySelector(".rail-wrap");
  if (railWrap) {
    var railLine = railWrap.querySelector(".rail-line");
    if (railLine) railLine.style.width = "92%";
  }

  /* Filters and accordions */
  var chips = document.querySelectorAll("[data-filter]");
  chips.forEach(function (chip) {
    chip.setAttribute("aria-pressed", String(chip.classList.contains("selected")));
  });
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (other) {
        other.classList.remove("selected");
        other.setAttribute("aria-pressed", "false");
      });
      chip.classList.add("selected");
      chip.setAttribute("aria-pressed", "true");
      var filter = chip.getAttribute("data-filter");
      document.querySelectorAll("[data-case]").forEach(function (tile) {
        tile.classList.toggle("is-hidden", filter !== "all" && tile.getAttribute("data-case") !== filter);
      });
      window.dispatchEvent(new CustomEvent("quantum:case-filter", { detail: { filter: filter } }));
    });
  });
  var faqs = document.querySelectorAll("details.faq");
  faqs.forEach(function (detail) {
    detail.addEventListener("toggle", function () {
      if (detail.open) faqs.forEach(function (other) { if (other !== detail) other.open = false; });
    });
  });

  /* Mobile menu */
  var headerContainer = document.querySelector(".site-header .container");
  var nav = document.querySelector(".site-header .nav");
  if (headerContainer && nav) {
    var menuButton = document.createElement("button");
    menuButton.className = "menu-btn";
    menuButton.setAttribute("aria-label", t("Open menu"));
    menuButton.innerHTML = '<i data-lucide="menu" style="width:24px;height:24px;"></i>';
    headerContainer.appendChild(menuButton);

    var overlay = document.createElement("div");
    overlay.className = "mobile-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", t("Menu"));
    var links = [
      ["For partners", "for-partners.html"], ["For startups", "for-startups.html"],
      ["SPARK", "spark.html"], ["Industries", "industries.html"],
      ["Case studies", "case-studies.html"], ["About", "about.html"], ["Contact", "contact.html"]
    ];
    overlay.innerHTML = links.map(function (link) {
      return '<a href="' + link[1] + '">' + t(link[0]) + "</a>";
    }).join("") +
      '<a class="btn btn--primary" href="contact.html">' + t("Contact us") + "</a>" +
      '<button class="close-btn" aria-label="' + t("Close menu") + '"><i data-lucide="x" style="width:26px;height:26px;"></i></button>';
    document.body.appendChild(overlay);
    menuButton.addEventListener("click", function () { overlay.classList.add("is-open"); });
    overlay.querySelector(".close-btn").addEventListener("click", function () { overlay.classList.remove("is-open"); });
    document.addEventListener("keydown", function (event) { if (event.key === "Escape") overlay.classList.remove("is-open"); });
  }

  /* Language selector with real flag assets */
  var languageButton = document.querySelector(".utility-btn");
  if (languageButton) {
    var currentLanguage = window.QuantumI18n ? window.QuantumI18n.current() : "en";
    var languageWrap = document.createElement("span");
    languageWrap.className = "lang-wrap";
    languageButton.parentNode.insertBefore(languageWrap, languageButton);
    languageWrap.appendChild(languageButton);
    languageButton.innerHTML = '<img class="language-flag" src="assets/flags/' + (currentLanguage === "he" ? "il" : "gb") + '.png" alt=""><span>' + (currentLanguage === "he" ? "HE" : "EN") + "</span>";

    var languagePanel = document.createElement("div");
    languagePanel.className = "lang-panel";
    languagePanel.innerHTML =
      '<button type="button" data-language="en"><span class="lang-option-label"><img class="language-flag" src="assets/flags/gb.png" alt="">English</span><span aria-hidden="true">' + (currentLanguage === "en" ? "✓" : "") + "</span></button>" +
      '<button type="button" data-language="he"><span class="lang-option-label"><img class="language-flag" src="assets/flags/il.png" alt="">עברית</span><span aria-hidden="true">' + (currentLanguage === "he" ? "✓" : "") + "</span></button>";
    languageWrap.appendChild(languagePanel);
    languagePanel.querySelector('[data-language="' + currentLanguage + '"]').classList.add("current");

    languageButton.addEventListener("click", function (event) {
      event.stopPropagation();
      languagePanel.classList.toggle("is-open");
    });
    languagePanel.querySelectorAll("[data-language]").forEach(function (option) {
      option.addEventListener("click", function () {
        if (window.QuantumI18n) window.QuantumI18n.set(option.getAttribute("data-language"));
      });
    });
    document.addEventListener("click", function (event) {
      if (!languageWrap.contains(event.target)) languagePanel.classList.remove("is-open");
    });
  }

  /* AJAX forms send submissions to the configured FormSubmit endpoint, which
     emails intern@quantum-hub.com after one-time inbox confirmation. */
  document.querySelectorAll("form.field").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var email = form.querySelector('input[type="email"]');
      var validEmail = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
      if (email) email.classList.toggle("invalid", !validEmail);
      if (!validEmail || !form.checkValidity()) {
        if (email && !validEmail) email.focus();
        else form.reportValidity();
        return;
      }

      var submit = form.querySelector('[type="submit"]');
      var originalText = submit ? submit.textContent : "";
      if (submit) { submit.disabled = true; submit.textContent = t("Sending…"); }
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      }).then(function (response) {
        if (!response.ok) throw new Error("Submission failed");
        var emailValue = email.value.replace(/</g, "&lt;");
        form.innerHTML = '<div class="form-success"><h3><span class="dot"></span>' + t("Message received") + '</h3><p style="margin-top:var(--space-3);">' + t("Thanks — we'll get back to you shortly at") + ' <strong style="color:#fff;">' + emailValue + "</strong>.</p></div>";
      }).catch(function () {
        if (submit) { submit.disabled = false; submit.textContent = originalText; }
        var error = form.querySelector(".form-error");
        if (!error) {
          error = document.createElement("p");
          error.className = "form-error";
          error.style.cssText = "margin-top:12px;color:var(--q-danger);font-family:var(--font-ui);font-size:13px;";
          form.appendChild(error);
        }
        error.innerHTML = t("We couldn't send this form. Please email us directly at") + ' <a href="mailto:intern@quantum-hub.com">intern@quantum-hub.com</a>.';
      });
    });
  });

  if (window.lucide) window.lucide.createIcons();
})();
