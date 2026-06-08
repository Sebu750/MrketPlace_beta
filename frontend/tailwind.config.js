/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#fdfcf9",
          100: "#faf7f0",
          200: "#f5f0e4",
          300: "#ede5d3",
          400: "#e0d4bb",
        },
        parchment: {
          50: "#fdfbf6",
          100: "#f8f3ea",
          200: "#f0e8d8",
          300: "#e5d9c1",
        },
        crimson: {
          50: "#fdf2f3",
          100: "#fce4e6",
          200: "#f9cdd2",
          300: "#f3a5ae",
          400: "#ea6b7a",
          500: "#dc3545",
          600: "#c41e3a",
          700: "#a01830",
          800: "#7a1228",
          900: "#5c0e1e",
        },
        gold: {
          50: "#faf6ef",
          100: "#f0e6d0",
          200: "#e0cda3",
          300: "#cfae72",
          400: "#bb9457",
          500: "#a07a3e",
          600: "#845f30",
          700: "#6b4828",
          800: "#5a3c26",
          900: "#4d3423",
        },
        noir: {
          50: "#f6f6f6",
          100: "#e7e7e7",
          200: "#d1d1d1",
          300: "#b0b0b0",
          400: "#888888",
          500: "#6d6d6d",
          600: "#5d5d5d",
          700: "#4f4f4f",
          800: "#1a1a1a",
          900: "#0d0d0d",
          950: "#080808",
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 1s ease-out forwards",
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        "scroll-x": "scrollX 30s linear infinite",
        "drift-up": "driftUp 1.2s cubic-bezier(0.22,1,0.36,1) forwards",
        "fade-in-slow": "fadeIn 1.6s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scrollX: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        driftUp: {
          "0%": { opacity: "0", transform: "translateY(32px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
