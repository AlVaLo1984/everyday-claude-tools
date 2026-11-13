/*
 * Everyday Claude Tools: renders the catalog from data/site.json and data/artifacts.json.
 * No frameworks, no build step, no third-party requests.
 * To add a tool, add one object to data/artifacts.json.
 */
(function () {
  "use strict";

  var PRIVACY_TEXT = {
    "browser-only": "Your data stays in your browser. What you type is saved only on this device, and clearing your browser data erases it.",
    "none-stored": "Nothing you type is saved. It's gone when you close the page."
    // "unverified": deliberately shows nothing until someone has checked.
  };

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

  function isDefaultRegion(item) {
    var region = (item.region || "").trim().toLowerCase();
    var language = (item.language || "").trim().toLowerCase();
    return (region === "" || region === "any") && (language === "" || language === "english");
  }

  function formatDate(iso) {
    var parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    if (!parts) return "";
    var date = new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]));
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  }

  function disabledAction(text, className) {
    return el("span", { className: "btn btn-disabled " + (className || ""), "aria-disabled": "true", text: text });
  }

  function externalLink(url, visibleText, hint, className) {
    return el("a", {
      className: className,
      href: url,
      target: "_blank",
      rel: "noopener noreferrer"
    }, [visibleText, hint]);
  }

  function regionBadge(item) {
    var region = (item.region || "Any").trim();
    var language = (item.language || "English").trim();
    if (isDefaultRegion(item)) {
      return el("p", { className: "badge badge-plain" }, [
        el("span", { className: "badge-label", text: "Works for: " }),
        "Anywhere · English"
      ]);
    }
    var regionText = region.toLowerCase() === "any" ? "Anywhere" : region + " only";
    return el("p", { className: "badge badge-limited" }, [
      el("span", { className: "badge-label", text: "Please note: " }),
      regionText + " · in " + language
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

  function renderListing(item, index, site) {
    var titleId = item.id + "-title";
    var url = safeUrl(item.url);
    var feedbackUrl = safeUrl(site.feedbackFormUrl);

    var openAction = url
      ? externalLink(url, "Open in Claude", el("span", { className: "btn-hint" }, [" (opens claude.ai in a new tab)"]), "btn btn-primary")
      : disabledAction("Link coming soon", "btn-primary-disabled");

    var feedbackAction = feedbackUrl
      ? externalLink(feedbackUrl, "Used it? Tell us how it went", srOnly(" (feedback form about " + item.title + ", opens in a new tab)"), "text-link")
      : el("span", { className: "text-disabled", "aria-disabled": "true" }, ["Used it? Feedback form coming soon"]);

    var privacyText = item.privacyNote || PRIVACY_TEXT[item.privacy] || "";
    var added = formatDate(item.addedOn);

    return el("article", { className: "listing", id: item.id, "aria-labelledby": titleId, tabindex: "-1" }, [
      el("header", { className: "listing-head" }, [
        el("p", { className: "listing-meta" }, [
          el("span", { className: "listing-number", text: "No. " + (index + 1) }),
          added ? el("span", { text: "Added " + added }) : null
        ]),
        el("h3", { id: titleId, className: "listing-title" }, [
          el("a", { href: "#" + item.id, className: "anchor-link", text: item.title })
        ]),
        regionBadge(item)
      ]),
      el("p", { className: "listing-problem", text: item.problem }),
      el("dl", { className: "details" }, [
        detailRow("Who it's for", item.forWho),
        detailRow("What you need at hand", item.needAtHand || []),
        detailRow("Time it takes", item.timeToUse)
      ]),
      privacyText ? el("p", { className: "privacy" }, [el("strong", { text: "Privacy: " }), privacyText]) : null,
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
    slot.appendChild(safe
      ? externalLink(safe, text, srOnly(" (" + label + ", opens in a new tab)"), "btn btn-secondary")
      : disabledAction("Feedback form coming soon", "btn-secondary-disabled"));
  }

  function applySite(site) {
    if (site.siteName) {
      document.title = site.siteName;
      document.querySelectorAll("[data-site-name]").forEach(function (n) { n.textContent = site.siteName; });
    }
    if (site.tagline) {
      document.querySelectorAll("[data-site-tagline]").forEach(function (n) { n.textContent = site.tagline; });
    }
    renderCta(document.querySelector('[data-cta="feedback"]'), site.feedbackFormUrl, "Open the feedback form", "feedback form");
    // The suggestion section lives in the same form unless a separate suggestUrl is set.
    renderCta(document.querySelector('[data-cta="suggest"]'), site.suggestUrl || site.feedbackFormUrl, "Suggest a tool", "suggestion form");
  }

  function showStatus(message) {
    var status = document.querySelector("[data-status]");
    if (!status) return;
    status.textContent = message;
    status.hidden = false;
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
    Promise.all([getJson("data/site.json"), getJson("data/artifacts.json")])
      .then(function (results) {
        var site = results[0] || {};
        var items = (Array.isArray(results[1]) ? results[1] : []).filter(function (item) {
          return item && item.status === "live" && item.id && item.title;
        });

        applySite(site);

        var listings = document.querySelector("[data-listings]");
        var contents = document.querySelector("[data-contents]");
        listings.textContent = "";
        contents.textContent = "";

        if (items.length === 0) {
          showStatus("There are no tools listed right now. Please check back soon.");
          return;
        }

        items.forEach(function (item, index) {
          listings.appendChild(renderListing(item, index, site));
          var note = isDefaultRegion(item) ? null : el("span", { className: "contents-note", text: item.region + " · " + item.language });
          contents.appendChild(el("li", null, [el("a", { href: "#" + item.id, text: item.title }), note ? " " : null, note]));
        });

        focusHashTarget();
      })
      .catch(function () {
        showStatus("Sorry, the list of tools couldn't be loaded. Please refresh the page or try again later.");
      });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
