/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0d0d0f",
        panel: "#161618",
        panel2: "#1d1d20",
        border: "#2a2a2e",
        ink: "#ececf1",
        sub: "#9a9aa5",
        accent: "#d97757",
        linear: "#5e6ad2",
        github: "#e6e6e6",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      keyframes: {
        fadein: {
          "0%": { opacity: 0, transform: "translateY(6px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.2 },
        },
      },
      animation: {
        fadein: "fadein 0.35s ease-out both",
        blink: "blink 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
