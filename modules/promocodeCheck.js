import { getUrlParameter } from "./params";

export const defaulPromocode = "OLYMPUSAZ629";

document
  .querySelector(".modal-open-btn")
  .setAttribute("data-promocode", defaulPromocode);

export const receivedPromocode = (
  getUrlParameter("promocode") || defaulPromocode
).toLocaleUpperCase();
