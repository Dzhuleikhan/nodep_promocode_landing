// Прелоадер живёт отдельным модулем и подключается первым.
// Раньше этот код стоял в конце twoStepForm.js: любая ошибка в форме означала,
// что до него не дойдут, и игрок оставался перед вечным прелоадером.
// Здесь зависимостей нет вообще, поэтому уронить его нечем.

const FADE_MS = 250;
// Аварийный таймаут: что бы ни упало в модулях, экран откроется
const TIMEOUT_MS = 6000;
// На быстром соединении переводы успевают приехать за пару сотен миллисекунд,
// и прелоадер мелькал вспышкой. Держим его минимум секунду от старта навигации.
const MIN_VISIBLE_MS = 1000;

const preloader = document.querySelector(".preloader");

if (preloader) {
  let isHidden = false;

  const fadeOut = () => {
    preloader.style.transition = `opacity ${FADE_MS}ms ease`;
    preloader.style.opacity = "0";
    // не просто прячем: узел с fixed и z-index 1000 незачем оставлять в дереве
    setTimeout(() => preloader.remove(), FADE_MS);
  };

  const hide = () => {
    if (isHidden) return;
    isHidden = true;

    clearTimeout(timer);

    // performance.now() отсчитывается от начала навигации, так что это остаток
    // минимального показа, а не задержка поверх него
    setTimeout(fadeOut, Math.max(0, MIN_VISIBLE_MS - performance.now()));
  };

  // основной путь: контент переведён и отрисован
  window.addEventListener("lang:changed", hide, { once: true });

  // страховка: упал модуль, не приехали переводы — открываем как есть
  const timer = setTimeout(hide, TIMEOUT_MS);
}
