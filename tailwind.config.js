/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        panel: "var(--color-panel)",
        panel2: "var(--color-panel2)",
        border: "var(--color-border)",
        ink: "var(--color-ink)",
        sub: "var(--color-sub)",
        accent: "var(--color-accent)",
        linear: "var(--color-linear)",
        code: "var(--color-code)",
        onaccent: "#0d0d0f",
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
