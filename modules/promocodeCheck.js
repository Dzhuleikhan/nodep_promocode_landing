import { newDomain } from "./fetchingDomain";

export const defaulPromocode = "ROYAL7211";

const headerLogoLink = document.querySelector(".header-logo-link");

headerLogoLink.setAttribute(
  "href",
  `https://${newDomain}?promocode=${defaulPromocode}`
);
