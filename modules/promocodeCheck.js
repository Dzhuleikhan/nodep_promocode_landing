import { getUrlParameter } from "./params";
import { newDomain } from "./fetchingDomain";

export const defaulPromocode = "";

document
  .querySelector(".modal-open-btn")
  .setAttribute("data-promocode", defaulPromocode);

export const receivedPromocode = (
  getUrlParameter("promocode") || defaulPromocode
).toLocaleUpperCase();

const headerLogoLink = document.querySelector(".header-logo-link");

headerLogoLink.setAttribute(
  "href",
  `https://${newDomain}?promocode=${
    receivedPromocode ? receivedPromocode : defaulPromocode
  }`
);
