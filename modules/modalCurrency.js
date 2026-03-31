import { geoData } from "./geoLocation";
import {
  countryCurrencyData,
  nodepBonuses,
  bonusSumAndWager,
} from "../public/data";
import { getUrlParameter } from "./params";

const CDN = "https://3344112-img.b-cdn.net";
const bonusType = getUrlParameter("bonusType") || "freebet";

const settingFooterPayments = (currencyAbbr) => {
  const selectedCurrency =
    nodepBonuses.find((c) => c.currency === currencyAbbr) ||
    nodepBonuses.find((c) => c.currency === "EUR");

  const footerPaymentsList = document.querySelector(".footer-payments-list");
  if (!footerPaymentsList || !selectedCurrency) return;

  footerPaymentsList.innerHTML = selectedCurrency.paymentMethods
    .map(
      (payment) =>
        `<img width="100" height="51" class="grayscale-100 w-[100px] max-[576px]:max-w-[50px] transition hover:grayscale-0" src="${CDN}/graphic/landings/paymentMethods/nodep/${payment}.svg" alt="${payment}" />`,
    )
    .join("");
};

const exceptCurrenciesForPercent = [
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

export function settingHeroBonusValues(currency) {
  const currencyEntry = countryCurrencyData.find(
    (entry) => entry.countryCurrency === currency,
  );

  const percent = exceptCurrenciesForPercent.includes(currency)
    ? "100%"
    : "200%";
  document.querySelectorAll(".two-step-bonus-percent").forEach((el) => {
    el.innerHTML = percent;
  });

  if (currencyEntry) {
    document.querySelectorAll(".bonus-total-amount").forEach((el) => {
      el.innerHTML = currencyEntry.amount;
    });
    document.querySelectorAll(".bonus-currency-symbol").forEach((el) => {
      el.innerHTML = currencyEntry.countryCurrencySymbol;
    });
    document.querySelectorAll(".two-step-bonus-spins").forEach((el) => {
      el.innerHTML = currencyEntry.spins;
    });
  } else {
    document.querySelectorAll(".bonus-total-amount").forEach((el) => {
      el.innerHTML = "20.000";
    });
    document.querySelectorAll(".bonus-currency-symbol").forEach((el) => {
      el.innerHTML = "zł";
    });
    document.querySelectorAll(".two-step-bonus-spins").forEach((el) => {
      el.innerHTML = "200FS";
    });
  }
}

function updateCashUrlParams(currency) {
  const entry = bonusSumAndWager.find((p) => p.currency === currency);
  const amount = entry ? entry.amount : 20;
  const url = new URL(window.location.href);
  url.searchParams.set("sumAmount", amount);
  url.searchParams.set("currency", currency);
  window.history.replaceState({}, "", url);
}

export function settingCashBonusValues(currency) {
  const url = new URL(window.location.href);
  const urlSumAmount = url.searchParams.get("sumAmount");
  const urlCurrency = url.searchParams.get("currency");

  let amount, symbol, currencyCode;

  if (urlSumAmount && urlCurrency) {
    amount = urlSumAmount;
    currencyCode = urlCurrency;
    const currencyEntry = countryCurrencyData.find(
      (e) => e.countryCurrency === urlCurrency,
    );
    symbol = currencyEntry ? currencyEntry.countryCurrencySymbol : urlCurrency;
  } else {
    const entry = bonusSumAndWager.find((p) => p.currency === currency);
    amount = entry ? entry.amount : 20;
    currencyCode = currency;
    const currencyEntry = countryCurrencyData.find(
      (e) => e.countryCurrency === currency,
    );
    symbol = currencyEntry ? currencyEntry.countryCurrencySymbol : "$";

    url.searchParams.set("sumAmount", amount);
    url.searchParams.set("currency", currencyCode);
    window.history.replaceState({}, "", url);
  }

  document.querySelectorAll(".bonus-value").forEach((el) => {
    el.innerHTML = amount;
  });
  document.querySelectorAll(".bonus-currency").forEach((el) => {
    el.innerHTML = symbol;
  });
}

export function getCountryCurrencyABBR(inputCountry) {
  for (const data of countryCurrencyData) {
    if (data.countries.includes(inputCountry)) {
      return data.countryCurrency;
    }
  }
  return "PLN";
}

function getCountryCurrencyFullName(inputCountry) {
  for (const data of countryCurrencyData) {
    if (data.countries.includes(inputCountry)) {
      return data.countryCurrencyFullName;
    }
  }
  return "Polish Zloty";
}

function getCountryCurrencyIcon(inputCountry) {
  for (const data of countryCurrencyData) {
    if (data.countries.includes(inputCountry)) {
      return data.countryCurrencyIcon;
    }
  }
  return "https://3344112-img.b-cdn.net/currency_icons/PLN.svg";
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

    const currencyData = {
      abbr: currencyAbbr,
      name: currencyFullName,
      icon: currencyIcon,
    };

    // Save to local storage
    localStorage.setItem("currencyData", JSON.stringify(currencyData));

    setCurrency(currencyAbbr, currencyFullName, currencyIcon);
    settingHeroBonusValues(currencyAbbr);
    if (bonusType === "cash") {
      settingCashBonusValues(currencyAbbr);
    }
    settingFooterPayments(currencyAbbr);
  } catch (error) {
    console.error("Error fetching location data:", error);
  }
}

/**
 *  Currency dropdown
 */

function generateCurrencyList() {
  const seen = new Set();
  const uniqueCurrencies = countryCurrencyData.filter((entry) => {
    if (seen.has(entry.countryCurrency)) return false;
    seen.add(entry.countryCurrency);
    return true;
  });

  document.querySelectorAll(".currency-list").forEach((ul) => {
    ul.innerHTML = uniqueCurrencies
      .map(
        (entry) => `
        <li class="grid cursor-pointer grid-cols-[auto_1fr_auto] gap-2 border-b border-white/20 bg-[#212A36] p-3 text-base font-bold transition-all hover:bg-[#121422] [&.active]:bg-[#121422]">
          <img class="currency-item-icon" width="24" height="24" src="${entry.countryCurrencyIcon}" alt="${entry.countryCurrency}" />
          <span class="currency-item-name">${entry.countryCurrencyFullName}</span>
          <div>
            <span class="currency-item-symbol">${entry.countryCurrencySymbol}</span>
            |
            <span class="currency-item-abbr">${entry.countryCurrency}</span>
          </div>
        </li>`,
      )
      .join("");
  });
}
generateCurrencyList();
settingModalCurrency();

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
        settingHeroBonusValues(curAbbr);
        if (bonusType === "cash") {
          updateCashUrlParams(curAbbr);
          settingCashBonusValues(curAbbr);
        }
        settingFooterPayments(curAbbr);
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
