/* Small synchronous bootstrap. The translation catalogue lives in i18n.js;
   loading it as data keeps the large catalogue out of the browser's script
   parser while preserving a no-build static site. */
(function () {
  "use strict";

  var he = {};
  try {
    var request = new XMLHttpRequest();
    request.open("GET", "js/i18n.js", false);
    request.send(null);
    if (request.status >= 200 && request.status < 300) {
      var source = request.responseText;
      var marker = source.indexOf("var he = {");
      var objectStart = source.indexOf("{", marker);
      var objectEnd = source.indexOf("\n  };\n\n  var language", objectStart);
      var catalogue = source.slice(objectStart, objectEnd + 4).replace(/\/\*[\s\S]*?\*\//g, "");
      he = JSON.parse(catalogue);
    }
  } catch (error) {
    he = {};
  }

  var language = "en";
  try { language = localStorage.getItem("qh-language") || "en"; } catch (error) {}
  if (language !== "he") language = "en";

  function translate(text) {
    if (language !== "he") return text;
    var key = String(text).replace(/\u00a0/g, " ");
    return Object.prototype.hasOwnProperty.call(he, key) ? he[key] : text;
  }

  function applyHebrew() {
    document.documentElement.lang = "he";
    document.documentElement.dir = "rtl";
    document.title = translate(document.title);

    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      if (node.parentElement && /^(SCRIPT|STYLE|NOSCRIPT)$/.test(node.parentElement.tagName)) return;
      var raw = node.nodeValue;
      var trimmed = raw.trim();
      var key = trimmed.replace(/\u00a0/g, " ");
      if (!trimmed || !Object.prototype.hasOwnProperty.call(he, key)) return;
      node.nodeValue = raw.replace(trimmed, he[key]);
    });

    ["placeholder", "aria-label", "title", "alt"].forEach(function (attribute) {
      document.querySelectorAll("[" + attribute + "]").forEach(function (element) {
        var value = element.getAttribute(attribute);
        var key = String(value).replace(/\u00a0/g, " ");
        if (Object.prototype.hasOwnProperty.call(he, key)) element.setAttribute(attribute, he[key]);
      });
    });
    document.querySelectorAll('meta[name="description"], meta[property="og:title"], meta[property="og:description"]').forEach(function (meta) {
      var content = meta.getAttribute("content");
      if (Object.prototype.hasOwnProperty.call(he, content)) meta.setAttribute("content", he[content]);
    });
  }

  if (language === "he") applyHebrew();

  window.QuantumI18n = {
    current: function () { return language; },
    translate: translate,
    set: function (next) {
      if (next !== "en" && next !== "he") return;
      try { localStorage.setItem("qh-language", next); } catch (error) {}
      window.location.reload();
    }
  };
})();
