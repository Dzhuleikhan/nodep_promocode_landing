import { translations } from "/public/translations";
import { geoData, language } from "./geoLocation";
import { getSupportedLanguage } from "./geoLocation";
import { settingInitialBonusValue } from "./twoStepForm";
import { setSpinAmount } from "./promocodeCheck";
import { SupportedLanguages } from "../public/data";
import { updateTelInputLanguage } from "./itiTelInput";

const CDN = "https://3344112-img.b-cdn.net";

const headerLangBtn = document.querySelector(".header-lang-btn");
const headerLangList = document.querySelector(".header-lang-list");
const html = document.querySelector("html");

let languageOptions = {};

async function getLanguageOptions() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    const response = await fetch("/api/language-options", {
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!response.ok) throw new Error("Bad API response");
    const data = await response.json();
    if (data && typeof data === "object" && !Array.isArray(data)) return data;
    throw new Error("Invalid format");
  } catch (e) {
    return {
      en: { name: "EN", flag: "gb" },
      pl: { name: "PL", flag: "pl" },
    };
  }
}

function updateButtonText(lang) {
  const langBtnImg = headerLangBtn.querySelector("img");
  const headerLangName = document.querySelector(".header-lang-btn span");

  const option = languageOptions[lang] || languageOptions.en;
  if (!option) return;
  const { name, flag } = option;

  langBtnImg.setAttribute(
    "src",
    CDN + `/graphic/flags/flag-${flag}.svg` ||
      CDN + `/graphic/flags/flag-en.svg`,
  );
  headerLangName.innerHTML = name;
  html.setAttribute("lang", lang);
}

function updateContent(lang) {
  const elements = document.querySelectorAll("[data-translate]");
  elements.forEach((element) => {
    const key = element.getAttribute("data-translate");
    element.innerHTML = translations[lang][key];
  });
}

function getInitialLanguage(country, fallbackLang) {
  const browserLang = navigator.language.split("-")[0];
  const supportedLang = SupportedLanguages.includes(browserLang)
    ? browserLang
    : fallbackLang;

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

function updateCurrentDomain() {
  document.querySelectorAll(".current-domain").forEach((domain) => {
    domain.innerHTML = window.location.hostname;
  });
}

async function initLanguage() {
  try {
    languageOptions = await getLanguageOptions();

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
  } catch (e) {
    console.error("Language init failed, continuing with defaults");
  }

  const initialLang = getInitialLanguage(geoData.countryCode, language);
  changeLanguage(initialLang);

  setTimeout(() => {
    updateCurrentDomain();
    setSpinAmount();
  }, 200);
}
initLanguage();

window.addEventListener("geoReady", (e) => {
  const lang = getInitialLanguage(
    e.detail.countryCode,
    getSupportedLanguage(e.detail.countryCode),
  );
  changeLanguage(lang);
  document.body.classList.add("geo-ready");
});

headerLangList.addEventListener("click", (e) => {
  e.preventDefault();
  const link = e.target.closest("a[data-lang]");
  const targetLang = link.getAttribute("data-lang");
  changeLanguage(targetLang);
  localStorage.setItem("preferredLanguage", getSupportedLanguage(targetLang));

  const currencyData = JSON.parse(localStorage.getItem("currencyData"));
  settingInitialBonusValue(currencyData.abbr);
  updateCurrentDomain();
  setSpinAmount();
  headerLangList.classList.remove("is-open");
});
