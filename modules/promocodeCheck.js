import { getUrlParameter } from "./params";
import { newDomain } from "./fetchingDomain";
import { twoStepFormData } from "./twoStepForm";

export const defaulPromocode = "NODEP10GBP";

document
  .querySelector(".modal-open-btn")
  .setAttribute("data-promocode", defaulPromocode);

export const receivedPromocode = (
  getUrlParameter("promocode") || defaulPromocode
).toLocaleUpperCase();

twoStepFormData.promocode = receivedPromocode
  ? receivedPromocode
  : defaulPromocode;

const headerLogoLink = document.querySelector(".header-logo-link");

headerLogoLink.setAttribute(
  "href",
  `https://${newDomain}?promocode=${
    receivedPromocode ? receivedPromocode : defaulPromocode
  }`
);
