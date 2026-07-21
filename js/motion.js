/* Quantum-hub interaction layer. Motion follows DESIGN-SPEC.md and stops when
   the visitor requests reduced motion. */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var t = function (english) {
    return window.QuantumI18n ? window.QuantumI18n.translate(english) : english;
  };
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

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

  /* A restrained word reveal for the primary marketing headlines. The split is
     created after translation so Hebrew and English animate their own words. */
  if (!reduced) {
    var textRevealHeadings = Array.prototype.slice.call(document.querySelectorAll("main h1.display-xl"))
      .filter(function (heading) { return heading.children.length === 0; });
    textRevealHeadings.forEach(function (heading) {
      var label = heading.textContent.trim();
      if (!label) return;
      var fragment = document.createDocumentFragment();
      label.split(/\s+/).forEach(function (word, index) {
        var clip = document.createElement("span");
        var inner = document.createElement("span");
        clip.className = "text-reveal-word";
        clip.setAttribute("aria-hidden", "true");
        clip.style.setProperty("--word-delay", Math.min(index * 38, 304) + "ms");
        inner.textContent = word;
        clip.appendChild(inner);
        fragment.appendChild(clip);
      });
      heading.textContent = "";
      heading.appendChild(fragment);
      heading.classList.add("text-reveal-heading");
      heading.setAttribute("aria-label", label);
    });
    if (!("IntersectionObserver" in window)) {
      textRevealHeadings.forEach(function (heading) { heading.classList.add("is-text-revealed"); });
    } else {
      var textRevealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-text-revealed");
          textRevealObserver.unobserve(entry.target);
        });
      }, { threshold: .35, rootMargin: "0px 0px -4% 0px" });
      textRevealHeadings.forEach(function (heading) { textRevealObserver.observe(heading); });
    }
  }

  /* Magnetic CTAs borrow a few pixels of pointer movement, then settle back. */
  if (!reduced && finePointer) {
    document.querySelectorAll(".btn").forEach(function (button) {
      button.classList.add("is-magnetic");
      button.addEventListener("pointermove", function (event) {
        var rect = button.getBoundingClientRect();
        var x = (event.clientX - rect.left - rect.width / 2) / Math.max(rect.width / 2, 1);
        var y = (event.clientY - rect.top - rect.height / 2) / Math.max(rect.height / 2, 1);
        button.style.setProperty("--magnet-x", (x * 6).toFixed(2) + "px");
        button.style.setProperty("--magnet-y", (y * 5).toFixed(2) + "px");
      });
      function releaseMagnet() {
        button.style.setProperty("--magnet-x", "0px");
        button.style.setProperty("--magnet-y", "0px");
      }
      button.addEventListener("pointerleave", releaseMagnet);
      button.addEventListener("pointercancel", releaseMagnet);
      button.addEventListener("blur", releaseMagnet);
    });
  }

  /* Footer color field reveals as it enters and gently follows a fine pointer. */
  var gradientFooter = document.querySelector(".site-footer");
  if (gradientFooter) {
    var footerNavigation = gradientFooter.querySelector(".footer-nav");
    if (footerNavigation) {
      var footerLinks = [
        ["For partners", "for-partners.html"], ["For startups", "for-startups.html"],
        ["POCs", "pocs.html"], ["SPARK", "spark.html"], ["Industries", "industries.html"],
        ["POC catalogue", "case-studies.html"], ["Hub updates", "updates.html"],
        ["About", "about.html"], ["Contact", "contact.html"]
      ];
      footerNavigation.innerHTML = footerLinks.map(function (link) {
        return '<a href="' + link[1] + '">' + t(link[0]) + '</a>';
      }).join("");
    }
    var footerLinkedIn = gradientFooter.querySelector('a[href*="linkedin.com/company/quantum-hub"]');
    if (!footerLinkedIn) {
      footerLinkedIn = document.createElement("a");
      footerLinkedIn.href = "https://www.linkedin.com/company/quantum-hub/";
      footerLinkedIn.innerHTML = '<i data-lucide="linkedin" aria-hidden="true"></i>';
      var footerTop = gradientFooter.querySelector(".footer-top");
      if (footerTop) footerTop.appendChild(footerLinkedIn);
      else {
        var footerSocialRow = document.createElement("div");
        footerSocialRow.className = "footer-social-row";
        footerSocialRow.appendChild(footerLinkedIn);
        var footerContainer = gradientFooter.querySelector(".container");
        var footerLegal = gradientFooter.querySelector(".footer-legal");
        if (footerContainer) footerContainer.insertBefore(footerSocialRow, footerLegal || null);
      }
    }
    footerLinkedIn.setAttribute("aria-label", t("Quantum-hub on LinkedIn"));
    footerLinkedIn.classList.add("footer-social-link");
    footerLinkedIn.target = "_blank";
    footerLinkedIn.rel = "noopener";

    if (reduced || !("IntersectionObserver" in window)) {
      gradientFooter.classList.add("is-gradient-visible");
    } else {
      var footerObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-gradient-visible");
          footerObserver.unobserve(entry.target);
        });
      }, { threshold: .12 });
      footerObserver.observe(gradientFooter);
    }
    if (!reduced && finePointer) {
      var footerFrame = 0;
      var footerPointer = null;
      gradientFooter.addEventListener("pointermove", function (event) {
        footerPointer = event;
        if (footerFrame) return;
        footerFrame = requestAnimationFrame(function () {
          if (!footerPointer) {
            footerFrame = 0;
            return;
          }
          var rect = gradientFooter.getBoundingClientRect();
          var x = Math.max(8, Math.min(92, ((footerPointer.clientX - rect.left) / Math.max(rect.width, 1)) * 100));
          var y = Math.max(12, Math.min(88, ((footerPointer.clientY - rect.top) / Math.max(rect.height, 1)) * 100));
          var energy = Math.min(1, Math.abs(x - 50) / 50 + Math.abs(y - 50) / 70);
          gradientFooter.style.setProperty("--footer-x", x.toFixed(2) + "%");
          gradientFooter.style.setProperty("--footer-y", y.toFixed(2) + "%");
          gradientFooter.style.setProperty("--footer-glow-opacity", (.22 + energy * .12).toFixed(3));
          footerFrame = 0;
        });
      });
      gradientFooter.addEventListener("pointerleave", function () {
        footerPointer = null;
        if (footerFrame) cancelAnimationFrame(footerFrame);
        footerFrame = 0;
        gradientFooter.style.setProperty("--footer-x", "72%");
        gradientFooter.style.setProperty("--footer-y", "48%");
        gradientFooter.style.setProperty("--footer-glow-opacity", ".24");
      });
    }
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

  /* One direction-aware mega panel grows and shrinks between menu groups. Its
     150ms open and 200ms close buffers mirror the intentional hover behavior
     studied on Annnimate, while the visual system remains native to Quantum. */
  var navBar = document.querySelector(".site-header .nav");
  var megaGroups = [
    {
      label: "Partners", files: ["for-partners.html"],
      kicker: "For operating companies", title: "Turn a live constraint into a testable brief.",
      links: [["Partner overview", "for-partners.html", "How Quantum works inside the consortium"], ["Bring a challenge", "contact.html", "Start with the operating question"]]
    },
    {
      label: "Startups", files: ["for-startups.html", "spark.html", "spark-register.html"],
      kicker: "For technology teams", title: "Enter through a use case, not a pitch queue.",
      links: [["Startup pathway", "for-startups.html", "Understand the route into a partner POC"], ["SPARK program", "spark.html", "Build toward a partner-selected trial"], ["Apply to SPARK", "spark-register.html", "Submit the technology for review"]]
    },
    {
      label: "POCs", files: ["pocs.html", "case-studies.html", "case-study-actasys.html"],
      kicker: "Proof in the field", title: "See how promising technology becomes usable evidence.",
      links: [["Why POCs matter", "pocs.html", "Explore the decisions a strong trial unlocks"], ["POC catalogue", "case-studies.html", "Browse all 110 supplied collaborations"], ["Actasys case", "case-study-actasys.html", "Follow one sensor-cleaning test in detail"]]
    },
    {
      label: "Explore", files: ["industries.html", "about.html", "updates.html", "contact.html"],
      kicker: "Inside Quantum-hub", title: "Meet the network around every field test.",
      links: [["Industries", "industries.html", "Four connected operating environments"], ["Company", "about.html", "The people translating between both sides"], ["Hub updates", "updates.html", "Verified notes from the work in motion"], ["Contact", "contact.html", "Choose the right starting point"]]
    }
  ];

  if (navBar) {
    navBar.classList.add("mega-nav");
    navBar.innerHTML = megaGroups.map(function (group, index) {
      return '<button class="mega-trigger" type="button" data-mega-index="' + index + '" aria-expanded="false" aria-controls="quantum-mega-panel">' + t(group.label) + '<i data-lucide="chevron-down" aria-hidden="true"></i></button>';
    }).join("") + '<span class="nav-orbit" aria-hidden="true"></span>';

    var megaPanel = document.createElement("div");
    megaPanel.id = "quantum-mega-panel";
    megaPanel.className = "mega-panel";
    megaPanel.setAttribute("aria-hidden", "true");
    megaPanel.innerHTML = '<div class="mega-panel-inner"></div>';
    navBar.appendChild(megaPanel);

    var megaInner = megaPanel.querySelector(".mega-panel-inner");
    var navTargets = Array.prototype.slice.call(navBar.querySelectorAll(".mega-trigger"));
    var currentFile = window.location.pathname.split("/").pop() || "index.html";
    var activeMegaIndex = -1;
    var renderedMegaIndex = -1;
    var openMegaTimer = 0;
    var closeMegaTimer = 0;
    var orbitTarget = null;

    megaGroups.forEach(function (group, index) {
      if (group.files.indexOf(currentFile) !== -1) {
        navTargets[index].classList.add("active");
        navTargets[index].setAttribute("aria-current", "page");
      }
    });

    function moveOrbit(target) {
      var navRect = navBar.getBoundingClientRect();
      var targetRect = target.getBoundingClientRect();
      navBar.style.setProperty("--nav-orbit-x", (targetRect.left - navRect.left) + "px");
      navBar.style.setProperty("--nav-orbit-w", targetRect.width + "px");
      navBar.classList.add("nav-orbit-on");
      orbitTarget = target;
    }

    function renderMega(index) {
      var group = megaGroups[index];
      var direction = renderedMegaIndex < 0 || index >= renderedMegaIndex ? 1 : -1;
      megaInner.style.setProperty("--mega-direction", direction);
      megaInner.innerHTML = '<div class="mega-copy"><span class="eyebrow">' + t(group.kicker) + '</span><p>' + t(group.title) + '</p></div><div class="mega-links">' + group.links.map(function (link, linkIndex) {
        return '<a href="' + link[1] + '" style="--mega-stagger:' + (linkIndex * 40) + 'ms"><span><strong>' + t(link[0]) + '</strong><small>' + t(link[2]) + '</small></span><i data-lucide="arrow-up-right" aria-hidden="true"></i></a>';
      }).join("") + '</div>';
      megaPanel.style.setProperty("--mega-w", [570, 630, 660, 700][index] + "px");
      megaPanel.style.setProperty("--mega-h", (megaInner.scrollHeight + 48) + "px");
      renderedMegaIndex = index;
      if (window.lucide) window.lucide.createIcons();
    }

    function openMega(index) {
      window.clearTimeout(closeMegaTimer);
      if (activeMegaIndex !== index) renderMega(index);
      activeMegaIndex = index;
      navTargets.forEach(function (trigger, triggerIndex) {
        trigger.setAttribute("aria-expanded", String(triggerIndex === index));
      });
      moveOrbit(navTargets[index]);
      megaPanel.classList.add("is-open");
      megaPanel.setAttribute("aria-hidden", "false");
    }

    function queueMega(index) {
      window.clearTimeout(closeMegaTimer);
      window.clearTimeout(openMegaTimer);
      openMegaTimer = window.setTimeout(function () { openMega(index); }, activeMegaIndex < 0 ? 150 : 0);
    }

    function closeMega() {
      window.clearTimeout(openMegaTimer);
      closeMegaTimer = window.setTimeout(function () {
        activeMegaIndex = -1;
        megaPanel.classList.remove("is-open");
        megaPanel.setAttribute("aria-hidden", "true");
        navTargets.forEach(function (trigger) { trigger.setAttribute("aria-expanded", "false"); });
        navBar.classList.remove("nav-orbit-on");
        orbitTarget = null;
      }, 200);
    }

    navTargets.forEach(function (trigger, index) {
      trigger.addEventListener("mouseenter", function () { queueMega(index); });
      trigger.addEventListener("focus", function () { queueMega(index); });
      trigger.addEventListener("click", function () {
        if (activeMegaIndex === index && megaPanel.classList.contains("is-open")) closeMega();
        else openMega(index);
      });
    });
    navBar.addEventListener("mouseleave", closeMega);
    navBar.addEventListener("mouseenter", function () { window.clearTimeout(closeMegaTimer); });
    navBar.addEventListener("focusout", function (event) {
      if (!navBar.contains(event.relatedTarget)) closeMega();
    });
    document.addEventListener("click", function (event) {
      if (!navBar.contains(event.target) && activeMegaIndex >= 0) closeMega();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && activeMegaIndex >= 0) {
        var returnTarget = navTargets[activeMegaIndex];
        closeMega();
        if (returnTarget) returnTarget.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (orbitTarget) window.requestAnimationFrame(function () { moveOrbit(orbitTarget); });
    }, { passive: true });
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
  var sparkFlipWrap = document.querySelector("[data-spark-flip]");
  var sparkFlipStage = sparkFlipWrap ? sparkFlipWrap.querySelector(".spark-flip-stage") : null;
  var sparkFlipCards = sparkFlipWrap ? Array.prototype.slice.call(sparkFlipWrap.querySelectorAll("[data-flip-card]")) : [];
  var sparkFlipProgress = sparkFlipWrap ? sparkFlipWrap.querySelector(".spark-flip-progress > span") : null;
  var sparkFlipMobile = window.matchMedia("(max-width: 900px)");
  var sparkFlipTarget = 0;
  var sparkFlipCurrent = 0;
  var sparkFlipFrame = 0;
  var sparkFlipStatic = null;
  var processWrap = document.querySelector("[data-process-story]");
  var processSteps = processWrap ? Array.prototype.slice.call(processWrap.querySelectorAll("[data-process-step]")) : [];
  var processVisuals = processWrap ? Array.prototype.slice.call(processWrap.querySelectorAll("[data-process-visual]")) : [];
  var processLine = processWrap ? processWrap.querySelector(".rail-line") : null;
  var processMobile = window.matchMedia("(max-width: 768px)");
  var processIndex = -1;
  var processWasStatic = null;
  var processWheelLocked = false;
  var processWheelTimer = 0;

  function clearSparkFlip() {
    if (!sparkFlipWrap) return;
    sparkFlipWrap.classList.remove("is-enhanced");
    sparkFlipCards.forEach(function (card) {
      card.style.removeProperty("transform");
      card.style.removeProperty("opacity");
      card.style.removeProperty("z-index");
      card.style.removeProperty("--flip-copy");
      card.style.removeProperty("--flip-copy-y");
    });
    if (sparkFlipProgress) sparkFlipProgress.style.removeProperty("transform");
    if (sparkFlipFrame) cancelAnimationFrame(sparkFlipFrame);
    sparkFlipFrame = 0;
  }

  function renderSparkFlip(progress) {
    if (!sparkFlipWrap || !sparkFlipStage || !sparkFlipWrap.classList.contains("is-enhanced")) return;
    var stageWidth = sparkFlipStage.offsetWidth;
    var stageHeight = sparkFlipStage.offsetHeight;
    if (!stageWidth || !stageHeight || !sparkFlipCards.length) return;
    var cardWidth = sparkFlipCards[0].offsetWidth;
    var cardHeight = sparkFlipCards[0].offsetHeight;
    var startX = [-18, 11, -8, 16];
    var startY = [5, -11, 13, -5];
    var startRotation = [-8, 6, -4, 9];
    var stagger = .055;
    var available = 1 - stagger * (sparkFlipCards.length - 1);

    sparkFlipCards.forEach(function (card, index) {
      var local = Math.max(0, Math.min(1, (progress - index * stagger) / available));
      var eased = 1 - Math.pow(1 - local, 3);
      var column = index % 2;
      var row = Math.floor(index / 2);
      var endX = (column ? 1 : -1) * (stageWidth - cardWidth) / 2;
      var endY = (row ? 1 : -1) * (stageHeight - cardHeight) / 2;
      var x = startX[index] * (1 - eased) + endX * eased;
      var y = startY[index] * (1 - eased) + endY * eased;
      var rotation = startRotation[index] * (1 - eased);
      var scale = .9 + .1 * eased;
      var copy = index === 0 ? 1 : Math.max(.18, Math.min(1, (local - .18) / .52));
      card.style.transform = "translate(calc(-50% + " + x.toFixed(2) + "px), calc(-50% + " + y.toFixed(2) + "px)) rotate(" + rotation.toFixed(2) + "deg) scale(" + scale.toFixed(3) + ")";
      card.style.opacity = String(.76 + .24 * eased);
      card.style.zIndex = String(sparkFlipCards.length - index);
      card.style.setProperty("--flip-copy", copy.toFixed(3));
      card.style.setProperty("--flip-copy-y", ((1 - copy) * 8).toFixed(2) + "px");
    });
    if (sparkFlipProgress) sparkFlipProgress.style.transform = "scaleX(" + progress.toFixed(4) + ")";
  }

  function animateSparkFlip() {
    sparkFlipCurrent += (sparkFlipTarget - sparkFlipCurrent) * .16;
    if (Math.abs(sparkFlipTarget - sparkFlipCurrent) < .001) sparkFlipCurrent = sparkFlipTarget;
    renderSparkFlip(sparkFlipCurrent);
    if (sparkFlipCurrent !== sparkFlipTarget) sparkFlipFrame = requestAnimationFrame(animateSparkFlip);
    else sparkFlipFrame = 0;
  }

  function updateSparkFlip(viewportHeight) {
    if (!sparkFlipWrap || !sparkFlipCards.length) return;
    var staticLayout = reduced || sparkFlipMobile.matches;
    if (staticLayout) {
      if (sparkFlipStatic !== true) clearSparkFlip();
      sparkFlipStatic = true;
      return;
    }
    if (sparkFlipStatic !== false) {
      sparkFlipWrap.classList.add("is-enhanced");
      sparkFlipStatic = false;
    }
    var rect = sparkFlipWrap.getBoundingClientRect();
    var headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 72;
    var stickyHeight = Math.max(1, viewportHeight - headerHeight);
    var travel = Math.max(1, sparkFlipWrap.offsetHeight - stickyHeight);
    sparkFlipTarget = Math.max(0, Math.min(1, (headerHeight - rect.top) / travel));
    if (!sparkFlipFrame) sparkFlipFrame = requestAnimationFrame(animateSparkFlip);
  }

  function setProcessStep(index, staticLayout) {
    if (!processSteps.length) return;
    index = Math.max(0, Math.min(processSteps.length - 1, index));
    if (index === processIndex && staticLayout === processWasStatic) return;
    processIndex = index;
    processWasStatic = staticLayout;
    processSteps.forEach(function (step, stepIndex) {
      var active = stepIndex === index;
      step.classList.toggle("active", active);
      step.classList.toggle("is-complete", !staticLayout && stepIndex < index);
      step.setAttribute("aria-pressed", String(active));
    });
    processVisuals.forEach(function (visual, visualIndex) {
      var active = visualIndex === index;
      visual.classList.toggle("active", active);
      visual.setAttribute("aria-hidden", String(!staticLayout && !active));
    });
    if (processLine) {
      var completion = processSteps.length > 1 ? index / (processSteps.length - 1) : 1;
      processLine.style.width = (completion * 92) + "%";
    }
  }

  function updateProcessStory(viewportHeight) {
    if (!processWrap || !processSteps.length) return;
    var staticLayout = reduced || processMobile.matches;
    if (staticLayout) {
      setProcessStep(Math.max(0, processIndex), true);
      return;
    }
    if (processWheelLocked) return;
    var rect = processWrap.getBoundingClientRect();
    var headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 72;
    var stickyHeight = Math.max(1, viewportHeight - headerHeight);
    var travel = Math.max(1, processWrap.offsetHeight - stickyHeight);
    var progress = Math.max(0, Math.min(1, (headerHeight - rect.top) / travel));
    var index = Math.min(processSteps.length - 1, Math.round(progress * (processSteps.length - 1)));
    setProcessStep(index, false);
  }

  function processMetrics() {
    var viewportHeight = window.innerHeight;
    var headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 72;
    var stickyHeight = Math.max(1, viewportHeight - headerHeight);
    return {
      headerHeight: headerHeight,
      travel: Math.max(1, processWrap.offsetHeight - stickyHeight),
      storyTop: window.scrollY + processWrap.getBoundingClientRect().top
    };
  }

  function lockProcessStory() {
    processWheelLocked = true;
    if (processWheelTimer) window.clearTimeout(processWheelTimer);
    processWheelTimer = window.setTimeout(function () {
      processWheelLocked = false;
      processWheelTimer = 0;
      requestAnimationFrame(onScroll);
    }, 680);
  }

  function scrollToProcessStep(index) {
    var metrics = processMetrics();
    var completion = processSteps.length > 1 ? index / (processSteps.length - 1) : 0;
    setProcessStep(index, false);
    lockProcessStory();
    window.scrollTo({
      top: metrics.storyTop - metrics.headerHeight + metrics.travel * completion,
      behavior: "smooth"
    });
  }

  function processStoryIsPinned() {
    if (!processWrap) return false;
    var rect = processWrap.getBoundingClientRect();
    var headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 72;
    return rect.top <= headerHeight + 2 && rect.bottom >= window.innerHeight - 2;
  }

  function moveProcessStep(direction, event) {
    if (reduced || processMobile.matches || !processStoryIsPinned()) return false;
    if (processWheelLocked) {
      if (event) event.preventDefault();
      return true;
    }
    var current = Math.max(0, processIndex);
    var next = current + direction;
    if (next < 0 || next >= processSteps.length) return false;
    if (event) event.preventDefault();
    scrollToProcessStep(next);
    return true;
  }

  processSteps.forEach(function (step, index) {
    step.addEventListener("click", function () {
      if (reduced || processMobile.matches) {
        setProcessStep(index, true);
        return;
      }
      scrollToProcessStep(index);
    });
  });

  if (processWrap) {
    window.addEventListener("wheel", function (event) {
      if (event.ctrlKey || Math.abs(event.deltaY) < Math.abs(event.deltaX) || event.deltaY === 0) return;
      moveProcessStep(event.deltaY > 0 ? 1 : -1, event);
    }, { passive: false });

    window.addEventListener("keydown", function (event) {
      var target = event.target;
      if (target && /INPUT|TEXTAREA|SELECT|BUTTON/.test(target.tagName)) return;
      var direction = 0;
      if (event.key === "ArrowDown" || event.key === "PageDown" || (event.key === " " && !event.shiftKey)) direction = 1;
      if (event.key === "ArrowUp" || event.key === "PageUp" || (event.key === " " && event.shiftKey)) direction = -1;
      if (direction) moveProcessStep(direction, event);
    });
  }

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
    updateSparkFlip(viewportHeight);
    updateProcessStory(viewportHeight);
  }
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) {
      requestAnimationFrame(function () { onScroll(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener("resize", function () { requestAnimationFrame(onScroll); }, { passive: true });
  onScroll();

  /* Videos are ambient, muted loops. They resume whenever the page becomes visible
     and deliberately expose no playback controls. */
  var videos = document.querySelectorAll("video[data-loop]");
  function attemptPlay(video) {
    if (reduced) return;
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    var promise = video.play();
    if (promise && promise.catch) promise.catch(function () {});
  }
  videos.forEach(function (video) {
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("loop", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    if (reduced) {
      video.removeAttribute("autoplay");
      video.pause();
    } else {
      video.setAttribute("autoplay", "");
    }

    video.addEventListener("canplay", function () {
      attemptPlay(video);
    });
    video.addEventListener("ended", function () {
      video.currentTime = 0;
      attemptPlay(video);
    });

    if (video.readyState === 0) video.load();
    attemptPlay(video);
  });
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) videos.forEach(attemptPlay);
  });

  /* Four continuous cables carry equal-speed current through every process card. */
  var cableStage = document.querySelector("[data-cable-flow]");
  if (cableStage) {
    var cableCanvas = cableStage.querySelector("canvas");
    var cableContext = cableCanvas && cableCanvas.getContext("2d");
    var cableNodes = Array.prototype.slice.call(cableStage.querySelectorAll(".flow-node"));
    var cableLaneOffsets = [-9, -3, 3, 9];
    var cableLaneColors = [
      "rgba(194,203,203,.18)",
      "rgba(240,107,160,.22)",
      "rgba(194,203,203,.15)",
      "rgba(240,107,160,.18)"
    ];
    var cableWidth = 0;
    var cableHeight = 0;
    var cableVisible = !("IntersectionObserver" in window);
    var cableRunning = false;
    var cableFrame = 0;
    var cableRoutes = [];
    var cableRoutesRtl = false;

    function cablePort(node, entering, laneOffset, rtl) {
      var left = node.offsetLeft;
      var right = left + node.offsetWidth;
      return {
        x: rtl ? (entering ? right : left) : (entering ? left : right),
        y: node.offsetTop + node.offsetHeight - 31 + laneOffset
      };
    }

    function cableSegment(segmentIndex, laneIndex, rtl) {
      var laneOffset = cableLaneOffsets[laneIndex];
      var direction = rtl ? -1 : 1;
      var start;
      var end;
      if (segmentIndex === 0) {
        end = cablePort(cableNodes[0], true, laneOffset, rtl);
        start = { x: rtl ? cableWidth + 46 : -46, y: end.y };
      } else if (segmentIndex === cableNodes.length) {
        start = cablePort(cableNodes[cableNodes.length - 1], false, laneOffset, rtl);
        end = { x: rtl ? -46 : cableWidth + 46, y: start.y };
      } else {
        start = cablePort(cableNodes[segmentIndex - 1], false, laneOffset, rtl);
        end = cablePort(cableNodes[segmentIndex], true, laneOffset, rtl);
      }
      var gap = Math.abs(end.x - start.x);
      var control = Math.max(40, Math.min(112, gap * .52));
      return {
        p0: start,
        p1: { x: start.x + direction * control, y: start.y },
        p2: { x: end.x - direction * control, y: end.y },
        p3: end
      };
    }

    function cablePoint(curve, t) {
      var inverse = 1 - t;
      return {
        x: inverse * inverse * inverse * curve.p0.x + 3 * inverse * inverse * t * curve.p1.x + 3 * inverse * t * t * curve.p2.x + t * t * t * curve.p3.x,
        y: inverse * inverse * inverse * curve.p0.y + 3 * inverse * inverse * t * curve.p1.y + 3 * inverse * t * t * curve.p2.y + t * t * t * curve.p3.y
      };
    }

    function appendCablePoint(route, point) {
      var previous = route.points[route.points.length - 1];
      var distance = previous ? Math.hypot(point.x - previous.x, point.y - previous.y) : 0;
      route.total += distance;
      route.points.push({ x: point.x, y: point.y, distance: route.total });
    }

    function appendCableCurve(route, curve) {
      var chord = Math.hypot(curve.p3.x - curve.p0.x, curve.p3.y - curve.p0.y);
      var samples = Math.max(12, Math.ceil(chord / 8));
      for (var sample = 0; sample <= samples; sample += 1) {
        if (sample === 0 && route.points.length) continue;
        appendCablePoint(route, cablePoint(curve, sample / samples));
      }
    }

    function buildCableRoute(laneIndex, rtl) {
      var laneOffset = cableLaneOffsets[laneIndex];
      var route = { points: [], total: 0 };
      for (var segmentIndex = 0; segmentIndex <= cableNodes.length; segmentIndex += 1) {
        appendCableCurve(route, cableSegment(segmentIndex, laneIndex, rtl));
        if (segmentIndex >= cableNodes.length) continue;
        var insideStart = cablePort(cableNodes[segmentIndex], true, laneOffset, rtl);
        var insideEnd = cablePort(cableNodes[segmentIndex], false, laneOffset, rtl);
        var insideSamples = Math.max(8, Math.ceil(Math.abs(insideEnd.x - insideStart.x) / 8));
        for (var insideSample = 1; insideSample <= insideSamples; insideSample += 1) {
          var insideProgress = insideSample / insideSamples;
          appendCablePoint(route, {
            x: insideStart.x + (insideEnd.x - insideStart.x) * insideProgress,
            y: insideStart.y
          });
        }
      }
      return route;
    }

    function cablePointAtDistance(route, distance) {
      if (!route.points.length) return { x: 0, y: 0 };
      var target = Math.max(0, Math.min(route.total, distance));
      var low = 1;
      var high = route.points.length - 1;
      while (low < high) {
        var middle = Math.floor((low + high) / 2);
        if (route.points[middle].distance < target) low = middle + 1;
        else high = middle;
      }
      var next = route.points[low];
      var previous = route.points[Math.max(0, low - 1)];
      var span = Math.max(.001, next.distance - previous.distance);
      var progress = (target - previous.distance) / span;
      return {
        x: previous.x + (next.x - previous.x) * progress,
        y: previous.y + (next.y - previous.y) * progress
      };
    }

    function traceCableDistance(route, from, to) {
      if (to <= from || !route.total) return;
      var first = cablePointAtDistance(route, from);
      cableContext.beginPath();
      cableContext.moveTo(first.x, first.y);
      for (var distance = from + 4; distance < to; distance += 4) {
        var point = cablePointAtDistance(route, distance);
        cableContext.lineTo(point.x, point.y);
      }
      var last = cablePointAtDistance(route, to);
      cableContext.lineTo(last.x, last.y);
    }

    function strokeCablePulse(route, from, to) {
      if (from < 0) {
        traceCableDistance(route, route.total + from, route.total);
        cableContext.stroke();
        traceCableDistance(route, 0, to);
        cableContext.stroke();
      } else {
        traceCableDistance(route, from, to);
        cableContext.stroke();
      }
    }

    function drawCableFlow(time) {
      if (!cableContext) return;
      cableContext.clearRect(0, 0, cableWidth, cableHeight);
      var rtl = document.documentElement.dir === "rtl";
      if (!cableRoutes.length || cableRoutesRtl !== rtl) {
        cableRoutes = cableLaneOffsets.map(function (_, laneIndex) { return buildCableRoute(laneIndex, rtl); });
        cableRoutesRtl = rtl;
      }
      cableContext.shadowBlur = 0;
      cableContext.lineCap = "round";
      cableContext.lineJoin = "round";
      cableRoutes.forEach(function (route, laneIndex) {
        traceCableDistance(route, 0, route.total);
        cableContext.lineWidth = 1.5;
        cableContext.strokeStyle = cableLaneColors[laneIndex];
        cableContext.stroke();
      });

      var cardEnergy = cableNodes.map(function () { return 0; });
      if (!reduced) {
        cableRoutes.forEach(function (route, laneIndex) {
          var headDistance = ((time * .088) + route.total * laneIndex * .23) % route.total;
          cableContext.lineWidth = 2.7;
          cableContext.strokeStyle = "rgba(240,107,160,.88)";
          cableContext.shadowColor = "rgba(216,43,114,.86)";
          cableContext.shadowBlur = 13;
          strokeCablePulse(route, headDistance - 48, headDistance);
          var head = cablePointAtDistance(route, headDistance);
          cableContext.beginPath();
          cableContext.arc(head.x, head.y, 2.7, 0, Math.PI * 2);
          cableContext.fillStyle = "rgba(255,214,231,.98)";
          cableContext.shadowBlur = 15;
          cableContext.fill();
          cableNodes.forEach(function (node, nodeIndex) {
            var nodeLeft = node.offsetLeft;
            var nodeRight = nodeLeft + node.offsetWidth;
            var nodeTop = node.offsetTop;
            var nodeBottom = nodeTop + node.offsetHeight;
            if (head.x >= nodeLeft && head.x <= nodeRight && head.y >= nodeBottom - 48 && head.y <= nodeBottom - 14) {
              cardEnergy[nodeIndex] = .16;
            }
          });
        });
      }
      cableContext.shadowBlur = 0;

      cableNodes.forEach(function (node, index) {
        node.style.setProperty("--flow-energy", cardEnergy[index].toFixed(3));
      });
    }

    function sizeCableCanvas() {
      if (!cableContext) return;
      var rect = cableStage.getBoundingClientRect();
      var ratio = Math.min(window.devicePixelRatio || 1, 2);
      cableWidth = Math.max(1, rect.width);
      cableHeight = Math.max(1, rect.height);
      cableCanvas.width = Math.round(cableWidth * ratio);
      cableCanvas.height = Math.round(cableHeight * ratio);
      cableCanvas.style.width = cableWidth + "px";
      cableCanvas.style.height = cableHeight + "px";
      cableContext.setTransform(ratio, 0, 0, ratio, 0, 0);
      cableRoutes = [];
      drawCableFlow(reduced ? 0 : performance.now());
    }

    function runCableFlow(time) {
      drawCableFlow(time);
      if (cableVisible && !reduced && !document.hidden) cableFrame = window.requestAnimationFrame(runCableFlow);
      else {
        cableFrame = 0;
        cableRunning = false;
      }
    }

    function startCableFlow() {
      if (reduced || cableRunning || !cableVisible || document.hidden) return;
      cableRunning = true;
      cableFrame = window.requestAnimationFrame(runCableFlow);
    }

    function stopCableFlow() {
      if (cableFrame) window.cancelAnimationFrame(cableFrame);
      cableFrame = 0;
      cableRunning = false;
    }

    sizeCableCanvas();
    if ("ResizeObserver" in window) {
      var cableResizeObserver = new ResizeObserver(sizeCableCanvas);
      cableResizeObserver.observe(cableStage);
      cableNodes.forEach(function (node) { cableResizeObserver.observe(node); });
    } else window.addEventListener("resize", sizeCableCanvas, { passive: true });

    if (!reduced && "IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        cableVisible = entries[0].isIntersecting;
        if (cableVisible) startCableFlow();
        else stopCableFlow();
      }, { rootMargin: "180px 0px" }).observe(cableStage);
    }
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stopCableFlow();
      else startCableFlow();
    });
    startCableFlow();
  }

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
      if (window.QuantumPocCatalogue && document.querySelector("[data-poc-catalogue]")) {
        window.QuantumPocCatalogue.setFilter(filter);
        return;
      }
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

  /* Mobile menu: the desktop mega groups become compact tap accordions. */
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
    overlay.innerHTML = '<div class="mobile-menu-head"><span class="eyebrow">' + t("Navigate Quantum-hub") + '</span></div><div class="mobile-menu-groups">' + megaGroups.map(function (group, groupIndex) {
      return '<section class="mobile-menu-group"><button type="button" aria-expanded="false" aria-controls="mobile-menu-group-' + groupIndex + '"><span>' + t(group.label) + '</span><i data-lucide="plus" aria-hidden="true"></i></button><div class="mobile-menu-group-panel" id="mobile-menu-group-' + groupIndex + '">' + group.links.map(function (link) {
        return '<a href="' + link[1] + '"><strong>' + t(link[0]) + '</strong><small>' + t(link[2]) + '</small></a>';
      }).join("") + '</div></section>';
    }).join("") + '</div>' +
      '<a class="btn btn--primary mobile-menu-contact" href="contact.html">' + t("Contact us") + "</a>" +
      '<button class="close-btn" aria-label="' + t("Close menu") + '"><i data-lucide="x" style="width:26px;height:26px;"></i></button>';
    document.body.appendChild(overlay);
    var mobileGroupButtons = Array.prototype.slice.call(overlay.querySelectorAll(".mobile-menu-group > button"));
    mobileGroupButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var shouldOpen = button.getAttribute("aria-expanded") !== "true";
        mobileGroupButtons.forEach(function (other) {
          other.setAttribute("aria-expanded", "false");
          other.parentElement.classList.remove("is-open");
        });
        if (shouldOpen) {
          button.setAttribute("aria-expanded", "true");
          button.parentElement.classList.add("is-open");
        }
      });
    });
    function openMobileMenu() {
      overlay.classList.add("is-open");
      document.body.classList.add("menu-open");
      overlay.querySelector(".close-btn").focus();
    }
    function closeMobileMenu() {
      overlay.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      menuButton.focus();
    }
    menuButton.addEventListener("click", openMobileMenu);
    overlay.querySelector(".close-btn").addEventListener("click", closeMobileMenu);
    document.addEventListener("keydown", function (event) { if (event.key === "Escape" && overlay.classList.contains("is-open")) closeMobileMenu(); });
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
