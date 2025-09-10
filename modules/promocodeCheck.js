import { newDomain } from "./fetchingDomain";
import { addUrlParameter, getUrlParameter } from "./params";

export const defaulPromocode = "";
const headerLogoLink = document.querySelector(".header-logo-link");

export const receivedPromocode = (
  getUrlParameter("promocode") || ""
).toLocaleUpperCase();

headerLogoLink.setAttribute(
  "href",
  `https://${newDomain}?promocode=${
    receivedPromocode ? receivedPromocode : defaulPromocode
  }`
);

document
  .querySelector(".hero-modal-open-btn")
  .setAttribute(
    "data-promocode",
    receivedPromocode ? receivedPromocode : defaulPromocode
  );

export const togglePromocodeWrapper = (state) => {
  const formWrapper = document.querySelector(".form-promocode-wrapper");
  const promoWrapper = document.querySelector(".two-step-promocode-wrapper");
  const promoInput = document.querySelector(".two-step-promocode-input");

  if (state === "show") {
    formWrapper.classList.remove("hidden");
    promoWrapper.classList.add("is-visible", "is-valid");
    promoInput.value =
      typeof receivedPromocode !== "undefined" ? receivedPromocode : "";
  } else if (state === "hide") {
    formWrapper.classList.add("hidden");
    promoWrapper.classList.remove("is-visible", "is-valid");
    promoInput.value = "";
  } else {
    console.warn(
      "Invalid state passed to togglePromocodeWrapper. Use 'show' or 'hide'."
    );
  }
};

if (receivedPromocode) {
  togglePromocodeWrapper("show");
} else {
  console.log("There is no promocode received");
  togglePromocodeWrapper("hide");
}

export const defaulNodepAmount = "10";

export const receivedNodepAmount =
  getUrlParameter("nodepAmount") || defaulNodepAmount;

addUrlParameter("nodepAmount", receivedNodepAmount);

export function setNodepAmount() {
  document.querySelectorAll(".nodep-bonus-amount").forEach((el) => {
    el.innerHTML = receivedNodepAmount;
  });
}
