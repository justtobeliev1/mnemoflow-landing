import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          soft: "rgb(var(--ink-soft) / <alpha-value>)",
          faint: "rgb(var(--ink-faint) / <alpha-value>)",
        },
        line: "#E3E8F0",
        mist: "#F6F8FB",
        coal: { DEFAULT: "#0B0E17", raised: "#151926" },
        brand: { DEFAULT: "rgb(var(--brand) / <alpha-value>)" },
      },
      fontFamily: {
        display: ["var(--font-body)"],
      },
      maxWidth: { wide: "1200px" },
      backgroundImage: {
        flow: "linear-gradient(100deg, rgb(var(--g1)) 0%, rgb(var(--g2)) 32%, rgb(var(--g3)) 66%, rgb(var(--g4)) 100%)",
      },
      transitionTimingFunction: { out: "cubic-bezier(0.22, 1, 0.36, 1)" },
    },
  },
  plugins: [],
};

export default config;
