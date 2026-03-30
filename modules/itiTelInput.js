import intlTelInput from "intl-tel-input/intlTelInputWithUtils";
import { geoData } from "./geoLocation";

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

twoStepPhoneInput.addEventListener("input", function (e) {
  e.target.value = e.target.value.replace(/[^0-9]/g, "");
});

twoStepPhoneInput.addEventListener("countrychange", () => {
  twoStepPhoneInput.value = "";
});
