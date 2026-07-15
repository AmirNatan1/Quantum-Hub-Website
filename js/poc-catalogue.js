/* Data-driven POC catalogue. The source list is kept verbatim in
   data/poc-source-list.txt so uncertain spellings are never silently erased. */
(function () {
  "use strict";

  var viewport = document.querySelector("[data-poc-catalogue]");
  if (!viewport) return;

  var track = viewport.querySelector(".drift-track");
  var search = document.querySelector("[data-poc-search]");
  var resultCount = document.querySelector("[data-poc-result-count]");
  var language = window.QuantumI18n && window.QuantumI18n.current() === "he" ? "he" : "en";
  var activeFilter = "all";
  var records = [];
  var searchTimer = null;

  var sectorLabels = {
    en: { automotive: "Automotive", logistics: "Logistics", industry: "Industry 4.0", energy: "Energy" },
    he: { automotive: "רכב", logistics: "לוגיסטיקה", industry: "תעשייה 4.0", energy: "אנרגיה" }
  };

  var profiles = {
    "corractions": {
      sector: "automotive", image: "assets/media/case-corractions.png", imageAlt: "CorrActions logo",
      source: "https://quantum-hub.com/poc-playground/",
      en: "Software that tracks driver brain-control activity in real time to identify deterioration.",
      he: "תוכנה שעוקבת בזמן אמת אחר פעילות מנגנוני השליטה של הנהג כדי לזהות הידרדרות."
    },
    "tactile mobility": {
      sector: "automotive", image: "assets/media/case-tactile-mobility.png", imageAlt: "Tactile Mobility logo",
      source: "https://quantum-hub.com/poc-playground/",
      en: "Software-only analysis of existing vehicle sensors to produce vehicle, road, and vehicle-road insights.",
      he: "ניתוח תוכנתי של חיישני הרכב הקיימים להפקת תובנות על הרכב, הכביש והאינטראקציה ביניהם."
    },
    "maradin": {
      sector: "automotive", image: "assets/media/case-maradin.png", imageAlt: "Maradin logo",
      source: "https://quantum-hub.com/poc-playground/",
      en: "MEMS-based laser scanning designed to support communication with passengers and other road users.",
      he: "סריקת לייזר מבוססת MEMS שנועדה לתמוך בתקשורת עם נוסעים ועם משתמשי דרך אחרים."
    },
    "coreteel": {
      sector: "industry", image: "assets/media/case-coreteel.png", imageAlt: "Coreteel logo",
      source: "https://quantum-hub.com/poc-playground/",
      en: "Environmentally conscious anti-corrosion materials that can be sprayed or dipped at room temperature.",
      he: "חומרים למניעת קורוזיה שניתנים ליישום בהתזה או בטבילה בטמפרטורת החדר."
    },
    "actasys": {
      sector: "automotive", image: "assets/media/case-actasys.png", imageAlt: "Actasys logo",
      source: "https://quantum-hub.com/poc-playground/", detail: "case-study-actasys.html",
      en: "ActaJet sensor cleaning designed to maintain camera and sensor visibility for ADAS and autonomous vehicles.",
      he: "מערכת ניקוי החיישנים ActaJet שנועדה לשמור על ראות המצלמות והחיישנים ברכבי ADAS וברכב אוטונומי."
    },
    "safemode": {
      image: "assets/media/poc-safemode.png", imageAlt: "SafeMode logo",
      source: "https://quantum-hub.com/portfolio/safemode/"
    },
    "autotrust": {
      sector: "automotive", image: "assets/media/poc-autotrust.jpeg", imageAlt: "AutoTrust logo",
      source: "https://quantum-hub.com/portfolio/siraj/"
    },
    "thermo terra": {
      sector: "industry", image: "assets/media/poc-thermoterra.png", imageAlt: "ThermoTerra logo",
      source: "https://quantum-hub.com/portfolio/thermoterra/"
    }
  };

  var fallbackRecords = [
    "Coreteel@ MedOne", "Coreteel@ Laktechniek", "Coreteel@ Bazan",
    "Thermo Terra @ Venta", "Tactile mobility @ Hyundai", "CorrActions @ Hyundai",
    "Autotrust Hyundai Mobis", "SafeMode Galil Maaravi", "SafeMode Negev Arava",
    "SafeMode UTI", "SafeMode Emek Hayarden", "Maradin Hyundai", "SafeMode Taavura Tours",
    "Movilit SafeMode", "SafeMode Tashtit", "Actasys Hyundai"
  ];

  var exactCorrections = {
    "Tactile mobility": "Tactile Mobility",
    "Evolution Al": "Evolution AI",
    "Korra Al": "Korra AI",
    "Belle Al": "Belle AI",
    "Maverick Al": "Maverick AI",
    "Beamz Al": "Beamz AI",
    "Reindeer Al": "Reindeer AI",
    "Bell Al": "Bell AI",
    "Prosody-Al": "Prosody-AI",
    "Conbo al": "Conbo AI",
    "Conbo ai": "Conbo AI",
    "Self ai": "Self AI",
    "brain space": "Brain.Space",
    "Eyenet-mobile": "Eye-Net Mobile",
    "Gvanim-sensing": "Gvanim Sensing",
    "Apallo Power": "Apollo Power"
  };

  var suffixes = [
    "Earthmoving Division", "Grand Automotive", "Taavura Tours", "Bus & Coach",
    "Emek Hayarden", "Negev Arava", "Ganei Hadas", "Hyundai Mobis",
    "Galil Maaravi", "Mast Solutions", "Grand Auto", "Defen Tec", "Masof Hamitanim",
    "Logisticare", "Laktechniek", "ProCollege", "Tikshoov", "Shmerling", "Smerling",
    "Mast Solution", "Nedcar",
    "Tashtit", "Tadiran", "MedOne", "Hyundai", "Bazan", "TalCar", "Talcar",
    "Taavura", "Maman", "Laufer", "Weweler", "Tifzoret", "Movilit", "SEEU", "VDL", "UTI",
    "UPS", "ETS", "E.M.I", "E.Μ.Ι", "EMI", "GA"
  ];

  function keyFor(value) {
    return String(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
    });
  }

  function normalizePartner(value) {
    return String(value).trim()
      .replace(/^\s+|\s+$/g, "")
      .replace(/^Hyuridal$/i, "Hyundai")
      .replace(/^TalCar$/i, "Talcar")
      .replace(/^E\.(?:M|Μ)\.I$/i, "EMI")
      .replace(/^Smerling$/i, "Shmerling");
  }

  function normalizeCompany(value) {
    var clean = String(value).trim().replace(/\s+/g, " ");
    return exactCorrections[clean] || clean;
  }

  function specialRecord(raw) {
    var special = {
      "Movilit Quantum (Data)": ["Movilit Quantum", "Data track"],
      "Movilit Quantum (Product)": ["Movilit Quantum", "Product track"],
      "MIS26 Taavura (Emek Hayarden/Tifzoret)": ["MIS26", "Taavura — Emek Hayarden / Tifzoret"],
      "Connected Insurance @ Hyuridal": ["Connected Insurance", "Hyundai"],
      "Wire Logic @ Tashtit, UTI": ["Wire Logic", "Tashtit / UTI"],
      "RoadSense @ Mast Solutions @ Heijmans": ["RoadSense", "Mast Solutions / Heijmans"],
      "Hyundai Blings to": ["Blings", "Hyundai"],
      "Quantum <> Masof Hamitanim": ["Quantum-hub", "Masof Hamitanim"],
      "Quantum <> MPcheck": ["Quantum-hub", "MPcheck"],
      "UTI Quantum": ["UTI", "Quantum-hub"],
      "Maman Quantum": ["Maman", "Quantum-hub"],
      "Movilit SafeMode": ["SafeMode", "Movilit"],
      "eSelf a ProCollege": ["eSelf", "ProCollege"]
    };
    return special[raw] || null;
  }

  function parseRecord(raw, index) {
    var cleanRaw = raw.trim();
    var demo = /\s*\(Demo\)\s*$/i.test(cleanRaw);
    var withoutDemo = cleanRaw.replace(/\s*\(Demo\)\s*$/i, "").trim();
    var special = specialRecord(cleanRaw) || specialRecord(withoutDemo);
    var company = "";
    var partner = "";

    if (special) {
      company = special[0];
      partner = special[1];
    } else if (withoutDemo.indexOf("<>") !== -1) {
      var arrowParts = withoutDemo.split(/\s*<>\s*/);
      company = arrowParts.shift();
      partner = arrowParts.join(" / ");
    } else if (withoutDemo.indexOf("@") !== -1) {
      var atParts = withoutDemo.split(/\s*@\s*/).filter(Boolean);
      company = atParts.shift();
      partner = atParts.join(" / ");
    } else {
      for (var suffixIndex = 0; suffixIndex < suffixes.length; suffixIndex += 1) {
        var suffix = suffixes[suffixIndex];
        if (withoutDemo.length > suffix.length && withoutDemo.toLowerCase().slice(-(suffix.length + 1)) === " " + suffix.toLowerCase()) {
          company = withoutDemo.slice(0, -(suffix.length + 1));
          partner = suffix;
          break;
        }
      }
      if (!company) {
        company = withoutDemo;
        partner = "Partner/site not separated";
      }
    }

    company = normalizeCompany(company);
    partner = normalizePartner(partner);
    var profile = profiles[keyFor(company)] || null;
    var sector = profile && profile.sector ? profile.sector : inferSector(company, partner);

    return {
      id: "poc-" + String(index + 1).padStart(3, "0"),
      raw: cleanRaw,
      company: company,
      partner: partner,
      demo: demo,
      sector: sector,
      profile: profile,
      searchText: keyFor([cleanRaw, company, partner, sector].join(" "))
    };
  }

  function inferSector(company, partner) {
    var combined = (company + " " + partner).toLowerCase();
    if (/hyundai|talcar|grand auto|bus & coach|hyundai mobis|weweler|vdl|\buti\b/.test(combined)) return "automotive";
    if (/bazan|tadiran|thermagix|h2 free dome|apollo solar|enogia|turbogen|blue planet|ngv/.test(combined)) return "energy";
    if (/maman|laufer|tashtit|taavura|logisticare|negev arava|emek hayarden|galil maaravi|shmerling|smerling|ganei hadas|ups|masof hamitanim/.test(combined)) return "logistics";
    return "industry";
  }

  function initialsFor(company) {
    var words = company.replace(/\([^)]*\)/g, " ").split(/[^A-Za-z0-9]+/).filter(Boolean);
    if (!words.length) return "POC";
    return words.slice(0, 2).map(function (word) { return word.charAt(0); }).join("").toUpperCase();
  }

  function partnerIsUnknown(partner) {
    return partner === "Partner/site not separated";
  }

  function descriptionFor(record) {
    if (record.profile && record.profile[language]) return record.profile[language];
    if (language === "he") {
      if (partnerIsUnknown(record.partner)) return "רשומת שיתוף פעולה שנמסרה ל-Quantum-hub. היקף הניסוי והחלוקה בין החברה לאתר אינם זמינים לציבור.";
      return "שיתוף פעולה ל-POC עם " + record.partner + ", כפי שנמסר בקטלוג של Quantum-hub. היקף הניסוי הטכני אינו זמין לציבור.";
    }
    if (partnerIsUnknown(record.partner)) return "Collaboration record supplied to Quantum-hub; the public source does not separate the company from the partner/site or document the technical scope.";
    return "POC pairing with " + record.partner + ", as listed in Quantum-hub’s supplied catalogue. Public technical scope is not available.";
  }

  function visualFor(record) {
    if (record.profile && record.profile.image) {
      return '<img src="' + escapeHtml(record.profile.image) + '" alt="' + escapeHtml(record.profile.imageAlt || record.company) + '" loading="lazy" draggable="false">';
    }
    var sector = sectorLabels[language][record.sector];
    var label = language === "he" ? record.company + ", POC בתחום " + sector : record.company + ", " + sector + " POC";
    return '<div class="drift-card-visual drift-card-visual--' + record.sector + '" role="img" aria-label="' + escapeHtml(label) + '">' +
      '<span class="drift-card-initials" aria-hidden="true">' + escapeHtml(initialsFor(record.company)) + '</span>' +
      '<span class="drift-card-wordmark">' + escapeHtml(record.company) + '</span></div>';
  }

  function cardFor(record) {
    var partnerLabel = partnerIsUnknown(record.partner) ? (language === "he" ? "הנוסח המקורי נשמר" : "Source wording preserved") : record.partner;
    var demoLabel = record.demo ? '<span class="poc-demo">' + (language === "he" ? "הדגמה" : "Demo") + '</span>' : "";
    var detail = record.profile && record.profile.detail ? '<a class="drift-case-link" href="' + record.profile.detail + '">' + (language === "he" ? "למקרה הבוחן המלא" : "Read the full case") + '</a>' : "";
    var sourceLink = record.profile && record.profile.source ? '<a class="poc-source-link" href="' + escapeHtml(record.profile.source) + '" target="_blank" rel="noopener">' + (language === "he" ? "מקור המדיה באתר המקורי" : "Original-site media source") + '</a>' : "";
    var mediaStatus = record.profile && record.profile.image ? "original" : "fallback";
    return '<div class="drift-card-physics" data-case="' + record.sector + '" data-search="' + escapeHtml(record.searchText) + '" data-media="' + mediaStatus + '" data-drift-original>' +
      '<article class="drift-card" aria-labelledby="' + record.id + '-title">' + visualFor(record) +
      '<div class="body"><span class="sector-label"><span class="sector-dot sector-dot--' + record.sector + '"></span>' + escapeHtml(sectorLabels[language][record.sector]) + '</span>' +
      '<h3 id="' + record.id + '-title">' + escapeHtml(record.company) + '</h3>' +
      '<p class="poc-partner"><span>' + (language === "he" ? "שותף / אתר" : "Partner / site") + '</span> ' + escapeHtml(partnerLabel) + demoLabel + '</p>' +
      '<p>' + escapeHtml(descriptionFor(record)) + '</p><div class="poc-card-links">' + detail + sourceLink + '</div></div></article></div>';
  }

  function render(sourceRecords) {
    records = sourceRecords.map(parseRecord);
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

    if (resultCount) {
      if (language === "he") resultCount.textContent = visible + " מתוך " + records.length + " ניסויי POC מוצגים";
      else resultCount.textContent = visible + " of " + records.length + " POCs shown";
    }
    window.dispatchEvent(new CustomEvent("quantum:case-filter", { detail: { filter: activeFilter, query: query } }));
  }

  window.QuantumPocCatalogue = {
    setFilter: applyFilter,
    count: function () { return records.length; },
    unmatchedMediaCount: function () {
      return records.filter(function (record) { return !(record.profile && record.profile.image); }).length;
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
      var sourceRecords = source.split(/\r?\n/).map(function (line) { return line.trim(); }).filter(Boolean);
      render(sourceRecords);
    })
    .catch(function () {
      render(fallbackRecords);
      if (resultCount) resultCount.textContent = language === "he" ? "הקטלוג המלא לא נטען; מוצגות רשומות מאומתות מהאתר המקורי." : "The full catalogue could not load; showing original-site matched records.";
    });
})();
