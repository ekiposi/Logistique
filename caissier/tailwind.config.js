// tailwind.config.js
module.exports = {
  content: [
    "./*.html",                 // Matches all HTML files in the root directory
    "./src/**/*.{js,ts,jsx,tsx,html}",  // Adjust these paths if your HTML or JS is elsewhere
    "./components/**/*.html",   // Include other directories if needed
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
