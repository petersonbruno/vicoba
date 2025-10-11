/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        secondary: "#F43F5E",
        success: "#16A34A",
        warning: "#FACC15",
        error: "#DC2626",
        lightprimary: "#EFF6FF",
        darkgray: "#1F2937",
        lightgray: "#F3F4F6",
      },
    },
  },
  plugins: [],
};
