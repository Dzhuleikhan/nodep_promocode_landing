const modalOpenBtns = document.querySelectorAll(".modal-open-btn");
const formOverlay = document.querySelector(".form-overlay");

modalOpenBtns.forEach((btn) => {
  if (btn) {
    btn.addEventListener("click", () => {
      formOverlay.classList.add("is-open");
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
      formOverlay.classList.remove("is-open");
      document.body.style.overflow = "visible";
    }
  });
}
