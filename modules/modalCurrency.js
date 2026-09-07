import { geoData, geoReady, geoConfirmed, isGeoFallback } from "./geoLocation";
import { countryCurrencyData, nodepBonuses } from "../public/data";
import {
  getCountryCurrencyABBR,
  getCountryCurrencyFullName,
  getCountryCurrencyIcon,
  getCountryCurrencySymbol,
  getCurrencyCountry,
  getCurrencyForCountry,
} from "./currency";
import {
  checkTir1CurrencyMatch,
  twoStepFormData,
  settingInitialBonusValue,
  setCurrencyPending,
} from "./twoStepForm";

const CDN = "https://3344112-img.b-cdn.net";

// маппинг живёт в currency.js — реэкспорт, чтобы не править импорты по модулям
export {
  getCountryCurrencyABBR,
  getCountryCurrencyIcon,
  getCurrencyCountry,
} from "./currency";

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

function settingModalCurrency(detectedCountry) {
  try {
    const countryInput = getCurrencyCountry(detectedCountry);

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
    settingInitialBonusValue(twoStepFormData.currency);
    setCurrencyPending(false);
  } catch (error) {
    console.error("Error fetching location data:", error);
  }
}

// Валюту игрок мог выбрать сам — тогда поздний ответ гео её не трогает.
let isCurrencyPickedByUser = false;

// Что уже проставлено: гео резолвится дважды (первый ответ и доливка), и на
// успешном гео оба раза дают одну валюту — второй проход тогда не нужен.
let appliedCurrency = null;

// гео не определилось — дефолт в geoData польский, но навязывать игроку
// злотый нельзя: берём нейтральный доллар
const applyCurrencyForGeo = () => {
  if (isCurrencyPickedByUser) return;

  const detectedCountry = isGeoFallback ? "US" : geoData.countryCode;
  const currencyAbbr = getCurrencyForCountry(detectedCountry);

  if (currencyAbbr === appliedCurrency) return;
  appliedCurrency = currencyAbbr;

  settingModalCurrency(detectedCountry);
};

// По geoReady — чтобы суммы бонуса в заголовке и на номинале не пустовали те
// секунды, пока идёт доливка: на провальном гео это нейтральный доллар.
geoReady.then(applyCurrencyForGeo);

// По geoConfirmed — когда страна подтверждена; если доливка принесла другую,
// валюта переставится, иначе проход отсечётся по appliedCurrency.
geoConfirmed.then(applyCurrencyForGeo);

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
        isCurrencyPickedByUser = true;
        currencyListItems.forEach((el) => {
          el.classList.remove("active");
        });
        item.classList.add("active");
        hideDropdown();

        // Taking currency value from item
        let curIcon = item.querySelector(".currency-item-icon").src;
        let curName = item.querySelector(".currency-item-name").textContent;
        let curAbbr = item
          .querySelector(".currency-item-abbr")
          .textContent.toUpperCase();
        let curAlt = item.querySelector(".currency-item-icon").alt;

        // Update all currency inputs on the page
        setCurrency(curAbbr, curName, curIcon);

        // Update local storage
        const currencyData = {
          abbr: curAbbr,
          name: curName,
          icon: curIcon,
          alt: curAlt,
        };
        localStorage.setItem("currencyData", JSON.stringify(currencyData));

        // Two step currency update
        settingBonusOnCurrencyChange(countryCurrencyData, currencyData);
        twoStepFormData.currency = currencyData.abbr;
        settingInitialBonusValue(twoStepFormData.currency);
        setCurrencyPending(false);

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
