import { getLocation } from "./geoLocation";
import { countryCurrencyData } from "../public/data";
import { formData } from "./formAuth";

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

export const settingInitialBonusValue = (currency) => {
  const currencyEntry = countryCurrencyData.find(
    (entry) => entry.countryCurrency === currency
  );

  if (currencyEntry) {
    document.querySelectorAll(".two-step-welcome-amount").forEach((el) => {
      el.innerHTML = currencyEntry.amount;
    });
    document.querySelectorAll(".bonus-currency-symbol").forEach((el) => {
      el.innerHTML = currencyEntry.countryCurrency;
    });
  } else {
    document.querySelectorAll(".two-step-welcome-amount").forEach((el) => {
      el.innerHTML = "4500";
    });
    document.querySelectorAll(".bonus-currency-symbol").forEach((el) => {
      el.innerHTML = "EUR";
    });
  }
};

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

async function settingModalCurrency() {
  try {
    let locationData = await getLocation();
    let countryInput = locationData.countryCode;

    const excludedCountries = ["RU", "MX", "CL", "CO", "TH", "ID"];

    if (excludedCountries.includes(countryInput)) {
      countryInput = "US";
    }

    const currencyAbbr = getCountryCurrencyABBR(countryInput);
    const currencyFullName = getCountryCurrencyFullName(countryInput);
    const currencyIcon = getCountryCurrencyIcon(countryInput);

    const currencyData = {
      abbr: currencyAbbr,
      name: currencyFullName,
      icon: currencyIcon,
    };

    // Save to local storage
    localStorage.setItem("currencyData", JSON.stringify(currencyData));

    setCurrency(currencyAbbr, currencyFullName, currencyIcon);
    formData.currency = currencyAbbr;
    settingInitialBonusValue(currencyAbbr);
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
        formData.currency = curAbbr;
        settingInitialBonusValue(curAbbr);

        settingBonusOnCurrencyChange(countryCurrencyData, currencyData);
      });
    });

    document.addEventListener("click", (event) => {
      if (!cur.contains(event.target)) {
        hideDropdown();
      }
    });
  }
});

export const checkTir1CurrencyMatch = (currency, bonus) => {
  const exceptCurrencies = [
    "RON",
    "DKK",
    "HUF",
    "CZK",
    "CHF",
    "PLN",
    "CAD",
    "USD",
    "EUR",
  ];
  if (exceptCurrencies.includes(currency) && bonus === "welcome-bonus-1") {
    bonus = bonus + "-alt";
  } else {
    bonus = bonus;
  }
  return bonus;
};
