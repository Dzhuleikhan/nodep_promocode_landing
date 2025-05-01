import { newDomain } from "./fetchingDomain";
import { getUrlParameter } from "./params";

export const defaulPromocode = "77ZEUS";

const headerLogoLink = document.querySelector(".header-logo-link");

headerLogoLink.setAttribute(
  "href",
  `https://${newDomain}?promocode=${defaulPromocode}`
);

document
  .querySelector(".modal-open-btn")
  .setAttribute("data-promocode", defaulPromocode);

export const receivedPromocode = (
  getUrlParameter("promocode") || defaulPromocode
).toLocaleUpperCase();
