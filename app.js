(function () {
  "use strict";

  var STORAGE_KEY = "people2fa.pair";
  var SECRET_BYTES = 10; // 80-bit secret → 16 Base32 chars (short/medium)
  var BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

  function base32Encode(bytes) {
    var output = "";
    var bits = 0;
    var value = 0;
    for (var i = 0; i < bytes.length; i++) {
      value = (value << 8) | bytes[i];
      bits += 8;
      while (bits >= 5) {
        output += BASE32[(value >>> (bits - 5)) & 31];
        bits -= 5;
      }
    }
    if (bits > 0) {
      output += BASE32[(value << (5 - bits)) & 31];
    }
    return output;
  }

  function generateSecret() {
    var bytes = new Uint8Array(SECRET_BYTES);
    crypto.getRandomValues(bytes);
    return base32Encode(bytes);
  }

  function sanitizeLabel(raw) {
    // Strip spaces/symbols and uppercase so labels stay URI-safe and readable.
    // Example: "Jamie&Vicky" → "JAMIEVICKY"
    return String(raw || "")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 64);
  }

  function buildOtpAuth(label, secret) {
    return (
      "otpauth://totp/" +
      encodeURIComponent(label) +
      "?secret=" +
      secret +
      "&issuer=" +
      encodeURIComponent("People2FA") +
      "&algorithm=SHA1&digits=6&period=30"
    );
  }

  function savePair(pair) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(pair));
  }

  function loadPair() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var pair = JSON.parse(raw);
      if (!pair || !pair.label || !pair.secret || !pair.otpauth) return null;
      return pair;
    } catch (err) {
      return null;
    }
  }

  function renderQr(otpauth) {
    var host = document.getElementById("qr");
    if (!host || typeof qrcode !== "function") return;

    var qr = qrcode(0, "M");
    qr.addData(otpauth);
    qr.make();
    host.innerHTML = qr.createTableTag(5, 0);
  }

  function fillResult(pair) {
    var labelEl = document.getElementById("pair-label");
    var secretEl = document.getElementById("pair-secret");
    var uriEl = document.getElementById("pair-uri");
    var addLink = document.getElementById("add-link");
    var namesEl = document.getElementById("pair-names");

    if (labelEl) labelEl.textContent = pair.label;
    if (secretEl) secretEl.textContent = pair.secret;
    if (uriEl) uriEl.textContent = pair.otpauth;
    if (namesEl) namesEl.textContent = pair.names || pair.label;
    if (addLink) {
      addLink.href = pair.otpauth;
    }
    renderQr(pair.otpauth);
  }

  function onLanding() {
    var form = document.getElementById("generate-form");
    var input = document.getElementById("both-names");
    var error = document.getElementById("form-error");
    if (!form || !input) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var names = input.value.trim();
      var label = sanitizeLabel(names);

      if (!label || label.length < 2) {
        if (error) {
          error.textContent = "Enter both names, like Jamie Vicky.";
          error.classList.add("show");
        }
        input.focus();
        return;
      }

      if (error) error.classList.remove("show");

      var secret = generateSecret();
      var otpauth = buildOtpAuth(label, secret);
      savePair({
        names: names,
        label: label,
        secret: secret,
        otpauth: otpauth,
        createdAt: new Date().toISOString()
      });
      window.location.href = "result.html";
    });
  }

  function onResult() {
    var pair = loadPair();
    if (!pair) {
      window.location.replace("index.html");
      return;
    }
    fillResult(pair);

    var copyBtn = document.getElementById("copy-uri");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        navigator.clipboard.writeText(pair.otpauth).then(
          function () {
            copyBtn.textContent = "Copied";
            setTimeout(function () {
              copyBtn.textContent = "Copy link";
            }, 1600);
          },
          function () {
            copyBtn.textContent = "Copy failed";
          }
        );
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var page = document.body.getAttribute("data-page");
    if (page === "landing") onLanding();
    if (page === "result") onResult();
  });
})();
