import {
  countryLanguagesMap,
  SupportedLanguages,
  countryZipCodeTranslates,
  getPostalCodeFormat,
} from "../public/data";

// На мобильной сети /geo-api не всегда укладывался в 2.5 с: запрос
// абортился, включался фолбэк PL/PLN — и игрок из Швейцарии или Шри-Ланки
// видел польскую валюту. Таймаут поднят, а на случай, если и его не хватит,
// ниже есть фоновая доливка.
const GEO_TIMEOUT_MS = 6000;
const GEO_RETRY_TIMEOUT_MS = 10000;

const requestLocation = (timeout = GEO_TIMEOUT_MS) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  const url = `https://${window.location.host}/geo-api/api/check?accessKey=0439ba6e-6092-46c2-9aeb-8662065bc43c`;

  return fetch(url, { signal: controller.signal })
    .finally(() => clearTimeout(timer))
    .catch(() => null);
};

const FALLBACK_GEO = { countryCode: "PL", currency: { code: "PLN" } };

export async function getLocation() {
  try {
    // запрос уже стартовал инлайном в <head> — забираем его результат,
    // а свой шлём только если тот тег почему-то не отработал
    const response = await (window.__geoRequest ?? requestLocation());

    if (!response || !response.ok) throw new Error("Bad API response");

    const data = await response.json();

    // пустой countryCode бесполезен так же, как отсутствие ответа
    if (!data?.countryCode) throw new Error("No countryCode in response");

    return data;
  } catch (err) {
    console.log("API failed, applying fallback GEO");
    // помечаем, чтобы знать: это дефолт, а не реальная страна игрока
    return { ...FALLBACK_GEO, isFallback: true };
  }
}

// Фолбэк — не ответ, а заглушка. Пробуем ещё раз своим запросом (инлайновый
// уже мёртв) и, если страна оказалась другой, чиним geoData на месте и зовём
// подписчиков событием geo:refined. Ничего не блокирует: ленд к этому моменту
// давно отрисован.
//
// Возвращает true, если гео реально ответило — по этому признаку снимается
// isGeoFallback. Выводить флаг из кода страны нельзя: игрок правда может быть
// из Польши, и тогда ему полагается злотый, а не «нейтральный» доллар.
const refineGeo = async () => {
  const response = await requestLocation(GEO_RETRY_TIMEOUT_MS);

  if (!response || !response.ok) return false;

  try {
    const data = await response.json();

    if (!data?.countryCode) return false;

    // страна совпала с дефолтной, но это подтверждённый ответ, а не заглушка
    if (data.countryCode === geoData.countryCode) return true;

    Object.assign(geoData, data);
    window.dispatchEvent(new CustomEvent("geo:refined", { detail: geoData }));
    return true;
  } catch {
    // битый JSON — остаёмся на дефолте
    return false;
  }
};

// Два разных обещания на два разных случая:
//   geoReady    — «есть хоть что-то», резолвится сразу, в том числе дефолтом;
//   geoConfirmed — «страна известна точно», ждёт реального ответа или конца
//                  доливки. Валюту ставим по geoReady, а по geoConfirmed
//                  переставляем: дефолтный PLN игроку из Шри-Ланки показывать
//                  нельзя, но и держать суммы пустыми всю доливку не годится.
// Флаг для тех, кому важно отличить дефолт от ответа сервера.
export let isGeoFallback = false;

let confirmGeo;
export const geoConfirmed = new Promise((resolve) => {
  confirmGeo = resolve;
});

// Гео не имеет права блокировать ленд. Раньше здесь стоял top-level await:
// любой затуп /api/check замораживал выполнение всех модулей разом, вплоть до
// вечного прелоадера. Теперь отдаём дефолт сразу, а ответ доливаем в тот же
// объект — импортёры держат ссылку и видят обновление.
export const geoData = { countryCode: "PL", currency: { code: "PLN" } };

// getLocation() не реджектится никогда (внутри try/catch + abort по таймауту),
// поэтому geoReady гарантированно резолвится и ничего не подвешивает
export const geoReady = getLocation().then(({ isFallback, ...data }) => {
  Object.assign(geoData, data);
  isGeoFallback = Boolean(isFallback);
  setHeaderFlag(geoData.countryCode);
  // это событие уже слушает itiTelInput — пересоздаёт телефонный инпут
  // с определившейся страной
  window.dispatchEvent(new CustomEvent("geoReady", { detail: geoData }));

  if (isFallback) {
    // доливка либо принесёт настоящую страну, либо подтвердит, что дефолт —
    // это всё, что у нас есть: в обоих случаях гео считается решённым
    refineGeo().then((confirmed) => {
      isGeoFallback = !confirmed;
      confirmGeo(geoData);
    });
  } else {
    confirmGeo(geoData);
  }

  return geoData;
});

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

// Коды браузера, расходящиеся с кодами словарей ленда
const BROWSER_LANG_ALIASES = {
  da: "dk", // датский: браузер шлёт ISO-код da, словарь лежит под dk
  no: "nb", // норвежский: браузер шлёт макро-код
  nn: "nb", // нюнорск отдаём на букмоле
};

// Ленд открывается на языке браузера; не поддерживаем его — показываем en.
// Считаем здесь, а не в language.js: значение уходит в /register как lang,
// а twoStepForm читает localStorage раньше, чем language.js успевает отработать.
export const getInitialLanguage = () => {
  const browserLang = navigator.language.split("-")[0];
  const lang = BROWSER_LANG_ALIASES[browserLang] ?? browserLang;

  return SupportedLanguages.includes(lang) ? lang : "en";
};

localStorage.setItem("preferredLanguage", getInitialLanguage());
export const language = localStorage.getItem("preferredLanguage");

// Флаг в шапке ставим по приходу гео: на дефолтной стране он врал бы про Польшу
function setHeaderFlag(countryCode) {
  const headerFlagImage = document.querySelector(".header-country-flag");
  if (!headerFlagImage) return;
  headerFlagImage.src = `https://3344112-img.b-cdn.net/graphic/flags/flag-${countryCode.toLowerCase()}.svg`;
  headerFlagImage.classList.remove("hidden");
}

window.addEventListener("geo:refined", () => setHeaderFlag(geoData.countryCode));

export const settingZipCodePlaceholder = (countryCode) => {
  const zipCodeLabel = document.querySelector(".two-step-zipcode-label");
  const base = countryZipCodeTranslates[countryCode] || "ZIP Code";
  const format = getPostalCodeFormat(countryCode);
  // Подсказываем юзеру ожидаемый формат прямо в лейбле, напр. "Kod pocztowy (00-001)"
  zipCodeLabel.textContent = format?.example ? `${base} (${format.example})` : base;
};
