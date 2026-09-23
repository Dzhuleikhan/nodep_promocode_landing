// Номинал в hero (.hero-amount) набран фиксированным кеглем из разметки
// (200px, на брейкпоинтах 150/110/100px). «30 CHF» влезает, а длинные суммы
// с валютой — «419460 SO'M» (UZS) — уезжали за правый край экрана.
// Кегль из CSS оставляем максимумом и ужимаем пропорционально, только если
// строка не помещается до правого края вьюпорта.
// Меряем по layout-размерам (offsetWidth/offsetLeft): transform (поворот,
// пульс scale) на них не влияет, поэтому замер стабилен при анимации.

const EDGE_GAP = 16; // отступ от правого края экрана
const SAFETY = 0.96; // запас на поворот -6deg и пульс анимации

const fitHeroAmount = () => {
  const amount = document.querySelector(".hero-amount");
  if (!amount || !amount.offsetParent) return;

  // сброс к кеглю из CSS текущего брейкпоинта — от него и считаем
  amount.style.fontSize = "";

  const width = amount.offsetWidth;
  if (!width) return;

  const parentLeft = amount.offsetParent.getBoundingClientRect().left;
  const left = parentLeft + amount.offsetLeft;
  const viewport = document.documentElement.clientWidth;
  const available = viewport - Math.max(left, 0) - EDGE_GAP;

  if (width <= available) return;

  const baseSize = parseFloat(getComputedStyle(amount).fontSize);
  const scale = Math.max((available / width) * SAFETY, 0.3);
  amount.style.fontSize = `${Math.floor(baseSize * scale)}px`;
};

let frame = 0;
const scheduleFit = () => {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(fitHeroAmount);
};

const amountEl = document.querySelector(".hero-amount");
if (amountEl) {
  // сумму и символ валюты подставляет twoStepForm / modalCurrency / смена
  // языка — ловим любую правку текста внутри номинала
  new MutationObserver(scheduleFit).observe(amountEl, {
    childList: true,
    characterData: true,
    subtree: true,
  });

  window.addEventListener("resize", scheduleFit);
  window.addEventListener("lang:changed", scheduleFit);
  document.fonts?.ready.then(scheduleFit);
  scheduleFit();
}
