(function () {
  "use strict";
  var root = document.querySelector("[data-calendar]");
  if (!root) return;
  var url = window.QH_CONFIG && window.QH_CONFIG.calendarUrl;
  var translate = function (text) {
    return window.QuantumI18n ? window.QuantumI18n.translate(text) : text;
  };

  if (!url) {
    root.innerHTML = '<div class="calendar-fallback"><span class="eyebrow">' + translate("meeting calendar") + '</span><h3>' + translate("Choose a time once the host calendar is activated") + '</h3><p>' + translate("Until then, email Quantum-hub and we will arrange a suitable time directly.") + '</p><a class="btn btn--primary" style="margin-top:var(--space-5);" href="mailto:intern@quantum-hub.com?subject=Meeting%20request%20via%20quantum-hub.com">' + translate("Request a meeting by email") + "</a></div>";
    return;
  }

  var widget = document.createElement("div");
  widget.className = "calendly-inline-widget";
  widget.setAttribute("data-url", url + (url.indexOf("?") === -1 ? "?" : "&") + "background_color=0e1112&text_color=ffffff&primary_color=d82b72");
  root.appendChild(widget);
  var script = document.createElement("script");
  script.src = "https://assets.calendly.com/assets/external/widget.js";
  script.async = true;
  document.head.appendChild(script);
})();
