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

  /* A restrained cable bundle carries one visible current from need to evidence.
     The aligned cards keep every connection readable and avoid crossing paths. */
  var cableStage = document.querySelector("[data-cable-flow]");
  if (cableStage) {
    var cableCanvas = cableStage.querySelector("canvas");
    var cableContext = cableCanvas && cableCanvas.getContext("2d");
    var cableNodes = Array.prototype.slice.call(cableStage.querySelectorAll(".flow-node"));
    var cableWidth = 0;
    var cableHeight = 0;
    var cableTrunkY = 0;
    var cableVisible = !("IntersectionObserver" in window);
    var cableRunning = false;
    var cableFrame = 0;

    function cableY(x, offset) {
      return cableTrunkY + offset + Math.sin((x / Math.max(1, cableWidth)) * Math.PI * 2 - .45) * 4;
    }

    function traceCable(offset) {
      cableContext.beginPath();
      for (var x = -40; x <= cableWidth + 40; x += 12) {
        var y = cableY(x, offset);
        if (x === -40) cableContext.moveTo(x, y);
        else cableContext.lineTo(x, y);
      }
    }

    function drawCableBranches() {
      cableNodes.forEach(function (node, index) {
        var anchorX = node.offsetLeft + node.offsetWidth / 2;
        var anchorY = node.offsetTop + node.offsetHeight + 7;
        var bend = index % 2 === 0 ? 9 : -9;
        cableContext.beginPath();
        cableContext.moveTo(anchorX, anchorY);
        cableContext.bezierCurveTo(anchorX, anchorY + 38, anchorX + bend, cableTrunkY - 38, anchorX, cableY(anchorX, 0));
        cableContext.lineWidth = 1.5;
        cableContext.strokeStyle = "rgba(194,203,203,.22)";
        cableContext.shadowBlur = 0;
        cableContext.stroke();
      });
    }

    function drawCableFlow(time) {
      if (!cableContext) return;
      cableContext.clearRect(0, 0, cableWidth, cableHeight);
      drawCableBranches();

      [-8, 8].forEach(function (offset) {
        traceCable(offset);
        cableContext.lineWidth = 1.5;
        cableContext.strokeStyle = "rgba(194,203,203,.16)";
        cableContext.shadowBlur = 0;
        cableContext.stroke();
      });

      traceCable(0);
      cableContext.lineWidth = 2;
      cableContext.strokeStyle = "rgba(240,107,160,.34)";
      cableContext.shadowBlur = 0;
      cableContext.stroke();

      var rtl = document.documentElement.dir === "rtl";
      var progress = reduced ? .78 : (time % 5200) / 5200;
      var pulseX = rtl ? cableWidth + 32 - progress * (cableWidth + 64) : -32 + progress * (cableWidth + 64);
      var tail = rtl ? 30 : -30;
      cableContext.beginPath();
      for (var step = 0; step <= 12; step += 1) {
        var tailX = pulseX + tail * (1 - step / 12);
        var tailY = cableY(tailX, 0);
        if (step === 0) cableContext.moveTo(tailX, tailY);
        else cableContext.lineTo(tailX, tailY);
      }
      cableContext.lineWidth = 3;
      cableContext.strokeStyle = "rgba(240,107,160,.8)";
      cableContext.shadowColor = "rgba(216,43,114,.78)";
      cableContext.shadowBlur = 14;
      cableContext.stroke();

      cableContext.beginPath();
      cableContext.arc(pulseX, cableY(pulseX, 0), 3.2, 0, Math.PI * 2);
      cableContext.fillStyle = "rgba(255,214,231,.98)";
      cableContext.shadowBlur = 18;
      cableContext.fill();
      cableContext.shadowBlur = 0;
    }

    function sizeCableCanvas() {
      if (!cableContext) return;
      var rect = cableStage.getBoundingClientRect();
      var ratio = Math.min(window.devicePixelRatio || 1, 2);
      cableWidth = Math.max(1, rect.width);
      cableHeight = Math.max(1, rect.height);
      cableTrunkY = cableHeight * .72;
      cableCanvas.width = Math.round(cableWidth * ratio);
      cableCanvas.height = Math.round(cableHeight * ratio);
      cableCanvas.style.width = cableWidth + "px";
      cableCanvas.style.height = cableHeight + "px";
      cableContext.setTransform(ratio, 0, 0, ratio, 0, 0);
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
