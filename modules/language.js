import { translations } from "/public/translations";
import { geoData, language } from "./geoLocation";
import { getSupportedLanguage } from "./geoLocation";
import { settingInitialBonusValue, twoStepFormData } from "./twoStepForm";
import { setSpinAmount } from "./promocodeCheck";
import { languageOptions, SupportedLanguages } from "../public/data";

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

function getInitialLanguage(country, fallbackLang) {
  const browserLang = navigator.language.split("-")[0];
  const supportedLang = SupportedLanguages.includes(browserLang)
    ? browserLang
    : fallbackLang;

  if (country === "NG") {
    const nigeriaLangs = ["ha", "yo", "ig"];
    return nigeriaLangs.includes(browserLang) ? browserLang : "ha";
  }
  if (country === "BE") {
    if (supportedLang && browserLang !== "nl") {
      return browserLang;
    }
    return "en";
  }
  if (country === "CH") {
    return supportedLang ?? "de";
  }
  if (country === "CA") {
    return supportedLang ?? "en";
  }
  if (country === "CY") {
    return supportedLang ?? "el";
  }
  if (country === "LU") {
    return supportedLang ?? "fr";
  }
  if (country === "EE") {
    return supportedLang ?? "et";
  }

  return fallbackLang;
}

function updateCurrentDomain() {
  document.querySelectorAll(".current-domain").forEach((domain) => {
    domain.innerHTML = window.location.hostname;
  });
}

async function initLanguage() {
  try {
    const initialLang = getInitialLanguage(geoData.countryCode, language);
    changeLanguage(initialLang);
    localStorage.setItem(
      "preferredLanguage",
      getSupportedLanguage(geoData.countryCode)
    );

    setTimeout(() => {
      updateCurrentDomain();
      setSpinAmount();
    }, 200);
  } catch (error) {
    console.error("Error determining language:", error);
  }
}
initLanguage();

headerLangList.addEventListener("click", (e) => {
  e.preventDefault();
  const link = e.target.closest("a[data-lang]");
  if (!link) return;
  const targetLang = link.getAttribute("data-lang");
  changeLanguage(targetLang);
  localStorage.setItem("preferredLanguage", getSupportedLanguage(targetLang));

  const currencyData = JSON.parse(localStorage.getItem("currencyData"));
  settingInitialBonusValue(currencyData.abbr);
  twoStepFormData.lang = localStorage.getItem("preferredLanguage");
  updateCurrentDomain();
  setSpinAmount();
  headerLangList.classList.remove("is-open");
});
