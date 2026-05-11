import { translations } from "/public/translations";
import { geoData } from "./geoLocation";
import { getSupportedLanguage } from "./geoLocation";
import { settingInitialBonusValue, twoStepFormData } from "./twoStepForm";
import { languageOptions } from "../public/data";

const CDN = "https://3344112-img.b-cdn.net";

const headerLangBtn = document.querySelector(".header-lang-btn");
const headerLangList = document.querySelector(".header-lang-list");
const html = document.querySelector("html");

if (headerLangList) {
  headerLangList.innerHTML = Object.entries(languageOptions)
    .map(([langCode, { name, flag }]) => {
      return `
        <li>
          <a
            href="#"
            data-lang="${langCode}"
            class="language-link flex items-center gap-2 bg-[#ffffff] px-3 py-[9px] transition-all"
          >
            <img
              class="pointer-events-none shrink-0 overflow-hidden rounded-full"
              width="20"
              height="20"
              src="${CDN}/graphic/flags/flag-${flag}.svg"
              alt="${name} flag"
            />
            <span class="pointer-events-none">${name}</span>
          </a>
        </li>
      `;
    })
    .join("");
}

if (headerLangBtn) {
  headerLangBtn.addEventListener("click", () => {
    headerLangList.classList.toggle("is-open");
  });
}

let lang;

function updateContent(lang) {
  const elements = document.querySelectorAll("[data-translate]");
  elements.forEach((element) => {
    const key = element.getAttribute("data-translate");
    element.innerHTML = translations[lang][key];
  });
}

function updateButtonText(lang) {
  const langBtnImg = headerLangBtn.querySelector("img");
  const headerLangName = document.querySelector(".header-lang-btn span");

  const { name, flag } = languageOptions[lang] || languageOptions.en;

  langBtnImg.setAttribute(
    "src",
    CDN + `/graphic/flags/flag-${flag}.svg` ||
      CDN + `/graphic/flags/flag-en.svg`
  );
  headerLangName.innerHTML = name;
  html.setAttribute("lang", lang);
}

const RTL_LANGUAGES = ["ar"];

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

export const availableLang = ["en", "fr"];

const countryLangMap = {
  EN: "en",
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
  IT: "it",
  EE: "et",
  LV: "lv",
  LT: "lt",
  HR: "hr",
  DK: "dk",
  FI: "fi",
  BG: "bg",
  NL: "nl",
  UA: "uk",
  SA: "ar",
  CN: "zh",
  KE: "sw",
  TZ: "sw",
  ET: "am",
  UG: "lm",
  RW: "rw",
  IE: "ga",
  LU: "lb",
  MT: "mt",
  GH: "tw",
};

async function determineLanguage() {
  const location = geoData;

  if (location.countryCode === "NG") {
    const browserLang = (navigator.language || navigator.languages?.[0] || "")
      .toLowerCase()
      .split("-")[0];
    const nigeriaLangs = ["ha", "yo", "ig"];
    lang = nigeriaLangs.includes(browserLang) ? browserLang : "ha";
    return lang;
  }

  lang = countryLangMap[location.countryCode] || "en";
  return lang;
}

async function mainFunction() {
  try {
    lang = await determineLanguage();
    changeLanguage(lang);
    localStorage.setItem(
      "preferredLanguage",
      getSupportedLanguage(lang.toUpperCase())
    );
    setTimeout(() => {
      document.querySelectorAll(".current-domain").forEach((domain) => {
        domain.innerHTML = window.location.hostname;
      });
    }, 200);
  } catch (error) {
    console.error("Error determining language:", error);
  }
}
mainFunction();

headerLangList.addEventListener("click", (e) => {
  e.preventDefault();
  const link = e.target.closest("a[data-lang]");
  if (!link) return;
  const targetLang = link.getAttribute("data-lang");
  changeLanguage(targetLang);
  localStorage.setItem(
    "preferredLanguage",
    getSupportedLanguage(targetLang.toUpperCase())
  );
  const currencyData = JSON.parse(localStorage.getItem("currencyData"));
  settingInitialBonusValue(currencyData.abbr);
  twoStepFormData.lang = localStorage.getItem("preferredLanguage");
  document.querySelectorAll(".current-domain").forEach((domain) => {
    domain.innerHTML = window.location.hostname;
  });
  headerLangList.classList.remove("is-open");
});
