/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#0e0e0e",      
        surface: "#3d2c49",      
        accent: "#b25f87",      
        textPrimary: "#e3d8f1",      
        textSecondary: "#4b4b4b",   
        borderColor: "#4b4b4b",
      },
      borderRadius: {
        "xl": "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        card: "0 24px 48px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
};
