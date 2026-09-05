import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#090d16",
        surface: {
          DEFAULT: "#0f172a",
          border: "#1e293b",
          hover: "#1e293b/80",
          card: "#131c2e",
        },
        brand: {
          DEFAULT: "#3b82f6",
          dark: "#2563eb",
          light: "#60a5fa",
          accent: "#6366f1",
        },
        status: {
          healthy: "#10b981",
          degraded: "#f59e0b",
          critical: "#ef4444",
          unknown: "#6b7280",
        },
        sev: {
          1: "#ef4444",
          2: "#f97316",
          3: "#eab308",
          4: "#3b82f6",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
