import { newDomain } from "./fetchingDomain";
import { getUrlParameter } from "./params";

export const defaulPromocode = "BTCCOMCRHR3333";

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
