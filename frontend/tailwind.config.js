/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#667eea",
        secondary: "#764ba2",
        success: "#27ae60",
        danger: "#e74c3c",
        warning: "#f39c12",
        info: "#3498db",
      },
    },
  },
  plugins: [],
}
