(function () {
  "use strict";
  var root = document.querySelector("[data-calendar]");
  if (!root) return;
  var url = window.QH_CONFIG && window.QH_CONFIG.calendarUrl;
  var translate = function (text) {
    return window.QuantumI18n ? window.QuantumI18n.translate(text) : text;
  };

  if (!url) {
    root.innerHTML = '<div class="calendar-fallback" role="status"><span class="eyebrow">Calendly</span><h3>' + translate("Online booking is being activated") + '</h3><p>' + translate("Available startup-meeting times will appear here as soon as Quantum-hub's calendar connection is complete.") + "</p></div>";
    return;
  }

  var widget = document.createElement("div");
  widget.className = "calendly-inline-widget";
  widget.setAttribute("data-url", url + (url.indexOf("?") === -1 ? "?" : "&") + "background_color=0e1112&text_color=ffffff&primary_color=d82b72");
  root.appendChild(widget);
  var external = document.createElement("a");
  external.className = "calendar-external";
  external.href = url;
  external.target = "_blank";
  external.rel = "noopener";
  external.textContent = translate("Open booking page in a new tab");
  root.appendChild(external);
  var script = document.createElement("script");
  script.src = "https://assets.calendly.com/assets/external/widget.js";
  script.async = true;
  document.head.appendChild(script);
})();
