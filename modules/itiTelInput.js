import intlTelInput from "intl-tel-input";
import { Metadata } from "libphonenumber-js/core";
import minMetadata from "libphonenumber-js/metadata.min.json";
import { geoData } from "./geoLocation";

const getMaxDigitsForCountry = (countryCode) => {
  try {
    const meta = new Metadata(minMetadata);
    meta.selectNumberingPlan(countryCode);
    return Math.max(...meta.numberingPlan.possibleLengths());
  } catch {
    return 15;
  }
};

const twoStepPhoneInput = document.querySelector(".two-step-phone-input");

const geoIpLookup = (success, failure) => {
  if (geoData && geoData.countryCode) {
    success(geoData.countryCode);
  } else {
    success("PL");
  }
};

const baseOptions = {
  initialCountry: "auto",
  separateDialCode: true,
  useFullscreenPopup: false,
  autoPlaceholder: "aggressive",
  loadUtils: () => import("intl-tel-input/utils"),
  geoIpLookup,
  customPlaceholder: function (selectedCountryPlaceholder) {
    return selectedCountryPlaceholder.replace(/[0-9]/g, "X");
  },
};

const fixItiLTR = () => {
  const container = twoStepPhoneInput
    .closest(".iti")
    ?.querySelector(".iti__country-container");
  if (container) {
    container.style.left = "0px";
    container.style.right = "auto";
  }
};

export let twoStepiti = intlTelInput(twoStepPhoneInput, baseOptions);
fixItiLTR();

let currentFormat = null;

const updatePhoneFormat = () => {
  const placeholder = twoStepPhoneInput.getAttribute("placeholder");
  if (!placeholder) return;
  currentFormat = placeholder;
};

// Национальный номер с нуля не начинается - это trunk prefix для набора внутри
// страны, в E.164 ему места нет.
const stripTrunkPrefix = (digits) => digits.replace(/^0+/, "");

// Позиция сразу за n-й цифрой отформатированной строки (n=0 - самое начало).
// Нужна, чтобы вернуть курсор туда же, где он стоял до переформатирования.
const caretAfterDigits = (text, n) => {
  if (n <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] >= "0" && text[i] <= "9" && ++seen === n) return i + 1;
  }
  return text.length;
};

const formatPhoneValue = () => {
  // Курсор считаем В ЦИФРАХ, а не в символах: разделители при переформатировании
  // сдвигаются, а количество цифр слева от курсора - нет. Без этого курсор
  // улетал в конец номера при любой правке в середине.
  const selStart =
    twoStepPhoneInput.selectionStart ?? twoStepPhoneInput.value.length;
  const digitsBeforeCaret = (
    twoStepPhoneInput.value.slice(0, selStart).match(/\d/g) || []
  ).length;

  const countryCode = twoStepiti.getSelectedCountryData().iso2?.toUpperCase();
  const maxDigits = getMaxDigitsForCountry(countryCode);
  const digits = stripTrunkPrefix(
    twoStepPhoneInput.value.replace(/\D/g, "")
  ).slice(0, maxDigits);

  if (digits.length === 0) {
    twoStepPhoneInput.value = "";
    return;
  }

  // Цифр могло стать меньше, чем было слева от курсора (обрезка по maxDigits
  // или снятие ведущего нуля) - прижимаем к последней цифре.
  const caretDigits = Math.min(digitsBeforeCaret, digits.length);

  if (!currentFormat) {
    twoStepPhoneInput.value = digits;
    twoStepPhoneInput.setSelectionRange(caretDigits, caretDigits);
    return;
  }

  const templateDigits = (currentFormat.match(/X/g) || []).length;

  let formatted = "";
  let digitIndex = 0;

  for (let i = 0; i < currentFormat.length; i++) {
    if (currentFormat[i] === "X") {
      if (digitIndex < digits.length) {
        formatted += digits[digitIndex++];
      } else {
        formatted += "X";
      }
    } else {
      formatted += currentFormat[i];
    }
  }

  if (digits.length > templateDigits) {
    formatted += digits.slice(templateDigits);
  }

  twoStepPhoneInput.value = formatted;
  const caret = caretAfterDigits(formatted, caretDigits);
  twoStepPhoneInput.setSelectionRange(caret, caret);
};

window.addEventListener("geoReady", (e) => {
  const countryCode = e.detail?.countryCode?.toLowerCase() || "pl";
  twoStepiti.destroy();
  twoStepiti = intlTelInput(twoStepPhoneInput, { ...baseOptions, initialCountry: countryCode });
  fixItiLTR();
  currentFormat = null;
});

twoStepPhoneInput.addEventListener("focus", updatePhoneFormat);
twoStepPhoneInput.addEventListener("input", formatPhoneValue);
twoStepPhoneInput.addEventListener("countrychange", () => {
  currentFormat = null;
  twoStepPhoneInput.value = "";
  updatePhoneFormat();
});

export function updateTelInputLanguage() {
  const currentCountry = twoStepiti.getSelectedCountryData().iso2;
  twoStepiti.destroy();

  const options = { ...baseOptions, initialCountry: currentCountry || "auto" };

  twoStepiti = intlTelInput(twoStepPhoneInput, options);
  fixItiLTR();
  currentFormat = null;
}
