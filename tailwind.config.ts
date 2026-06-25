import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design System — Pharmacie Hospitalière
        // Note: Pour shadcn/ui, utilisez des variables CSS dans votre globals.css
        background: "hsl(var(--background))",
        surface: "#FFFFFF",
        primary: {
          DEFAULT: "#103B4A",
          foreground: "#FFFFFF",
          50: "#E8F0F2",
          100: "#C5D9DE",
          200: "#9EBEC6",
          300: "#77A3AE",
          400: "#5A8E9A",
          500: "#103B4A",
          600: "#0E333F",
          700: "#0C2B35",
          800: "#0A232B",
          900: "#081B21",
        },
        secondary: {
          DEFAULT: "#6D8B74",
          foreground: "#FFFFFF",
          50: "#F0F4F1",
          100: "#D9E3DB",
          200: "#BFCFC2",
          300: "#A5BBA9",
          400: "#8BA790",
          500: "#6D8B74",
          600: "#5C7662",
          700: "#4B6150",
          800: "#3A4C3E",
          900: "#29372C",
        },
        accent: {
          DEFAULT: "#B87333",
          foreground: "#FFFFFF",
        },
        success: { DEFAULT: "#16A34A", foreground: "#FFFFFF" },
        warning: { DEFAULT: "#D97706", foreground: "#FFFFFF" },
        error: { DEFAULT: "#DC2626", foreground: "#FFFFFF" },
        info: { DEFAULT: "#0284C7", foreground: "#FFFFFF" },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "#103B4A",
        foreground: "#0F172A",
        muted: {
          DEFAULT: "#F1F5F9",
          foreground: "#64748B",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#0F172A",
        },
      },
      fontFamily: {
        sans: ["Inter", "Geist", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["4rem", { lineHeight: "1.1", fontWeight: "700" }],
        h1: ["3rem", { lineHeight: "1.15", fontWeight: "700" }],
        h2: ["2.25rem", { lineHeight: "1.25", fontWeight: "600" }],
        h3: ["1.75rem", { lineHeight: "1.3", fontWeight: "600" }],
        h4: ["1.375rem", { lineHeight: "1.4", fontWeight: "600" }],
        body: ["1rem", { lineHeight: "1.5", fontWeight: "400" }],
        small: ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
      },
      spacing: {
        "8": "8px",
        "16": "16px",
        "24": "24px",
        "32": "32px",
        "48": "48px",
        "64": "64px",
        "96": "96px",
        "128": "128px",
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
