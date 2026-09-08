import { newDomain } from "./fetchingDomain";
import { getUrlParameter } from "./params";

export const defaulPromocode = "GATES81";
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

export const defaulSpinAmount = "100";

export const receivedSpinAmount =
  getUrlParameter("spinAmount") || defaulSpinAmount;

export function setSpinAmount() {
  document.querySelectorAll(".actual-spin-amount").forEach((el) => {
    el.innerHTML = receivedSpinAmount;
  });
}

document
  .querySelector(".hero-modal-open-btn")
  .setAttribute(
    "data-promocode",
    receivedPromocode ? receivedPromocode : defaulPromocode
  );

// Код из URL правке не подлежит. pointer-events-none закрывает мышь и тап,
// но не клавиатуру: табом можно встать в поле и переписать код, а на «Apply»
// нажать Enter и обнулить промокод. Свой код игрок вводит как обычно.
const lockPromocodeField = (locked) => {
  const formWrapper = document.querySelector(".form-promocode-wrapper");
  const promoInput = document.querySelector(".two-step-promocode-input");
  const applyBtn = document.querySelector(".two-step-promocode-apply-btn");
  if (!promoInput) return;

  formWrapper?.classList.toggle("pointer-events-none", locked);
  promoInput.readOnly = locked;

  if (locked) {
    promoInput.setAttribute("tabindex", "-1");
    applyBtn?.setAttribute("tabindex", "-1");
  } else {
    promoInput.removeAttribute("tabindex");
    applyBtn?.removeAttribute("tabindex");
  }
};

export const togglePromocodeWrapper = (state) => {
  const formWrapper = document.querySelector(".form-promocode-wrapper");
  const promoWrapper = document.querySelector(".two-step-promocode-wrapper");
  const promoInput = document.querySelector(".two-step-promocode-input");

  if (state === "show") {
    formWrapper.classList.remove("hidden");
    promoWrapper.classList.add("is-visible", "is-valid");
    promoInput.value =
      typeof receivedPromocode !== "undefined" ? receivedPromocode : "";
    lockPromocodeField(true);
  } else if (state === "hide") {
    formWrapper.classList.add("hidden");
    promoWrapper.classList.remove("is-visible", "is-valid");
    promoInput.value = "";
    lockPromocodeField(false);
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
