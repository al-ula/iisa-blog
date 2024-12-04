import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import daisyui from "daisyui";
import catppuccin from "@catppuccin/daisyui";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    theme: {
      extend: {
      },
    },
  },
  plugins: [
    typography,
    daisyui,
  ],
  daisyui: {
    themes: [
      catppuccin("latte"),
      catppuccin("mocha"),
      catppuccin("macchiato"),
      catppuccin("frappe"),
      "light",
      "dark",
    ],
  },
} satisfies Config;
