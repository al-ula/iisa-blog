import { createSignal } from "solid-js";
import { DARK_THEME, LIGHT_THEME } from "../theme-config";
import Cookie from "js-cookie";
export const [theme, setTheme] = createSignal<
  typeof DARK_THEME | typeof LIGHT_THEME
>(LIGHT_THEME);

export function initTheme() {
  const storedTheme = loadTheme();
  const initialTheme = storedTheme === DARK_THEME ? DARK_THEME : LIGHT_THEME;
  setTheme(initialTheme);
  document.documentElement.setAttribute("data-theme", initialTheme);
}
export function updateTheme(newTheme: typeof DARK_THEME | typeof LIGHT_THEME) {
  if (theme() !== newTheme) { // Changed condition
    setTheme(newTheme);
  }
  document.documentElement.setAttribute("data-theme", newTheme);
}

export function saveTheme(theme: typeof DARK_THEME | typeof LIGHT_THEME) {
  Cookie.set("theme", theme);
}

export function loadTheme() {
  return Cookie.get("theme");
}
