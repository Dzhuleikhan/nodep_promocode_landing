export function getUrlParameter(name) {
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(window.location.href);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Set default bonusType in URL if not present
const url = new URL(window.location.href);
if (!url.searchParams.has("bonusType")) {
  url.searchParams.set("bonusType", "freebet");
  window.history.replaceState({}, "", url);
}

// Тестовый пользователь: если в URL есть testUser=yes и непустой testUserKey,
// прокидываем их в регистрацию
export function getTestUserParams() {
  const testUser = getUrlParameter("testUser");
  const testUserKey = getUrlParameter("testUserKey")?.trim();
  if (testUser !== "yes" || !testUserKey) return "";
  return `&testUser=yes&testUserKey=${encodeURIComponent(testUserKey)}`;
}
