import { newDomain } from "./fetchingDomain";
import { formData } from "./formAuth";
import { getUrlParameter } from "./params";

export const defaulPromocode = "SUPERHOT777";

export const receivedPromocode = (
  getUrlParameter("promocode") || defaulPromocode
).toLocaleUpperCase();

const headerLogoLink = document.querySelector(".header-logo-link");
formData.promocode = receivedPromocode ? receivedPromocode : defaulPromocode;

headerLogoLink.setAttribute(
  "href",
  `https://${newDomain}?promocode=${
    receivedPromocode ? receivedPromocode : defaulPromocode
  }`
);

export const defaulSpinAmount = "777";

export const receivedSpinAmount =
  getUrlParameter("spinAmount") || defaulSpinAmount;

export function setSpinAmount() {
  document.querySelectorAll(".actual-spin-amount").forEach((el) => {
    el.innerHTML = receivedSpinAmount;
  });
}
