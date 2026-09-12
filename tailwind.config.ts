import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#12213A",
          900: "#0D1826",
          800: "#12213A",
          700: "#1B2E4C",
          600: "#2C4266",
          500: "#4B5768",
          400: "#7C879A",
          200: "#C9CFD9",
          100: "#E4E7ED"
        },
        paper: "#F6F7F5",
        amber: {
          DEFAULT: "#FFB100",
          600: "#E39A00",
          100: "#FFF1CC"
        },
        growth: {
          DEFAULT: "#1F8A70",
          600: "#166E59",
          100: "#DCF1EA"
        }
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"]
      },
      maxWidth: {
        content: "1180px"
      },
      borderRadius: {
        sm: "2px",
        DEFAULT: "3px",
        md: "4px"
      }
    }
  },
  plugins: []
};

export default config;
