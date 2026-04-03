import intlTelInput from "intl-tel-input/intlTelInputWithUtils";
import arTranslations from "intl-tel-input/i18n/ar";
import { geoData } from "./geoLocation";
import Inputmask from "inputmask";

const RTL_LANGUAGES = ["ar"];
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
  geoIpLookup,
  customPlaceholder: function (selectedCountryPlaceholder) {
    return selectedCountryPlaceholder.replace(/[0-9]/g, "X");
  },
};

export let twoStepiti = intlTelInput(twoStepPhoneInput, baseOptions);

export function updateTelInputLanguage(lang) {
  const currentCountry = twoStepiti.getSelectedCountryData().iso2;
  twoStepiti.destroy();

  const options = { ...baseOptions, initialCountry: currentCountry || "auto" };
  if (RTL_LANGUAGES.includes(lang)) {
    options.i18n = arTranslations;
  }

  twoStepiti = intlTelInput(twoStepPhoneInput, options);
}

const applyMask = () => {
  const placeholder = twoStepPhoneInput.getAttribute("placeholder");

  if (!placeholder) return;

  const maskPattern = placeholder.replace(/X/g, "9");

  Inputmask({
    mask: maskPattern,
    placeholder: "X",
    clearMaskOnLostFocus: true,
  }).mask(twoStepPhoneInput);
};

twoStepPhoneInput.addEventListener("focus", applyMask);
twoStepPhoneInput.addEventListener("click", applyMask);
twoStepPhoneInput.addEventListener("countrychange", applyMask);
