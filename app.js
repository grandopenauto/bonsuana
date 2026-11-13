"use strict";

// Launch configuration: confirm this inbox can receive messages before promoting event bookings.
const BONSUANA_CONTACT_EMAIL = "hello@bonsuana.com";

const navToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("#nav-links");
const yearElement = document.querySelector("#year");
if (yearElement) yearElement.textContent = String(new Date().getFullYear());

function closeMenu() {
  if (!navToggle || !navLinks) return;
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation");
  navLinks.classList.remove("open");
}
if (navToggle && navLinks) {
  navToggle.addEventListener("click", function () {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    navLinks.classList.toggle("open", !isOpen);
  });
  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMenu();
  });
  document.addEventListener("click", function (event) {
    if (!navLinks.contains(event.target) && !navToggle.contains(event.target)) closeMenu();
  });
}

// The signature formula is four equal parts; ingredient stories are flavor descriptions,
// not medicinal or nutritional benefit claims.
const ingredients = [
  { label: "01 — TART CHERRY", description: "The punchy, tart foundation. A bold first note that makes this blend anything but ordinary." },
  { label: "02 — ORANGE JUICE", description: "A burst of sunny citrus that lifts the whole mix and keeps things bright." },
  { label: "03 — CRAN-RASP LEMONADE", description: "Sweet-tart berry sparkle with a lemonade twist. The playful middle note." },
  { label: "04 — HORCHATA", description: "The unexpected creamy-spiced turn that brings everything together. Ask about dairy and nut allergens." }
];
const ingredientButtons = document.querySelectorAll("[data-ingredient]");
const ingredientLabel = document.getElementById("ingredient-readout-number");
const ingredientText = document.getElementById("ingredient-readout");
ingredientButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const index = Number(button.getAttribute("data-ingredient"));
    const ingredient = ingredients[index];
    if (!ingredient) return;
    ingredientButtons.forEach(function (other) {
      const selected = other === button;
      other.classList.toggle("active", selected);
      other.setAttribute("aria-pressed", String(selected));
    });
    if (ingredientLabel) ingredientLabel.textContent = ingredient.label;
    if (ingredientText) ingredientText.textContent = ingredient.description;
  });
});

const form = document.getElementById("inquiry-form");
const copyButton = document.getElementById("copy-inquiry");
const formStatus = document.getElementById("form-status");
function buildInquiry() {
  if (!form) return null;
  if (!form.reportValidity()) return null;
  const get = function (id) { return document.getElementById(id).value.trim(); };
  const name = get("contact-name");
  const email = get("contact-email");
  const type = get("contact-type");
  const location = get("contact-location");
  const message = get("contact-message");
  return {
    subject: "Bonsuana collaboration inquiry — " + type,
    body: [
      "Hello Bonsuana team,",
      "",
      "I'd love to explore a collaboration.",
      "",
      "Name: " + name,
      "Reply-to email: " + email,
      "Type of inquiry: " + type,
      "Location: " + location,
      "",
      "About my idea:",
      message,
      "",
      "Sent from the Bonsuana Juice website inquiry composer."
    ].join("\n")
  };
}
function showStatus(message) {
  if (formStatus) formStatus.textContent = message;
}
if (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const inquiry = buildInquiry();
    if (!inquiry) return;
    if (!BONSUANA_CONTACT_EMAIL) {
      showStatus("Our booking email is not yet active. Use 'copy your inquiry' to save the details.");
      return;
    }
    const url = "mailto:" + encodeURIComponent(BONSUANA_CONTACT_EMAIL) +
      "?subject=" + encodeURIComponent(inquiry.subject) +
      "&body=" + encodeURIComponent(inquiry.body);
    showStatus("Your email app should open. Please review and press Send; nothing has been sent automatically.");
    window.location.href = url;
  });
}
if (copyButton) {
  copyButton.addEventListener("click", async function () {
    const inquiry = buildInquiry();
    if (!inquiry) return;
    const content = inquiry.subject + "\n\n" + inquiry.body;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(content);
      } else {
        const helper = document.createElement("textarea");
        helper.value = content;
        helper.setAttribute("readonly", "");
        helper.style.position = "fixed";
        helper.style.opacity = "0";
        document.body.appendChild(helper);
        helper.select();
        const copied = document.execCommand("copy");
        helper.remove();
        if (!copied) throw new Error("Copy failed");
      }
      showStatus("Inquiry copied. You can paste it into an email or message.");
      copyButton.textContent = "Copied ✓";
      window.setTimeout(function () { copyButton.textContent = "Or copy your inquiry ⧉"; }, 2400);
    } catch (error) {
      showStatus("Copy isn't available in this browser. Please select and copy your details manually.");
    }
  });
}
