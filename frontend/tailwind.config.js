/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        accentRose: "#b25f87",
        accentBlue: "#6b7cff",
        accentCyan: "#38c6ff",
        panelNavy: "#0f1440",
        panelIndigo: "#111a5e",       
        background: "#151d59",      
        textPrimary: "#eef0ff",
        textSecondary: "#b8bce6",
        borderColor: "rgba(255,255,255,0.12)",
        surface: "#3d2c49",
        surfaceAlt: "#1a2240",
        assistantBubble: "rgba(22,28,74,0.9)",
        userBubble: "rgba(38,16,71,0.9)",      
        accentPrimary: "#9b5cff",  
        accentMid: "#5f7cff",       
        accentSecondary: "#2ad3ff",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        card: "0 24px 48px rgba(0,0,0,0.55)",
        glow: "0 10px 30px rgba(99,84,255,.35), 0 2px 10px rgba(42,211,255,.25)",
        glowSoft: "0 10px 30px rgba(178,95,135,.25), 0 2px 10px rgba(56,198,255,.18)",
      },
    },
  },
  plugins: [],
};
