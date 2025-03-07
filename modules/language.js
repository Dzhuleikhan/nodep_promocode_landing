import { translations } from "/public/translations";
import { getLocation } from "./geoLocation";
import { getSupportedLanguage } from "./geoLocation";
import { settingInitialBonusValue, twoStepFormData } from "./twoStepForm";
import { settingNodepBonus } from "./modalCurrency";

const headerLangBtn = document.querySelector(".header-lang-btn");
const headerLangList = document.querySelector(".header-lang-list");
const languageLinks = document.querySelectorAll(".language-link");

let lang;

if (headerLangBtn) {
  headerLangBtn.addEventListener("click", () => {
    headerLangList.classList.toggle("is-open");
  });
}

languageLinks.forEach((link) => {
  if (link) {
    link.addEventListener("click", () => {
      headerLangList.classList.remove("is-open");
    });
  }
});

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

  const languageNames = {
    en: "English",
    fr: "Français",
    ro: "Română",
    hu: "Magyar",
    pl: "Polski",
    cz: "Čeština",
    sl: "Slovenščina",
    gr: "Ελληνικά",
    no: "Norwegian",
    se: "Svenska",
    sk: "Slovenčina",
    ru: "Русский",
    es: "Español",
    pt: "Português",
  };
  headerLangBtn.setAttribute(
    "src",
    `./img/flags/${lang}.svg` || `./img/flags/en.svg`
  );
  headerLangName.innerHTML = languageNames[lang];
  document.querySelector("html").setAttribute("lang", lang);
}

// async function determineLanguage() {
//   const location = await getLocation();
//   console.log(location.countryCode);

//   const countryLangMap = {
//     EN: "en",
//     FR: "fr",
//     RO: "ro",
//     HU: "hu",
//     PL: "pl",
//     CZ: "cz",
//     SL: "sl",
//     GR: "gr",
//     NO: "no",
//     SE: "se",
//     SK: "sk",
//     RU: "ru",
//     ES: "es",
//     PT: "pt",
//     // Add more country codes and their corresponding languages as needed
//   };
//   lang = countryLangMap[location.countryCode] || "en";

//   return lang;
// }

// async function mainFunction() {
//   try {
//     lang = await determineLanguage();

//     changeLanguage(lang);
//     localStorage.setItem("preferredLanguage", lang);
//     setTimeout(() => {
//       const currencyData = JSON.parse(localStorage.getItem("currencyData"));
//       settingNodepBonus(currencyData.abbr);
//       document.querySelectorAll(".current-domain").forEach((domain) => {
//         domain.innerHTML = window.location.hostname;
//       });
//     }, 200);
//   } catch (error) {
//     console.error("Error determining language:", error);
//   }
// }
// mainFunction();

const detectedLanguage = localStorage.getItem("preferredLanguage");

function applyTranslations(lang) {
  const language = translations[lang] ? lang : "en"; // Use 'en' if language not in translations
  const elements = document.querySelectorAll("[data-translate]");

  elements.forEach((element) => {
    const key = element.getAttribute("data-translate");
    if (translations[language] && translations[language][key]) {
      element.innerHTML = translations[language][key];
    }
  });
  document.querySelectorAll(".current-domain").forEach((domain) => {
    domain.innerHTML = window.location.hostname;
  });
}

applyTranslations(detectedLanguage);
updateButtonText(detectedLanguage);

document.querySelectorAll(".language-link").forEach((langBtn) => {
  langBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const targetLang = e.target.getAttribute("data-lang");
    // changeLanguage(targetLang);
    applyTranslations(targetLang);
    localStorage.setItem(
      "preferredLanguage",
      getSupportedLanguage(targetLang.toUpperCase())
    );
    const currencyData = JSON.parse(localStorage.getItem("currencyData"));
    settingInitialBonusValue(currencyData.abbr);
    settingNodepBonus(currencyData.abbr);
    twoStepFormData.lang = localStorage.getItem("preferredLanguage");
    document.querySelectorAll(".current-domain").forEach((domain) => {
      domain.innerHTML = window.location.hostname;
    });
  });
});
