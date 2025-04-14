import { countryLanguagesMap, SupportedLanguages } from "../public/data";

export async function getLocation() {
  let url =
    "https://apiip.net/api/check?accessKey=0439ba6e-6092-46c2-9aeb-8662065bc43c";
  let response = await fetch(url);
  let data = await response.json();

  return data;
}

export const geoData = await getLocation();

export const getSupportedLanguage = (countryCode) => {
  if (countryCode in countryLanguagesMap) {
    const languages = countryLanguagesMap[countryCode];
    for (let language of languages) {
      if (SupportedLanguages.includes(language)) {
        return language;
      }
    }
  }
  return "az";
};

localStorage.setItem(
  "preferredLanguage",
  getSupportedLanguage(geoData.countryCode)
);

function setHeaderFlag(countryCode) {
  const headerFlagImage = document.querySelector(".header-country-flag");
  headerFlagImage.src = `./img/flags/${countryCode.toLowerCase()}.svg`;
  headerFlagImage.classList.remove("hidden");
}
setHeaderFlag(geoData.countryCode);
