import { countryFlags, countryCurrencyData } from "../public/data";
import { geoData } from "./geoLocation";
import { twoStepiti } from "./itiTelInput";
import { newDomain } from "./fetchingDomain";
import { getUrlParameter } from "./params";
import gsap from "gsap";
import { isValidPhoneNumber } from "libphonenumber-js";
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

const CDN = "https://3344112-img.b-cdn.net";

// Страховка к атрибутам в разметке: добиваем поля, которым autocomplete не
// проставлен (в том числе созданные скриптом — поиск стран у телефона).
// Уже заданное значение не трогаем: у пароля стоит new-password, и только этот
// токен отучает Chrome подставлять сохранённую пару логин+пароль — "off" он на
// паролях игнорирует.
document.querySelectorAll("input").forEach((input) => {
  if (!input.hasAttribute("autocomplete")) {
    input.setAttribute("autocomplete", "off");
  }
});

// | ЧИСТКА ПОЛЕЙ
// Браузер восстанавливает введённые значения при перезагрузке, а менеджер
// паролей сам подставляет сохранённую пару почта+пароль. В компьютерном клубе
// это значит, что следующий игрок докручивает до модалки и видит чужие данные.
// Атрибуты autocomplete в разметке закрывают подстановку, а здесь снимаем то,
// что браузер успел восстановить сам.
// :not([readonly]) выводит из-под чистки промокод из ссылки — ему readOnly
// проставляет promocodeCheck. Браузеру там восстанавливать нечего, значение
// всегда ставит скрипт.
const RESTORABLE_FIELDS = [
  ".two-step-form input[type='text']:not([readonly])",
  ".two-step-form input[type='email']:not([readonly])",
  ".two-step-form input[type='password']:not([readonly])",
  ".two-step-form input[type='tel']:not([readonly])",
].join(", ");

// Без промокода в ссылке поле остаётся редактируемым, под чистку попадает
// и оно. На load код из ссылки уже подставлен (promocodeCheck отработал на
// импорте), поэтому второй проход его пропускает — иначе стёрли бы своё же.
const clearFormFields = (keepPromocode = false) => {
  document.querySelectorAll(RESTORABLE_FIELDS).forEach((input) => {
    if (keepPromocode && input.classList.contains("two-step-promocode-input")) {
      return;
    }

    input.value = "";
  });
};

clearFormFields();

// Восстановление может случиться и после разбора модулей, поэтому повторяем на
// load.
window.addEventListener("load", () => clearFormFields(true), { once: true });

const PHONE_ONLY_COUNTRIES = [];
const hideEmail = false;
const isPhoneOnlyMode =
  PHONE_ONLY_COUNTRIES.includes(geoData.countryCode) || hideEmail;

if (isPhoneOnlyMode) {
  document.querySelector(".two-step-email-wrapper")?.classList.add("hidden");
  document
    .querySelector(".two-step-step2-title-default")
    ?.classList.add("hidden");
  document
    .querySelector(".two-step-step2-title-phone")
    ?.classList.remove("hidden");
}

// ? SOCIALS TWO STEP FORM

export let twoStepFormData = {
  bonus: "",
  promocode: "",
  email: "",
  password: "",
  country: "",
  currency: geoData.currency.code === "RUB" ? "USD" : geoData.currency.code,
  phone: "",
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
  const currencyEntry = countryCurrencyData.find(
    (entry) => entry.countryCurrency === currency,
  );

  if (exceptCurrencies.includes(currency)) {
    document.querySelectorAll(".two-step-bonus-percent").forEach((text) => {
      text.innerHTML = "100%";
    });
  } else {
    document.querySelectorAll(".two-step-bonus-percent").forEach((text) => {
      text.innerHTML = "200%";
    });
  }

  if (currencyEntry) {
    document.querySelectorAll(".bonus-total-amount").forEach((el) => {
      el.innerHTML = currencyEntry.amount;
    });
    document.querySelectorAll(".bonus-currency-symbol").forEach((el) => {
      el.innerHTML = currencyEntry.countryCurrencySymbol;
    });
    document.querySelectorAll(".two-step-bonus-spins").forEach((el) => {
      el.innerHTML = currencyEntry.spins;
    });
    document.querySelectorAll(".bonus-currency-symbol").forEach((el) => {
      el.innerHTML = currencyEntry.countryCurrency;
    });
  } else {
    document.querySelectorAll(".bonus-total-amount").forEach((el) => {
      el.innerHTML = "4500";
    });
    document.querySelectorAll(".bonus-currency-symbol").forEach((el) => {
      el.innerHTML = "€";
    });
    document.querySelectorAll(".two-step-bonus-spins").forEach((el) => {
      el.innerHTML = "200FS";
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
    twoStepFormSecondStep.querySelector(".submit-btn");

  const twoStepFormEmailInput = twoStepFormSecondStep.querySelector(
    ".two-step-email-input",
  );
  const twoStepFormPasswordInput = twoStepFormSecondStep.querySelector(
    ".two-step-password-input",
  );
  const twoStepFormPhoneInput = twoStepFormSecondStep.querySelector(
    ".two-step-phone-input",
  );
  const btnOverlap = twoStepFormSecondStepBtn.querySelector(".disable-overlap");

  const regex =
    /^(?!.*\.\.)[a-zA-Z0-9][a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]{0,62}[a-zA-Z0-9]@(?:\[(?:\d{1,3}\.){3}\d{1,3}\]|[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+)$/;

  const currentEmail = () => normalizeEmail(twoStepFormEmailInput.value);

  // Zeruh (email-guard) подтвердил доставляемость? Если сниппета нет — fail-open (true).
  const emailDeliverableOk = () =>
    !(window.EmailGuard && window.EmailGuard.isValid) ||
    window.EmailGuard.isValid(twoStepFormEmailInput);

  const isEmailFieldValid = () => {
    const v = twoStepFormEmailInput.value.trim();
    if (!regex.test(v)) return false;
    // 1) Zeruh: пока не подтвердил доставляемость — false (кнопка выключена).
    if (!emailDeliverableOk()) return false;
    // 2) Занятость (наш API): пока вердикта нет — false; ошибка → fail-open; занята → false.
    const st = getEmailStatus(currentEmail());
    if (!st || st.pending) return false;
    if (st.errored) return true;
    return st.available === true;
  };

  // Проверка занятости почты ещё идёт (формат ок + Zeruh ок, но вердикта занятости нет).
  const isEmailAvailPending = () => {
    if (isPhoneOnlyMode) return false;
    const v = twoStepFormEmailInput.value.trim();
    if (!regex.test(v) || !emailDeliverableOk()) return false;
    const st = getEmailStatus(currentEmail());
    return !st || st.pending;
  };

  // Запустить проверку занятости почты — только если формат ок и Zeruh не против.
  const maybeCheckEmailAvailability = () => {
    if (isPhoneOnlyMode) return;
    const v = twoStepFormEmailInput.value.trim();
    if (!regex.test(v) || !emailDeliverableOk()) return;
    checkEmailAvailability(currentEmail()).then(() =>
      validateInputs("#4ED937", "#ff5530"),
    );
  };

  // Сообщение «этот e-mail нельзя использовать» — только при однозначном «занята».
  const emailAlertEl = document.querySelector(".two-step-email-alert");
  const updateEmailAlert = () => {
    if (!emailAlertEl || isPhoneOnlyMode) return;
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

  const isPasswordFieldValid = () =>
    twoStepFormPasswordInput.value.trim().length >= 6;

  const currentPhoneE164 = () => {
    const dialCode = twoStepiti.getSelectedCountryData().dialCode;
    const digits = twoStepFormPhoneInput.value.trim().replace(/\D/g, "");
    return `+${dialCode}${digits}`;
  };

  const isPhoneFormatValid = () => {
    const countryCode = twoStepiti.getSelectedCountryData().iso2?.toUpperCase();
    const dialCode = twoStepiti.getSelectedCountryData().dialCode;
    const digits = twoStepFormPhoneInput.value.trim().replace(/\D/g, "");
    if (!digits || !countryCode) return false;
    return isValidPhoneNumber(`+${dialCode}${digits}`, countryCode);
  };

  // ? IPQS (phone-guard): кормим сниппет номером (E.164 + страна) из data-атрибутов.
  // Пишем ТОЛЬКО при валидном формате, чтобы не бить IPQS по неполному вводу.
  const syncPhoneGuardData = () => {
    if (isPhoneFormatValid()) {
      const { dialCode, iso2 } = twoStepiti.getSelectedCountryData();
      const digits = twoStepFormPhoneInput.value.trim().replace(/\D/g, "");
      twoStepFormPhoneInput.dataset.pgE164 = `${dialCode}${digits}`; // только цифры, без "+"
      twoStepFormPhoneInput.dataset.pgCountry = (iso2 || "").toUpperCase();
    } else {
      delete twoStepFormPhoneInput.dataset.pgE164;
      delete twoStepFormPhoneInput.dataset.pgCountry;
    }
  };

  // IPQS подтвердил реальность номера? Если сниппета нет — fail-open (true).
  const isPhoneGuardValid = () =>
    !window.PhoneGuard || window.PhoneGuard.isValid(twoStepFormPhoneInput);
  // Вердикта IPQS ещё нет (формат ок, но проверка не завершена) → ждём.
  const isPhoneGuardPending = () =>
    !!window.PhoneGuard && window.PhoneGuard.isPending(twoStepFormPhoneInput);

  // Проверка занятости ещё идёт (формат ок, но вердикта нет).
  const isPhonePending = () => {
    if (!isPhoneFormatValid()) return false;
    const st = getPhoneStatus(currentPhoneE164());
    return !st || st.pending;
  };

  // Спиннер IPQS: флаг ставится на blur (когда реально запускаем) и снимается на
  // phoneguard:result. НЕ вешать спиннер на isPending — он true уже во время ввода (§5).
  let isIpqsChecking = false;

  // Реально летит запрос (IPQS на blur или занятость pending) — для спиннера.
  const isPhoneChecking = () => {
    if (!isPhoneFormatValid()) return false;
    if (isIpqsChecking) return true;
    const st = getPhoneStatus(currentPhoneE164());
    return !!st && st.pending;
  };

  const phoneSpinnerEl = document.querySelector(".two-step-phone-spinner");
  const updatePhoneSpinner = () => {
    if (!phoneSpinnerEl) return;
    phoneSpinnerEl.classList.toggle("hidden", !isPhoneChecking());
  };

  // Полная валидность для гейтинга кнопки: формат ок И номер НЕ занят.
  // Пока проверка идёт / нет данных → false (кнопка выключена, проскочить нельзя).
  // Ошибка проверки (сеть/таймаут/4xx/5xx) → fail-open (не блокируем лид).
  const isPhoneFieldValid = () => {
    if (!isPhoneFormatValid()) return false;
    if (isPhoneGuardPending()) return false; // ждём вердикт IPQS
    if (!isPhoneGuardValid()) return false; // valid:false/active:false → блок
    const st = getPhoneStatus(currentPhoneE164());
    if (!st || st.pending) return false;
    if (st.errored) return true;
    return st.available === true;
  };

  // Сообщение «номер нельзя использовать» — показываем только при однозначном «занят».
  const phoneAlertEl = document.querySelector(".two-step-phone-alert");
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

  // Поля, из которых игрок уже уходил (blur). Пересчёт на вводе идёт с
  // нейтральным цветом и раньше красил им ВСЕ невалидные поля шага: печатаешь в
  // почте — уже покрасневший короткий пароль снова фиолетовый (и наоборот).
  // Теперь нейтральный цвет — только у поля, в котором сейчас печатают, и у
  // ещё не тронутых; тронутое невалидное поле остаётся красным.
  const touchedFields = new WeakSet();
  [twoStepFormPhoneInput, twoStepFormEmailInput, twoStepFormPasswordInput].forEach(
    (input) =>
      input?.addEventListener("focusout", () => touchedFields.add(input)),
  );
  const NEUTRAL_COLOR = "#8726FF";
  const ERROR_COLOR = "#ff5530";

  const validateInputs = (validColor, invalidColor) => {
    const fields = isPhoneOnlyMode
      ? [
          { input: twoStepFormPhoneInput, isValid: isPhoneFieldValid() },
          { input: twoStepFormPasswordInput, isValid: isPasswordFieldValid() },
        ]
      : [
          { input: twoStepFormPhoneInput, isValid: isPhoneFieldValid() },
          { input: twoStepFormEmailInput, isValid: isEmailFieldValid() },
          { input: twoStepFormPasswordInput, isValid: isPasswordFieldValid() },
        ];

    let validCount = 0;
    fields.forEach(({ input, isValid }) => {
      // Во время проверки (занятость или IPQS) — нейтральный цвет, не красный.
      const checkingAvail =
        (input === twoStepFormPhoneInput &&
          (isPhonePending() || isPhoneChecking())) ||
        (input === twoStepFormEmailInput && isEmailAvailPending());
      if (checkingAvail) {
        input.style.color = NEUTRAL_COLOR;
      } else if (isValid) {
        input.style.color = validColor;
      } else {
        const keepError =
          invalidColor === NEUTRAL_COLOR &&
          touchedFields.has(input) &&
          input !== document.activeElement;
        input.style.color = keepError ? ERROR_COLOR : invalidColor;
      }
      if (isValid) validCount++;
    });

    updatePhoneAlert();
    updatePhoneSpinner();
    updateEmailAlert();

    const percentage = (validCount / fields.length) * 100;
    btnOverlap.style.left = `${percentage}%`;

    if (percentage === 100) {
      const dialCode = twoStepiti.getSelectedCountryData().dialCode;
      const sanitizedPhone = twoStepFormPhoneInput.value.replace(/\D/g, "");
      twoStepFormData.phone = `${dialCode}${sanitizedPhone}`;
      twoStepFormData.password = twoStepFormPasswordInput.value;

      if (!isPhoneOnlyMode) {
        twoStepFormData.email = twoStepFormEmailInput.value;
      } else {
        twoStepFormData.email = "";
      }

      twoStepFormSecondStepBtn.disabled = false;
    } else {
      twoStepFormSecondStepBtn.disabled = true;
    }
  };

  twoStepFormSecondStepBtn.disabled = true;

  const attachListeners = (input) => {
    input.addEventListener("focusout", () =>
      validateInputs("#4ED937", "#ff5530"),
    );
    input.addEventListener("input", () => {
      input.style.color = "#8726FF";
      validateInputs("#4ED937", "#8726FF");
    });
  };

  // Телефон: на blur запускаем IPQS (сниппет сам, по data-атрибутам) + проверку
  // занятости, на вердикт — пересчёт кнопки.
  const triggerPhoneCheck = () => {
    syncPhoneGuardData(); // отдать сниппету номер до того, как он прочтёт на blur
    if (isPhoneGuardPending()) isIpqsChecking = true; // запустился IPQS → крутим спиннер
    if (isPhoneFormatValid()) {
      checkPhoneAvailability(currentPhoneE164()).then(() =>
        validateInputs("#4ED937", "#ff5530"),
      );
    }
    validateInputs("#4ED937", "#ff5530"); // мгновенно отразить pending/формат
  };
  twoStepFormPhoneInput.addEventListener("focusout", triggerPhoneCheck);
  twoStepFormPhoneInput.addEventListener("input", () => {
    syncPhoneGuardData();
    twoStepFormPhoneInput.style.color = "#8726FF";
    validateInputs("#4ED937", "#8726FF");
  });

  // Вердикт IPQS прилетел асинхронно → снять спиннер и пересчитать кнопку/рамку.
  twoStepFormPhoneInput.addEventListener("phoneguard:result", () => {
    isIpqsChecking = false;
    validateInputs("#4ED937", "#ff5530");
  });
  attachListeners(twoStepFormPasswordInput);
  if (!isPhoneOnlyMode) {
    attachListeners(twoStepFormEmailInput);

    // Проверка занятости почты (наш API) — запускаем ПОСЛЕ Zeruh.
    twoStepFormEmailInput.addEventListener("emailguard:result", () => {
      maybeCheckEmailAvailability(); // Zeruh подтвердил → запускаем проверку занятости
      validateInputs("#4ED937", "#ff5530");
    });
    // Фолбэк, если email-guard не загрузился: запустить занятость на blur.
    twoStepFormEmailInput.addEventListener(
      "focusout",
      maybeCheckEmailAvailability,
    );

    // ? EMAIL-GUARD (Zeruh): пересчёт кнопки по async-вердикту + спиннер проверки
    const emailSpinner = twoStepFormSecondStep.querySelector(
      ".two-step-email-spinner",
    );
    const hideSpinner = () => emailSpinner?.classList.add("hidden");

    // вердикт Zeruh прилетел асинхронно → убрать спиннер. Пересчёт делает
    // обработчик того же события выше, и делает его красным цветом ошибки.
    // Второго пересчёта тут быть не должно: он шёл нейтральным #8726FF и, как
    // более поздний слушатель, перекрашивал обратно уже покрасневшее поле —
    // некорректная почта после blur оставалась фиолетовой.
    twoStepFormEmailInput.addEventListener("emailguard:result", () => {
      if (!window.EmailGuard?.isPending?.(twoStepFormEmailInput)) hideSpinner();
    });
    // почта ушла в Zeruh (синтаксис ок, вердикта ещё нет) → показать спиннер
    twoStepFormEmailInput.addEventListener("focusout", () => {
      if (window.EmailGuard?.isPending?.(twoStepFormEmailInput)) {
        emailSpinner?.classList.remove("hidden");
      }
    });
    // правка поля → активной проверки нет, перезапустится на blur
    twoStepFormEmailInput.addEventListener("input", hideSpinner);
  }

  twoStepFormPhoneInput.addEventListener("countrychange", () => {
    syncPhoneGuardData();
    validateInputs("#4ED937", "#8726FF");
  });

  // Перевести уже показанные сообщения «занято» (телефон/почта) при смене языка
  // сайта (язык меняется через атрибут <html lang>, у алертов нет data-translate).
  new MutationObserver(() => {
    updatePhoneAlert();
    updateEmailAlert();
    // Перерисовать хинт IPQS на новом языке, если номер сейчас заблокирован.
    if (
      window.PhoneGuard &&
      twoStepFormPhoneInput.getAttribute("data-pg-state") === "blocked"
    ) {
      window.PhoneGuard.verify(twoStepFormPhoneInput);
    }
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"],
  });

  // Фейловер: если на blur API не ответил за таймаут (fail-open включил кнопку),
  // добиваем проверку занятости (телефон и/или почта) на клике «Создать
  // аккаунт». Пока проверка идёт, отправку формы придерживаем.
  const isDefinitive = (st) =>
    !!st && !st.pending && !st.errored && typeof st.available === "boolean";

  twoStepFormSecondStepBtn.addEventListener("click", async (e) => {
    const needPhone =
      isPhoneFormatValid() && !isDefinitive(getPhoneStatus(currentPhoneE164()));
    const needEmail =
      !isPhoneOnlyMode &&
      regex.test(twoStepFormEmailInput.value.trim()) &&
      emailDeliverableOk() &&
      !isDefinitive(getEmailStatus(currentEmail()));

    if (!needPhone && !needEmail) return; // вердикты есть → форма уходит на submit

    // Однозначного ответа нет → придержать переход и перечекнуть.
    e.preventDefault();
    e.stopImmediatePropagation();
    const tasks = [];
    if (needPhone) tasks.push(checkPhoneAvailability(currentPhoneE164()));
    if (needEmail) tasks.push(checkEmailAvailability(currentEmail()));
    validateInputs("#4ED937", "#ff5530"); // показать pending (спиннер телефона)
    await Promise.all(tasks);
    validateInputs("#4ED937", "#ff5530"); // обновить алерты/кнопку по вердиктам

    const phoneTaken = getPhoneStatus(currentPhoneE164())?.available === false;
    const emailTaken =
      !isPhoneOnlyMode && getEmailStatus(currentEmail())?.available === false;
    if (!phoneTaken && !emailTaken) {
      // ничего не занято (свободно или снова не дозвонились → fail-open) → регистрируем
      twoStepFormSecondStep.closest("form").requestSubmit();
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
      img.setAttribute(
        "src",
        CDN + "/graphic/landings/twoStepFormImages/password-hide-icon.svg",
      );
    } else {
      twoStepFormPasswordInput.type = "password";
      img.setAttribute(
        "src",
        CDN + "/graphic/landings/twoStepFormImages/password-show-icon.svg",
      );
    }
  });
}

const validateStringInput = (input) => {
  return input.trim().replace(/\s+/g, " ");
};

// | COUNTRY — поля выбора страны в форме нет, страну берём из гео: она уходит
// в /register и рисует флаг в шапке модалки.
const applyDetectedCountry = () => {
  const matchedCountry = countryFlags.find(
    (country) =>
      country.slug.toLowerCase() === geoData.countryCode.toLowerCase(),
  );
  if (!matchedCountry) return;

  twoStepFormData.country = matchedCountry.slug.toUpperCase();

  const headerLogoFlag = document.querySelector(".header-logo-flag");
  if (headerLogoFlag) {
    headerLogoFlag.src = CDN + `/graphic/flags/flag-${matchedCountry.slug}.svg`;
    headerLogoFlag.alt = matchedCountry.name;
    headerLogoFlag.classList.remove("hidden");
  }
};

applyDetectedCountry();

// | CHANGING STEPS
const nextStepBtn = document.querySelectorAll(".next-step-btn");
const headerbackBtn = document.querySelector(".two-step-header-back-btn");
const twoStepFormSteps = document.querySelectorAll(".two-step-form-step");

let initialStep = 1;

// Курсор ставим в первое НЕзаполненное поле открытого шага, иначе игрок
// сначала целится в инпут и только потом печатает.
// Что пропускаем:
//   readonly — промокод из ссылки, печатать там нечего;
//   radio/checkbox — выбор бонуса, печатать там нечего;
//   .iti__search-input — поиск стран у телефона, в DOM он идёт раньше самого
//   телефона, но полем формы не является;
//   .two-step-promocode-input — промокод на первом шаге пустой чаще всего
//   (его вводят вручную), и одной проверки на пустоту мало: фокус вставал бы
//   в него, хотя шаг про выбор бонуса;
//   невидимые (offsetParent === null) — скрытый промокод, скрытая почта в
//   режиме «только телефон»;
//   заполненные — по «Назад» и повторным переходам фокус вставал в уже
//   введённые данные и без нужды поднимал клавиатуру. Телефон читается как
//   пустой корректно: при separateDialCode код страны живёт вне value.
// Все поля шага заполнены — не фокусируем ничего.
const focusFirstFieldIn = (stepEl) => {
  const field = [
    ...(stepEl?.querySelectorAll(
      "input:not([type='hidden']):not([type='radio']):not([type='checkbox']):not([disabled]):not([readonly]):not(.iti__search-input):not(.two-step-promocode-input)",
    ) || []),
  ].find((el) => el.offsetParent !== null && el.value.trim() === "");

  // без rAF намеренно: showStep зовётся из обработчика клика, а на iOS Safari
  // клавиатура поднимается только внутри пользовательского жеста
  field?.focus({ preventScroll: true });
};

const focusFirstField = (step) =>
  focusFirstFieldIn(document.querySelector(`.two-step-form-step-${step}`));

// Для открытия модалки: шаг не обязательно первый — игрок мог закрыть форму
// на втором и вернуться, is-active к этому моменту уже проставлен.
export const focusActiveStep = () =>
  focusFirstFieldIn(document.querySelector(".two-step-form-step.is-active"));

// focus: false — для «Назад»: игрок возвращается на уже пройденный шаг, поля
// там заполнены, и автофокус на мобилке зря поднимал клавиатуру
const showStep = (step, { focus = true } = {}) => {
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

  if (focus) focusFirstField(step);
};

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
    showStep(initialStep, { focus: false });
  });
}

// | SUBMITTING FORM
const twoStepFormMain = document.querySelector(".two-step-form");
twoStepFormData.lang = localStorage.getItem("preferredLanguage");

let cid = getUrlParameter("cid");
let partner = getUrlParameter("partner");
let offer = getUrlParameter("offer");

twoStepFormMain.addEventListener("submit", (e) => {
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

  const { bonus, country, currency, email, password, phone, promocode, lang } =
    twoStepFormData;

  console.log(twoStepFormData);

  const type = isPhoneOnlyMode ? "phone" : "email";
  const emailParam = isPhoneOnlyMode
    ? ""
    : `&email=${encodeURIComponent(email)}`;

  const registerUrl = `https://${newDomain}/api/register?env=prod&type=${type}&currency=${currency}${emailParam}&password=${encodeURIComponent(
    password,
  )}&phone=${phone}&bonus=${bonus}${
    promocode ? "&promocode=" + encodeURIComponent(promocode) : ""
  }&lang=${lang}${country ? "&country=" + country : ""}${
    cid ? "&cid=" + cid : ""
  }${partner ? "&partner=" + partner : ""}${offer ? "&offer=" + offer : ""}`;

  console.log(registerUrl);
  window.location.href = registerUrl + (window.EmailGuard?.tags?.() || "");
});

gsap.to(".preloader", { opacity: 0, duration: 0.25, delay: 0.5 });

// Closing modal

const twoStepModalCloseBtn = document.querySelector(
  ".two-step-modal-close-btn",
);
const twoStepOverlay = document.querySelector(".two-step-overlay");
const twoStepFormInner = document.querySelector(".two-step-modal");
const twoStepDeclineInner = document.querySelector(".two-step-decline");
const twoStepKeepBtn = document.querySelector(".two-step-keep-btn");
const twoStepReturnBtn = document.querySelector(".two-step-return-btn");

if (twoStepModalCloseBtn) {
  twoStepModalCloseBtn.addEventListener("click", () => {
    twoStepFormInner.classList.add("hidden");
    twoStepDeclineInner.classList.remove("hidden");
    // на этом экране выход только через его собственные кнопки — шапку прячем
    twoStepOverlay?.classList.add("is-declining");
  });
}

if (twoStepKeepBtn) {
  twoStepKeepBtn.addEventListener("click", () => {
    twoStepFormInner.classList.remove("hidden");
    twoStepDeclineInner.classList.add("hidden");
    twoStepOverlay?.classList.remove("is-declining");
  });
}

if (twoStepReturnBtn) {
  twoStepReturnBtn.addEventListener("click", () => {
    twoStepOverlay.classList.remove("is-open", "is-declining");
    twoStepFormInner.classList.remove("hidden");
    twoStepDeclineInner.classList.add("hidden");
    document.body.style.overflow = "visible";
  });
}
