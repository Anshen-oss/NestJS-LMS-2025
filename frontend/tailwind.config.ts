import lineClamp from "@tailwindcss/line-clamp";
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    lineClamp,
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
};
export default config;
