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
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);

    const url = `https://${window.location.host}/geo-api/api/check?accessKey=0439ba6e-6092-46c2-9aeb-8662065bc43c`;
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);

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

// Коды браузера, расходящиеся с кодами словарей ленда. Датский здесь лежит
// под своим ISO-кодом da — алиас ему не нужен.
const BROWSER_LANG_ALIASES = {
  no: "nb", // норвежский: браузер шлёт макро-код
  nn: "nb", // нюнорск отдаём на букмоле
  lg: "lm", // луганда: ISO-код lg, словарь лежит под lm
  ak: "tw", // акан: словарь лежит под tw (чви)
};

// Ленд открывается на языке браузера; гео на язык не влияет. Берём язык,
// только если для него есть словарь: в SupportedLanguages есть uz/bn/tr/id/kk/
// ky, а переводов под них на этом ленде нет — updateContent упал бы.
// Считаем здесь, а не в language.js: twoStepForm читает preferredLanguage
// раньше, чем language.js успевает отработать.
export const getInitialLanguage = () => {
  const browserLang = (navigator.language || "").split("-")[0].toLowerCase();
  const lang = BROWSER_LANG_ALIASES[browserLang] ?? browserLang;

  return SupportedLanguages.includes(lang) && translations[lang] ? lang : "en";
};

localStorage.setItem("preferredLanguage", getInitialLanguage());
export const language = localStorage.getItem("preferredLanguage");

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
  zipCodeLabel.textContent = format?.example
    ? `${base} (${format.example})`
    : base;
};
