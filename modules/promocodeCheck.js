import { getUrlParameter } from "./params";

export const defaulPromocode = "77ZEUS";

document
  .querySelector(".modal-open-btn")
  .setAttribute("data-promocode", defaulPromocode);

export const receivedPromocode = (
  getUrlParameter("promocode") || defaulPromocode
).toLocaleUpperCase();
