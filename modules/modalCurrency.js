import { getLocation } from "./geoLocation";
import { countryCurrencyData, nodepBonuses } from "../public/data";
import {
  checkTir1CurrencyMatch,
  twoStepFormData,
  settingInitialBonusValue,
} from "./twoStepForm";

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
  return "./img/currencies/usd.svg"; // or some default value if country is not found
}

function getCountryCurrencySymbol(inputCountry) {
  for (const data of countryCurrencyData) {
    if (data.countries.includes(inputCountry)) {
      return data.countryCurrencySymbol;
    }
  }
  return "$"; // or some default value if country is not found
}

function setCurrency(abbr, name, icon) {
  const formCurrency = document.querySelectorAll(".form-currency");
  formCurrency.forEach((cur) => {
    let input = cur.querySelector("input");
    let currencyName = cur.querySelector(".main-currency-name");
    let currencyIcon = cur.querySelector(".main-currency-icon");
    input.value = abbr;
    currencyName.textContent = name;
    currencyIcon.src = icon;

    const currencyListItem = cur.querySelectorAll(
      ".form-currency-dropdown ul li"
    );

    currencyListItem.forEach((item) => {
      const itemAbbr = item.querySelector(".currency-item-abbr").textContent;
      if (itemAbbr.includes(abbr)) {
        item.classList.add("active");
      }
    });
  });
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
    img.setAttribute("src", `./img/payments/${payment}.svg`);
    footerPaymentsList.appendChild(img);
  });
};

async function settingModalCurrency() {
  try {
    let locationData = await getLocation();
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

    setCurrency(currencyAbbr, currencyFullName, currencyIcon);
    settingFooterPayments(currencyAbbr);

    twoStepFormData.currency = currencyData.abbr;
    twoStepFormData.bonus = checkTir1CurrencyMatch(twoStepFormData.currency);
    setTimeout(() => {
      settingInitialBonusValue(twoStepFormData.currency);
    }, 300);
  } catch (error) {
    console.error("Error fetching location data:", error);
  }
}

settingModalCurrency();

/**
 *  Currency dropdownxw
 */
export const settingBonusOnCurrencyChange = (
  currencyDataArray,
  targetCurrency
) => {
  const matchedObject = currencyDataArray.find(
    (item) => item.countryCurrency === targetCurrency.abbr
  );
  const amount = matchedObject ? matchedObject.amount : null;
  const symbol = matchedObject ? matchedObject.countryCurrencySymbol : null;
  const spins = matchedObject ? matchedObject.spins : null;

  document.querySelectorAll(".bonus-value").forEach((el) => {
    el.innerHTML = amount;
  });
  document.querySelectorAll(".bonus-currency").forEach((el) => {
    el.innerHTML = symbol;
  });
  document.querySelectorAll(".bonus-spins").forEach((el) => {
    el.innerHTML = spins;
  });
};

const formCurrency = document.querySelectorAll(".form-currency");

formCurrency.forEach((cur) => {
  if (cur) {
    const currencyDropdownBtn = cur.querySelector(".form-currency-btn");
    const currencyDropdownList = cur.querySelector(".form-currency-dropdown");

    function hideDropdown() {
      currencyDropdownBtn.classList.remove("active");
      currencyDropdownList.classList.remove("active");
    }

    currencyDropdownBtn.addEventListener("click", () => {
      currencyDropdownBtn.classList.toggle("active");
      currencyDropdownList.classList.toggle("active");
    });

    const currencyListItems = currencyDropdownList.querySelectorAll("li");

    currencyListItems.forEach((item) => {
      item.addEventListener("click", () => {
        currencyListItems.forEach((el) => {
          el.classList.remove("active");
        });
        item.classList.add("active");
        hideDropdown();

        // Taking currency value from item
        let curIcon = item.querySelector(".currency-item-icon").src;
        let curName = item.querySelector(".currency-item-name").textContent;
        let curAbbr = item.querySelector(".currency-item-abbr").textContent;

        // Update all currency inputs on the page
        setCurrency(curAbbr, curName, curIcon);

        // Update local storage
        const currencyData = {
          abbr: curAbbr,
          name: curName,
          icon: curIcon,
        };
        localStorage.setItem("currencyData", JSON.stringify(currencyData));

        // Two step currency update
        settingBonusOnCurrencyChange(countryCurrencyData, currencyData);
        twoStepFormData.currency = currencyData.abbr;
        settingInitialBonusValue(twoStepFormData.currency);

        twoStepFormData.bonus = checkTir1CurrencyMatch(
          twoStepFormData.currency,
          twoStepFormData.bonus
        );
      });
    });

    document.addEventListener("click", (event) => {
      if (!cur.contains(event.target)) {
        hideDropdown();
      }
    });
  }
});
