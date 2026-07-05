import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1d2428",
        paper: "#f7f6f1",
        line: "#d9d7cc",
        dataBlue: "#245b7b",
        dataGreen: "#4b6f44",
        dataGold: "#a66f2b"
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Georgia", "Times New Roman", "serif"]
      },
      boxShadow: {
        soft: "0 18px 45px rgba(24, 31, 35, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
