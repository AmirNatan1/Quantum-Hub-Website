/* Interaction model for the POCs overview. Every enhancement has a static,
   readable baseline and turns itself off when reduced motion is requested. */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var t = function (text) {
    return window.QuantumI18n ? window.QuantumI18n.translate(text) : text;
  };

  var orbit = document.querySelector("[data-poc-orbit]");
  if (orbit && !reduced && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    orbit.addEventListener("pointermove", function (event) {
      var rect = orbit.getBoundingClientRect();
      var x = (event.clientX - rect.left) / Math.max(rect.width, 1) - .5;
      var y = (event.clientY - rect.top) / Math.max(rect.height, 1) - .5;
      orbit.style.setProperty("--poc-tilt-x", (x * 8).toFixed(2) + "deg");
      orbit.style.setProperty("--poc-tilt-y", (y * -8).toFixed(2) + "deg");
    });
    orbit.addEventListener("pointerleave", function () {
      orbit.style.setProperty("--poc-tilt-x", "0deg");
      orbit.style.setProperty("--poc-tilt-y", "0deg");
    });
  }

  var engine = document.querySelector("[data-poc-engine]");
  var stages = engine ? Array.prototype.slice.call(engine.querySelectorAll("[data-poc-stage]")) : [];
  var engineLine = engine ? engine.querySelector(".poc-engine-line span") : null;
  function setEngineStage(index) {
    stages.forEach(function (stage, stageIndex) {
      stage.classList.toggle("active", stageIndex <= index);
      stage.classList.toggle("current", stageIndex === index);
    });
    if (engineLine) engineLine.style.setProperty("--poc-engine-progress", stages.length > 1 ? index / (stages.length - 1) : 1);
  }
  if (stages.length) {
    setEngineStage(reduced ? stages.length - 1 : 0);
    stages.forEach(function (stage, index) {
      stage.addEventListener("pointerenter", function () { setEngineStage(index); });
      stage.addEventListener("focusin", function () { setEngineStage(index); });
    });
    if (!reduced && "IntersectionObserver" in window) {
      var stageObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setEngineStage(Number(entry.target.getAttribute("data-poc-stage")));
        });
      }, { threshold: .62, rootMargin: "-8% 0px -18% 0px" });
      stages.forEach(function (stage) { stageObserver.observe(stage); });
    }
  }

  var lensContent = {
    constraint: {
      label: "operational fit", title: "Measure the before and after.",
      copy: "Anchor the trial to the delay, cost, risk, or quality problem that prompted the search. A strong result changes that baseline in an observable way."
    },
    environment: {
      label: "field resilience", title: "Test where the edge cases live.",
      copy: "Expose the system to the physical conditions, data quality, pace, and exceptions that a polished demonstration cannot reproduce."
    },
    integration: {
      label: "organizational fit", title: "Include the humans and systems around it.",
      copy: "A technical result is incomplete until operators, security, IT, maintenance, and process owners understand the change it asks of them."
    },
    rollout: {
      label: "decision quality", title: "Define what happens after the result.",
      copy: "Translate the evidence into a next step with owners, conditions, and a reason—whether that step is deployment, refinement, another trial, or a stop."
    }
  };
  var questionButtons = Array.prototype.slice.call(document.querySelectorAll("[data-poc-question]"));
  var lens = document.querySelector("[data-poc-lens]");
  if (questionButtons.length && lens) {
    var lensLabel = lens.querySelector("[data-poc-lens-label]");
    var lensTitle = lens.querySelector("[data-poc-lens-title]");
    var lensCopy = lens.querySelector("[data-poc-lens-copy]");
    questionButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var content = lensContent[button.getAttribute("data-poc-question")];
        if (!content) return;
        questionButtons.forEach(function (other) {
          var active = other === button;
          other.classList.toggle("active", active);
          other.setAttribute("aria-selected", String(active));
        });
        lens.classList.remove("is-changing");
        void lens.offsetWidth;
        lens.classList.add("is-changing");
        lensLabel.textContent = t(content.label);
        lensTitle.textContent = t(content.title);
        lensCopy.textContent = t(content.copy);
      });
    });
  }
})();
