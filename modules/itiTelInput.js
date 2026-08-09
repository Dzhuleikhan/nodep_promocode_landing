import intlTelInput from "intl-tel-input/intlTelInputWithUtils";
import { geoData } from "./geoLocation";
import { Metadata } from "libphonenumber-js/core";
import minMetadata from "libphonenumber-js/metadata.min.json";
import { isValidPhoneNumber } from "libphonenumber-js";

const twoStepPhoneInput = document.querySelector(".two-step-phone-input");

const geoIpLookup = (success, failure) => {
  if (geoData && geoData.countryCode) {
    success(geoData.countryCode);
  } else {
    success("PL");
  }
};

export const twoStepiti = intlTelInput(twoStepPhoneInput, {
  initialCountry: "auto",
  separateDialCode: true,
  useFullscreenPopup: false,
  autoPlaceholder: "aggressive",
  geoIpLookup,
  customPlaceholder: function (selectedCountryPlaceholder) {
    return selectedCountryPlaceholder.replace(/[0-9]/g, "X");
  },
});

const getPossibleLengths = (countryCode) => {
  try {
    const meta = new Metadata(minMetadata);
    meta.selectNumberingPlan(countryCode);
    return meta.numberingPlan.possibleLengths();
  } catch {
    return null;
  }
};

export const getMaxDigitsForCountry = (countryCode) => {
  const lengths = getPossibleLengths(countryCode);
  return lengths ? Math.max(...lengths) : 15;
};

// Национальный номер с нуля не начинается - это trunk prefix для набора внутри
// страны, в E.164 ему места нет.
export const stripTrunkPrefix = (digits) => digits.replace(/^0+/, "");

export const stripDuplicatedDialCode = (digits, countryCode, dialCode) => {
  if (!dialCode || !digits.startsWith(dialCode)) return digits;
  const rest = digits.slice(dialCode.length);
  const lengths = getPossibleLengths(countryCode);
  if (!rest || !lengths) return digits;
  const maxLen = Math.max(...lengths);
  if (digits.length > maxLen && rest.length <= maxLen) return rest;
  if (isValidPhoneNumber("+" + dialCode + digits)) return digits;
  if (isValidPhoneNumber("+" + digits)) return rest;
  if (lengths.includes(rest.length) && !lengths.includes(digits.length)) {
    return rest;
  }
  return digits;
};

export const formatByPlaceholder = (digits, placeholder) => {
  if (!placeholder) return digits;
  let out = "";
  let di = 0;
  for (const ch of placeholder) {
    if (di >= digits.length) break;
    out += ch === "X" ? digits[di++] : ch;
  }
  if (di < digits.length) out += digits.slice(di);
  return out;
};

// Позиция сразу за n-й цифрой отформатированной строки (n=0 - самое начало).
// Нужна, чтобы вернуть курсор туда же, где он стоял до переформатирования.
export const caretAfterDigits = (text, n) => {
  if (n <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] >= "0" && text[i] <= "9" && ++seen === n) return i + 1;
  }
  return text.length;
};
