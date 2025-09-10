import { getLocation } from "./geoLocation";
import { countryCurrencyData, nodepBonuses } from "../public/data";
import { twoStepFormData, settingInitialBonusValue } from "./twoStepForm";
import { getUrlParameter } from "./params";

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

// | setting no deposit bonus amount and currency

export const settingNodepBonus = (currencyAbbr) => {
  // const nodepBonusAmount = document.querySelectorAll(".nodep-bonus-amount");
  // const nodepBonusCurrency = document.querySelectorAll(".nodep-bonus-currency");
  const nodepBonusTotalAmoun = document.querySelectorAll(".bonus-total-amount");
  const nodepBonusCurrencySymbol = document.querySelectorAll(
    ".bonus-currency-symbol"
  );

  const selectedCurrency =
    nodepBonuses.find((c) => c.currency === currencyAbbr) ||
    nodepBonuses.find((c) => c.currency === "USD");

  // nodepBonusAmount.forEach((text) => {
  //   text.textContent = selectedCurrency.bonusAmount;
  // });
  // nodepBonusCurrency.forEach((text) => {
  //   text.textContent = selectedCurrency.currency;
  // });
  nodepBonusTotalAmoun.forEach((text) => {
    text.textContent = selectedCurrency.moneyAmount;
  });
  nodepBonusCurrencySymbol.forEach((text) => {
    text.textContent = selectedCurrency.symbol;
  });
};

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

    if (locationData.currency.code === "CHE") {
      locationData.currency.code = "CHF";
    }

    const currencyCode =
      nodepBonuses.find(
        (item) => item.currency === locationData.currency.code
      ) || nodepBonuses.find((item) => item.currency === "EUR");

    const currencyData = {
      abbr: currencyCode.currency,
      name: currencyCode.currencyName,
      icon: currencyCode.countryCurrencyIcon,
      symbol: currencyCode.symbol,
    };

    // Save to local storage
    localStorage.setItem("currencyData", JSON.stringify(currencyData));

    setCurrency(currencyData.abbr, currencyData.name, currencyData.icon);

    twoStepFormData.currency = currencyData.abbr;
    settingInitialBonusValue(twoStepFormData.currency);
    setTimeout(() => {
      settingInitialBonusValue(currencyData.abbr);
      // settingNodepBonus(currencyData.abbr);
    }, 300);
    settingFooterPayments(currencyData.abbr);
  } catch (error) {
    console.error("Error fetching location data:", error);
  }
}
settingModalCurrency();

/**
 *  Currency dropdown
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
        let curSymbol = item.querySelector(".currency-item-symbol").textContent;

        // Update all currency inputs on the page
        setCurrency(curAbbr, curName, curIcon);

        // Update local storage
        const currencyData = {
          abbr: curAbbr,
          name: curName,
          icon: curIcon,
          symbol: curSymbol,
        };
        localStorage.setItem("currencyData", JSON.stringify(currencyData));

        // Two step currency update
        settingBonusOnCurrencyChange(countryCurrencyData, currencyData);
        twoStepFormData.currency = currencyData.abbr;
        settingInitialBonusValue(twoStepFormData.currency);
        // settingNodepBonus(currencyData.abbr);
        document.querySelector(".bonus-currency-symbol").innerHTML =
          currencyData.symbol;
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
    "NOK",
  ];
  if (exceptCurrencies.includes(currency) && bonus === "welcome-bonus-1") {
    bonus = bonus + "-alt";
  } else {
    bonus = bonus;
  }
  return bonus;
};
