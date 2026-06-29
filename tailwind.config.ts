import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        antiqua: { bg:"#F7F3EE", surface:"#EFEBE4", coal:"#1C1812", bronze:"#8B6914", gold:"#D4A843", muted:"#6B6558", border:"#E0D9CF" }
      },
      fontFamily: {
        display: ["var(--font-playfair)","Playfair Display","Georgia","serif"],
        body: ["var(--font-inter)","Inter","system-ui","sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
