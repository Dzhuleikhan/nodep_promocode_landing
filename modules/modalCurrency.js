import { geoData } from "./geoLocation";
import { countryCurrencyData } from "../public/data";
import { formData } from "./formAuth";

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
    let locationData = geoData;
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

const LI_CLASS =
  "grid cursor-pointer grid-cols-[auto_1fr_auto] gap-2 border-b border-white/20 bg-white p-3 text-base font-bold transition-all hover:bg-[#c2cefb] [&.active]:bg-[#c2cefb]";

function buildCurrencyList(ul) {
  ul.innerHTML = countryCurrencyData
    .map(
      ({ countryCurrency, countryCurrencyFullName, countryCurrencyIcon, countryCurrencySymbol }) => `
        <li class="${LI_CLASS}">
          <img class="currency-item-icon" width="24" height="24" src="${countryCurrencyIcon}" alt="${countryCurrency}" />
          <span class="currency-item-name">${countryCurrencyFullName}</span>
          <div>
            <span class="currency-item-symbol">${countryCurrencySymbol}</span>
            |
            <span class="currency-item-abbr">${countryCurrency}</span>
          </div>
        </li>
      `,
    )
    .join("");
}

const formCurrency = document.querySelectorAll(".form-currency");

formCurrency.forEach((cur) => {
  if (!cur) return;

  const currencyDropdownBtn = cur.querySelector(".form-currency-btn");
  const currencyDropdownList = cur.querySelector(".form-currency-dropdown");
  const ul = currencyDropdownList.querySelector("ul");

  buildCurrencyList(ul);

  function hideDropdown() {
    currencyDropdownBtn.classList.remove("active");
    currencyDropdownList.classList.remove("active");
  }

  currencyDropdownBtn.addEventListener("click", () => {
    currencyDropdownBtn.classList.toggle("active");
    currencyDropdownList.classList.toggle("active");
  });

  ul.addEventListener("click", (e) => {
    const item = e.target.closest("li");
    if (!item) return;

    ul.querySelectorAll("li").forEach((el) => el.classList.remove("active"));
    item.classList.add("active");
    hideDropdown();

    const curIcon = item.querySelector(".currency-item-icon").src;
    const curName = item.querySelector(".currency-item-name").textContent;
    const curAbbr = item.querySelector(".currency-item-abbr").textContent;

    setCurrency(curAbbr, curName, curIcon);

    const currencyData = { abbr: curAbbr, name: curName, icon: curIcon };
    localStorage.setItem("currencyData", JSON.stringify(currencyData));
    formData.currency = curAbbr;

    settingBonusOnCurrencyChange(countryCurrencyData, currencyData);
  });

  document.addEventListener("click", (event) => {
    if (!cur.contains(event.target)) {
      hideDropdown();
    }
  });
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
