import { newDomain } from "./fetchingDomain";
import { getUrlParameter } from "./params";

export const defaulPromocode = "GATES81";
const headerLogoLink = document.querySelector(".header-logo-link");

export const receivedPromocode = (
  getUrlParameter("promocode") || ""
).toLocaleUpperCase();

headerLogoLink.setAttribute(
  "href",
  `https://${newDomain}?promocode=${
    receivedPromocode ? receivedPromocode : defaulPromocode
  }`
);

export const defaulSpinAmount = "100";

export const receivedSpinAmount =
  getUrlParameter("spinAmount") || defaulSpinAmount;

export function setSpinAmount() {
  document.querySelectorAll(".actual-spin-amount").forEach((el) => {
    el.innerHTML = receivedSpinAmount;
  });
}

document
  .querySelector(".hero-modal-open-btn")
  .setAttribute(
    "data-promocode",
    receivedPromocode ? receivedPromocode : defaulPromocode
  );

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
    // Пишем и свойство, и атрибут. Атрибут value — это значение поля ПО
    // УМОЛЧАНИЮ, и именно к нему браузер откатывает контрол, состояние
    // которого не запоминал (а мы сами это и запретили через
    // autocomplete="off"). На мобильном Safari такой откат прилетает уже после
    // pageshow и затирал записанное свойство; с атрибутом откатывать теперь
    // некуда — по умолчанию там тот же код.
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

// Показ промокода привязан к выбранному бонусу: welcome-bonus-1 и «без бонуса»
// идут без кода, остальные — с кодом из ссылки. Ту же развилку держит
// обработчик смены бонуса в twoStepForm.js, здесь она нужна, чтобы состояние
// можно было пересобрать в любой момент, не дожидаясь клика по бонусу.
export const applyPromocodeFromBonus = () => {
  if (!receivedPromocode) {
    console.log("There is no promocode received");
    togglePromocodeWrapper("hide");
    return;
  }

  const bonusValue = document.querySelector(
    'input[name="bonus"]:checked'
  )?.value;

  togglePromocodeWrapper(
    bonusValue === "welcome-bonus-1" || bonusValue === "0" ? "hide" : "show"
  );
};

applyPromocodeFromBonus();

// Возврат «Назад» с прода после регистрации: поле промокода оказывалось пустым,
// хотя обёртка была показана. pageshow срабатывает и на обычной загрузке, и на
// подъёме из bfcache. Второй проход на следующем кадре — потому что мобильный
// Safari восстанавливает состояние формы асинхронно и успевает вклиниться уже
// после pageshow. Вызов идемпотентный: считает то же самое из ссылки и
// выбранного бонуса.
window.addEventListener("pageshow", () => {
  applyPromocodeFromBonus();
  requestAnimationFrame(applyPromocodeFromBonus);
});
