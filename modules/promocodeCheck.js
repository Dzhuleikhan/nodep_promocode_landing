import { newDomain } from "./fetchingDomain";
import { formData } from "./formAuth";
import { getUrlParameter } from "./params";

export const defaulPromocode = "GAMBA777FREE";
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
