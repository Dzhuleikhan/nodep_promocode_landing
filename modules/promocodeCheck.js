import { newDomain } from "./fetchingDomain";
import { formData } from "./formAuth";
import { getUrlParameter } from "./params";

export const defaulPromocode = "BTCCOMCRHR3333";

export const receivedPromocode = (
  getUrlParameter("promocode") || defaulPromocode
).toLocaleUpperCase();

const headerLogoLink = document.querySelector(".header-logo-link");
formData.promocode = "";

// headerLogoLink.setAttribute(
//   "href",
//   `https://${newDomain}?promocode=${
//     receivedPromocode ? receivedPromocode : defaulPromocode
//   }`
// );
