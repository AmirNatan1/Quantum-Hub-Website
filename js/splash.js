/* One-time Quantum-hub splash. Loaded synchronously in <head> so the first
   paint is covered without flashing the page underneath. */
(function () {
  "use strict";

  var root = document.documentElement;
  /* Bump the key only when the splash itself changes so every visitor sees
     the new version once, without replaying it during normal navigation. */
  var storageKey = "qh-splash-seen-v2";
  var replayKey = "qh-splash-replay";
  var shouldPlay = true;

  try {
    var replayRequested = sessionStorage.getItem(replayKey) === "1";
    shouldPlay = replayRequested || sessionStorage.getItem(storageKey) !== "1";
    if (replayRequested) sessionStorage.removeItem(replayKey);
  } catch (error) {
    /* The splash can still play when storage is unavailable. */
  }

  /* The top-left brand mark remains a home link, but it also requests one
     deliberate replay. Modified clicks retain normal browser behavior. */
  function bindLogoReplay() {
    document.querySelectorAll('.site-header .logo-tile[href]').forEach(function (logoLink) {
      logoLink.addEventListener("click", function (event) {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        try { sessionStorage.setItem(replayKey, "1"); } catch (error) {}
        window.location.assign(logoLink.href);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindLogoReplay, { once: true });
  } else {
    bindLogoReplay();
  }

  if (!shouldPlay) return;

  root.classList.add("site-splash-preparing");

  function mountSplash() {
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      root.classList.remove("site-splash-preparing");
      return;
    }

    var splash = document.createElement("div");
    splash.className = "site-splash";
    splash.setAttribute("aria-hidden", "true");
    splash.innerHTML = [
      '<div class="site-splash__lockup">',
      '<img class="site-splash__icon" src="assets/quantum-icon.png" alt="">',
      '<span class="site-splash__word" aria-label="quantum">',
      '<span>q</span><span>u</span><span>a</span><span>n</span><span>t</span><span>u</span><span>m</span>',
      "</span>",
      "</div>"
    ].join("");

    document.body.insertBefore(splash, document.body.firstChild);
    try { sessionStorage.setItem(storageKey, "1"); } catch (error) {}
    var blockedSiblings = [];
    if ("inert" in HTMLElement.prototype) {
      blockedSiblings = Array.prototype.slice.call(document.body.children).filter(function (element) {
        return element !== splash;
      });
      blockedSiblings.forEach(function (element) { element.inert = true; });
    }
    root.classList.remove("site-splash-preparing");
    root.classList.add("site-splash-open");

    window.requestAnimationFrame(function () {
      window.setTimeout(function () {
        splash.classList.add("is-revealing");
      }, 500);

      window.setTimeout(function () {
        splash.classList.add("is-exiting");
      }, 2720);

      window.setTimeout(function () {
        splash.remove();
        blockedSiblings.forEach(function (element) { element.inert = false; });
        root.classList.remove("site-splash-open");
      }, 3540);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountSplash, { once: true });
  } else {
    mountSplash();
  }
})();
