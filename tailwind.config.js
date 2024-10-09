/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "/views/admin/*.ejs",          // Include all EJS files in the views folder
    "/views/client/*.ejs",          // Include all EJS files in the views folder
    "/views/general/*.ejs",          // Include all EJS files in the views folder
    "/views/components/*.ejs",          // Include all EJS files in the views folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}