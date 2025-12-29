export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FCCD4C",
        purple: "#9C87D2",
        green: "#90C785",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        quicksand: ["Quicksand", "sans-serif"],
        nunito: ["Nunito", "sans-serif"],
      },
      keyframes: {
        buzz: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-6px) rotate(-10deg)" },
          "40%": { transform: "translateX(6px) rotate(10deg)" },
          "60%": { transform: "translateX(-4px) rotate(-6deg)" },
          "80%": { transform: "translateX(4px) rotate(6deg)" },
        },
        orbit: {
          from: { transform: "rotate(0deg) translateY(-1rem) rotate(0deg)" },
          to: { transform: "rotate(-360deg) translateY(-1rem) rotate(360deg)" },
        },
        counterOrbit: {
          "0%": { transform: "rotate(0deg) translateX(-50%)" },
          "100%": { transform: "rotate(-360deg) translateX(-50%)" },
        },
      },
      animation: {
        // buzz: "buzz 0.6s infinite linear",
        orbit: "orbit 1s linear infinite",
        counterOrbit: "counterOrbit 4s linear infinite",
      },
      utilities: {
        ".break-inside-avoid": {
          "break-inside": "avoid",
        },
      },
    },
  },
  plugins: [],
};
