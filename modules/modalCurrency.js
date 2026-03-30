import { geoData } from "./geoLocation";
import { countryCurrencyData, nodepBonuses } from "../public/data";
import { twoStepFormData, checkTir1CurrencyMatch } from "./twoStepForm";
import { settingInitialBonusValue } from "./twoStepForm";

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
  return "https://3344112-img.b-cdn.net/currency_icons/USD.svg"; // or some default value if country is not found
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
      ".form-currency-dropdown ul li",
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
  const nodepBonusAmount = document.querySelectorAll(".nodep-bonus-amount");
  const nodepBonusCurrency = document.querySelectorAll(".nodep-bonus-currency");
  // const nodepBonusTotalAmoun = document.querySelectorAll(".bonus-total-amount");
  // const nodepBonusCurrencySymbol = document.querySelectorAll(
  //   ".bonus-currency-symbol"
  // );

  const selectedCurrency =
    nodepBonuses.find((c) => c.currency === currencyAbbr) ||
    nodepBonuses.find((c) => c.currency === "USD");

  nodepBonusAmount.forEach((text) => {
    text.textContent = selectedCurrency.bonusAmount;
  });
  nodepBonusCurrency.forEach((text) => {
    text.textContent = selectedCurrency.currency;
  });
  // nodepBonusTotalAmoun.forEach((text) => {
  //   text.textContent = selectedCurrency.moneyAmount;
  // });
  // nodepBonusCurrencySymbol.forEach((text) => {
  //   text.textContent = selectedCurrency.symbol;
  // });
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
    img.setAttribute(
      "src",
      `https://3344112-img.b-cdn.net/graphic/landings/paymentMethods/nodep/${payment}.svg`,
    );
    footerPaymentsList.appendChild(img);
  });
};

const hiddenCurrencies = ["COP", "CLP", "IDR", "MXN", "RUB", "THB"];

function buildCurrencyList() {
  const dropdownItems = countryCurrencyData.filter(
    (c) => !hiddenCurrencies.includes(c.countryCurrency),
  );

  document.querySelectorAll(".currency-list").forEach((ul) => {
    ul.innerHTML = dropdownItems
      .map(
        (c) => `
        <li class="grid cursor-pointer grid-cols-[auto_1fr_auto] gap-2 border-b border-[#755EEB]/20 bg-white px-4 py-[10px] text-base font-bold text-[#1c1c1c] transition-all [&.active]:bg-[#b4aae7]">
          <img class="currency-item-icon" width="24" height="24" src="${c.countryCurrencyIcon}" alt="${c.countryCurrency}" />
          <span class="currency-item-name">${c.countryCurrencyFullName}</span>
          <div>
            <span class="currency-item-symbol">${c.countryCurrencySymbol}</span>
            |
            <span class="currency-item-abbr">${c.countryCurrency}</span>
          </div>
        </li>`,
      )
      .join("");
  });
}

async function settingModalCurrency() {
  try {
    buildCurrencyList();
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

    setCurrency(currencyAbbr, currencyFullName, currencyIcon);

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
 *  Currency dropdown
 */
export const settingBonusOnCurrencyChange = (
  currencyDataArray,
  targetCurrency,
) => {
  const matchedObject = currencyDataArray.find(
    (item) => item.countryCurrency === targetCurrency.abbr,
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

    currencyDropdownList.addEventListener("click", (e) => {
      const item = e.target.closest("li");
      if (!item) return;

      currencyDropdownList.querySelectorAll("li").forEach((el) => {
        el.classList.remove("active");
      });
      item.classList.add("active");
      hideDropdown();

      let curIcon = item.querySelector(".currency-item-icon").src;
      let curName = item.querySelector(".currency-item-name").textContent;
      let curAbbr = item.querySelector(".currency-item-abbr").textContent;
      let curSymbol = item.querySelector(".currency-item-symbol").textContent;

      setCurrency(curAbbr, curName, curIcon);

      const currencyData = {
        abbr: curAbbr,
        name: curName,
        icon: curIcon,
        symbol: curSymbol,
      };
      localStorage.setItem("currencyData", JSON.stringify(currencyData));

      settingBonusOnCurrencyChange(countryCurrencyData, currencyData);
      twoStepFormData.currency = currencyData.abbr;
      settingInitialBonusValue(twoStepFormData.currency);
      settingNodepBonus(currencyData.abbr);
      document.querySelector(".bonus-currency-symbol").innerHTML =
        currencyData.symbol;

      twoStepFormData.bonus = checkTir1CurrencyMatch(
        twoStepFormData.currency,
        twoStepFormData.bonus,
      );
    });

    document.addEventListener("click", (event) => {
      if (!cur.contains(event.target)) {
        hideDropdown();
      }
    });
  }
});
