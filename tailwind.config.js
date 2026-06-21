/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        ink: "#1B2430",
        canvas: "#F4F5F7",
        surface: "#FFFFFF",
        line: "#E3E6EB",
        sidebar: "#101B36",
        sidebarmuted: "#93A4D9",
        brand: {
          DEFAULT: "#2F5FE0",
          dark: "#1F46B8",
          light: "#E9EEFD",
        },
        gold: {
          DEFAULT: "#E89A3C",
          light: "#FCF0DF",
        },
        track: {
          technical: "#4338CA",
          technicalTint: "#ECEBFB",
          communication: "#D8584A",
          communicationTint: "#FBEAE8",
          aptitude: "#C5860F",
          aptitudeTint: "#FBF1DE",
          consistency: "#0E8F62",
          consistencyTint: "#E5F5EC",
          others: "#7C5CD6",
          othersTint: "#F1ECFB",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 27, 54, 0.06), 0 1px 0 rgba(16,27,54,0.04)",
        pop: "0 8px 24px rgba(16, 27, 54, 0.12)",
      },
      borderRadius: {
        xl2: "1.1rem",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(6px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.2s ease-out",
      },
    },
  },
  plugins: [],
}

