(function () {
  "use strict";

  var root = document.documentElement;

  /* ── light / dark toggle ──────────────────────────────────────────── */
  function currentTheme() {
    return (
      root.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    );
  }

  var toggle = document.querySelector("[data-theme-toggle]");
  if (toggle) {
    var sync = function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      toggle.setAttribute("aria-label", toggle.dataset["label" + (next === "dark" ? "Dark" : "Light")] || "");
      toggle.setAttribute("title", toggle.getAttribute("aria-label"));
    };
    sync();

    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("tuan:theme", next);
      } catch (e) {}
      sync();
      window.dispatchEvent(new CustomEvent("tuan:themechange", { detail: { theme: next } }));
    });

    /* Follow the OS setting until the reader picks a theme by hand. */
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
      var saved = null;
      try {
        saved = localStorage.getItem("tuan:theme");
      } catch (e) {}
      if (!saved) {
        sync();
        window.dispatchEvent(new CustomEvent("tuan:themechange", { detail: { theme: currentTheme() } }));
      }
    });
  }

  /* ── copy-code button ─────────────────────────────────────────────── */
  document.querySelectorAll(".codeblock__copy").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var block = btn.closest(".codeblock");
      if (!block) return;
      var src =
        block.querySelector(".lntd:last-child code") || block.querySelector("pre code");
      if (!src) return;

      var done = function () {
        btn.classList.add("is-done");
        setTimeout(function () {
          btn.classList.remove("is-done");
        }, 1600);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(src.textContent).then(done, function () {});
      } else {
        var ta = document.createElement("textarea");
        ta.value = src.textContent;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand("copy");
          done();
        } catch (e) {}
        document.body.removeChild(ta);
      }
    });
  });

})();
