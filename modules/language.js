import { translations } from "/public/translations";
import { geoData } from "./geoLocation";
import { getSupportedLanguage } from "./geoLocation";
import { twoStepFormData } from "./twoStepForm";
// import { settingNodepBonus } from "./modalCurrency";
import { settingInitialBonusValue } from "./twoStepForm";
import { updateTelInputLanguage } from "./itiTelInput";

export const languageOptions = [
  { code: "en", name: "EN", flag: "en" },
  { code: "fr", name: "FR", flag: "fr" },
  { code: "ru", name: "RU", flag: "ru" },
  { code: "es", name: "ES", flag: "es" },
  { code: "pt", name: "PT", flag: "pt" },
  { code: "ro", name: "RO", flag: "ro" },
  { code: "hu", name: "HU", flag: "hu" },
  { code: "pl", name: "PL", flag: "pl" },
  { code: "cs", name: "CS", flag: "cz" },
  { code: "sl", name: "SL", flag: "si" },
  { code: "nb", name: "NO", flag: "no" },
  { code: "sv", name: "SV", flag: "se" },
  { code: "sk", name: "SK", flag: "sk" },
  { code: "el", name: "EL", flag: "gr" },
  { code: "de", name: "DE", flag: "de" },
  { code: "it", name: "IT", flag: "it" },
  { code: "et", name: "ET", flag: "ee" },
  { code: "lv", name: "LV", flag: "lv" },
  { code: "lt", name: "LT", flag: "lt" },
  { code: "hr", name: "HR", flag: "hr" },
  { code: "bg", name: "BG", flag: "bg" },
  { code: "da", name: "DA", flag: "dk" },
  { code: "nl", name: "NL", flag: "nl" },
  { code: "fi", name: "FI", flag: "fi" },
  { code: "uk", name: "UK", flag: "ua" },
  { code: "zh", name: "ZH", flag: "cn" },
  { code: "ga", name: "GA", flag: "ie" },
  { code: "lb", name: "LB", flag: "lu" },
  { code: "mt", name: "MT", flag: "mt" },
  { code: "sw", name: "SW", flag: "tz" },
  { code: "rw", name: "RW", flag: "rw" },
  { code: "am", name: "AM", flag: "et" },
  { code: "lm", name: "LM", flag: "ug" },
  { code: "ar", name: "AR", flag: "sa" },
  { code: "ha", name: "HA", flag: "ng" },
  { code: "yo", name: "YO", flag: "ng" },
  { code: "ig", name: "IG", flag: "ng" },
  { code: "tw", name: "TW", flag: "gh" },
];

const countryLangMap = {
  EN: "en",
  GB: "en",
  FR: "fr",
  RO: "ro",
  HU: "hu",
  PL: "pl",
  CZ: "cs",
  SI: "sl",
  GR: "el",
  NO: "nb",
  SE: "sv",
  SK: "sk",
  RU: "ru",
  ES: "es",
  PT: "pt",
  DE: "de",
  AT: "de",
  IT: "it",
  EE: "et",
  LV: "lv",
  LT: "lt",
  HR: "hr",
  BG: "bg",
  DK: "da",
  NL: "nl",
  BE: "nl",
  FI: "fi",
  UA: "uk",
  CN: "zh",
  IE: "ga",
  LU: "lb",
  MT: "mt",
  TZ: "sw",
  KE: "sw",
  RW: "rw",
  ET: "am",
  UG: "lm",
  GH: "tw",
  SA: "ar",
  AE: "ar",
  EG: "ar",
  IQ: "ar",
  JO: "ar",
  KW: "ar",
  LB: "ar",
  MA: "ar",
  QA: "ar",
  OM: "ar",
  BH: "ar",
};

const html = document.querySelector("html");
const headerLangBtn = document.querySelector(".header-lang-btn");
const headerLangList = document.querySelector(".header-lang-list");

const RTL_LANGUAGES = ["ar"];

let lang;

function buildLanguageList() {
  headerLangList.innerHTML = languageOptions
    .map(
      ({ code, name, flag }) => `
      <li>
        <a data-lang="${code}" class="language-link flex items-center gap-2 bg-[#ffffff] px-3 py-[9px] transition-all" href="#">
          <img class="pointer-events-none shrink-0 overflow-hidden rounded-full" width="20" height="20" src="https://3344112-img.b-cdn.net/graphic/flags/flag-${flag}.svg" alt="${flag.toUpperCase()} flag" />
          <span class="pointer-events-none">${name}</span>
        </a>
      </li>`,
    )
    .join("");

  headerLangList.addEventListener("click", (e) => {
    const link = e.target.closest(".language-link");
    if (!link) return;
    e.preventDefault();
    const targetLang = link.getAttribute("data-lang");
    changeLanguage(targetLang);
    headerLangList.classList.remove("is-open");
    localStorage.setItem(
      "preferredLanguage",
      getSupportedLanguage(targetLang.toUpperCase()),
    );
    const currencyData = JSON.parse(localStorage.getItem("currencyData"));
    settingInitialBonusValue(currencyData.abbr);
    // settingNodepBonus(currencyData.abbr);
    twoStepFormData.lang = localStorage.getItem("preferredLanguage");
    document.querySelectorAll(".current-domain").forEach((domain) => {
      domain.innerHTML = window.location.hostname;
    });
  });
}

if (headerLangBtn) {
  headerLangBtn.addEventListener("click", () => {
    headerLangList.classList.toggle("is-open");
  });
}

function updateContent(lang) {
  const elements = document.querySelectorAll("[data-translate]");
  elements.forEach((element) => {
    const key = element.getAttribute("data-translate");
    element.innerHTML = translations[lang][key];
  });
}

function changeLanguage(lang) {
  updateContent(lang);
  updateButtonText(lang);
  setActiveLanguageBtn(lang);

  if (RTL_LANGUAGES.includes(lang)) {
    html.setAttribute("dir", "rtl");
    document.body.classList.add("is-rtl");
  } else {
    html.setAttribute("dir", "ltr");
    document.body.classList.remove("is-rtl");
  }

  updateTelInputLanguage(lang);
}

function setActiveLanguageBtn(currentLang) {
  document.querySelectorAll(".language-link").forEach((el) => {
    if (el.getAttribute("data-lang") === currentLang) {
      el.classList.add("active");
    } else {
      el.classList.remove("active");
    }
  });
}

function updateButtonText(lang) {
  const headerLangBtn = document.querySelector(".header-lang-btn img");
  const headerLangName = document.querySelector(".header-lang-btn span");
  const option = languageOptions.find((o) => o.code === lang);
  const flagCode = option ? option.flag : lang;

  headerLangBtn.setAttribute(
    "src",
    `https://3344112-img.b-cdn.net/graphic/flags/flag-${flagCode}.svg`,
  );
  headerLangName.innerHTML = option ? option.name : lang;
  html.setAttribute("lang", lang);
}

async function determineLanguage() {
  const location = geoData;

  if (location.countryCode === "NG") {
    const nigeriaLangs = ["ha", "yo", "ig"];
    const browserLang = (navigator.language || "").split("-")[0].toLowerCase();
    lang = nigeriaLangs.includes(browserLang) ? browserLang : "ha";
    return lang;
  }

  lang = countryLangMap[location.countryCode] || "en";
  return lang;
}

async function mainFunction() {
  try {
    buildLanguageList();
    lang = await determineLanguage();
    changeLanguage(lang);
    localStorage.setItem(
      "preferredLanguage",
      getSupportedLanguage(lang.toUpperCase()),
    );
    setTimeout(() => {
      const currencyData = JSON.parse(localStorage.getItem("currencyData"));
      // settingNodepBonus(currencyData.abbr);
      document.querySelectorAll(".current-domain").forEach((domain) => {
        domain.innerHTML = window.location.hostname;
      });
      settingInitialBonusValue(currencyData.abbr);
    }, 200);
  } catch (error) {
    console.error("Error determining language:", error);
  }
}
mainFunction();
