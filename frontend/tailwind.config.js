/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#5f6FFF",
        secondary: "#5f6FDD",
      },
      gridTemplateColumns: {
        auto: "repeat(auto-fill ,minmax(200px,1fr))",
      },
      keyframes: {
        // Glow blob effect
        "wavy-glow": {
          "0%": {
            transform: "translateX(0) translateY(0) scale(1)",
            opacity: "0.4",
          },
          "25%": {
            transform: "translateX(30px) translateY(-15px) scale(1.05)",
            opacity: "0.5",
          },
          "50%": {
            transform: "translateX(60px) translateY(0) scale(1.1)",
            opacity: "0.6",
          },
          "75%": {
            transform: "translateX(30px) translateY(15px) scale(1.05)",
            opacity: "0.5",
          },
          "100%": {
            transform: "translateX(0) translateY(0) scale(1)",
            opacity: "0.4",
          },
        },

        // Moving gradient border (box b snake style)
        "border-rotate": {
          "0%": { "--border-angle": "0deg" },
          "100%": { "--border-angle": "360deg" },
        },

        // Shine pulse (scrolling gradient)
        "shine-pulse": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
      },
      animation: {
        "wavy-glow": "wavy-glow 10s ease-in-out infinite",
        "border-rotate": "border-rotate 4s linear infinite",
        "shine-pulse": "shine-pulse 3s linear infinite",
      },
    },
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        "@property --border-angle": {
          syntax: "<angle>",
          inherits: false,
          initialValue: "0deg",
        },
      });
    },
  ],
};
