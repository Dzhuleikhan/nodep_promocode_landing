import { addUrlParameter, getUrlParameter } from "./params";
import { twoStepFormData } from "./twoStepForm";

const modalOpenBtns = document.querySelectorAll(".hero-modal-open-btn");
const formOverlay = document.querySelectorAll(".two-step-overlay");

const defaultModalParam = "two-step";

const modalParam = getUrlParameter("modal") || defaultModalParam;
addUrlParameter("modal", modalParam);

function showModalFromParam(param) {
  const modal = Array.from(formOverlay).find(
    (overlay) => overlay.getAttribute("data-modal") === param
  );

  (
    modal || document.querySelector(`[data-modal="${defaultModalParam}"]`)
  )?.classList.add("is-open");
}

modalOpenBtns.forEach((btn) => {
  let currentPromocode = btn.getAttribute("data-promocode");
  twoStepFormData.promocode = currentPromocode;
  if (btn) {
    btn.addEventListener("click", () => {
      showModalFromParam(modalParam);
      document.body.style.overflow = "hidden";
    });
  }
});

const formModalClosebtn = document.querySelector(".form-modal-close-btn");
const tryToCloseWindow = document.querySelector(".try-to-close");

if (formModalClosebtn) {
  formModalClosebtn.addEventListener("click", () => {
    tryToCloseWindow.classList.remove("hidden");
  });
}

if (tryToCloseWindow) {
  tryToCloseWindow.addEventListener("click", (e) => {
    if (e.target.classList.contains("keep-registering")) {
      tryToCloseWindow.classList.add("hidden");
    } else if (e.target.classList.contains("return-to-website")) {
      tryToCloseWindow.classList.add("hidden");
      formOverlay.forEach((overlay) => {
        overlay.classList.remove("is-open");
      });
      document.body.style.overflow = "visible";
    }
  });
}
