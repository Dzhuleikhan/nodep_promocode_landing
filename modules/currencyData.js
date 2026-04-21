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

fetch("/api/country-currencies")
  .then((res) => {
    if (!res.ok) throw new Error("Bad API response");
    return res.json();
  })
  .then((data) => {
    if (Array.isArray(data) && data.length > 0) {
      countryCurrencyData = data;
      window.dispatchEvent(new CustomEvent("currencyDataReady"));
    }
  })
  .catch(() => {});
