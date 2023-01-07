/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: "#202020",
        placeholder: "#797979",
        "dark-placeholder": "#3D3D3D",
        "primary-text": "#D2D2D2",
        "secondary-text": "#797979",
        accent: "#0099FF",
        "dark-accent": "#0079ca",
      },
      screens: {
        mobile: { min: "0px", max: "768px" },
      },
    },
  },
  plugins: [],
};
