import { newDomain } from "./fetchingDomain";
import { formData } from "./formAuth";
import { getUrlParameter } from "./params";

export const defaulPromocode = "HIGHROLLERSMAGYAR";

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
