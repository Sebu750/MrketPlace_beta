/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        white: {
          DEFAULT: "#ffffff",
          warm: "#fdfcfb",
        },
        ivory: {
          50: "#fdfcf9",
          100: "#faf8f5",
          200: "#f5f2ed",
          300: "#ede9e2",
          400: "#e2dcd3",
        },
        stone: {
          50: "#f7f6f4",
          100: "#eeece8",
          200: "#e0dcd5",
          300: "#ccc6bc",
          400: "#b0a898",
          500: "#968d7d",
        },
        charcoal: {
          50: "#f5f5f5",
          100: "#e5e5e5",
          200: "#cccccc",
          300: "#999999",
          400: "#666666",
          500: "#4a4a4a",
          600: "#333333",
          700: "#2d2d2d",
          800: "#1f1f1f",
          900: "#141414",
          950: "#0a0a0a",
        },
        bronze: {
          50: "#f8f5f2",
          100: "#ede6dd",
          200: "#d9ccb8",
          300: "#c4ad93",
          400: "#a89070",
          500: "#8f7a60",
          600: "#756350",
          700: "#5e4f40",
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(4.5rem, 8vw, 9rem)", { lineHeight: "0.92", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(3.5rem, 6vw, 7rem)", { lineHeight: "0.95", letterSpacing: "-0.015em" }],
        "display": ["clamp(2.5rem, 4vw, 5rem)", { lineHeight: "1", letterSpacing: "-0.01em" }],
        "display-sm": ["clamp(1.75rem, 2.5vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.005em" }],
      },
      animation: {
        "fade-in": "fadeIn 1.2s ease-out forwards",
        "fade-in-up": "fadeInUp 1s cubic-bezier(0.22,1,0.36,1) forwards",
        "fade-in-slow": "fadeIn 2s ease-out forwards",
        "drift-up": "driftUp 1.4s cubic-bezier(0.22,1,0.36,1) forwards",
        "scroll-x": "scrollX 50s linear infinite",
        "reveal": "revealUp 1.1s cubic-bezier(0.22,1,0.36,1) forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        driftUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scrollX: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        revealUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      transitionDuration: {
        slow: "700ms",
        slower: "1000ms",
      },
    },
  },
  plugins: [],
};
