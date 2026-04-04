import { translations } from "/public/translations";
import { geoData } from "./geoLocation";
import { getSupportedLanguage } from "./geoLocation";
import { settingInitialBonusValue, twoStepFormData } from "./twoStepForm";
import { setSpinAmount } from "./promocodeCheck";
import { languageOptions, SupportedLanguages } from "../public/data";
import { updateTelInputLanguage } from "./itiTelInput";

const CDN = "https://3344112-img.b-cdn.net";

const headerLangBtn = document.querySelector(".header-lang-btn");
const headerLangList = document.querySelector(".header-lang-list");

let lang;

if (headerLangList) {
  headerLangList.innerHTML = "";

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
              src="https://3344112-img.b-cdn.net/graphic/flags/flag-${flag}.svg"
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

const RTL_LANGUAGES = ["ar"];
const html = document.querySelector("html");

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

export const availableLang = ["en", "fr"];

async function determineLanguage() {
  const location = geoData;
  lang = getSupportedLanguage(location.countryCode);
  return lang;
}

async function mainFunction() {
  try {
    lang = await determineLanguage();
    changeLanguage(lang);
    localStorage.setItem(
      "preferredLanguage",
      getSupportedLanguage(geoData.countryCode)
    );
    setTimeout(() => {
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
  setSpinAmount();
  headerLangList.classList.remove("is-open");
});
