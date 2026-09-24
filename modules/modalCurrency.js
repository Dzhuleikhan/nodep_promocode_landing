import { geoData } from "./geoLocation";
import { countryCurrencyData, nodepBonuses } from "../public/data";
import { twoStepFormData, settingInitialBonusValue } from "./twoStepForm";

const CDN = "https://3344112-img.b-cdn.net";

export function getCountryCurrencyABBR(inputCountry) {
  for (const data of countryCurrencyData) {
    if (data.countries.includes(inputCountry)) {
      return data.countryCurrency;
    }
  }
  return "USD"; // or some default value if country is not found
}

function getCountryCurrencyFullName(inputCountry) {
  for (const data of countryCurrencyData) {
    if (data.countries.includes(inputCountry)) {
      return data.countryCurrencyFullName;
    }
  }
  return "US Dollar"; // or some default value if country is not found
}

function getCountryCurrencyIcon(inputCountry) {
  for (const data of countryCurrencyData) {
    if (data.countries.includes(inputCountry)) {
      return data.countryCurrencyIcon;
    }
  }
  return CDN + "/currency_icons/USD.svg"; // or some default value if country is not found
}

function getCountryCurrencySymbol(inputCountry) {
  for (const data of countryCurrencyData) {
    if (data.countries.includes(inputCountry)) {
      return data.countryCurrencySymbol;
    }
  }
  return "$"; // or some default value if country is not found
}

const settingFooterPayments = (currencyAbbr) => {
  const selectedCurrency =
    nodepBonuses.find((c) => c.currency === currencyAbbr) ||
    nodepBonuses.find((c) => c.currency === "EUR");

  const footerPaymentsList = document.querySelector(".footer-payments-list");
  footerPaymentsList.innerHTML = "";

  selectedCurrency.paymentMethods.forEach((payment) => {
    const img = document.createElement("img");
    img.classList.add("grayscale-100");
    img.classList.add("transition");
    img.classList.add("hover:grayscale-0");
    img.setAttribute(
      "src",
      CDN + `/graphic/landings/paymentMethods/nodep/${payment}.svg`
    );
    footerPaymentsList.appendChild(img);
  });
};

async function settingModalCurrency() {
  try {
    let locationData = geoData;
    let countryInput = locationData.countryCode;

    const excludedCountries = ["RU", "MX", "CL", "CO", "TH", "ID"];

    if (excludedCountries.includes(countryInput)) {
      countryInput = "US";
    }

    if (countryInput === "GB") {
      countryInput = "FR";
    }

    const currencyAbbr = getCountryCurrencyABBR(countryInput);
    const currencyFullName = getCountryCurrencyFullName(countryInput);
    const currencyIcon = getCountryCurrencyIcon(countryInput);
    const currencySymbol = getCountryCurrencySymbol(countryInput);

    const currencyData = {
      abbr: currencyAbbr,
      name: currencyFullName,
      icon: currencyIcon,
      symbol: currencySymbol,
    };

    // Save to local storage
    localStorage.setItem("currencyData", JSON.stringify(currencyData));

    settingFooterPayments(currencyAbbr);

    twoStepFormData.currency = currencyData.abbr;
    setTimeout(() => {
      settingInitialBonusValue(twoStepFormData.currency);
    }, 300);
  } catch (error) {
    console.error("Error fetching location data:", error);
  }
}

settingModalCurrency();
