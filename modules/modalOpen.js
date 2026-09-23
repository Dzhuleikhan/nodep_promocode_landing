import { twoStepFormData, focusActiveStep } from "./twoStepForm";

const modalOpenBtns = document.querySelectorAll(".hero-modal-open-btn");
const formOverlay = document.querySelector(".two-step-overlay");

modalOpenBtns.forEach((btn) => {
  let currentPromocode = btn.getAttribute("data-promocode");
  twoStepFormData.promocode = currentPromocode;
  if (btn) {
    btn.addEventListener("click", () => {
      formOverlay.classList.add("is-open");
      document.body.style.overflow = "hidden";

      // Синхронно, внутри клика: оверлей уже display:flex, поля измеримы,
      // а на iOS Safari клавиатура поднимается только в пользовательском жесте
      focusActiveStep();
    });
  }
});
