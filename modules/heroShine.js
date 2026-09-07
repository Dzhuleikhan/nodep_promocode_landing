// Блик по слиткам обрезается маской из той же картинки, что и сама картинка.
// Пока она не загрузилась, маски нет — и полоса света бежит по пустому месту.
// Зависимостей у модуля нет намеренно: он подключается до тяжёлых модулей.
document.querySelectorAll(".gold-bricks").forEach((box) => {
  const img = box.querySelector("img");
  if (!img) return;

  const markReady = () => box.classList.add("is-ready");

  // из кэша картинка приходит уже готовой, события load не будет
  if (img.complete && img.naturalWidth) {
    markReady();
  } else {
    img.addEventListener("load", markReady, { once: true });
  }
});
