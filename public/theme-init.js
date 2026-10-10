/*
 * Pre-paint theme bootstrap.
 *
 * Loaded as a blocking <script> in the document <head> (both the SSR shell in
 * src/routes/__root.tsx and the static SPA shell written by
 * scripts/build-for-freebuff.sh), so the stored theme class is on <html> before
 * the first paint and users never see a flash of the wrong theme.
 *
 * Keep this file dependency-free and synchronous: anything async runs too late
 * to prevent the flash.
 */
try {
  var theme = "brutal";
  try {
    var settings = JSON.parse(localStorage.getItem("slashai.settings") || "{}");
    if (settings && typeof settings.theme === "string") theme = settings.theme;
  } catch (e) {
    /* unreadable settings - keep the default */
  }
  if (theme === "light") document.documentElement.classList.add("light");
  else if (theme === "amoled") document.documentElement.classList.add("amoled");
  else if (theme === "glass") document.documentElement.classList.add("glass");
  else if (theme === "brutal") document.documentElement.classList.add("brutal");
} catch (e) {
  /* never block the page over a theme */
}
