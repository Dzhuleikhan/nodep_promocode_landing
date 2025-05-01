const modalOpenBtns = document.querySelectorAll(".hero-modal-open-btn");
const formOverlay = document.querySelector(".two-step-overlay");

modalOpenBtns.forEach((btn) => {
  if (btn) {
    btn.addEventListener("click", () => {
      formOverlay.classList.add("is-open");
      document.body.style.overflow = "hidden";
    });
  }
});
