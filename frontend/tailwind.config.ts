import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fff7f0",
          100: "#ffead9",
          200: "#ffd4b3",
          300: "#ffb380",
          400: "#ff934d",
          500: "#ff751f",
          600: "#e5600a",
          700: "#bf4e08",
          800: "#993e06",
          900: "#732f05",
        },
        accent: {
          50: "#fdf4ff",
          100: "#fae8ff",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",
        },
      },
    },
  },
  plugins: [],
};

export default config;
