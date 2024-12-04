import { createSignal, onMount } from "solid-js";
import {
  loadTheme,
  saveTheme,
  setTheme,
  theme,
  updateTheme,
} from "~/signals/theme";
import { DARK_THEME, LIGHT_THEME } from "../theme-config";

/**
 * ThemeToggle is a functional component that provides a toggle switch for switching
 * between dark and light themes. It uses the Solid.js createSignal and onMount hooks
 * to manage and initialize the theme state. The component checks the stored theme
 * on mount and updates the DOM accordingly. The toggle switch allows users to switch
 * themes, updating both the application state and persisting the choice in a cookie.
 */
export const ThemeToggle = () => {
  const [toggle, setToggle] = createSignal(false);

  onMount(() => {
    const storedTheme = loadTheme() || LIGHT_THEME; // Provide fallback to LIGHT_THEME
    setToggle(storedTheme === DARK_THEME);
    updateTheme(storedTheme);
  });

  /**
   * Toggle the theme between light and dark, persisting the choice in a cookie
   * and updating the application state.
   */
  const toggleTheme = () => {
    // First update the toggle state
    const newToggle = !toggle();
    setToggle(newToggle);

    // Then set the theme based on the toggle state
    const newTheme = newToggle ? DARK_THEME : LIGHT_THEME;
    setTheme(newTheme);
    saveTheme(newTheme);
    updateTheme(newTheme);
  };

  return (
    <label class="place-items-center grid cursor-pointer scale-78">
      <input
        type="checkbox"
        class="col-span-2 col-start-1 row-start-1 bg-base-content theme-controller toggle"
        checked={toggle()}
        onChange={toggleTheme} // Changed from onClick to onChange
      />
      <svg
        class="col-start-1 row-start-1 fill-base-100 stroke-base-100"
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
      </svg>
      <svg
        class="col-start-2 row-start-1 fill-base-100 stroke-base-100"
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </label>
  );
};
