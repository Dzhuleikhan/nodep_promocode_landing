import { translations } from "/public/translations";
import {
  countryLanguagesMap,
  SupportedLanguages,
  countryZipCodeTranslates,
  getPostalCodeFormat,
} from "../public/data";

export async function getLocation() {
  const fallback = { countryCode: "PL", currency: { code: "PLN" } };

  try {
    const url = `https://${window.location.host}/geo-api/api/check?accessKey=0439ba6e-6092-46c2-9aeb-8662065bc43c`;
    const response = await fetch(url);

    if (!response.ok) throw new Error("Bad API response");

    const data = await response.json();
    return data;
  } catch (err) {
    console.log("API failed, applying fallback GEO");
    return fallback;
  }
}

export let geoData = await getLocation();

export const getSupportedLanguage = (countryCode) => {
  if (countryCode in countryLanguagesMap) {
    const languages = countryLanguagesMap[countryCode];
    for (let language of languages) {
      if (SupportedLanguages.includes(language)) {
        return language;
      }
    }
  }
  return "en";
};

// Ленд открывается на языке браузера; гео на язык не влияет.
// Словари этого ленда лежат не под кодами языков, а под своими ключами
// (cz, si, gr, no, se, ee, kz, dk) — переводим код браузера в ключ словаря.
// Язык без словаря → en.
const BROWSER_LANG_TO_UI = {
  cs: "cz",
  sl: "si",
  el: "gr",
  nb: "no",
  nn: "no",
  sv: "se",
  et: "ee",
  kk: "kz",
  da: "dk",
};

export const getInitialUiLang = () => {
  const browserLang = (navigator.language || "").split("-")[0].toLowerCase();
  const key = BROWSER_LANG_TO_UI[browserLang] ?? browserLang;

  return translations[key] ? key : "en";
};

export const initialUiLang = getInitialUiLang();

// В /register уходит код языка (cs, sl …), а не ключ словаря — как и при
// ручном выборе в хедере, берём его через getSupportedLanguage(ключ).
// Считаем здесь: twoStepForm читает preferredLanguage раньше language.js.
localStorage.setItem(
  "preferredLanguage",
  getSupportedLanguage(initialUiLang.toUpperCase())
);

function setHeaderFlag(countryCode) {
  const headerFlagImage = document.querySelector(".header-country-flag");
  headerFlagImage.src = `https://3344112-img.b-cdn.net/graphic/flags/flag-${countryCode.toLowerCase()}.svg`;
  headerFlagImage.classList.remove("hidden");
}
setHeaderFlag(geoData.countryCode);

export const settingZipCodePlaceholder = (countryCode) => {
  const zipCodeLabel = document.querySelector(".two-step-zipcode-label");
  const base = countryZipCodeTranslates[countryCode] || "ZIP Code";
  const format = getPostalCodeFormat(countryCode);
  // Подсказываем юзеру ожидаемый формат прямо в лейбле, напр. "Kod pocztowy (00-001)"
  zipCodeLabel.textContent = format?.example ? `${base} (${format.example})` : base;
};
