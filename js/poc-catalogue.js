/* Approved public POC catalogue. Keep this list aligned with
   data/poc-source-list.txt and the verified content brief. */
(function () {
  "use strict";

  var viewport = document.querySelector("[data-poc-catalogue]");
  if (!viewport) return;

  var track = viewport.querySelector(".drift-track");
  var search = document.querySelector("[data-poc-search]");
  var resultCount = document.querySelector("[data-poc-result-count]");
  var activeFilter = "all";
  var records = [];
  var searchTimer = null;

  var sectorLabels = {
    automotive: "Automotive",
    logistics: "Logistics",
    industry: "Industry 4.0",
    energy: "Energy"
  };

  var profiles = {
    "actasys": {
      sector: "automotive", description: "Sensor cleaning systems for ADAS",
      image: "assets/media/case-actasys.png", imageAlt: "Actasys logo", detail: "case-study-actasys.html"
    },
    "tactile mobility": {
      sector: "automotive", description: "Tactile sensing and data software for vehicles",
      image: "assets/media/case-tactile-mobility.png", imageAlt: "Tactile Mobility logo"
    },
    "indoor robotics": { sector: "logistics", description: "Fully autonomous indoor drone fleet" },
    "hoopo": { sector: "logistics", description: "Visibility and management for non-powered equipment" },
    "skillreal": { sector: "industry", description: "Digital twin technology for the manufacturing floor" },
    "ubq materials": { sector: "industry", description: "Household waste converted into thermoplastic material" },
    "gencell": { sector: "energy", description: "Hydrogen and ammonia fuel cell power solutions" },
    "augwind": { sector: "energy", description: "Underground compressed-air energy storage" }
  };

  var fallbackRecords = [
    "Actasys", "Tactile Mobility", "Indoor Robotics", "Hoopo",
    "SkillReal", "UBQ Materials", "GenCell", "Augwind"
  ];

  function keyFor(value) {
    return String(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
    });
  }

  function initialsFor(company) {
    var words = company.split(/[^A-Za-z0-9]+/).filter(Boolean);
    return words.length ? words.slice(0, 2).map(function (word) {
      return word.charAt(0);
    }).join("").toUpperCase() : "POC";
  }

  function parseRecord(raw, index) {
    var company = raw.trim();
    var profile = profiles[keyFor(company)];
    return {
      id: "poc-" + String(index + 1).padStart(3, "0"),
      company: company,
      sector: profile ? profile.sector : "industry",
      profile: profile || { sector: "industry", description: "Public technical scope is not available." },
      searchText: keyFor([company, profile ? profile.sector : "industry"].join(" "))
    };
  }

  function visualFor(record) {
    if (record.profile.image) {
      return '<img src="' + escapeHtml(record.profile.image) + '" alt="' + escapeHtml(record.profile.imageAlt) + '" loading="lazy" draggable="false">';
    }
    return '<div class="drift-card-visual drift-card-visual--' + record.sector + '" role="img" aria-label="' + escapeHtml(record.company + ", " + sectorLabels[record.sector] + " POC") + '">' +
      '<span class="drift-card-initials" aria-hidden="true">' + escapeHtml(initialsFor(record.company)) + '</span>' +
      '<span class="drift-card-wordmark">' + escapeHtml(record.company) + '</span></div>';
  }

  function cardFor(record) {
    var detail = record.profile.detail ? '<a class="drift-case-link" href="' + record.profile.detail + '">Read the full case</a>' : "";
    var mediaStatus = record.profile.image ? "approved" : "typographic";
    return '<div class="drift-card-physics" data-case="' + record.sector + '" data-search="' + escapeHtml(record.searchText) + '" data-media="' + mediaStatus + '" data-drift-original>' +
      '<article class="drift-card" aria-labelledby="' + record.id + '-title">' + visualFor(record) +
      '<div class="body"><span class="sector-label"><span class="sector-dot sector-dot--' + record.sector + '"></span>' + escapeHtml(sectorLabels[record.sector]) + '</span>' +
      '<h3 id="' + record.id + '-title">' + escapeHtml(record.company) + '</h3>' +
      '<p>' + escapeHtml(record.profile.description) + '</p><div class="poc-card-links">' + detail + '</div></div></article></div>';
  }

  function render(sourceRecords) {
    records = sourceRecords.map(parseRecord).filter(function (record) {
      return Boolean(profiles[keyFor(record.company)]);
    });
    track.innerHTML = records.map(cardFor).join("");
    viewport.setAttribute("aria-busy", "false");
    viewport.dataset.pocReady = "true";
    applyFilter();
    window.dispatchEvent(new CustomEvent("quantum:poc-ready", { detail: { count: records.length } }));
  }

  function applyFilter(nextFilter) {
    if (nextFilter) activeFilter = nextFilter;
    var query = keyFor(search ? search.value : "");
    var visible = 0;
    track.querySelectorAll("[data-drift-original]").forEach(function (card) {
      var sectorMatch = activeFilter === "all" || card.getAttribute("data-case") === activeFilter;
      var searchMatch = !query || card.getAttribute("data-search").indexOf(query) !== -1;
      var show = sectorMatch && searchMatch;
      card.classList.toggle("is-hidden", !show);
      if (show) visible += 1;
    });
    if (resultCount) resultCount.textContent = visible + " of " + records.length + " POCs shown";
    window.dispatchEvent(new CustomEvent("quantum:case-filter", { detail: { filter: activeFilter, query: query } }));
  }

  window.QuantumPocCatalogue = {
    setFilter: applyFilter,
    count: function () { return records.length; },
    unmatchedMediaCount: function () {
      return records.filter(function (record) { return !record.profile.image; }).length;
    }
  };

  if (search) search.addEventListener("input", function () {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(function () { applyFilter(); }, 90);
  });

  fetch("data/poc-source-list.txt", { credentials: "same-origin" })
    .then(function (response) {
      if (!response.ok) throw new Error("Catalogue request failed");
      return response.text();
    })
    .then(function (source) {
      render(source.split(/\r?\n/).map(function (line) { return line.trim(); }).filter(Boolean));
    })
    .catch(function () {
      render(fallbackRecords);
      if (resultCount) resultCount.textContent = "The catalogue could not load; showing the approved public records.";
    });
})();