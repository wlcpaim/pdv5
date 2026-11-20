/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0f1115",
        surface: "#1a1d24",
        primary: "#6366f1",
        success: "#22c55e",
        danger: "#ef4444",
        text: "#f8fafc",
        muted: "#94a3b8"
      }
    },
  },
  plugins: [],
}
