import {
  countryFlags,
  getPostalCodeMode,
  hasStateField,
  formatPostalCode,
  validatePostalCodeFormat,
} from "../public/data";
import { geoData, settingZipCodePlaceholder } from "./geoLocation";
import {
  twoStepiti,
  getMaxDigitsForCountry,
  stripDuplicatedDialCode,
  formatByPlaceholder,
} from "./itiTelInput";
import { newDomain } from "./fetchingDomain";
import { getUrlParameter } from "./params";
import gsap from "gsap";
import flatpickr from "flatpickr";
import {
  defaulPromocode,
  receivedPromocode,
  togglePromocodeWrapper,
} from "./promocodeCheck";
import {
  checkPhoneAvailability,
  getPhoneStatus,
  phoneTakenMessage,
} from "./phoneAvailability";
import {
  checkEmailAvailability,
  getEmailStatus,
  normalizeEmail,
  emailTakenMessage,
} from "./emailAvailability";

document.querySelectorAll("input").forEach((input) => {
  input.setAttribute("autocomplete", "off");
});

// ? SOCIALS TWO STEP FORM

export let twoStepFormData = {
  bonus: "welcome-bonus-1",
  promocode: "",
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  birthday: "",
  gender: "",
  country: "",
  currency: geoData.currency.code === "RUB" ? "USD" : geoData.currency.code,
  phone: "",
  state: "",
  city: "",
  street: "",
  houseNumber: "",
  apartment: "",
  zipCode: "",
  lang: "",
};

export const exceptCurrencies = [
  "RON",
  "DKK",
  "HUF",
  "CZK",
  "CHF",
  "PLN",
  "CAD",
  "USD",
  "EUR",
  "NOK",
];

export const checkTir1CurrencyMatch = (currency, bonus) => {
  const initialBonus = "welcome-bonus-1";
  const updatedBonus = "welcome-bonus-1-alt";

  if (twoStepFormData.bonus !== "" && twoStepFormData.bonus !== "0") {
    if (exceptCurrencies.includes(currency)) {
      return updatedBonus;
    }
    return initialBonus;
  }

  return bonus;
};

twoStepFormData.bonus = document.querySelector(
  'input[name="bonus"]:checked',
).value;

// | CHOOSING BONUSES

const twoStepBonusCheckbox = document.querySelectorAll(
  ".two-step-bonus-checkbox",
);
const appliedBonusWrapper = document.querySelectorAll(".applied-bonus-wrapper");

twoStepBonusCheckbox.forEach((checkbox) => {
  const input = checkbox.querySelector("input");
  input.addEventListener("change", () => {
    const bonusValue = input.value;

    const bonusImg = input.getAttribute("data-img");
    const bonusName = checkbox.querySelector(
      ".two-step-bonus-checkbox-name",
    ).innerHTML;
    const bonusText = checkbox.querySelector(
      ".two-step-bonus-checkbox-text",
    ).innerHTML;

    if (bonusValue === "welcome-bonus-1" || bonusValue === "0") {
      twoStepFormData.promocode = "";
      if (receivedPromocode) {
        togglePromocodeWrapper("hide");
      }
    } else {
      twoStepFormData.promocode = receivedPromocode
        ? receivedPromocode
        : defaulPromocode;
      if (receivedPromocode) {
        togglePromocodeWrapper("show");
      }
    }
    twoStepFormData.bonus = bonusValue;

    twoStepFormData.bonus = checkTir1CurrencyMatch(
      twoStepFormData.currency,
      twoStepFormData.bonus,
    );

    appliedBonusWrapper.forEach((appliedBonus) => {
      const img = appliedBonus.querySelector(".applied-bonus-img");
      const name = appliedBonus.querySelector(".applied-bonus-name");
      const text = appliedBonus.querySelector(".applied-bonus-text");

      img.setAttribute("src", bonusImg);
      name.innerHTML = bonusName;
      text.innerHTML = bonusText;
    });
  });
});

export const settingInitialBonusValue = (currency) => {
  if (exceptCurrencies.includes(currency)) {
    document.querySelectorAll(".two-step-bonus-percent").forEach((text) => {
      text.innerHTML = "100%";
    });
    document.querySelectorAll(".two-step-bonus-spins").forEach((text) => {
      text.innerHTML = "200FS";
    });
    document
      .querySelector(".welcome-bonus-input")
      .setAttribute("data-text", "100% + 200FS on your first deposit");
    document.querySelectorAll(".applied-bonus-percent").forEach((el) => {
      el.innerHTML = "100%";
    });
    document.querySelectorAll(".applied-bonus-spins").forEach((el) => {
      el.innerHTML = "200FS";
    });
  } else {
    document.querySelectorAll(".two-step-bonus-percent").forEach((text) => {
      text.innerHTML = "200%";
    });
    document.querySelectorAll(".two-step-bonus-spins").forEach((text) => {
      text.innerHTML = "25FS";
    });
    document
      .querySelector(".welcome-bonus-input")
      .setAttribute("data-text", "200% + 25FS on your first deposit");
    document.querySelectorAll(".applied-bonus-percent").forEach((el) => {
      el.innerHTML = "200%";
    });
    document.querySelectorAll(".applied-bonus-spins").forEach((el) => {
      el.innerHTML = "25FS";
    });
  }
};

// | INPUTS
const twoStepGeneralInput = document.querySelectorAll(
  ".two-step-general-input",
);

twoStepGeneralInput.forEach((input) => {
  if (input) {
    input.addEventListener("input", () => {
      const label = input.nextElementSibling;
      label.classList.toggle("active", input.value.trim() !== "");
    });
  }
});

// | PROMOCODE
const twoStepPromocodeBtn = document.querySelector(".two-step-promocode-btn");
const twoStepPromocodeWrapper = document.querySelector(
  ".two-step-promocode-wrapper",
);
if (twoStepPromocodeBtn) {
  twoStepPromocodeBtn.addEventListener("click", () => {
    twoStepPromocodeBtn.classList.add("hidden");
    twoStepPromocodeWrapper.classList.add("is-visible");
  });
}

const promocodeWrapperTl = gsap.timeline({ paused: true });

promocodeWrapperTl
  .to(twoStepPromocodeWrapper, { x: -14, duration: 0.03 })
  .to(twoStepPromocodeWrapper, { x: 14, duration: 0.03 })
  .to(twoStepPromocodeWrapper, { x: 0, duration: 0.03 });

if (twoStepPromocodeWrapper) {
  const input = twoStepPromocodeWrapper.querySelector(
    ".two-step-promocode-input",
  );
  const promocodeApplyBtn = twoStepPromocodeWrapper.querySelector(
    ".two-step-promocode-apply-btn",
  );

  let promoIsValid;

  input.addEventListener("input", async () => {
    const promoCode = input.value;
    try {
      const response = await fetch(
        "https://promocodesapi.onrender.com/check-promo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: promoCode }),
        },
      );

      const result = await response.json();

      promoIsValid = result.valid;

      if (twoStepPromocodeWrapper.classList.contains("is-valid")) {
        twoStepFormData.promocode = "";
        console.log("Промокод неверный");
        twoStepPromocodeWrapper.classList.remove("is-valid");
        twoStepPromocodeWrapper.classList.add("is-not-valid");
      }
    } catch (error) {
      console.error("Ошибка при проверке промокода:", error);
    }
  });

  promocodeApplyBtn.addEventListener("click", () => {
    console.log(promoIsValid);
    if (promoIsValid) {
      twoStepFormData.promocode = validateStringInput(
        input.value,
      ).toUpperCase();
      console.log("Промокод верный");
      twoStepPromocodeWrapper.classList.add("is-valid");
      twoStepPromocodeWrapper.classList.remove("is-not-valid");
    } else {
      twoStepFormData.promocode = "";
      console.log("Промокод неверный");
      twoStepPromocodeWrapper.classList.remove("is-valid");
      twoStepPromocodeWrapper.classList.add("is-not-valid");
      promocodeWrapperTl.restart();
    }
  });
}

// | STEP 2 -- EMAIL AND PASSWORD

const twoStepFormSecondStep = document.querySelector(".two-step-form-step-2");
if (twoStepFormSecondStep) {
  const twoStepFormSecondStepBtn =
    twoStepFormSecondStep.querySelector(".next-step-btn");

  const twoStepFormEmailInput = twoStepFormSecondStep.querySelector(
    ".two-step-email-input",
  );
  const twoStepFormPasswordInput = twoStepFormSecondStep.querySelector(
    ".two-step-password-input",
  );
  const btnOverlap = twoStepFormSecondStepBtn.querySelector(".disable-overlap");

  const regex =
    /^(?!.*\.\.)[a-zA-Z0-9][a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]{0,62}[a-zA-Z0-9]@(?:\[(?:\d{1,3}\.){3}\d{1,3}\]|[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+)$/;

  const currentEmail = () => normalizeEmail(twoStepFormEmailInput.value);

  // email-guard: Zeruh подтвердил доставляемость? Если сниппета нет — fail-open (true).
  const emailDeliverableOk = () =>
    !(window.EmailGuard && window.EmailGuard.isValid) ||
    window.EmailGuard.isValid(twoStepFormEmailInput);

  // Полная валидность почты для гейта: формат + Zeruh + НЕ занята.
  // Нет записи/pending → false (ждём вердикт); errored → fail-open; занята → false.
  const isEmailFieldValid = () => {
    const v = twoStepFormEmailInput.value.trim();
    if (!regex.test(v)) return false;
    if (!emailDeliverableOk()) return false;
    const st = getEmailStatus(currentEmail());
    if (!st || st.pending) return false;
    if (st.errored) return true;
    return st.available === true;
  };

  // Проверка занятости почты ещё идёт (формат ок + Zeruh ок, но вердикта нет).
  const isEmailAvailPending = () => {
    const v = twoStepFormEmailInput.value.trim();
    if (!regex.test(v) || !emailDeliverableOk()) return false;
    const st = getEmailStatus(currentEmail());
    return !st || st.pending;
  };

  // Запустить проверку занятости почты — только если формат ок и Zeruh не против.
  const maybeCheckEmailAvailability = () => {
    const v = twoStepFormEmailInput.value.trim();
    if (!regex.test(v) || !emailDeliverableOk()) return;
    checkEmailAvailability(currentEmail()).then(() =>
      validateInputs("#4ED937", "#ff5530"),
    );
  };

  // Сообщение «этот e-mail нельзя использовать» — только при однозначном «занята».
  const emailAlertEl = document.querySelector(".two-step-email-alert");
  const updateEmailAlert = () => {
    if (!emailAlertEl) return;
    const v = twoStepFormEmailInput.value.trim();
    const st = getEmailStatus(currentEmail());
    const taken =
      regex.test(v) &&
      emailDeliverableOk() &&
      st &&
      !st.pending &&
      !st.errored &&
      st.available === false;
    if (taken) {
      const lang =
        document.documentElement.getAttribute("lang") ||
        localStorage.getItem("preferredLanguage") ||
        "en";
      emailAlertEl.textContent = emailTakenMessage(lang);
      emailAlertEl.classList.remove("hidden");
    } else {
      emailAlertEl.classList.add("hidden");
    }
  };

  const validateInputs = (validColor, invalidColor) => {
    const passwordValue = twoStepFormPasswordInput.value.trim();

    // Кнопка держится выключенной, пока Zeruh + проверка занятости не подтвердят почту.
    const isEmailValid = isEmailFieldValid();
    const isPasswordValid = passwordValue.length >= 6;

    // Во время проверки занятости — нейтральный цвет, не красный.
    twoStepFormEmailInput.style.color = isEmailAvailPending()
      ? "#8726FF"
      : isEmailValid
        ? validColor
        : invalidColor;
    twoStepFormPasswordInput.style.color = isPasswordValid
      ? validColor
      : invalidColor;

    updateEmailAlert();

    if (isEmailValid && isPasswordValid) {
      btnOverlap.style.left = "100%";
      twoStepFormData.email = twoStepFormEmailInput.value;
      twoStepFormData.password = twoStepFormPasswordInput.value;
      twoStepFormSecondStepBtn.disabled = false;
    } else if (isEmailValid || isPasswordValid) {
      btnOverlap.style.left = "50%";
      twoStepFormSecondStepBtn.disabled = true;
    } else {
      btnOverlap.style.left = "";
      twoStepFormSecondStepBtn.disabled = true;
    }
  };

  twoStepFormEmailInput.addEventListener("focusout", () =>
    validateInputs("#4ED937", "#ff5530"),
  );
  twoStepFormPasswordInput.addEventListener("focusout", () =>
    validateInputs("#4ED937", "#ff5530"),
  );

  if (
    twoStepFormEmailInput.value === "" ||
    twoStepFormPasswordInput.value === ""
  ) {
    twoStepFormSecondStepBtn.disabled = true;
  }

  twoStepFormEmailInput.addEventListener("input", () => {
    twoStepFormEmailInput.style.color = "#8726FF";
    validateInputs("#4ED937", "#8726FF");
  });
  twoStepFormPasswordInput.addEventListener("input", () => {
    twoStepFormPasswordInput.style.color = "#8726FF";
    validateInputs("#4ED937", "#8726FF");
  });

  // email-guard: вердикт Zeruh приходит асинхронно (после blur) — пересчитываем
  // заливку и блок кнопки; плюс крутим спиннер в инпуте, пока идёт проверка.
  const emailSpinner = twoStepFormSecondStep.querySelector(
    ".two-step-email-spinner",
  );
  const showSpinner = () => emailSpinner?.classList.remove("hidden");
  const hideSpinner = () => emailSpinner?.classList.add("hidden");

  twoStepFormEmailInput.addEventListener("focusout", () => {
    if (window.EmailGuard?.isPending?.(twoStepFormEmailInput)) showSpinner();
  });
  twoStepFormEmailInput.addEventListener("input", hideSpinner);
  twoStepFormEmailInput.addEventListener("emailguard:result", () => {
    if (!window.EmailGuard?.isPending?.(twoStepFormEmailInput)) hideSpinner();
    maybeCheckEmailAvailability(); // Zeruh подтвердил → запускаем проверку занятости
    validateInputs("#4ED937", "#ff5530");
  });
  // Фолбэк, если email-guard не загрузился: запустить занятость на blur.
  twoStepFormEmailInput.addEventListener(
    "focusout",
    maybeCheckEmailAvailability,
  );

  // Перевести уже показанное сообщение «занято» при смене языка сайта
  // (язык меняется через атрибут <html lang>, у алерта нет data-translate).
  new MutationObserver(() => {
    updateEmailAlert();
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"],
  });

  // Фейловер: если на blur API не ответил за таймаут (fail-open включил кнопку),
  // добиваем проверку занятости почты на клике «Далее». Регистрируется раньше
  // глобального advance-хендлера → при блоке его перебивает.
  const isDefinitive = (st) =>
    !!st && !st.pending && !st.errored && typeof st.available === "boolean";

  twoStepFormSecondStepBtn.addEventListener("click", async (e) => {
    const needEmail =
      regex.test(twoStepFormEmailInput.value.trim()) &&
      emailDeliverableOk() &&
      !isDefinitive(getEmailStatus(currentEmail()));

    if (!needEmail) return; // вердикт есть → глобальный хендлер пускает дальше

    // Однозначного ответа нет → придержать переход и перечекнуть.
    e.preventDefault();
    e.stopImmediatePropagation();
    validateInputs("#4ED937", "#ff5530"); // показать pending
    await checkEmailAvailability(currentEmail());
    validateInputs("#4ED937", "#ff5530"); // обновить алерт/кнопку по вердикту

    const emailTaken = getEmailStatus(currentEmail())?.available === false;
    if (!emailTaken) {
      // свободно или снова не дозвонились (fail-open) → переходим
      initialStep++;
      showStep(initialStep);
    }
    // занято → остаёмся на шаге: алерт показан, кнопка станет disabled
  });

  // Show password
  const passwordShowBtn = twoStepFormSecondStep.querySelector(
    ".two-step-password-show-btn",
  );
  passwordShowBtn.addEventListener("click", () => {
    let img = passwordShowBtn.querySelector("img");
    if (twoStepFormPasswordInput.type === "password") {
      twoStepFormPasswordInput.type = "text";
      img.setAttribute("src", "./img/twoStepFormImg/password-hide-icon.svg");
    } else {
      twoStepFormPasswordInput.type = "password";
      img.setAttribute("src", "./img/twoStepFormImg/password-show-icon.svg");
    }
  });
}

const validateStringInput = (input) => {
  return input.trim().replace(/\s+/g, " ");
};

// | STEP 3 -- FIRST NAME, LAST NAME, DATE, GENDER
const twoStepFormThirdStep = document.querySelector(".two-step-form-step-3");
if (twoStepFormThirdStep) {
  const firstName = twoStepFormThirdStep.querySelector(
    ".two-step-first-name-input",
  );
  const lastName = twoStepFormThirdStep.querySelector(
    ".two-step-last-name-input",
  );
  const twoStepBirthdayInput = twoStepFormThirdStep.querySelector(
    ".two-step-birthday-input",
  );

  const twoStepBirthdayAlert = document.querySelector(
    ".two-step-birthday-alert",
  );
  const twoStepBirthdayAlertInvalid = document.querySelector(
    ".two-step-birthday-alert-invalid",
  );

  const nextBtn = twoStepFormThirdStep.querySelector(".next-step-btn");
  const btnOverlap = twoStepFormThirdStep.querySelector(".disable-overlap");

  let isValidDate;
  let isValidAge;

  const calendar = flatpickr(twoStepBirthdayInput, {
    allowInput: true,
    dateFormat: "d.m.Y",
    maxDate: "today",
    disableMobile: true,
  });

  document
    .querySelector(".two-step-birthday-btn")
    .addEventListener("click", () => {
      calendar.open();
    });

  twoStepBirthdayInput.addEventListener("focus", () => {
    calendar.close();
  });

  twoStepBirthdayInput.addEventListener("input", function (e) {
    let value = twoStepBirthdayInput.value.replace(/\D/g, ""); // Remove non-numeric characters

    if (value.length > 8) value = value.slice(0, 8); // Limit input to 8 digits

    let formattedValue = "";

    if (value.length > 0) formattedValue += value.slice(0, 2);
    if (value.length > 2) formattedValue += "." + value.slice(2, 4);
    if (value.length > 4) formattedValue += "." + value.slice(4, 8);

    twoStepBirthdayInput.value = formattedValue;

    if (value.length >= 8) {
      calendar.setDate(formattedValue);
      calendar.close();
    }

    if (formattedValue.length === 10) {
      // Validate when input is fully entered
      const dateParts = formattedValue.split(".");
      const day = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10);
      const year = parseInt(dateParts[2], 10);

      // Convert to ISO format (YYYY-MM-DD)
      const isoDate = convertToISODate(year, month, day);
      twoStepFormData.birthday = isoDate;

      function convertToISODate(year, month, day) {
        const date = new Date(Date.UTC(year, month - 1, day));
        return date.toISOString().split("T")[0];
      }

      const currentYear = new Date().getFullYear(); // ✅ Added to get the current year for validation
      isValidDate = validateDate(day, month, year);

      // ✅ If the year is in the future, mark as an invalid date but prevent age validation
      if (year > currentYear) {
        isValidDate = false;
        isValidAge = true; // ✅ Prevents the "must be 18+" error when year > current year
      } else {
        isValidAge = validateAge(year, month, day); // ✅ Only validate age if date is valid and in the past
      }

      // ✅ Adjusted error display logic
      if (!isValidDate) {
        twoStepBirthdayAlertInvalid.classList.remove("hidden");
        twoStepBirthdayAlert.classList.add("hidden");
      } else if (!isValidAge) {
        twoStepBirthdayAlertInvalid.classList.add("hidden");
        twoStepBirthdayAlert.classList.remove("hidden");
      } else {
        twoStepBirthdayAlertInvalid.classList.add("hidden");
        twoStepBirthdayAlert.classList.add("hidden");
      }
    }
  });

  function validateDate(day, month, year) {
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }

  function validateAge(year, month, day) {
    const currentDate = new Date();
    const birthDate = new Date(year, month - 1, day);

    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const m = currentDate.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && currentDate.getDate() < birthDate.getDate())) {
      age--; // Если еще не был день рождения в текущем году
    }

    return age >= 18; // Проверяем, что возраст 18 или больше
  }

  // Validation
  nextBtn.disabled = true;

  const inputValidations = [
    {
      input: firstName,
      condition: (value) => value !== "", // First name must not be empty
    },
    {
      input: lastName,
      condition: (value) => value !== "", // Last name must not be empty
    },
    {
      input: twoStepBirthdayInput,
      condition: (value) => value.length === 10 && isValidDate && isValidAge, // Valid date (YYYY-MM-DD)
    },
  ];

  const validateInputs = () => {
    let validCount = 0; // Counter for valid inputs
    const totalInputs = inputValidations.length;

    // Validate each input
    inputValidations.forEach(({ input, condition }) => {
      const isValid = condition(input.value.trim()); // Check validity
      input.style.color = isValid ? "#41D937" : "#ff0000"; // Apply text color
      if (isValid) validCount++;
    });

    // Calculate and update button overlap position
    const percentage = (validCount / totalInputs) * 100;
    btnOverlap.style.left = `${percentage}%`;

    if (percentage === 100) {
      nextBtn.disabled = false;
      twoStepFormData.firstName = validateStringInput(firstName.value);
      twoStepFormData.lastName = validateStringInput(lastName.value);

      twoStepFormData.gender = document.querySelector(
        'input[name="gender"]:checked',
      ).value;
    } else {
      nextBtn.disabled = true;
    }
  };

  // Attach focusout event listener to each input
  inputValidations.forEach(({ input }) => {
    input.addEventListener("focusout", validateInputs);
  });
  inputValidations.forEach(({ input }) => {
    input.addEventListener("input", () => {
      validateInputs();
    });
  });

  // GENDER CHECKBOXES
  const genderCheckboxInputs = document.querySelectorAll(
    ".gender-checkbox-input",
  );

  genderCheckboxInputs.forEach((input) => {
    if (input) {
      input.addEventListener("change", () => {
        twoStepFormData.gender = input.value;
      });
    }
  });
}

// | POSTAL CODE / STATE — режим поля по стране (см. GB_DOCS/postal) ───────────
// Текущий режим поля Postal Code: "hidden" | "optional" | "required".
export let postalCodeMode = "required";

// Применяет режим поля Postal Code к DOM в зависимости от страны.
// Через querySelector — чтобы безопасно вызываться до const-объявлений элементов.
export const applyPostalCodeMode = (countryCode) => {
  postalCodeMode = getPostalCodeMode(countryCode);

  const wrapper = document.querySelector(".two-step-zipcode-wrapper");
  const input = document.querySelector(".two-step-zipcode-input");
  const label = document.querySelector(".two-step-zipcode-label");
  const info = document.querySelector(".two-step-zipcode-info");
  const tooltip = document.querySelector(".two-step-zipcode-tooltip");
  if (!wrapper || !input || !label) return;

  tooltip?.classList.remove("is-visible");
  info?.setAttribute("aria-expanded", "false");

  if (postalCodeMode === "hidden") {
    wrapper.classList.add("hidden");
    wrapper.classList.remove("has-info");
    info?.classList.add("hidden");
    label.classList.remove("two-step-required-label");
    input.value = "";
    twoStepFormData.zipCode = "";
  } else if (postalCodeMode === "optional") {
    wrapper.classList.remove("hidden");
    wrapper.classList.add("has-info");
    info?.classList.remove("hidden");
    label.classList.remove("two-step-required-label");
  } else {
    wrapper.classList.remove("hidden");
    wrapper.classList.remove("has-info");
    info?.classList.add("hidden");
    label.classList.add("two-step-required-label");
  }
};

// Показывает поле State/Province только для стран из stateProvinceCountries.
// Поле необязательное — сабмит не блокирует.
export const applyStateField = (countryCode) => {
  const wrapper = document.querySelector(".two-step-state-wrapper");
  const input = document.querySelector(".two-step-state-input");
  const label = document.querySelector(".two-step-state-label");
  if (!wrapper || !input) return;

  if (hasStateField(countryCode)) {
    wrapper.classList.remove("hidden");
  } else {
    wrapper.classList.add("hidden");
    input.value = "";
    label?.classList.remove("active");
    twoStepFormData.state = "";
  }
};

// | STEP 4 -- FIRST NAME, LAST NAME, DATE, GENDER
const twoStepFormFourthStep = document.querySelector(".two-step-form-step-4");
if (twoStepFormFourthStep) {
  // ? Country
  const twoStepAppliedCountryInput = twoStepFormFourthStep.querySelector(
    ".two-step-country-input",
  );
  const twoStepAppliedCountryImage = twoStepFormFourthStep.querySelector(
    ".two-step-country-image",
  );
  const twoStepCountryWrapper = twoStepFormFourthStep.querySelector(
    ".two-step-country-wrapper",
  );
  const twoStepCountryButton = twoStepFormFourthStep.querySelector(
    ".two-step-country-button",
  );
  const twoStepCountryDropdown = twoStepFormFourthStep.querySelector(
    ".two-step-country-drowpdown",
  );
  const twoStepCountryList = twoStepCountryDropdown.querySelector(
    ".two-step-country-list",
  );
  const twoStepCountryListItems = twoStepCountryDropdown.querySelectorAll(
    ".two-step-country-list-item",
  );
  const twoStepCountrySearchInput = twoStepCountryDropdown.querySelector(
    ".two-step-country-search-input",
  );

  const headerlogoFlag = document.querySelector(".header-logo-flag");

  // Dropdown visibility toggle
  twoStepCountryButton.addEventListener("click", () => {
    twoStepCountryDropdown.classList.toggle("hidden");
  });
  document.addEventListener("click", (event) => {
    if (!twoStepCountryWrapper.contains(event.target)) {
      // If the click is outside the dropdown and wrapper, hide the dropdown
      twoStepCountryDropdown.classList.add("hidden");
    }
  });

  // Choosing country from dropdown
  twoStepCountryList.addEventListener("click", (event) => {
    const item = event.target.closest(".two-step-country-list-item"); // Replace with your item class or selector
    if (item) {
      const countryCode = item.getAttribute("countryCode");
      const name = item.querySelector("span")?.textContent || "No name found";
      const imageUrl = item.querySelector("img")?.src || "No image found";
      twoStepAppliedCountryInput.value = name;
      twoStepAppliedCountryImage.src = imageUrl;
      twoStepAppliedCountryImage.alt = name;
      twoStepCountryDropdown.classList.add("hidden");
      twoStepFormData.country = countryCode;
      // Postal/State: лейбл с примером, режим индекса и видимость State по стране.
      settingZipCodePlaceholder(countryCode);
      applyPostalCodeMode(countryCode);
      applyStateField(countryCode);
      validateInputs1("#4ED937", "#8726FF");
    }
  });

  // Apply detected country
  const applyDetectedCountry = async () => {
    const locationData = geoData;
    settingZipCodePlaceholder(locationData.countryCode);
    applyPostalCodeMode(locationData.countryCode);
    applyStateField(locationData.countryCode);

    const mathedCountry = countryFlags.find((country) => {
      return (
        country.slug.toLowerCase() === locationData.countryCode.toLowerCase()
      );
    });
    if (mathedCountry) {
      twoStepAppliedCountryInput.value = mathedCountry.name;
      twoStepAppliedCountryImage.src = `./img/flags/${mathedCountry.slug}.svg`;
      twoStepAppliedCountryImage.alt = mathedCountry.name;
      headerlogoFlag.src = `./img/flags/${mathedCountry.slug}.svg`;
      headerlogoFlag.alt = mathedCountry.name;
      headerlogoFlag.classList.remove("hidden");
      twoStepFormData.country = mathedCountry.slug.toUpperCase();
    }
  };

  applyDetectedCountry();
  // Adding countries to dropdown

  const renderCountries = (filter = "") => {
    twoStepCountryList.innerHTML = ""; // Clear existing list

    // Filter countries based on the search input
    const filteredCountries = countryFlags.filter((country) =>
      country.name.toLowerCase().includes(filter.toLowerCase()),
    );

    // Render each country in the filtered list
    filteredCountries.forEach((country) => {
      const listItem = document.createElement("li");
      listItem.setAttribute("countryCode", country.slug.toLocaleUpperCase());
      listItem.className =
        "two-step-country-list-item cursor-pointer flex items-center gap-[5px] border-b border-[#755EEB]/30 py-[10px]";

      const img = document.createElement("img");
      img.className =
        "pointer-events-none h-6 w-6 rounded-full overflow-hidden object-contain";
      img.width = 24;
      img.height = 24;
      img.src = `./img/flags/${country.slug}.svg`;
      img.alt = country.name;

      const span = document.createElement("span");
      span.className =
        "pointer-events-none text-base font-bold tracking-[-0.02em] text-[#1c1c1c]";
      span.textContent = country.name;

      listItem.appendChild(img);
      listItem.appendChild(span);
      twoStepCountryList.appendChild(listItem);
    });

    // If no countries match the search, show a message
    if (filteredCountries.length === 0) {
      const noResult = document.createElement("li");
      noResult.className = "text-gray-500 py-2";
      noResult.textContent = "No countries found.";
      twoStepCountryList.appendChild(noResult);
    }
  };

  // Event listener for the search input
  twoStepCountrySearchInput.addEventListener("input", (e) => {
    renderCountries(e.target.value);
  });

  // Initial render
  renderCountries();

  // ? VALIDATION
  const submitBtn = twoStepFormFourthStep.querySelector(".submit-btn");
  const btnOverlap = twoStepFormFourthStep.querySelector(".disable-overlap");
  const twoStepPhoneInput = twoStepFormFourthStep.querySelector(
    ".two-step-phone-input",
  );
  const twoStepCityInput = twoStepFormFourthStep.querySelector(
    ".two-step-city-input",
  );
  const twoStepStreetInput = twoStepFormFourthStep.querySelector(
    ".two-step-street-input",
  );
  const twoStepHouseInput = twoStepFormFourthStep.querySelector(
    ".two-step-house-input",
  );
  const twoStepApartmentInput = twoStepFormFourthStep.querySelector(
    ".two-step-apartment-input",
  );
  const twoStepZipcodeInput = twoStepFormFourthStep.querySelector(
    ".two-step-zipcode-input",
  );

  // State/Province — обычный текстовый инпут (необязательный). Видимость по стране
  // управляет applyStateField(); сюда только сохраняем значение.
  const twoStepStateInput = twoStepFormFourthStep.querySelector(
    ".two-step-state-input",
  );
  twoStepStateInput.addEventListener("input", () => {
    twoStepFormData.state = validateStringInput(twoStepStateInput.value);
  });

  // Авто-формат индекса по стране (вставка разделителей, верхний регистр).
  twoStepZipcodeInput.addEventListener("input", () => {
    const formatted = formatPostalCode(
      twoStepFormData.country,
      twoStepZipcodeInput.value,
    );
    if (formatted !== twoStepZipcodeInput.value) {
      twoStepZipcodeInput.value = formatted;
      twoStepZipcodeInput.setSelectionRange(formatted.length, formatted.length);
    }
  });

  twoStepPhoneInput.addEventListener("input", function (e) {
    const countryData = twoStepiti.getSelectedCountryData();
    const countryCode = countryData.iso2 ? countryData.iso2.toUpperCase() : "";
    const dialCode = countryData.dialCode;
    const maxDigits = getMaxDigitsForCountry(countryCode);
    const raw = stripDuplicatedDialCode(
      e.target.value.replace(/\D/g, ""),
      countryCode,
      dialCode,
    );
    const digits = raw.slice(0, maxDigits);
    e.target.value = formatByPlaceholder(
      digits,
      e.target.getAttribute("placeholder"),
    );
    e.target.setSelectionRange(e.target.value.length, e.target.value.length);
  });

  submitBtn.disabled = true;

  // ── Проверка занятости телефона (same-origin API, fail-open) ──
  const currentPhoneE164 = () => {
    const dialCode = twoStepiti.getSelectedCountryData().dialCode;
    const digits = twoStepPhoneInput.value.trim().replace(/\D/g, "");
    return `+${dialCode}${digits}`;
  };
  const isPhoneFormatValid = () => twoStepiti.isValidNumber();

  // ── phone-guard (IPQS): реальность/живость номера, fail-open ──
  // Сниппет читает номер из data-атрибутов поля. Кормим ТОЛЬКО при валидном
  // формате (separateDialCode → код страны вне инпута, сниппет сам e164 не соберёт).
  const syncPhoneGuardData = () => {
    if (isPhoneFormatValid()) {
      const { dialCode, iso2 } = twoStepiti.getSelectedCountryData();
      const digits = twoStepPhoneInput.value.trim().replace(/\D/g, "");
      twoStepPhoneInput.dataset.pgE164 = `${dialCode}${digits}`; // цифры без "+"
      twoStepPhoneInput.dataset.pgCountry = (iso2 || "").toUpperCase();
    } else {
      delete twoStepPhoneInput.dataset.pgE164;
      delete twoStepPhoneInput.dataset.pgCountry;
    }
  };

  // IPQS подтвердил реальность? Нет сниппета → fail-open (true).
  const isPhoneGuardValid = () =>
    !window.PhoneGuard || window.PhoneGuard.isValid(twoStepPhoneInput);
  // Формат ок, но вердикта IPQS ещё нет (ждём).
  const isPhoneGuardPending = () =>
    !!window.PhoneGuard && window.PhoneGuard.isPending(twoStepPhoneInput);

  // Спиннер IPQS вешаем на явный флаг (set на blur, clear на phoneguard:result),
  // НЕ на isPending — он true уже во время ввода (см. LANDING_INTEGRATION §5).
  let isIpqsChecking = false;

  // Проверка занятости ещё идёт (формат ок, но вердикта нет).
  const isPhonePending = () => {
    if (!isPhoneFormatValid()) return false;
    const st = getPhoneStatus(currentPhoneE164());
    return !st || st.pending;
  };

  // Реально летит запрос (IPQS или занятость) — для спиннера.
  const isPhoneChecking = () => {
    if (!isPhoneFormatValid()) return false;
    if (isIpqsChecking) return true;
    const st = getPhoneStatus(currentPhoneE164());
    return !!st && st.pending;
  };

  // Полная валидность для гейта: формат → IPQS → занятость (все три должны пройти).
  // IPQS: pending → false (ждём вердикт); valid:false/active:false → false (блок).
  // Занятость: нет записи/pending → false (ждём); errored → fail-open; занят → false.
  const isPhoneFieldValid = () => {
    if (!isPhoneFormatValid()) return false;
    if (isPhoneGuardPending()) return false; // ждём вердикт IPQS
    if (!isPhoneGuardValid()) return false; // valid:false/active:false → блок
    const st = getPhoneStatus(currentPhoneE164());
    if (!st || st.pending) return false;
    if (st.errored) return true;
    return st.available === true;
  };

  const phoneSpinnerEl = twoStepFormFourthStep.querySelector(
    ".two-step-phone-spinner",
  );
  const updatePhoneSpinner = () => {
    if (!phoneSpinnerEl) return;
    phoneSpinnerEl.classList.toggle("hidden", !isPhoneChecking());
  };

  // Сообщение «номер нельзя использовать» — только при однозначном «занят».
  const phoneAlertEl = twoStepFormFourthStep.querySelector(
    ".two-step-phone-alert",
  );
  const updatePhoneAlert = () => {
    if (!phoneAlertEl) return;
    const st = getPhoneStatus(currentPhoneE164());
    const taken =
      isPhoneFormatValid() &&
      st &&
      !st.pending &&
      !st.errored &&
      st.available === false;
    if (taken) {
      const lang =
        document.documentElement.getAttribute("lang") ||
        localStorage.getItem("preferredLanguage") ||
        "en";
      phoneAlertEl.textContent = phoneTakenMessage(lang);
      phoneAlertEl.classList.remove("hidden");
    } else {
      phoneAlertEl.classList.add("hidden");
    }
  };
  const isPhoneDefinitive = (st) =>
    !!st && !st.pending && !st.errored && typeof st.available === "boolean";

  // Перевести показанное сообщение «занято» при смене языка сайта.
  // Плюс: если IPQS-хинт показан (blocked) — перепрогнать verify, чтобы сниппет
  // перерисовал свой .pg-hint на новом языке.
  new MutationObserver(() => {
    updatePhoneAlert();
    if (
      window.PhoneGuard &&
      twoStepPhoneInput.getAttribute("data-pg-state") === "blocked"
    ) {
      window.PhoneGuard.verify(twoStepPhoneInput);
    }
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"],
  });

  const inputValidations1 = [
    {
      input: twoStepPhoneInput,
      condition: () => isPhoneFieldValid(),
    },
    {
      input: twoStepCityInput,
      condition: (value) => value !== "",
    },
    {
      input: twoStepStreetInput,
      condition: (value) => value !== "",
    },
    {
      input: twoStepHouseInput,
      condition: (value) => value !== "",
    },
    {
      // REQUIRED — должно совпадать с форматом страны; OPTIONAL/HIDDEN — не блокирует.
      input: twoStepZipcodeInput,
      condition: (value) =>
        postalCodeMode !== "required" ||
        validatePostalCodeFormat(twoStepFormData.country, value),
    },
  ];

  const validateInputs1 = (validColor, invalidColor) => {
    let validCount = 0;
    const totalInputs = inputValidations1.length;

    let twoStepCode = twoStepiti.getSelectedCountryData().dialCode;
    let twoStepPhoneNumber = twoStepPhoneInput.value.trim();

    let sanitizedPhoneNumber = twoStepPhoneNumber.replace(/\D/g, "");
    let fullPhoneNumber = `${twoStepCode}${sanitizedPhoneNumber}`;

    // Validate each input
    inputValidations1.forEach(({ input, condition }) => {
      const isValid = condition(input.value.trim()); // Check validity
      // Телефон во время проверки (IPQS или занятость) — нейтральный цвет, не красный.
      if (input === twoStepPhoneInput && (isPhonePending() || isIpqsChecking)) {
        input.style.color = "#8726FF";
      } else {
        input.style.color = isValid ? validColor : invalidColor; // Apply text color
      }
      if (isValid) validCount++;
    });

    updatePhoneAlert();
    updatePhoneSpinner();

    // Calculate and update button overlap position
    const percentage = (validCount / totalInputs) * 100;
    btnOverlap.style.left = `${percentage}%`;

    // If phone number is valid, log the full phone number

    if (percentage === 100) {
      submitBtn.disabled = false;
      twoStepFormData.city = validateStringInput(twoStepCityInput.value);
      twoStepFormData.street = validateStringInput(twoStepStreetInput.value);
      twoStepFormData.houseNumber = validateStringInput(twoStepHouseInput.value);
      twoStepFormData.apartment = validateStringInput(twoStepApartmentInput.value);
      twoStepFormData.zipCode = validateStringInput(twoStepZipcodeInput.value);
      if (twoStepPhoneInput.value.trim() !== "" && twoStepiti.isValidNumber()) {
        twoStepFormData.phone = fullPhoneNumber;
      }
    } else {
      submitBtn.disabled = true;
    }
  };

  inputValidations1.forEach(({ input }) => {
    input.addEventListener("focusout", validateInputs1("#4ED937", "#ff5530"));
  });
  inputValidations1.forEach(({ input }) => {
    input.addEventListener("input", () => {
      validateInputs1("#4ED937", "#8726FF");
      input.style.color = "#8726FF";
    });
  });
  twoStepPhoneInput.addEventListener("countrychange", () => {
    twoStepPhoneInput.value = "";
    syncPhoneGuardData(); // номер очищен → снять data-атрибуты IPQS
    validateInputs1("#4ED937", "#8726FF");
  });

  // Телефон: на blur запускаем IPQS + проверку занятости, на вердикт — пересчёт кнопки.
  twoStepPhoneInput.addEventListener("focusout", () => {
    syncPhoneGuardData(); // до того как сниппет прочтёт номер на blur
    if (isPhoneFormatValid()) {
      if (isPhoneGuardPending()) isIpqsChecking = true; // спиннер на время IPQS
      checkPhoneAvailability(currentPhoneE164()).then(() =>
        validateInputs1("#4ED937", "#ff5530"),
      );
    }
    validateInputs1("#4ED937", "#ff5530"); // мгновенно отразить pending/спиннер
  });
  // Значение сменилось → запись null → спиннер гаснет.
  twoStepPhoneInput.addEventListener("input", () => {
    syncPhoneGuardData();
    updatePhoneSpinner();
  });

  // IPQS вердикт приходит асинхронно — гасим флаг спиннера и пересчитываем гейт/цвет.
  twoStepPhoneInput.addEventListener("phoneguard:result", () => {
    isIpqsChecking = false;
    validateInputs1("#4ED937", "#ff5530");
  });

  // Postal Code hint — тап на мобилке (на десктопе тултип по hover из CSS).
  const zipcodeInfoBtn = twoStepFormFourthStep.querySelector(
    ".two-step-zipcode-info",
  );
  const zipcodeTooltip = twoStepFormFourthStep.querySelector(
    ".two-step-zipcode-tooltip",
  );
  if (zipcodeInfoBtn && zipcodeTooltip) {
    zipcodeInfoBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = zipcodeTooltip.classList.toggle("is-visible");
      zipcodeInfoBtn.setAttribute("aria-expanded", String(isOpen));
    });
    document.addEventListener("click", (e) => {
      if (!zipcodeInfoBtn.contains(e.target)) {
        zipcodeTooltip.classList.remove("is-visible");
        zipcodeInfoBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Фейловер: если на blur API не ответил за таймаут (fail-open включил кнопку),
  // добиваем проверку занятости телефона на сабмите формы — ниже в обработчике submit.
  twoStepFormFourthStep._phoneAvail = {
    currentPhoneE164,
    isPhoneFormatValid,
    isPhoneDefinitive,
    updatePhoneAlert,
    updatePhoneSpinner,
  };
}

// | CHANGING STEPS
const nextStepBtn = document.querySelectorAll(".next-step-btn");
const headerbackBtn = document.querySelector(".two-step-header-back-btn");
const twoStepFormSteps = document.querySelectorAll(".two-step-form-step");

let initialStep = 1;

const showStep = (step) => {
  twoStepFormSteps.forEach((stepWrapper) => {
    stepWrapper.classList.remove("is-active");
    document
      .querySelector(`.two-step-form-step-${step}`)
      .classList.add("is-active");
  });
  const circles = document.querySelectorAll(".two-step-progress-circle");
  circles.forEach((circle, index) => {
    if (index < step) {
      circle.classList.add("active"); // Mark current and previous steps as active
    } else {
      circle.classList.remove("active"); // Remove active class from subsequent steps
    }
  });
  if (step > 1) {
    headerbackBtn.classList.add("is-visible");
  } else {
    headerbackBtn.classList.remove("is-visible");
  }
};
// showStep(3);

nextStepBtn.forEach((btn) => {
  if (btn) {
    btn.addEventListener("click", () => {
      initialStep++;
      showStep(initialStep);
    });
  }
});

if (headerbackBtn) {
  headerbackBtn.addEventListener("click", () => {
    initialStep--;
    showStep(initialStep);
  });
}

// | SUBMITTING FORM
const twoStepFormMain = document.querySelector(".two-step-form");
twoStepFormData.lang = localStorage.getItem("preferredLanguage");

let cid = getUrlParameter("cid");
let partner = getUrlParameter("partner");
let offer = getUrlParameter("offer");

twoStepFormMain.addEventListener("submit", async (e) => {
  e.preventDefault();

  twoStepFormData.lang = localStorage.getItem("preferredLanguage");

  const twoStepSubmitBtn = twoStepFormMain.querySelector(".submit-btn");
  const btnLoader = twoStepSubmitBtn.querySelector(
    ".two-step-submit-btn-loader",
  );
  const btnIcon = twoStepSubmitBtn.querySelector(".two-step-submit-btn-icon");
  const btnText = twoStepSubmitBtn.querySelector(".two-step-submit-btn-text");
  btnIcon.classList.add("hidden");
  btnText.classList.add("hidden");
  btnLoader.classList.remove("hidden");
  twoStepSubmitBtn.disabled = true;

  let {
    street,
    houseNumber,
    apartment,
    birthday,
    bonus,
    city,
    state,
    country,
    currency,
    email,
    firstName,
    gender,
    lastName,
    password,
    phone,
    promocode,
    zipCode,
    lang,
  } = twoStepFormData;

  console.log(twoStepFormData);

  // Фейловер занятости телефона: добиваем проверку перед редиректом.
  // await мгновенен, если вердикт уже в кэше (blur); иначе ждёт ≤1.5с. fail-open:
  // блокируем ТОЛЬКО при однозначном available:false; ошибка/таймаут → пускаем.
  // (phone = `${dialCode}${digits}` без "+" → для API добавляем "+".)
  if (phone) {
    const verdict = await checkPhoneAvailability(`+${phone}`);
    if (verdict && verdict.available === false) {
      btnLoader.classList.add("hidden");
      btnIcon.classList.remove("hidden");
      btnText.classList.remove("hidden");
      twoStepSubmitBtn.disabled = false;
      const phoneAvail =
        document.querySelector(".two-step-form-step-4")?._phoneAvail;
      phoneAvail?.updatePhoneAlert?.();
      phoneAvail?.updatePhoneSpinner?.();
      return; // занято — не регистрируем
    }
  }

  // email-guard: теги качества почты (status/score/flags) в payload; "" если нет.
  const egTags =
    (window.EmailGuard && window.EmailGuard.tags && window.EmailGuard.tags()) ||
    "";

  // phone-guard: теги качества телефона (valid/active/fraud_score/line_type/flags); "" если нет.
  const pgTags =
    (window.PhoneGuard && window.PhoneGuard.tags && window.PhoneGuard.tags()) ||
    "";

  window.location.href =
    `https://${newDomain}/api/register?env=prod&type=email&currency=${currency}&email=${encodeURIComponent(
      email,
    )}&password=${encodeURIComponent(password)}&phone=${phone}&bonus=${bonus}${
      promocode ? "&promocode=" + encodeURIComponent(promocode) : ""
    }&lang=${lang}${firstName ? "&f_name=" + encodeURIComponent(firstName) : ""}${
      lastName ? "&l_name=" + encodeURIComponent(lastName) : ""
    }${birthday ? "&birth=" + birthday : ""}${gender ? "&gender=" + gender : ""}${
      country ? "&country=" + country : ""
    }${state ? "&state=" + encodeURIComponent(state) : ""}${
      city ? "&city=" + encodeURIComponent(city) : ""
    }${zipCode ? "&postal=" + encodeURIComponent(zipCode) : ""}${
      street ? "&street=" + encodeURIComponent(street) : ""
    }${houseNumber ? "&house_number=" + encodeURIComponent(houseNumber) : ""}${
      apartment ? "&apartment=" + encodeURIComponent(apartment) : ""
    }${cid ? "&cid=" + cid : ""}${partner ? "&partner=" + partner : ""}${
      offer ? "&offer=" + offer : ""
    }` +
    egTags +
    pgTags;
  console.log(
    `https://${newDomain}/api/register?env=prod&type=email&currency=${currency}&email=${encodeURIComponent(
      email,
    )}&password=${encodeURIComponent(password)}&phone=${phone}&bonus=${bonus}${
      promocode ? "&promocode=" + encodeURIComponent(promocode) : ""
    }&lang=${lang}${
      firstName ? "&f_name=" + encodeURIComponent(firstName) : ""
    }${lastName ? "&l_name=" + encodeURIComponent(lastName) : ""}${
      birthday ? "&birth=" + birthday : ""
    }${gender ? "&gender=" + gender : ""}${
      country ? "&country=" + country : ""
    }${state ? "&state=" + encodeURIComponent(state) : ""}${
      city ? "&city=" + encodeURIComponent(city) : ""
    }${zipCode ? "&postal=" + encodeURIComponent(zipCode) : ""}${
      street ? "&street=" + encodeURIComponent(street) : ""
    }${houseNumber ? "&house_number=" + encodeURIComponent(houseNumber) : ""}${
      apartment ? "&apartment=" + encodeURIComponent(apartment) : ""
    }${cid ? "&cid=" + cid : ""}${partner ? "&partner=" + partner : ""}${
      offer ? "&offer=" + offer : ""
    }`,
  );
});

gsap.to(".preloader", { opacity: 0, duration: 0.25, delay: 0.5 });

// Closing modal

const twoStepModalCloseBtn = document.querySelector(
  ".two-step-modal-close-btn",
);
const twoStepFormInner = document.querySelector(".two-step-modal");
const twoStepDeclineInner = document.querySelector(".two-step-decline");
const twoStepKeepBtn = document.querySelector(".two-step-keep-btn");
const twoStepReturnBtn = document.querySelector(".two-step-return-btn");

if (twoStepModalCloseBtn) {
  twoStepModalCloseBtn.addEventListener("click", () => {
    twoStepFormInner.classList.add("hidden");
    twoStepDeclineInner.classList.remove("hidden");
  });
}

if (twoStepKeepBtn) {
  twoStepKeepBtn.addEventListener("click", () => {
    twoStepFormInner.classList.remove("hidden");
    twoStepDeclineInner.classList.add("hidden");
  });
}

if (twoStepReturnBtn) {
  twoStepReturnBtn.addEventListener("click", () => {
    document.querySelector(".two-step-overlay").classList.remove("is-open");
    twoStepFormInner.classList.remove("hidden");
    twoStepDeclineInner.classList.add("hidden");
    document.body.style.overflow = "visible";
  });
}
