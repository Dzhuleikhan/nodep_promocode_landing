const fallback = [
  {
    countries: [
      "US",
      "EC",
      "SV",
      "ZW",
      "LB",
      "VN",
      "CU",
      "HT",
      "MH",
      "NA",
      "WS",
      "TL",
      "EN",
    ],
    countryCurrency: "USD",
    countryCurrencySymbol: "$",
    countryCurrencyFullName: "US Dollar",
    countryCurrencyIcon: "https://3344112-img.b-cdn.net/currency_icons/USD.svg",
    amount: "5.000",
    spins: "200FS",
  },
];

export let countryCurrencyData = fallback;

const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 2500);

fetch("/api/country-currencies", {
  signal: controller.signal,
})
  .then((res) => {
    clearTimeout(timer);
    if (!res.ok) throw new Error("Bad API response");
    return res.json();
  })
  .then((data) => {
    if (Array.isArray(data) && data.length > 0) {
      countryCurrencyData = data;
    }
  })
  .catch(() => {});
