import intlTelInput from "intl-tel-input/intlTelInputWithUtils";
import { geoData } from "./geoLocation";

const socialsPhoneInput = document.querySelector(".socials-phone-input");

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
  geoIpLookup,
  customPlaceholder: function (selectedCountryPlaceholder) {
    return selectedCountryPlaceholder.replace(/[0-9]/g, "X");
  },
};

const fixItiLTR = () => {
  const container = socialsPhoneInput
    .closest(".iti")
    ?.querySelector(".iti__country-container");
  if (container) {
    container.style.left = "0px";
    container.style.right = "auto";
  }
};

export let socialsIti = intlTelInput(socialsPhoneInput, baseOptions);
fixItiLTR();

let currentFormat = null;

const updatePhoneFormat = () => {
  const placeholder = socialsPhoneInput.getAttribute("placeholder");
  if (!placeholder) return;
  currentFormat = placeholder;
};

const formatPhoneValue = () => {
  if (!currentFormat) return;

  const maxDigits = (currentFormat.match(/X/g) || []).length;
  const digits = socialsPhoneInput.value.replace(/\D/g, "").slice(0, maxDigits);

  if (digits.length === 0) {
    socialsPhoneInput.value = "";
    return;
  }

  let formatted = "";
  let digitIndex = 0;
  let cursorPos = 0;

  for (let i = 0; i < currentFormat.length; i++) {
    if (currentFormat[i] === "X") {
      if (digitIndex < digits.length) {
        formatted += digits[digitIndex++];
        cursorPos = formatted.length;
      } else {
        formatted += "X";
      }
    } else {
      formatted += currentFormat[i];
    }
  }

  socialsPhoneInput.value = formatted;
  socialsPhoneInput.setSelectionRange(cursorPos, cursorPos);
};

socialsPhoneInput.addEventListener("focus", updatePhoneFormat);
socialsPhoneInput.addEventListener("input", formatPhoneValue);
socialsPhoneInput.addEventListener("countrychange", () => {
  currentFormat = null;
  socialsPhoneInput.value = "";
  updatePhoneFormat();
});

export function updateTelInputLanguage() {
  const currentCountry = socialsIti.getSelectedCountryData().iso2;
  socialsIti.destroy();

  const options = { ...baseOptions, initialCountry: currentCountry || "auto" };

  socialsIti = intlTelInput(socialsPhoneInput, options);
  fixItiLTR();
  currentFormat = null;
}
