import { geoData } from "./geoLocation";
import { nodepBonuses } from "../public/data";
import { countryCurrencyData } from "./currencyData";
import {
  checkTir1CurrencyMatch,
  twoStepFormData,
  settingInitialBonusValue,
} from "./twoStepForm";

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

function setCurrency(abbr, name, icon) {
  const formCurrency = document.querySelectorAll(".form-currency");
  formCurrency.forEach((cur) => {
    let input = cur.querySelector("input");
    let currencyName = cur.querySelector(".main-currency-name");
    let currencyIcon = cur.querySelector(".main-currency-icon");
    input.value = abbr;
    currencyName.textContent = name;
    currencyIcon.src = icon;
    currencyIcon.alt = abbr;

    const currencyListItem = cur.querySelectorAll(
      ".form-currency-dropdown ul li",
    );

    currencyListItem.forEach((item) => item.classList.remove("active"));
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
    img.setAttribute(
      "src",
      CDN + `/graphic/landings/paymentMethods/nodep/${payment}.svg`,
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

    setCurrency(currencyAbbr, currencyFullName, currencyIcon);
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

window.addEventListener("geoReady", () => settingModalCurrency());
window.addEventListener("currencyDataReady", () => settingModalCurrency());

/**
 *  Currency dropdownxw
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

async function getCurrencies() {
  try {
    const response = await fetch("/api/currencies");
    if (!response.ok) throw new Error("Bad API response");
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) return data;
    throw new Error("Invalid format");
  } catch (e) {
    return [
      { code: "EUR", name: "Euro", symbol: "€" },
      { code: "USD", name: "US Dollar", symbol: "$" },
    ];
  }
}

const LI_CLASS =
  "grid cursor-pointer grid-cols-[auto_1fr_auto] gap-2 border-b border-[#755EEB]/20 bg-white px-4 py-[10px] text-base font-bold text-[#1c1c1c] transition-all [&.active]:bg-[#b4aae7]";

function renderCurrencyDropdown(currencies) {
  document.querySelectorAll(".form-currency-dropdown ul").forEach((ul) => {
    ul.innerHTML = currencies
      .map(
        ({ code, name, symbol }) => `
      <li class="${LI_CLASS}">
        <img class="currency-item-icon" width="24" height="24" src="${CDN}/currency_icons/${code}.svg" alt="${code}" />
        <span class="currency-item-name">${name}</span>
        <div>
          <span class="currency-item-symbol">${symbol}</span>
          |
          <span class="currency-item-abbr">${code}</span>
        </div>
      </li>`,
      )
      .join("");
  });
}

getCurrencies().then((currencies) => {
  renderCurrencyDropdown(currencies);
  settingModalCurrency();
});

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

      currencyDropdownList
        .querySelectorAll("li")
        .forEach((el) => el.classList.remove("active"));
      item.classList.add("active");
      hideDropdown();

      const curIcon = item.querySelector(".currency-item-icon").src;
      const curName = item.querySelector(".currency-item-name").textContent;
      const curAbbr = item
        .querySelector(".currency-item-abbr")
        .textContent.toUpperCase();
      const curAlt = item.querySelector(".currency-item-icon").alt;

      setCurrency(curAbbr, curName, curIcon);

      const currencyData = {
        abbr: curAbbr,
        name: curName,
        icon: curIcon,
        alt: curAlt,
      };
      localStorage.setItem("currencyData", JSON.stringify(currencyData));

      settingBonusOnCurrencyChange(countryCurrencyData, currencyData);
      twoStepFormData.currency = currencyData.abbr;
      settingInitialBonusValue(twoStepFormData.currency);
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
