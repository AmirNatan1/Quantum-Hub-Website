/* Quantum-hub drifting gallery: custom drag, inertia, repulsion and lightweight
   film response without a premium animation dependency. */
(function () {
  "use strict";

  function init() {

  var viewport = document.querySelector("[data-drift-gallery]");
  if (!viewport) return;

  var track = viewport.querySelector(".drift-track");
  var emptyState = viewport.querySelector(".drift-empty");
  if (!track) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var originalCards = Array.prototype.slice.call(track.querySelectorAll("[data-drift-original]"));
  var allCards = originalCards.slice();
  var states = new WeakMap();
  var observedCards = new WeakSet();
  var settlingCards = new Set();
  var cardObserver = null;
  var galleryVisible = true;
  var position = 0;
  var targetPosition = 0;
  var baselineVelocity = document.documentElement.dir === "rtl" ? 0.62 : -0.62;
  var velocity = baselineVelocity;
  var dragging = false;
  var dragAxis = null;
  var activeCard = null;
  var pointerId = null;
  var lastPointerX = 0;
  var lastPointerY = 0;
  var lastPointerTime = 0;
  var dragDistance = 0;
  var suppressClick = false;
  var keyboardPaused = false;
  var lastFrame = performance.now();
  var lastGrainFrame = 0;

  originalCards.forEach(function (card, index) {
    card.dataset.driftOrder = String(index);
  });

  if ("IntersectionObserver" in window) {
    cardObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle("is-in-drift-view", entry.isIntersecting);
      });
    }, { root: viewport, rootMargin: "80px" });

    new IntersectionObserver(function (entries) {
      galleryVisible = entries[0] ? entries[0].isIntersecting : true;
    }, { rootMargin: "160px" }).observe(viewport);
  }

  function stateFor(card) {
    var state = states.get(card);
    if (!state) {
      var order = parseInt(card.dataset.driftOrder || allCards.indexOf(card), 10) || 0;
      state = { x: 0, velocity: 0, target: 0, phase: order * 0.83 };
      states.set(card, state);
    }
    if (cardObserver && !observedCards.has(card)) {
      cardObserver.observe(card);
      observedCards.add(card);
    }
    return state;
  }

  function registerCard(card) {
    if (allCards.indexOf(card) === -1) allCards.push(card);
    stateFor(card);
  }

  originalCards.forEach(registerCard);

  function visibleCards() {
    return Array.prototype.filter.call(track.children, function (card) {
      return card.classList && card.classList.contains("drift-card-physics") && !card.classList.contains("is-hidden");
    });
  }

  function restoreOriginalOrder() {
    settlingCards.clear();
    Array.prototype.slice.call(track.querySelectorAll("[data-drift-clone]")).forEach(function (clone) {
      if (cardObserver) cardObserver.unobserve(clone);
      clone.remove();
    });
    allCards = originalCards.slice();
    originalCards.slice().sort(function (a, b) {
      return parseInt(a.dataset.driftOrder, 10) - parseInt(b.dataset.driftOrder, 10);
    }).forEach(function (card) { track.appendChild(card); });
  }

  function cloneCard(seed, cloneIndex) {
    var clone = seed.cloneNode(true);
    clone.removeAttribute("data-drift-original");
    clone.setAttribute("data-drift-clone", "");
    clone.setAttribute("aria-hidden", "true");
    clone.classList.remove("is-in-drift-view", "is-grabbed");
    clone.style.transform = "";
    clone.querySelectorAll("[id]").forEach(function (element) { element.removeAttribute("id"); });
    clone.querySelectorAll("[aria-labelledby]").forEach(function (element) { element.removeAttribute("aria-labelledby"); });
    clone.dataset.driftOrder = String(parseInt(seed.dataset.driftOrder, 10) + cloneIndex * originalCards.length);
    clone.querySelectorAll("a, button, input, select, textarea, [tabindex]").forEach(function (interactive) {
      interactive.setAttribute("tabindex", "-1");
    });
    track.appendChild(clone);
    registerCard(clone);
    return clone;
  }

  function updateEmptyState() {
    var hasCards = visibleCards().length > 0;
    if (emptyState) emptyState.hidden = hasCards;
    track.hidden = !hasCards;
    return hasCards;
  }

  function ensureTrackCoverage() {
    restoreOriginalOrder();
    position = 0;
    targetPosition = 0;
    velocity = baselineVelocity;
    if (!updateEmptyState() || reduced) return;

    var seeds = originalCards.filter(function (card) { return !card.classList.contains("is-hidden"); });
    var cloneIndex = 1;
    var seedIndex = 0;
    var safety = 0;
    while (track.scrollWidth < viewport.clientWidth * 1.7 && safety < Math.max(12, seeds.length * 5)) {
      cloneCard(seeds[seedIndex % seeds.length], cloneIndex);
      seedIndex += 1;
      if (seedIndex % seeds.length === 0) cloneIndex += 1;
      safety += 1;
    }
  }

  function cardStep(card) {
    var styles = window.getComputedStyle(track);
    var gap = parseFloat(styles.columnGap || styles.gap) || 24;
    return card.getBoundingClientRect().width + gap;
  }

  function recycleCards() {
    var cards = visibleCards();
    if (cards.length < 2) return;
    var viewportRect = viewport.getBoundingClientRect();
    var first = cards[0];
    var firstRect = first.getBoundingClientRect();

    if (firstRect.right < viewportRect.left - 2) {
      var firstStep = cardStep(first);
      track.appendChild(first);
      position += firstStep;
      targetPosition += firstStep;
      return;
    }

    if (firstRect.left > viewportRect.left - 2) {
      var last = cards[cards.length - 1];
      var lastStep = cardStep(last);
      track.insertBefore(last, first);
      position -= lastStep;
      targetPosition -= lastStep;
    }
  }

  function setRepulsion(grabbed) {
    if (!grabbed) return;
    var activeRect = grabbed.getBoundingClientRect();
    var activeCenter = activeRect.left + activeRect.width / 2;
    var radius = Math.min(620, viewport.clientWidth * 0.58);
    var candidates = visibleCards().filter(function (card) {
      return card === grabbed || card.classList.contains("is-in-drift-view");
    });

    candidates.forEach(function (card) {
      var state = stateFor(card);
      if (card === grabbed) {
        state.target = 0;
      } else {
        var rect = card.getBoundingClientRect();
        var distance = rect.left + rect.width / 2 - activeCenter;
        var proximity = Math.max(0, 1 - Math.abs(distance) / radius);
        state.target = (distance < 0 ? -1 : 1) * proximity * proximity * 92;
      }
      settlingCards.add(card);
    });
  }

  function releaseRepulsion() {
    allCards.forEach(function (card) {
      var state = stateFor(card);
      if (Math.abs(state.x) > 0.05 || Math.abs(state.target) > 0.05) settlingCards.add(card);
      state.target = 0;
      card.classList.remove("is-grabbed");
    });
    activeCard = null;
  }

  function updateCardPhysics(card, now, floatEnabled) {
    var state = stateFor(card);
    var spring = (state.target - state.x) * 0.14;
    state.velocity = (state.velocity + spring) * 0.74;
    state.x += state.velocity;
    var floatY = floatEnabled ? Math.sin(now / 760 + state.phase) * 6 : 0;
    card.style.transform = "translate3d(" + state.x.toFixed(2) + "px," + floatY.toFixed(2) + "px,0)";
    if (!floatEnabled && Math.abs(state.x) < 0.08 && Math.abs(state.velocity) < 0.08 && state.target === 0) {
      state.x = 0;
      state.velocity = 0;
      card.style.transform = "translate3d(0,0,0)";
      settlingCards.delete(card);
    }
  }

  var grain = null;
  var grainContext = null;
  var grainImage = null;
  if (!reduced) {
    grain = document.createElement("canvas");
    grain.className = "drift-grain";
    grain.width = 96;
    grain.height = 96;
    grain.setAttribute("aria-hidden", "true");
    viewport.appendChild(grain);
    grainContext = grain.getContext("2d", { alpha: true });
    if (grainContext) grainImage = grainContext.createImageData(grain.width, grain.height);
  }

  function updateGrain(now, energy) {
    if (!grainContext || !grainImage) return;
    var interval = 145 - energy * 95;
    if (now - lastGrainFrame < interval) return;
    lastGrainFrame = now;
    for (var index = 0; index < grainImage.data.length; index += 4) {
      var value = Math.random() > 0.5 ? 255 : 30;
      grainImage.data[index] = value;
      grainImage.data[index + 1] = value;
      grainImage.data[index + 2] = value;
      grainImage.data[index + 3] = Math.floor(18 + Math.random() * 44);
    }
    grainContext.putImageData(grainImage, 0, 0);
    grain.style.opacity = String(0.12 + energy * 0.24);
  }

  function endDrag(event, cancelled) {
    if (!dragging || (event && pointerId !== null && event.pointerId !== pointerId)) return;
    if (pointerId !== null && viewport.hasPointerCapture && viewport.hasPointerCapture(pointerId)) {
      viewport.releasePointerCapture(pointerId);
    }
    dragging = false;
    dragAxis = null;
    pointerId = null;
    viewport.classList.remove("is-dragging");
    if (activeCard) activeCard.classList.remove("is-grabbed");
    releaseRepulsion();
    suppressClick = !cancelled && dragDistance > 7;
    window.setTimeout(function () { suppressClick = false; }, 0);
  }

  viewport.addEventListener("pointerdown", function (event) {
    if (event.button !== undefined && event.button !== 0) return;
    dragging = true;
    dragAxis = event.pointerType === "mouse" ? "horizontal" : null;
    pointerId = event.pointerId;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    lastPointerTime = performance.now();
    dragDistance = 0;
    velocity = 0;
    activeCard = event.target.closest(".drift-card-physics");
    if (activeCard) {
      activeCard.classList.add("is-grabbed");
      setRepulsion(activeCard);
    }
    viewport.classList.add("is-dragging");
  });

  viewport.addEventListener("pointermove", function (event) {
    if (!dragging || event.pointerId !== pointerId) return;
    var totalX = event.clientX - lastPointerX;
    var totalY = event.clientY - lastPointerY;
    if (!dragAxis && Math.max(Math.abs(totalX), Math.abs(totalY)) > 6) {
      dragAxis = Math.abs(totalX) > Math.abs(totalY) ? "horizontal" : "vertical";
      if (dragAxis === "vertical") {
        endDrag(event, true);
        return;
      }
    }
    if (dragAxis !== "horizontal") return;
    event.preventDefault();
    if (viewport.setPointerCapture && !viewport.hasPointerCapture(event.pointerId)) viewport.setPointerCapture(event.pointerId);
    var now = performance.now();
    var elapsed = Math.max(8, now - lastPointerTime);
    var delta = event.clientX - lastPointerX;
    targetPosition += delta;
    velocity = Math.max(-42, Math.min(42, velocity * 0.56 + (delta / elapsed) * 16.67 * 0.44));
    dragDistance += Math.abs(delta);
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    lastPointerTime = now;
  }, { passive: false });

  window.addEventListener("pointerup", function (event) { endDrag(event, false); });
  window.addEventListener("pointercancel", function (event) { endDrag(event, true); });
  viewport.addEventListener("click", function (event) {
    if (suppressClick) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  viewport.addEventListener("keydown", function (event) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    var direction = event.key === "ArrowLeft" ? 1 : -1;
    targetPosition += direction * Math.min(180, viewport.clientWidth * 0.16);
    velocity = direction * 12;
  });
  viewport.addEventListener("focusin", function (event) { keyboardPaused = event.target !== viewport; });
  viewport.addEventListener("focusout", function (event) {
    if (!viewport.contains(event.relatedTarget)) keyboardPaused = false;
  });

  window.addEventListener("quantum:case-filter", function () {
    window.requestAnimationFrame(ensureTrackCoverage);
  });
  var resizeTimer = null;
  window.addEventListener("resize", function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(ensureTrackCoverage, 160);
  }, { passive: true });

  function frame(now) {
    window.requestAnimationFrame(frame);
    if (!galleryVisible || document.hidden || track.hidden) {
      lastFrame = now;
      return;
    }
    var frameScale = Math.min(2, Math.max(0.45, (now - lastFrame) / 16.67));
    lastFrame = now;

    if (!dragging) {
      var desiredVelocity = keyboardPaused ? 0 : baselineVelocity;
      velocity += (desiredVelocity - velocity) * (1 - Math.pow(0.94, frameScale));
      targetPosition += velocity * frameScale;
    }
    position += (targetPosition - position) * (1 - Math.pow(dragging ? 0.68 : 0.82, frameScale));
    track.style.transform = "translate3d(" + position.toFixed(2) + "px,0,0)";
    recycleCards();

    var visible = Array.prototype.slice.call(track.querySelectorAll(".is-in-drift-view:not(.is-hidden)"));
    visible.forEach(function (card) { updateCardPhysics(card, now, true); });
    settlingCards.forEach(function (card) {
      if (visible.indexOf(card) === -1) updateCardPhysics(card, now, false);
    });

    var energy = Math.max(0, Math.min(1, (Math.abs(velocity) - Math.abs(baselineVelocity)) / 24 + Math.abs(targetPosition - position) / 140));
    viewport.style.setProperty("--drift-energy", energy.toFixed(3));
    updateGrain(now, energy);
  }

  function updateReducedEmptyState() {
    updateEmptyState();
  }

  if (reduced) {
    viewport.classList.add("is-reduced");
    updateReducedEmptyState();
    window.addEventListener("quantum:case-filter", updateReducedEmptyState);
  } else {
    viewport.classList.add("is-enhanced");
    ensureTrackCoverage();
    window.requestAnimationFrame(frame);
  }

  }

  var catalogueViewport = document.querySelector("[data-poc-catalogue]");
  if (catalogueViewport && catalogueViewport.dataset.pocReady !== "true") {
    window.addEventListener("quantum:poc-ready", init, { once: true });
  } else {
    init();
  }
})();
