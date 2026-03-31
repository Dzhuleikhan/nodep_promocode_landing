import { newDomain } from "./fetchingDomain";
import { getUrlParameter } from "./params";

export const defaulPromocode = "GURWF7";
const headerLogoLink = document.querySelector(".header-logo-link");

export const receivedPromocode = (
  getUrlParameter("promocode") || ""
).toLocaleUpperCase();

headerLogoLink.setAttribute(
  "href",
  `https://${newDomain}?promocode=${
    receivedPromocode ? receivedPromocode : defaulPromocode
  }`,
);

export const defaulSpinAmount = "100";

export const receivedSpinAmount =
  getUrlParameter("spinAmount") || defaulSpinAmount;

export function setSpinAmount() {
  document.querySelectorAll(".actual-spin-amount").forEach((el) => {
    el.innerHTML = receivedSpinAmount;
  });
}

const promocodeInput = document.querySelector(".promocode-input");
if (promocodeInput) {
  promocodeInput.value = receivedPromocode
    ? receivedPromocode
    : defaulPromocode;
}
