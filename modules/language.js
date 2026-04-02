import { translations } from "/public/translations";
import { geoData, language } from "./geoLocation";
import { getSupportedLanguage } from "./geoLocation";
import { setSpinAmount } from "./promocodeCheck";
import {
  settingHeroBonusValues,
  settingCashBonusValues,
} from "./modalCurrency";
import { languageOptions, SupportedLanguages } from "../public/data";
import { getUrlParameter } from "./params";

const bonusType = getUrlParameter("bonusType") || "freebet";

const CDN = "https://3344112-img.b-cdn.net";

const headerLangBtn = document.querySelector(".header-lang-btn");
const headerLangList = document.querySelector(".header-lang-list");
const html = document.querySelector("html");

if (headerLangList) {
  headerLangList.innerHTML = "";

  headerLangList.innerHTML = Object.entries(languageOptions)
    .map(([langCode, { name, flag }]) => {
      return `
        <li>
          <a
            href="#"
            data-lang="${langCode}"
            class="language-link flex items-center gap-[5px] rounded-lg p-[6px] transition-all hover:bg-[#FFE73833]"
          >
            <img
              class="pointer-events-none shrink-0 overflow-hidden rounded-full"
              width="20"
              height="20"
              src="https://3344112-img.b-cdn.net/graphic/flags/flag-${flag}.svg"
              alt="${name} flag"
            />
            <span class="pointer-events-none text-white">${name}</span>
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

function updateButtonText(lang) {
  const langBtnImg = headerLangBtn.querySelector("img");
  const headerLangName = document.querySelector(".header-lang-btn span");

  const { name, flag } = languageOptions[lang] || languageOptions.en;

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
    if (bonusType === "cash") {
      if (key === "heroTitle" && translations[lang].heroTitleCash) {
        element.innerHTML = translations[lang].heroTitleCash;
        return;
      }
      if (key === "bonusName" && translations[lang].bonusNameCash) {
        element.innerHTML = translations[lang].bonusNameCash;
        return;
      }
    }
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

function refreshHeroBonusValues() {
  const currencyData = JSON.parse(localStorage.getItem("currencyData"));
  if (currencyData) {
    settingHeroBonusValues(currencyData.abbr);
    if (bonusType === "cash") {
      settingCashBonusValues(currencyData.abbr);
    }
  }
}

const RTL_LANGUAGES = ["ar"];
const CHICKEN_SRC_LTR =
  "https://3344112-img.b-cdn.net/graphic/landings/сhickenroannew/chicken-1.webp";
const CHICKEN_SRC_RTL =
  "https://3344112-img.b-cdn.net/graphic/landings/сhickenroannew/chicken-rtl-1.webp";

function applyDirection(lang) {
  const isRtl = RTL_LANGUAGES.includes(lang);
  html.setAttribute("dir", isRtl ? "rtl" : "ltr");
  document.body.classList.toggle("rtl", isRtl);

  const chickenImages = document.querySelectorAll(".chicken-img");
  chickenImages.forEach((img) => {
    img.src = isRtl ? CHICKEN_SRC_RTL : CHICKEN_SRC_LTR;
  });
}

function changeLanguage(lang) {
  updateContent(lang);
  updateButtonText(lang);
  setActiveLanguageBtn(lang);
  applyDirection(lang);
  refreshHeroBonusValues();
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
  const initialLang = getInitialLanguage(geoData.countryCode, language);
  changeLanguage(initialLang);

  setTimeout(() => {
    updateCurrentDomain();
    setSpinAmount();
  }, 200);
}
initLanguage();

headerLangList.addEventListener("click", (e) => {
  e.preventDefault();
  const link = e.target.closest("a[data-lang]");
  if (!link) return;
  const targetLang = link.getAttribute("data-lang");
  changeLanguage(targetLang);
  localStorage.setItem("preferredLanguage", getSupportedLanguage(targetLang));
  updateCurrentDomain();
  setSpinAmount();
  headerLangList.classList.remove("is-open");
});
