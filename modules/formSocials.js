import { socialsIti } from "./itiTelInput.js";
import { getUrlParameter } from "./params.js";
import { newDomain } from "./fetchingDomain.js";
import { checkTir1CurrencyMatch } from "./modalCurrency.js";
import { receivedPromocode, defaulPromocode } from "./promocodeCheck.js";
// import { hiddenSelect } from "./hiddenSelect.js";

// | SOCIALS FORM VALIDATING AND SUBMITTING
export let formStepCount = 1;
const formSteps = document.querySelectorAll(".socials-form-step");

const changingFormSteps = (stepCount) => {
  formSteps.forEach((step) => {
    if (step) {
      formSteps.forEach((el) => {
        el.classList.add("hidden");
      });
      document
        .querySelector(`.socials-form-step-${stepCount}`)
        .classList.remove("hidden");
    }
  });
};
changingFormSteps(formStepCount);

const formModals = document.querySelectorAll(".form-modal-socials");

let formTab;
let formTabParam = getUrlParameter("method-type");

if (formTabParam) {
  formTab = formTabParam === "phone" ? "phone" : "email";
} else {
  formTab = "email";
}

const socialsForm = document.querySelector(".socials-form");

if (socialsForm) {
  const formTypeBtns = document.querySelectorAll(".socials-form-type-btn");
  const formGroups = document.querySelectorAll(".socials-form-group");

  const formStep1 = socialsForm.querySelector(".socials-form-step-1");
  const formStep2 = socialsForm.querySelector(".socials-form-step-2");
  const formStepBtnPrev = document.querySelector(".form-step-btn-prev");
  const backBtnWrapper = document.querySelector(".back-btn-wrapper");

  // STEP 1
  if (formStep1) {
    const formStepBtnNext = formStep1.querySelector(".form-step-btn-next");

    // Validating Email input
    const emailRegEx =
      /^(?!.*\.\.)[a-zA-Z0-9][a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]{0,62}[a-zA-Z0-9]@(?:\[(?:\d{1,3}\.){3}\d{1,3}\]|[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+)$/;
    const formGroupEmail = formStep1.querySelector(".socials-form-group-email");
    const emalInput = formGroupEmail.querySelector(".email-input");

    function validateEmail() {
      if (emalInput.value === "") {
        formGroupEmail.querySelector(".not-valid-icon").classList.add("hidden");
        formGroupEmail.classList.remove("not-valid");
        formStepBtnNext.disabled = true;
      } else if (emalInput.value.match(emailRegEx)) {
        formStepBtnNext.disabled = false;
        formGroupEmail.querySelector(".not-valid-icon").classList.add("hidden");
        formGroupEmail.classList.remove("not-valid");
      } else {
        formGroupEmail.classList.add("not-valid");
        formGroupEmail
          .querySelector(".not-valid-icon")
          .classList.remove("hidden");
        formStepBtnNext.disabled = true;
      }
    }

    emalInput.addEventListener("input", validateEmail);

    // Phone validation
    const formGroupPhone = formStep1.querySelector(".socials-form-group-phone");
    const phoneInput = formGroupPhone.querySelector(".phone-input");

    function validatePhoneNumber() {
      if (phoneInput.value === "") {
        formGroupPhone.classList.remove("not-valid");
        formGroupPhone.querySelector(".not-valid-icon").classList.add("hidden");
      } else if (!phoneInput.value.trim()) {
        formGroupPhone.classList.add("not-valid");
        formGroupPhone
          .querySelector(".not-valid-icon")
          .classList.remove("hidden");
        formStepBtnNext.disabled = true;
        return false;
      } else if (socialsIti.isValidNumber()) {
        formGroupPhone.classList.remove("not-valid");
        formGroupPhone.querySelector(".not-valid-icon").classList.add("hidden");
        formStepBtnNext.disabled = false;
        return true;
      } else {
        formGroupPhone.classList.add("not-valid");
        formGroupPhone
          .querySelector(".not-valid-icon")
          .classList.remove("hidden");
        formStepBtnNext.disabled = true;
        return false;
      }
    }

    // Validating Phone input
    phoneInput.addEventListener("input", validatePhoneNumber);

    formStepBtnNext.addEventListener("click", (e) => {
      e.preventDefault();
      formStepCount++;
      changingFormSteps(formStepCount);
      backBtnWrapper.classList.remove("hidden");
      backBtnWrapper.classList.add("flex");
    });
    if (formStepBtnPrev) {
      formStepBtnPrev.addEventListener("click", () => {
        formStepCount--;
        changingFormSteps(formStepCount);
        backBtnWrapper.classList.add("hidden");
        backBtnWrapper.classList.remove("flex");
      });
    }

    // Changing tabs in step 1
    formTypeBtns.forEach((btn) => {
      if (btn) {
        btn.addEventListener("click", (e) => {
          let tab = e.target.getAttribute("data-tab");
          formTypeBtns.forEach((el) => {
            el.classList.remove("active");
          });
          btn.classList.add("active");
          formTab = tab;

          if (tab === "email") {
            formGroupPhone.classList.remove("not-valid");
            phoneInput.value = "";
            if (emalInput.value != "" && emalInput.value.match(emailRegEx)) {
              formStepBtnNext.disabled = false;
            } else {
              formStepBtnNext.disabled = true;
            }
          }
          if (tab === "phone") {
            formGroupEmail.classList.remove("not-valid");
            emalInput.value = "";
            if (phoneInput.value != "" && socialsIti.isValidNumber()) {
              formStepBtnNext.disabled = false;
            } else {
              formStepBtnNext.disabled = true;
            }
          }

          formGroups.forEach((group) => {
            group.classList.remove("active");
          });
          document
            .querySelector(`.socials-form-group-${tab}`)
            .classList.add("active");
        });
      }
    });
  }

  // STEP 2
  if (formStep2) {
    const formStepBtnNext = formStep2.querySelector(".form-step-btn-next");

    // Password validation
    const formGroupPassword = formStep2.querySelector(
      ".socials-form-group-password",
    );
    const passwordInput = formGroupPassword.querySelector(".password-input");
    const passwordShowIcon =
      formGroupPassword.querySelector(".show-password-btn");

    if (formGroupPassword) {
      passwordShowIcon.addEventListener("click", () => {
        if (passwordInput.type === "password") {
          passwordInput.setAttribute("type", "text");
          passwordShowIcon.src = "./img/password-visible.svg";
        } else {
          passwordInput.setAttribute("type", "password");
          passwordShowIcon.src = "./img/password-invisible.svg";
        }
      });
    }

    const validatePassword = () => {
      if (passwordInput.value.length > 6) {
        formStepBtnNext.disabled = false;
        formGroupPassword.classList.remove("not-valid");
        formGroupPassword
          .querySelector(".not-valid-icon")
          .classList.add("hidden");
      } else {
        formStepBtnNext.disabled = true;
        formGroupPassword.classList.add("not-valid");
        formGroupPassword
          .querySelector(".not-valid-icon")
          .classList.remove("hidden");
      }
    };

    // CHECKBOX VALIDATION
    const checkboxInput = formStep2.querySelector(".checkbox-input");

    passwordInput.addEventListener("input", validatePassword);

    checkboxInput.addEventListener("change", () => {
      if (formTab === "email") {
        if (checkboxInput.checked === true && passwordInput.value.length > 6) {
          formStepBtnNext.disabled = false;
        } else {
          formStepBtnNext.disabled = true;
        }
      }
      if (formTab === "phone") {
        if (checkboxInput.checked === true) {
          formStepBtnNext.disabled = false;
        } else {
          formStepBtnNext.disabled = true;
        }
      }
    });
  }
}

const mainForm = document.querySelector(".socials-form");
let lang = localStorage.getItem("preferredLanguage");

function disableFormWhileSubmitting() {
  mainForm.classList.add("loading");
  mainForm.querySelector(".main-form-submit-btn").disabled = true;
}

let cid = getUrlParameter("cid");
let partner = getUrlParameter("partner");
let offer = getUrlParameter("offer");

if (mainForm) {
  mainForm.addEventListener("keydown", (e) => {
    const step1btn = mainForm.querySelector(".form-step-btn-1");
    const submitBtn = mainForm.querySelector("button[type='submit']");

    const email = mainForm.querySelector(".email-input");
    const phone = mainForm.querySelector(".phone-input");
    const password = mainForm.querySelector(".password-input");
    const currency = mainForm.querySelector(".currency-input");
    const bonus = mainForm
      .querySelector(".bonus-input")
      .getAttribute("data-bonus");

    let formData = {};
    formData.email = email.value;
    formData.phone = phone.value;
    formData.password = password.value;
    formData.currency = currency.value;
    formData.bonus = bonus;
    lang = localStorage.getItem("preferredLanguage");
    formData.promocode = receivedPromocode || defaulPromocode;

    let code = socialsIti.getSelectedCountryData().dialCode;
    let phoneNumber = phone.value.trim();

    formData.bonus = checkTir1CurrencyMatch(formData.currency, formData.bonus);

    if (code && phoneNumber) {
      let sanitizedPhoneNumber = phoneNumber.replace(/\D/g, "");
      let fullPhoneNumber = `${code}${sanitizedPhoneNumber}`;
      if (socialsIti.isValidNumber()) {
        formData.phone = fullPhoneNumber;
      }
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (formStepCount === 1) {
        if (!step1btn.disabled) {
          formStepCount++;
          changingFormSteps(formStepCount);
          backBtnWrapper.classList.remove("hidden");
          backBtnWrapper.classList.add("flex");
        }
      }
      if (formStepCount === 2) {
        if (!submitBtn.disabled) {
          if (formTab === "email") {
            disableFormWhileSubmitting();

            window.location.href = `https://${newDomain}/api/register?env=prod&type=${formTab}&currency=${
              formData.currency
            }&email=${encodeURIComponent(
              formData.email,
            )}&password=${encodeURIComponent(formData.password)}${
              formData.bonus === "" ? "" : "&bonus=" + formData.bonus
            }${
              formData.promocode ? "&promocode=" + formData.promocode : ""
            }&lang=${lang}${cid ? "&cid=" + cid : ""}${
              partner ? "&partner=" + partner : ""
            }${offer ? "&offer=" + offer : ""}`;
            console.log(
              `https://${newDomain}/api/register?env=prod&type=${formTab}&currency=${
                formData.currency
              }&email=${encodeURIComponent(
                formData.email,
              )}&password=${encodeURIComponent(formData.password)}${
                formData.bonus === "" ? "" : "&bonus=" + formData.bonus
              }${
                formData.promocode ? "&promocode=" + formData.promocode : ""
              }&lang=${lang}${cid ? "&cid=" + cid : ""}${
                partner ? "&partner=" + partner : ""
              }${offer ? "&offer=" + offer : ""}`,
            );
          } else if (formTab === "phone") {
            disableFormWhileSubmitting();

            window.location.href = `https://${newDomain}/api/register?env=prod&type=${formTab}&currency=${
              formData.currency
            }&phone=${formData.phone}&password=${encodeURIComponent(
              formData.password,
            )}${formData.bonus === "" ? "" : "&bonus=" + formData.bonus}${
              formData.promocode ? "&promocode=" + formData.promocode : ""
            }&lang=${lang}${cid ? "&cid=" + cid : ""}${
              partner ? "&partner=" + partner : ""
            }${offer ? "&offer=" + offer : ""}`;
            console.log(
              `https://${newDomain}/api/register?env=prod&type=${formTab}&currency=${
                formData.currency
              }&phone=${formData.phone}&password=${encodeURIComponent(
                formData.password,
              )}${formData.bonus === "" ? "" : "&bonus=" + formData.bonus}${
                formData.promocode ? "&promocode=" + formData.promocode : ""
              }&lang=${lang}${cid ? "&cid=" + cid : ""}${
                partner ? "&partner=" + partner : ""
              }${offer ? "&offer=" + offer : ""}`,
            );
          }
        }
      }
    }
  });

  mainForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const step1btn = mainForm.querySelector(".form-step-btn-1");

    const email = mainForm.querySelector(".email-input");
    const phone = mainForm.querySelector(".phone-input");
    const password = mainForm.querySelector(".password-input");
    const currency = mainForm.querySelector(".currency-input");
    const bonus = mainForm
      .querySelector(".bonus-input")
      .getAttribute("data-bonus");

    let formData = {};
    formData.email = email.value;
    formData.phone = phone.value;
    formData.password = password.value;
    formData.currency = currency.value;
    formData.bonus = bonus;
    lang = localStorage.getItem("preferredLanguage");
    formData.promocode = receivedPromocode || defaulPromocode;

    let code = socialsIti.getSelectedCountryData().dialCode;
    let phoneNumber = phone.value.trim();

    formData.bonus = checkTir1CurrencyMatch(formData.currency, formData.bonus);

    if (code && phoneNumber) {
      let sanitizedPhoneNumber = phoneNumber.replace(/\D/g, "");
      let fullPhoneNumber = `${code}${sanitizedPhoneNumber}`;
      if (socialsIti.isValidNumber()) {
        formData.phone = fullPhoneNumber;
      }
    }

    if (formStepCount === 1) {
      if (!step1btn.disabled) {
        formStepCount++;
        changingFormSteps(formStepCount);
      }
    }

    if (formTab === "email") {
      disableFormWhileSubmitting();

      window.location.href = `https://${newDomain}/api/register?env=prod&type=${formTab}&currency=${
        formData.currency
      }&email=${encodeURIComponent(
        formData.email,
      )}&password=${encodeURIComponent(formData.password)}${
        formData.bonus === "" ? "" : "&bonus=" + formData.bonus
      }${
        formData.promocode ? "&promocode=" + formData.promocode : ""
      }&lang=${lang}${cid ? "&cid=" + cid : ""}${
        partner ? "&partner=" + partner : ""
      }${offer ? "&offer=" + offer : ""}`;
      console.log(
        `https://${newDomain}/api/register?env=prod&type=${formTab}&currency=${
          formData.currency
        }&email=${encodeURIComponent(
          formData.email,
        )}&password=${encodeURIComponent(formData.password)}${
          formData.bonus === "" ? "" : "&bonus=" + formData.bonus
        }${
          formData.promocode ? "&promocode=" + formData.promocode : ""
        }&lang=${lang}${cid ? "&cid=" + cid : ""}${
          partner ? "&partner=" + partner : ""
        }${offer ? "&offer=" + offer : ""}`,
      );
    } else if (formTab === "phone") {
      disableFormWhileSubmitting();

      window.location.href = `https://${newDomain}/api/register?env=prod&type=${formTab}&currency=${
        formData.currency
      }&phone=${formData.phone}&password=${encodeURIComponent(
        formData.password,
      )}${formData.bonus === "" ? "" : "&bonus=" + formData.bonus}${
        formData.promocode ? "&promocode=" + formData.promocode : ""
      }&lang=${lang}${cid ? "&cid=" + cid : ""}${
        partner ? "&partner=" + partner : ""
      }${offer ? "&offer=" + offer : ""}`;
      console.log(
        `https://${newDomain}/api/register?env=prod&type=${formTab}&currency=${
          formData.currency
        }&phone=${formData.phone}&password=${encodeURIComponent(
          formData.password,
        )}${formData.bonus === "" ? "" : "&bonus=" + formData.bonus}${
          formData.promocode ? "&promocode=" + formData.promocode : ""
        }&lang=${lang}${cid ? "&cid=" + cid : ""}${
          partner ? "&partner=" + partner : ""
        }${offer ? "&offer=" + offer : ""}`,
      );
    }
  });
}

window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    window.location.reload();
  }
});

const formSocialLinks = document.querySelectorAll(".socials-form-social-link");

formSocialLinks.forEach((link) => {
  if (link) {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const type = e.target.getAttribute("data-reg-type");
      let bonus = mainForm
        .querySelector(".bonus-input")
        .getAttribute("data-bonus");
      const lang = localStorage.getItem("preferredLanguage");

      let currencyStoredData = localStorage.getItem("currencyData");
      let currencyData = JSON.parse(currencyStoredData);
      let currency = currencyData.abbr;
      let promocode = receivedPromocode || defaulPromocode;

      bonus = checkTir1CurrencyMatch(currency, bonus);

      window.location.href = `https://${newDomain}/api/register?env=prod&type=${type}&currency=${currency}${
        bonus === "" ? "" : "&bonus=" + bonus
      }${promocode ? "&promocode=" + promocode : ""}&lang=${lang}${
        cid ? "&cid=" + cid : ""
      }${partner ? "&partner=" + partner : ""}${
        offer ? "&offer=" + offer : ""
      }`;
      console.log(
        `https://${newDomain}/api/register?env=prod&type=${type}&currency=${currency}${
          bonus === "" ? "" : "&bonus=" + bonus
        }${promocode ? "&promocode=" + promocode : ""}&lang=${lang}${
          cid ? "&cid=" + cid : ""
        }${partner ? "&partner=" + partner : ""}${
          offer ? "&offer=" + offer : ""
        }`,
      );
    });
  }
});
