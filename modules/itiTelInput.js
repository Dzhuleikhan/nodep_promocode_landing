import intlTelInput from "intl-tel-input/intlTelInputWithUtils";
import { geoData } from "./geoLocation";
import Inputmask from "inputmask";

const socialsPhoneInput = document.querySelector(".socials-phone-input");

const geoIpLookup = (success, failure) => {
  if (geoData && geoData.countryCode) {
    success(geoData.countryCode);
  } else {
    success("PL");
  }
};

export const socialsIti = intlTelInput(socialsPhoneInput, {
  initialCountry: "auto",
  separateDialCode: true,
  useFullscreenPopup: false,
  autoPlaceholder: "polite",
  geoIpLookup,
  customPlaceholder: function (selectedCountryPlaceholder) {
    return selectedCountryPlaceholder.replace(/[0-9]/g, "X");
  },
});

const applyMask = () => {
  const placeholder = socialsPhoneInput.getAttribute("placeholder");

  if (!placeholder) return;

  const maskPattern = placeholder.replace(/X/g, "9");

  Inputmask({
    mask: maskPattern,
    placeholder: "X",
    clearMaskOnLostFocus: true,
  }).mask(socialsPhoneInput);
};

socialsPhoneInput.addEventListener("focus", applyMask);
socialsPhoneInput.addEventListener("click", applyMask);
socialsPhoneInput.addEventListener("countrychange", applyMask);
