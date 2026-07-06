import { getUrlParameter } from "./params";

if (getUrlParameter("withoutWelcome") === "true") {
  const heroSubtitle = document.querySelector(".hero-subtitle");
  const welcomeBonusLabel = document
    .querySelector('.welcome-bonus-input[value="welcome-bonus-1"]')
    ?.closest(".two-step-bonus-checkbox");

  if (heroSubtitle) {
    heroSubtitle.style.opacity = "0";
    heroSubtitle.style.visibility = "hidden";
  }
  welcomeBonusLabel?.classList.add("hidden");
}
