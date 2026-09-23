import { getUrlParameter } from "./params";

export const defaulPromocode = "";
document
  .querySelector(".hero-modal-open-btn")
  .setAttribute("data-promocode", defaulPromocode);

export const receivedPromocode = (
  getUrlParameter("promocode") || ""
).toLocaleUpperCase();

// Код из URL правке не подлежит. pointer-events-none закрывает мышь и тап,
// но не клавиатуру: табом можно встать в поле и переписать код, а на «Apply»
// нажать Enter и обнулить промокод. Свой код игрок вводит как обычно.
const lockPromocodeField = (locked) => {
  const formWrapper = document.querySelector(".form-promocode-wrapper");
  const promoInput = document.querySelector(".two-step-promocode-input");
  const applyBtn = document.querySelector(".two-step-promocode-apply-btn");
  if (!promoInput) return;

  formWrapper?.classList.toggle("pointer-events-none", locked);
  promoInput.readOnly = locked;

  if (locked) {
    promoInput.setAttribute("tabindex", "-1");
    applyBtn?.setAttribute("tabindex", "-1");
  } else {
    promoInput.removeAttribute("tabindex");
    applyBtn?.removeAttribute("tabindex");
  }
};

export const togglePromocodeWrapper = (state) => {
  const formWrapper = document.querySelector(".form-promocode-wrapper");
  const promoWrapper = document.querySelector(".two-step-promocode-wrapper");
  const promoInput = document.querySelector(".two-step-promocode-input");

  if (state === "show") {
    formWrapper.classList.remove("hidden");
    promoWrapper.classList.add("is-visible", "is-valid");
    // Пишем и свойство, и атрибут: при возврате «Назад» с прода (bfcache /
    // восстановление формы в мобильном Safari) поле откатывается к атрибуту
    // value — с ним откатываться некуда.
    promoInput.setAttribute("value", receivedPromocode);
    promoInput.value = receivedPromocode;
    lockPromocodeField(true);
  } else if (state === "hide") {
    formWrapper.classList.add("hidden");
    promoWrapper.classList.remove("is-visible", "is-valid");
    promoInput.removeAttribute("value");
    promoInput.value = "";
    lockPromocodeField(false);
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

// Возврат «Назад» с прода: обёртка промокода показана, а поле пустое (bfcache /
// Safari восстанавливает форму асинхронно, уже после pageshow). Если обёртка
// сейчас видна — заново подставляем код. Второй проход на следующем кадре.
const restorePromocode = () => {
  const formWrapper = document.querySelector(".form-promocode-wrapper");
  if (receivedPromocode && formWrapper && !formWrapper.classList.contains("hidden")) {
    togglePromocodeWrapper("show");
  }
};
window.addEventListener("pageshow", () => {
  restorePromocode();
  requestAnimationFrame(restorePromocode);
});
