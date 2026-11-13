/*
 * Everyday Claude Tools: renders the catalog from data/site.json and data/artifacts.json.
 * No frameworks, no build step, no third-party requests.
 * To add a tool, add one object to data/artifacts.json.
 *
 * Languages: English (en), Spanish (es), Catalan (ca).
 * The language comes from ?lang=xx, then the visitor's last choice, then the browser language.
 * Text fields in artifacts.json may be a plain string or an object {"en": "...", "es": "...", "ca": "..."}.
 */
(function () {
  "use strict";

  var LANGS = ["en", "es", "ca"];
  var STORE_KEY = "ect-lang";

  var UI = {
    en: {
      skip: "Skip to the list of tools",
      tagline: "A short, hand-picked list of small free tools for everyday problems.",
      langLabel: "Language",
      h1: "Small free tools for everyday problems",
      lede: "Each tool here does one ordinary job, like comparing mortgage offers or keeping a daily habit going. They were made with Claude and open on Claude's website, and a real person picked each one.",
      free: "They're free to use. If one helped you, or got in your way, please tell us. That's how we decide what to keep.",
      contents: "On this page",
      tools: "The tools",
      ftTitle: "First time opening one of these?",
      ft1: "<strong>It's a small app someone made with Claude.</strong> The \"Open in Claude\" button takes you to it on claude.ai, in a new tab.",
      ft2: "<strong>You'll see the tool inside a Claude page.</strong> You don't need to chat with Claude to use it. Just fill in the boxes.",
      ft3: "<strong>You don't need a Claude account.</strong> The tool opens without signing in. The page shows banners inviting you to sign in or get the Claude app; you can ignore them.",
      ft4: "<strong>Your data stays with you.</strong> For the tools listed here, what you type is kept in your own browser on that device. It doesn't move to your other devices, and clearing your browser data erases it.",
      ft5: "<strong>It's a tool, not advice.</strong> The money tools do the arithmetic for you. Check the numbers with your bank or adviser before you decide anything.",
      ft6: "<strong>Tell us how it went.</strong> A two-minute <a href=\"#feedback\">feedback form</a> is at the bottom of this page.",
      fbTitle: "Tell us how it went",
      fbUsedH: "Used one of the tools?",
      fbUsedP: "Did it help? Was anything confusing? Your answers decide which tools stay and what we add next. It takes about two minutes.",
      fbSugH: "Know a problem a small tool could solve?",
      fbSugP: "Suggest a tool you'd like to see here, or one you've made with Claude. There's a section for this in the same form.",
      foot1: "<span data-site-name>{site}</span> is picked and kept by hand. It is not an official Anthropic or Claude website.",
      foot2: "This site has no ads, no cookies and no tracking. The tools themselves open on claude.ai.",
      privacyBrowser: "Your data stays in your browser. What you type is saved only on this device, and clearing your browser data erases it.",
      privacyNone: "Nothing you type is saved. It's gone when you close the page.",
      privacy: "Privacy: ",
      open: "Open in Claude",
      openHint: " (opens claude.ai in a new tab)",
      soon: "Link coming soon",
      usedIt: "Used it? Tell us how it went",
      usedItSr: " (feedback form about {title}, opens in a new tab)",
      usedItSoon: "Used it? Feedback form coming soon",
      formSoon: "Feedback form coming soon",
      openForm: "Open the feedback form",
      formLabel: "feedback form",
      suggest: "Suggest a tool",
      suggestLabel: "suggestion form",
      newTab: ", opens in a new tab",
      formLang: "The form is in English.",
      no: "No. ",
      added: "Added ",
      who: "Who it's for",
      need: "What you need at hand",
      time: "Time it takes",
      worksFor: "Works for: ",
      note: "Please note: ",
      anywhere: "Anywhere",
      only: "{region} only",
      inLangs: "in {langs}",
      onlyIn: "only in {langs}",
      langNames: { en: "English", es: "Spanish", ca: "Catalan" },
      and: " and ",
      empty: "There are no tools listed right now. Please check back soon.",
      failed: "Sorry, the list of tools couldn't be loaded. Please refresh the page or try again later."
    },
    es: {
      skip: "Saltar a la lista de herramientas",
      tagline: "Una lista corta, elegida a mano, de pequeñas herramientas gratuitas para problemas del día a día.",
      langLabel: "Idioma",
      h1: "Pequeñas herramientas gratuitas para el día a día",
      lede: "Cada herramienta hace una sola tarea cotidiana, como comparar ofertas de hipoteca o mantener un hábito diario. Están hechas con Claude, se abren en la web de Claude y una persona real ha elegido cada una.",
      free: "Son gratuitas. Si alguna te ha ayudado, o te ha dado problemas, cuéntanoslo. Así decidimos qué se queda.",
      contents: "En esta página",
      tools: "Las herramientas",
      ftTitle: "¿Es la primera vez que abres una?",
      ft1: "<strong>Es una pequeña aplicación hecha con Claude.</strong> El botón «Abrir en Claude» te lleva a ella en claude.ai, en una pestaña nueva.",
      ft2: "<strong>Verás la herramienta dentro de una página de Claude.</strong> No hace falta chatear con Claude para usarla. Solo rellena las casillas.",
      ft3: "<strong>No necesitas cuenta de Claude.</strong> La herramienta se abre sin iniciar sesión. La página muestra avisos para iniciar sesión o descargar la app de Claude; puedes ignorarlos.",
      ft4: "<strong>Tus datos se quedan contigo.</strong> En las herramientas de esta lista, lo que escribes se guarda solo en tu navegador, en ese dispositivo. No pasa a tus otros dispositivos, y si borras los datos del navegador se pierde.",
      ft5: "<strong>Es una herramienta, no un consejo.</strong> Las herramientas de dinero hacen las cuentas por ti. Comprueba las cifras con tu banco o asesor antes de decidir nada.",
      ft6: "<strong>Cuéntanos qué tal.</strong> Al final de esta página hay un <a href=\"#feedback\">formulario</a> de dos minutos.",
      fbTitle: "Cuéntanos qué tal",
      fbUsedH: "¿Has usado alguna herramienta?",
      fbUsedP: "¿Te ha ayudado? ¿Algo te ha confundido? Tus respuestas deciden qué herramientas se quedan y qué añadimos. Son unos dos minutos.",
      fbSugH: "¿Conoces un problema que una herramienta pequeña podría resolver?",
      fbSugP: "Propón una herramienta que te gustaría ver aquí, o una que hayas hecho con Claude. Hay un apartado para ello en el mismo formulario.",
      foot1: "<span data-site-name>{site}</span> se elige y se mantiene a mano. No es una web oficial de Anthropic ni de Claude.",
      foot2: "Esta web no tiene anuncios, ni cookies, ni seguimiento. Las herramientas se abren en claude.ai.",
      privacyBrowser: "Tus datos se quedan en tu navegador. Lo que escribes se guarda solo en este dispositivo, y si borras los datos del navegador se pierde.",
      privacyNone: "No se guarda nada de lo que escribes. Desaparece al cerrar la página.",
      privacy: "Privacidad: ",
      open: "Abrir en Claude",
      openHint: " (abre claude.ai en una pestaña nueva)",
      soon: "Enlace próximamente",
      usedIt: "¿La has usado? Cuéntanos qué tal",
      usedItSr: " (formulario sobre {title}, se abre en una pestaña nueva)",
      usedItSoon: "¿La has usado? Formulario próximamente",
      formSoon: "Formulario próximamente",
      openForm: "Abrir el formulario",
      formLabel: "formulario de opinión",
      suggest: "Proponer una herramienta",
      suggestLabel: "formulario de propuestas",
      newTab: ", se abre en una pestaña nueva",
      formLang: "El formulario está en inglés.",
      no: "N.º ",
      added: "Añadida el ",
      who: "Para quién es",
      need: "Qué necesitas tener a mano",
      time: "Cuánto tiempo lleva",
      worksFor: "Sirve para: ",
      note: "Ten en cuenta: ",
      anywhere: "Cualquier lugar",
      only: "Solo {region}",
      inLangs: "en {langs}",
      onlyIn: "solo en {langs}",
      langNames: { en: "inglés", es: "español", ca: "catalán" },
      and: " y ",
      empty: "Ahora mismo no hay herramientas en la lista. Vuelve pronto.",
      failed: "No se ha podido cargar la lista de herramientas. Recarga la página o inténtalo más tarde."
    },
    ca: {
      skip: "Salta a la llista d'eines",
      tagline: "Una llista curta, triada a mà, de petites eines gratuïtes per a problemes del dia a dia.",
      langLabel: "Idioma",
      h1: "Petites eines gratuïtes per al dia a dia",
      lede: "Cada eina fa una sola feina quotidiana, com comparar ofertes d'hipoteca o mantenir un hàbit diari. Estan fetes amb Claude, s'obren al web de Claude i una persona real ha triat cadascuna.",
      free: "Són gratuïtes. Si alguna t'ha ajudat, o t'ha donat problemes, explica-ho. Així decidim què es queda.",
      contents: "En aquesta pàgina",
      tools: "Les eines",
      ftTitle: "És la primera vegada que n'obres una?",
      ft1: "<strong>És una petita aplicació feta amb Claude.</strong> El botó «Obre a Claude» t'hi porta a claude.ai, en una pestanya nova.",
      ft2: "<strong>Veuràs l'eina dins d'una pàgina de Claude.</strong> No cal xatejar amb Claude per fer-la servir. Només cal omplir les caselles.",
      ft3: "<strong>No necessites compte de Claude.</strong> L'eina s'obre sense iniciar sessió. La pàgina mostra avisos per iniciar sessió o baixar l'app de Claude; els pots ignorar.",
      ft4: "<strong>Les teves dades es queden amb tu.</strong> A les eines d'aquesta llista, el que escrius es desa només al teu navegador, en aquest dispositiu. No passa als teus altres dispositius, i si esborres les dades del navegador es perd.",
      ft5: "<strong>És una eina, no un consell.</strong> Les eines de diners fan els càlculs per tu. Comprova les xifres amb el teu banc o assessor abans de decidir res.",
      ft6: "<strong>Explica'ns com ha anat.</strong> Al final d'aquesta pàgina hi ha un <a href=\"#feedback\">formulari</a> de dos minuts.",
      fbTitle: "Explica'ns com ha anat",
      fbUsedH: "Has fet servir alguna eina?",
      fbUsedP: "T'ha ajudat? Alguna cosa t'ha confós? Les teves respostes decideixen quines eines es queden i què hi afegim. Són uns dos minuts.",
      fbSugH: "Coneixes un problema que una eina petita podria resoldre?",
      fbSugP: "Proposa una eina que t'agradaria veure aquí, o una que hagis fet amb Claude. Hi ha un apartat per a això al mateix formulari.",
      foot1: "<span data-site-name>{site}</span> es tria i es manté a mà. No és un web oficial d'Anthropic ni de Claude.",
      foot2: "Aquest web no té anuncis, ni galetes, ni seguiment. Les eines s'obren a claude.ai.",
      privacyBrowser: "Les teves dades es queden al navegador. El que escrius es desa només en aquest dispositiu, i si esborres les dades del navegador es perd.",
      privacyNone: "No es desa res del que escrius. Desapareix en tancar la pàgina.",
      privacy: "Privadesa: ",
      open: "Obre a Claude",
      openHint: " (obre claude.ai en una pestanya nova)",
      soon: "Enllaç aviat",
      usedIt: "L'has fet servir? Explica'ns com ha anat",
      usedItSr: " (formulari sobre {title}, s'obre en una pestanya nova)",
      usedItSoon: "L'has fet servir? Formulari aviat",
      formSoon: "Formulari aviat",
      openForm: "Obre el formulari",
      formLabel: "formulari d'opinió",
      suggest: "Proposa una eina",
      suggestLabel: "formulari de propostes",
      newTab: ", s'obre en una pestanya nova",
      formLang: "El formulari és en anglès.",
      no: "Núm. ",
      added: "Afegida el ",
      who: "Per a qui és",
      need: "Què has de tenir a mà",
      time: "Quant temps cal",
      worksFor: "Serveix per a: ",
      note: "Tingues en compte: ",
      anywhere: "Qualsevol lloc",
      only: "Només {region}",
      inLangs: "en {langs}",
      onlyIn: "només en {langs}",
      langNames: { en: "anglès", es: "castellà", ca: "català" },
      and: " i ",
      empty: "Ara mateix no hi ha cap eina a la llista. Torna aviat.",
      failed: "No s'ha pogut carregar la llista d'eines. Torna a carregar la pàgina o prova-ho més tard."
    }
  };

  var LOCALES = { en: "en-GB", es: "es-ES", ca: "ca-ES" };
  var lang = "en";
  var state = { site: null, items: null };

  function t(key, vars) {
    var s = (UI[lang] && UI[lang][key] !== undefined) ? UI[lang][key] : UI.en[key];
    if (vars && typeof s === "string") {
      Object.keys(vars).forEach(function (k) { s = s.split("{" + k + "}").join(vars[k]); });
    }
    return s;
  }

  // Pick the current language from a field that is either a string or {en, es, ca}.
  function L(value) {
    if (value === null || value === undefined) return "";
    if (typeof value === "string" || Array.isArray(value)) return value;
    return value[lang] !== undefined ? value[lang] : (value.en !== undefined ? value.en : "");
  }

  function pickLanguage() {
    var fromUrl = new URLSearchParams(location.search).get("lang");
    if (LANGS.indexOf(fromUrl) !== -1) return fromUrl;
    try {
      var saved = localStorage.getItem(STORE_KEY);
      if (LANGS.indexOf(saved) !== -1) return saved;
    } catch (e) { /* storage blocked: fall through */ }
    var prefs = navigator.languages || [navigator.language || "en"];
    for (var i = 0; i < prefs.length; i++) {
      var code = String(prefs[i]).toLowerCase().slice(0, 2);
      if (LANGS.indexOf(code) !== -1) return code;
    }
    return "en";
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        var value = attrs[key];
        if (value === null || value === undefined || value === false) return;
        if (key === "text") node.textContent = value;
        else if (key === "className") node.className = value;
        else node.setAttribute(key, value === true ? "" : value);
      });
    }
    (children || []).forEach(function (child) {
      if (child === null || child === undefined) return;
      node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    });
    return node;
  }

  function srOnly(text) {
    return el("span", { className: "visually-hidden", text: text });
  }

  // Only allow absolute https links so a typo in the data can't create a javascript: link.
  function safeUrl(url) {
    if (typeof url !== "string" || url.trim() === "") return "";
    try {
      var parsed = new URL(url.trim());
      return parsed.protocol === "https:" ? parsed.href : "";
    } catch (e) {
      return "";
    }
  }

  // Tool links carry the language as #en/#es/#ca, which the tools read to open in that language.
  function toolUrl(item) {
    var url = safeUrl(item.url);
    if (!url) return "";
    var langs = toolLangs(item);
    var target = langs.indexOf(lang) !== -1 ? lang : langs[0];
    return url.split("#")[0] + "#" + target;
  }

  function toolLangs(item) {
    if (Array.isArray(item.languages) && item.languages.length) {
      return item.languages.filter(function (l) { return LANGS.indexOf(l) !== -1; });
    }
    return ["en"];
  }

  function isAnyRegion(item) {
    var region = L(item.region);
    return !region || String(region).trim().toLowerCase() === "any";
  }

  function langList(codes) {
    var names = t("langNames");
    var words = codes.map(function (c) { return names[c] || c; });
    if (words.length <= 1) return words.join("");
    return words.slice(0, -1).join(", ") + t("and") + words[words.length - 1];
  }

  // A listing needs a warning when it is region-limited or not available in the page's language.
  function isLimited(item) {
    return !isAnyRegion(item) || toolLangs(item).indexOf(lang) === -1;
  }

  function limitText(item) {
    var langs = toolLangs(item);
    var regionText = isAnyRegion(item) ? t("anywhere") : t("only", { region: L(item.region) });
    var langText = langs.indexOf(lang) === -1 ? t("onlyIn", { langs: langList(langs) }) : t("inLangs", { langs: langList(langs) });
    return regionText + " · " + langText;
  }

  function formatDate(iso) {
    var parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    if (!parts) return "";
    var date = new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]));
    return date.toLocaleDateString(LOCALES[lang], { day: "numeric", month: "long", year: "numeric" });
  }

  function disabledAction(text, className) {
    return el("span", { className: "btn btn-disabled " + (className || ""), "aria-disabled": "true", text: text });
  }

  function externalLink(url, visibleText, hint, className, hreflang) {
    return el("a", {
      className: className,
      href: url,
      target: "_blank",
      rel: "noopener noreferrer",
      hreflang: hreflang || null
    }, [visibleText, hint]);
  }

  function regionBadge(item) {
    if (!isLimited(item)) {
      return el("p", { className: "badge badge-plain" }, [
        el("span", { className: "badge-label", text: t("worksFor") }),
        limitText(item)
      ]);
    }
    return el("p", { className: "badge badge-limited" }, [
      el("span", { className: "badge-label", text: t("note") }),
      limitText(item)
    ]);
  }

  function detailRow(label, value) {
    var valueNode;
    if (Array.isArray(value)) {
      valueNode = value.length === 1
        ? el("dd", { text: value[0] })
        : el("dd", null, [el("ul", null, value.map(function (v) { return el("li", { text: v }); }))]);
    } else {
      valueNode = el("dd", { text: value });
    }
    return el("div", { className: "detail-row" }, [el("dt", { text: label }), valueNode]);
  }

  // Text written in a language other than the page's gets its own lang attribute.
  function textLang(value) {
    if (value && typeof value === "object" && !Array.isArray(value) && value[lang] === undefined) return "en";
    return null;
  }

  function renderListing(item, index, site) {
    var titleId = item.id + "-title";
    var url = toolUrl(item);
    var feedbackUrl = safeUrl(site.feedbackFormUrl);
    var title = L(item.title);
    var langs = toolLangs(item);

    var openAction = url
      ? externalLink(url, t("open"), el("span", { className: "btn-hint" }, [t("openHint")]), "btn btn-primary", langs.indexOf(lang) !== -1 ? lang : langs[0])
      : disabledAction(t("soon"), "btn-primary-disabled");

    var feedbackAction = feedbackUrl
      ? externalLink(feedbackUrl, t("usedIt"), srOnly(t("usedItSr", { title: title })), "text-link", "en")
      : el("span", { className: "text-disabled", "aria-disabled": "true" }, [t("usedItSoon")]);

    var privacyText = L(item.privacyNote) || (item.privacy === "browser-only" ? t("privacyBrowser") : item.privacy === "none-stored" ? t("privacyNone") : "");
    var added = formatDate(item.addedOn);

    return el("article", { className: "listing", id: item.id, "aria-labelledby": titleId, tabindex: "-1" }, [
      el("header", { className: "listing-head" }, [
        el("p", { className: "listing-meta" }, [
          el("span", { className: "listing-number", text: t("no") + (index + 1) }),
          added ? el("span", { text: t("added") + added }) : null
        ]),
        el("h3", { id: titleId, className: "listing-title", lang: textLang(item.title) }, [
          el("a", { href: "#" + item.id, className: "anchor-link", text: title })
        ]),
        regionBadge(item)
      ]),
      el("p", { className: "listing-problem", text: L(item.problem), lang: textLang(item.problem) }),
      el("dl", { className: "details" }, [
        detailRow(t("who"), L(item.forWho)),
        detailRow(t("need"), L(item.needAtHand) || []),
        detailRow(t("time"), L(item.timeToUse))
      ]),
      privacyText ? el("p", { className: "privacy" }, [el("strong", { text: t("privacy") }), privacyText]) : null,
      el("div", { className: "listing-actions" }, [
        openAction,
        el("p", { className: "listing-feedback" }, [feedbackAction])
      ])
    ]);
  }

  function renderCta(slot, url, text, label) {
    if (!slot) return;
    slot.textContent = "";
    var safe = safeUrl(url);
    if (!safe) {
      slot.appendChild(disabledAction(t("formSoon"), "btn-secondary-disabled"));
      return;
    }
    slot.appendChild(externalLink(safe, text, srOnly(" (" + label + t("newTab") + ")"), "btn btn-secondary", "en"));
    if (lang !== "en") slot.appendChild(el("span", { className: "form-lang", text: " " + t("formLang") }));
  }

  function applyStatic(site) {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (n) {
      var html = t(n.getAttribute("data-i18n"), { site: site.siteName || "Everyday Claude Tools" });
      if (typeof html === "string") n.innerHTML = html;
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (n) {
      n.setAttribute("aria-label", t(n.getAttribute("data-i18n-aria")));
    });
    if (site.siteName) {
      document.title = site.siteName;
      document.querySelectorAll("[data-site-name]").forEach(function (n) { n.textContent = site.siteName; });
    }
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", t("tagline"));
    document.querySelectorAll("[data-lang]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-lang") === lang ? "true" : "false");
    });
    renderCta(document.querySelector('[data-cta="feedback"]'), site.feedbackFormUrl, t("openForm"), t("formLabel"));
    // The suggestion section lives in the same form unless a separate suggestUrl is set.
    renderCta(document.querySelector('[data-cta="suggest"]'), site.suggestUrl || site.feedbackFormUrl, t("suggest"), t("suggestLabel"));
  }

  function showStatus(message) {
    var status = document.querySelector("[data-status]");
    if (!status) return;
    status.textContent = message;
    status.hidden = !message;
  }

  function renderAll() {
    var site = state.site || {};
    applyStatic(site);
    if (!state.items) return;

    var listings = document.querySelector("[data-listings]");
    var contents = document.querySelector("[data-contents]");
    listings.textContent = "";
    contents.textContent = "";

    if (state.items.length === 0) {
      showStatus(t("empty"));
      return;
    }
    showStatus("");

    state.items.forEach(function (item, index) {
      listings.appendChild(renderListing(item, index, site));
      var note = isLimited(item) ? el("span", { className: "contents-note", text: limitText(item) }) : null;
      contents.appendChild(el("li", null, [
        el("a", { href: "#" + item.id, text: L(item.title), lang: textLang(item.title) }),
        note ? " " : null,
        note
      ]));
    });
  }

  function setLanguage(code) {
    if (LANGS.indexOf(code) === -1 || code === lang) return;
    lang = code;
    try { localStorage.setItem(STORE_KEY, code); } catch (e) { /* not saved; still switches */ }
    // Keep ?lang in the address in step with the choice, so a copied link opens in the same language.
    var params = new URLSearchParams(location.search);
    if (params.has("lang")) {
      params.set("lang", code);
      history.replaceState(null, "", location.pathname + "?" + params.toString() + location.hash);
    }
    renderAll();
  }

  function getJson(path) {
    return fetch(path, { cache: "no-cache" }).then(function (res) {
      if (!res.ok) throw new Error(path + " returned " + res.status);
      return res.json();
    });
  }

  function focusHashTarget() {
    if (!location.hash) return;
    var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) {
      target.scrollIntoView({ block: "start", behavior: "instant" });
      if (target.classList.contains("listing")) target.focus({ preventScroll: true });
    }
  }

  function init() {
    lang = pickLanguage();
    var sw = document.querySelector("[data-lang-switch]");
    if (sw) {
      sw.hidden = false;
      sw.addEventListener("click", function (e) {
        var b = e.target.closest("[data-lang]");
        if (b) setLanguage(b.getAttribute("data-lang"));
      });
    }
    state.site = {};
    renderAll();

    Promise.all([getJson("data/site.json"), getJson("data/artifacts.json")])
      .then(function (results) {
        state.site = results[0] || {};
        state.items = (Array.isArray(results[1]) ? results[1] : []).filter(function (item) {
          return item && item.status === "live" && item.id && L(item.title);
        });
        renderAll();
        focusHashTarget();
      })
      .catch(function () {
        showStatus(t("failed"));
      });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
