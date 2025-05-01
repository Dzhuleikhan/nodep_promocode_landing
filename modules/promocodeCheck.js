import { newDomain } from "./fetchingDomain";
import { formData } from "./formAuth";
import { getUrlParameter } from "./params";

export const defaulPromocode = "ROYAL7211";
const headerLogoLink = document.querySelector(".header-logo-link");

export const receivedPromocode = (
  getUrlParameter("promocode") || ""
).toLocaleUpperCase();

formData.promocode = receivedPromocode ? receivedPromocode : defaulPromocode;

headerLogoLink.setAttribute(
  "href",
  `https://${newDomain}?promocode=${
    receivedPromocode ? receivedPromocode : defaulPromocode
  }`
);
