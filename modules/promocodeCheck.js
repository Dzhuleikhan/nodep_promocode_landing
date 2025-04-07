import { getUrlParameter } from "./params";

export const defaulPromocode = "HEIST75";
document
  .querySelector(".hero-modal-open-btn")
  .setAttribute("data-promocode", defaulPromocode);

export const receivedPromocode = (
  getUrlParameter("promocode") || ""
).toLocaleUpperCase();

export const togglePromocodeWrapper = (state) => {
  const formWrapper = document.querySelector(".form-promocode-wrapper");
  const promoWrapper = document.querySelector(".two-step-promocode-wrapper");
  const promoInput = document.querySelector(".two-step-promocode-input");

  if (state === "show") {
    formWrapper.classList.remove("hidden");
    promoWrapper.classList.add("is-visible", "is-valid");
    promoInput.value =
      typeof receivedPromocode !== "undefined" ? receivedPromocode : "";
  } else if (state === "hide") {
    formWrapper.classList.add("hidden");
    promoWrapper.classList.remove("is-visible", "is-valid");
    promoInput.value = "";
  } else {
    console.warn(
      "Invalid state passed to togglePromocodeWrapper. Use 'show' or 'hide'."
    );
  }
};

if (receivedPromocode) {
  document
    .querySelector(".hero-modal-open-btn")
    .setAttribute("data-promocode", receivedPromocode);
  togglePromocodeWrapper("show");
} else {
  console.log("There is no promocode received");
  togglePromocodeWrapper("hide");
}
