import type { Config } from "tailwindcss";

/**
 * As cores e fontes vêm de variáveis CSS definidas em src/app/globals.css.
 * Para trocar a identidade visual, edite apenas as variáveis lá — nada aqui.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--color-bg) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-2": "rgb(var(--color-surface-2) / <alpha-value>)",
        fg: "rgb(var(--color-fg) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        accent: {
          DEFAULT: "rgb(var(--color-accent) / <alpha-value>)",
          hover: "rgb(var(--color-accent-hover) / <alpha-value>)",
          fg: "rgb(var(--color-accent-fg) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
      maxWidth: {
        content: "1120px",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(18,18,18,0.04), 0 8px 30px rgba(18,18,18,0.06)",
        lift: "0 10px 40px rgba(18,18,18,0.12)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "pulse-cta": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgb(var(--color-accent) / 0.45)" },
          "50%": { boxShadow: "0 0 0 10px rgb(var(--color-accent) / 0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        "slide-up": "slide-up 0.25s ease-out both",
        "pulse-cta": "pulse-cta 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
