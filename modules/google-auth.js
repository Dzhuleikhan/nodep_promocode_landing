import { newDomain } from "./fetchingDomain";
import { getUrlParameter } from "./params";
import { receivedPromocode } from "./promocodeCheck";

// One-tap google auth
let currencyStoredData = localStorage.getItem("currencyData");
let currencyData = JSON.parse(currencyStoredData);
let currency = currencyData.abbr;

const cid = getUrlParameter("cid");
const partner = getUrlParameter("partner");
const offer = getUrlParameter("offer");
const lang = localStorage.getItem("preferredLanguage");

window.onload = function () {
  google.accounts.id.initialize({
    client_id:
      "757023558262-l0ffftmca719f5a4ksq4r5l2rugankkn.apps.googleusercontent.com",
    callback: handleCredentialResponse,
    auto_select: false,
    cancel_on_tap_outside: true,
  });
  google.accounts.id.prompt();
};

function handleCredentialResponse() {
  window.location.href = `https://${newDomain}/api/register?env=prod&type=google&currency=${currency}${receivedPromocode ? "&promocode=" + receivedPromocode : ""}&lang=${lang}${cid ? "&cid=" + cid : ""}${partner ? "&partner=" + partner : ""}${offer ? "&offer=" + offer : ""}`;
}
