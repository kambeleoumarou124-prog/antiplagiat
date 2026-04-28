/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--color-border)",
        input: "var(--color-border)",
        ring: "var(--color-primary)",
        background: "var(--color-bg)",
        foreground: "var(--color-text)",
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "#ffffff",
          light: "var(--color-primary-light)",
          dark: "var(--color-primary-dark)",
        },
        secondary: {
          DEFAULT: "var(--color-muted)",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "var(--color-error)",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f1f5f9",
          foreground: "var(--color-muted)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "#ffffff",
          light: "var(--color-accent-light)",
          dark: "var(--color-accent-dark)",
        },
        popover: {
          DEFAULT: "var(--color-surface)",
          foreground: "var(--color-text)",
        },
        card: {
          DEFAULT: "var(--color-surface)",
          foreground: "var(--color-text)",
        },
        plagiat: {
          vert: "var(--color-plagiat-vert)",
          orange: "var(--color-plagiat-orange)",
          rouge: "var(--color-plagiat-rouge)",
          critique: "var(--color-plagiat-critique)",
        }
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["IBM Plex Sans", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
