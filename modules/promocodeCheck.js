import { newDomain } from "./fetchingDomain";
import { getUrlParameter } from "./params";
import { twoStepFormData } from "./twoStepForm";

// Промокоды под тип бонуса. Дефолт переопределяется параметром ссылки
// ?cashPromocode=...
const BONUS_PROMOCODE_DEFAULTS = {
  cash: "DJ30SO30",
};

export const bonusPromocodes = {
  cash: (
    getUrlParameter("cashPromocode") || BONUS_PROMOCODE_DEFAULTS.cash
  ).toLocaleUpperCase(),
};

// Промокод по умолчанию для ссылок ленда — бонус, выбранный в форме изначально
export const defaulPromocode = bonusPromocodes.cash;

// Прямой ?promocode= имеет приоритет над промокодами бонусов
export const receivedPromocode = (
  getUrlParameter("promocode") || ""
).toLocaleUpperCase();

const linkPromocode = receivedPromocode || defaulPromocode;

document
  .querySelector(".header-logo-link")
  ?.setAttribute("href", `https://${newDomain}?promocode=${linkPromocode}`);

document
  .querySelector(".hero-modal-open-btn")
  ?.setAttribute("data-promocode", linkPromocode);

// | SPIN AMOUNT
export const defaulSpinAmount = "100";

export const receivedSpinAmount =
  getUrlParameter("spinAmount") || defaulSpinAmount;

export function setSpinAmount() {
  document.querySelectorAll(".actual-spin-amount").forEach((el) => {
    el.innerHTML = receivedSpinAmount;
  });
}

// | PROMOCODE PER BONUS
// Промокод выбранного чекбокса бонуса.
// У «Without Bonus» нет data-promocode-type — промокод не передаём.
const getPromocodeForCheckedBonus = () => {
  if (receivedPromocode) return receivedPromocode;

  const checkedBonus = document.querySelector('input[name="bonus"]:checked');
  const bonusType = checkedBonus?.dataset.promocodeType;

  return bonusPromocodes[bonusType] || "";
};

// | PROMOCODE FIELD
// Поле промокода на ленде показывается только когда код пришёл из URL
export const togglePromocodeWrapper = (state) => {
  const formWrapper = document.querySelector(".form-promocode-wrapper");
  const promoWrapper = document.querySelector(".two-step-promocode-wrapper");
  const promoInput = document.querySelector(".two-step-promocode-input");
  if (!formWrapper || !promoWrapper || !promoInput) return;

  if (state === "show") {
    formWrapper.classList.remove("hidden");
    promoWrapper.classList.add("is-visible", "is-valid");
    promoInput.value = receivedPromocode;
  } else {
    formWrapper.classList.add("hidden");
    promoWrapper.classList.remove("is-visible", "is-valid");
    promoInput.value = "";
  }
};

const applyPromocodeFromBonus = () => {
  const promocode = getPromocodeForCheckedBonus();
  twoStepFormData.promocode = promocode;

  // Код из URL показываем пользователю, промокод бонуса подставляем молча
  togglePromocodeWrapper(receivedPromocode && promocode ? "show" : "hide");
};

document.querySelectorAll('input[name="bonus"]').forEach((input) => {
  input.addEventListener("change", applyPromocodeFromBonus);
});

applyPromocodeFromBonus();

// Возврат «Назад» с прода после регистрации: поле промокода оказывалось пустым,
// хотя обёртка была показана. Значение в него пишет скрипт, а браузеру мы сами
// запретили его помнить — autocomplete="off" по спецификации означает «не
// запоминать значение», и при восстановлении по истории поверх записанного
// скриптом накатывалось пустое значение по умолчанию.
// pageshow срабатывает и на обычной загрузке, и на подъёме из bfcache, поэтому
// ставим код заново на каждый показ страницы. Вызов идемпотентный: считает то же
// самое из ссылки и выбранного бонуса.
window.addEventListener("pageshow", applyPromocodeFromBonus);
