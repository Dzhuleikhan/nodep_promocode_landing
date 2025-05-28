import { newDomain } from "./fetchingDomain";
import { getSupportedLanguage } from "./geoLocation";
import { getUrlParameter } from "./params";

// | AUTH FORM VALIDATION AND SUBMITTING

const emailForm = document.querySelector(".email-form");
const emailInput = emailForm.querySelector(".email-input");
const passwordInput = emailForm.querySelector(".password-input");
const checkbox = emailForm.querySelector(".checkbox-input");
const lang = getSupportedLanguage(localStorage.getItem("lang"));

const defaultPromocode = "ROYALFREE";
let cid = getUrlParameter("cid");

export let formData = {};
let emailValid = false;
let passwordValid = false;
let checkboxValid = true;

formData.lang = lang;
formData.cid = cid;

function enableSubmitButton() {
  if (emailValid && passwordValid && checkboxValid) {
    emailForm.querySelector(".form-submit-btn").disabled = false;
  } else {
    emailForm.querySelector(".form-submit-btn").disabled = true;
  }
}

// Validate checkbox
checkbox.addEventListener("change", (event) => {
  if (event.target.checked) {
    checkboxValid = true;
  } else {
    checkboxValid = false;
  }
  enableSubmitButton();
});

// Validate email
emailInput.addEventListener("input", (event) => {
  const emailValue = event.target.value;
  const emailPattern =
    /^(?!.*\.\.)[a-zA-Z0-9][a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]{0,62}[a-zA-Z0-9]@(?:\[(?:\d{1,3}\.){3}\d{1,3}\]|[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+)$/;
  const placeholder = emailInput.nextElementSibling;
  if (emailValue.length >= 1) {
    placeholder.classList.add("hidden");
  } else {
    placeholder.classList.remove("hidden");
  }

  if (emailPattern.test(emailValue)) {
    emailValid = true;
    formData.email = emailValue;
    document.querySelector(".auth-form-email").classList.remove("non-valid");
    document.querySelector(".auth-form-email").classList.add("valid");
  } else {
    emailValid = false;
    formData.email = "";
    document.querySelector(".auth-form-email").classList.remove("valid");
    document.querySelector(".auth-form-email").classList.add("non-valid");
  }

  enableSubmitButton();
});

// Validate password
const showPasswordBtn = document.querySelector(".show-password");

passwordInput.addEventListener("input", (event) => {
  const passwordValue = event.target.value;
  const placeholder = passwordInput.nextElementSibling;

  if (passwordValue.length >= 1) {
    placeholder.classList.add("hidden");
  } else {
    placeholder.classList.remove("hidden");
  }

  if (passwordValue.length >= 6) {
    passwordValid = true;
    formData.password = passwordValue;
    document.querySelector(".auth-form-password").classList.remove("non-valid");
    document.querySelector(".auth-form-password").classList.add("valid");
  } else {
    passwordValid = false;
    formData.password = "";
    document.querySelector(".auth-form-password").classList.remove("valid");
    document.querySelector(".auth-form-password").classList.add("non-valid");
  }

  enableSubmitButton();
});

showPasswordBtn.addEventListener("click", () => {
  const visibleIcon = showPasswordBtn.querySelector(".password-visible");
  const invisibleIcon = showPasswordBtn.querySelector(".password-invisible");
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    visibleIcon.classList.add("hidden");
    invisibleIcon.classList.remove("hidden");
  } else {
    passwordInput.type = "password";
    visibleIcon.classList.remove("hidden");
    invisibleIcon.classList.add("hidden");
  }
});

function disableBtnOnSubmit() {
  document.querySelector(".form-submit-btn-spinner").classList.remove("hidden");
  document.querySelector(".form-submit-btn-text").classList.add("hidden");
  document.querySelector(".form-submit-btn").disabled = true;
}

// Submitting form

function submitForm(form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    disableBtnOnSubmit();
    window.location.href = `https://${newDomain}/api/register?env=prod&type=email&currency=${
      formData.currency
    }&email=${encodeURIComponent(formData.email)}&password=${encodeURIComponent(
      formData.password
    )}${formData.bonus ? "&bonus=" + formData.bonus : ""}${
      formData.promocode ? "&promocode=" + formData.promocode : ""
    }&lang=${formData.lang}${cid ? "&cid=" + cid : ""}`;
    console.log(
      `https://${newDomain}/api/register?env=prod&type=email&currency=${
        formData.currency
      }&email=${encodeURIComponent(
        formData.email
      )}&password=${encodeURIComponent(formData.password)}${
        formData.bonus ? "&bonus=" + formData.bonus : ""
      }${formData.promocode ? "&promocode=" + formData.promocode : ""}&lang=${
        formData.lang
      }${formData.cid ? "&cid=" + formData.cid : ""}`
    );
    console.log(formData);
  });
}
submitForm(emailForm);

// Socials registration

const socialsRegBtns = document.querySelectorAll(".social-reg-btn");

socialsRegBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const regType = btn.getAttribute("data-reg-type");

    window.location.href = `https://${newDomain}/api/register?env=prod&type=${regType}&currency=${
      formData.currency
    }${formData.bonus ? "&bonus=" + formData.bonus : ""}${
      formData.promocode ? "&promocode=" + formData.promocode : ""
    }&lang=${formData.lang}${formData.cid ? "&cid=" + formData.cid : ""}`;
    console.log(
      `https://${newDomain}/api/register?env=prod&type=${regType}&currency=${
        formData.currency
      }${formData.bonus ? "&bonus=" + formData.bonus : ""}${
        formData.promocode ? "&promocode=" + formData.promocode : ""
      }&lang=${formData.lang}${formData.cid ? "&cid=" + formData.cid : ""}`
    );
  });
});

// Cliking main HeroBtn

const heroMainBtn = document.querySelector(".hero-main-btn");

heroMainBtn.addEventListener("click", () => {
  if (!emailValid && !passwordValid) {
    document.querySelector(".auth-form-email").classList.remove("valid");
    document.querySelector(".auth-form-email").classList.add("non-valid");
    document.querySelector(".auth-form-password").classList.remove("valid");
    document.querySelector(".auth-form-password").classList.add("non-valid");
  }
});
