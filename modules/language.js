import { translations } from "/public/translations";
import { getSupportedLanguage, initialUiLang } from "./geoLocation";
import { settingInitialBonusValue, twoStepFormData } from "./twoStepForm";
import { setSpinAmount } from "./promocodeCheck";

const CDN = "https://3344112-img.b-cdn.net";

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

  // Заглушки, которые рисуются из JS, а не через data-translate:
  // «страна не найдена» у телефона и у селекта страны. updateContent их не видит.
  window.dispatchEvent(new CustomEvent("lang:changed", { detail: lang }));
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

  // В кнопке и списке — короткие коды, как на остальных лендах: полные
  // названия («Portuguese») не влезали в узкий список и обрезались.
  const languageNames = {
    en: "EN",
    fr: "FR",
    ro: "RO",
    hu: "HU",
    pl: "PL",
    cz: "CS",
    si: "SL",
    gr: "EL",
    no: "NB",
    se: "SV",
    sk: "SK",
    ru: "RU",
    es: "ES",
    pt: "PT",
    de: "DE",
    az: "AZ",
    it: "IT",
    ee: "ET",
    lv: "LV",
    lt: "LT",
    hr: "HR",
    kz: "KK",
    fi: "FI",
    dk: "DK",
    bg: "BG",
  };
  headerLangBtn.setAttribute(
    "src",
    CDN + `/graphic/flags/flag-${lang}.svg` ||
      CDN + `/graphic/flags/flag-en.svg`
  );
  headerLangName.innerHTML = languageNames[lang];
  document.querySelector("html").setAttribute("lang", lang);
}

export const availableLang = ["en", "fr"];

// язык уже выбран в geoLocation.js по браузеру
async function determineLanguage() {
  lang = initialUiLang;
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
      const currencyData = JSON.parse(localStorage.getItem("currencyData"));
      document.querySelectorAll(".current-domain").forEach((domain) => {
        domain.innerHTML = window.location.hostname;
      });
      setSpinAmount();
    }, 200);
  } catch (error) {
    console.error("Error determining language:", error);
  }
}
mainFunction();

document.querySelectorAll(".language-link").forEach((langBtn) => {
  langBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const targetLang = e.target.getAttribute("data-lang");
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
    setSpinAmount();
  });
});
