import {
  countryLanguagesMap,
  SupportedLanguages,
  countryZipCodeTranslates,
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

const fallback = { countryCode: "PL", currency: { code: "PLN" } };
export let geoData = fallback;

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

if (!localStorage.getItem("preferredLanguage")) {
  localStorage.setItem(
    "preferredLanguage",
    getSupportedLanguage(fallback.countryCode),
  );
}
export const language = localStorage.getItem("preferredLanguage");

function setHeaderFlag(countryCode) {
  const headerFlagImage = document.querySelector(".header-country-flag");
  headerFlagImage.src = `https://3344112-img.b-cdn.net/graphic/flags/flag-${countryCode.toLowerCase()}.svg`;
  headerFlagImage.classList.remove("hidden");
}
setHeaderFlag(geoData.countryCode);

getLocation()
  .then((data) => {
    geoData = data;
    localStorage.setItem(
      "preferredLanguage",
      getSupportedLanguage(data.countryCode),
    );
    setHeaderFlag(data.countryCode);
    window.dispatchEvent(new CustomEvent("geoReady", { detail: data }));
  })
  .catch(() => {
    window.dispatchEvent(new CustomEvent("geoReady", { detail: fallback }));
  });

export const settingZipCodePlaceholder = (countryCode) => {
  const zipCodeLabel = document.querySelector(".two-step-zipcode-label");
  const placeholder = countryZipCodeTranslates[countryCode] || "ZIP Code";
  zipCodeLabel.textContent = placeholder;
};

console.log("**__**");
