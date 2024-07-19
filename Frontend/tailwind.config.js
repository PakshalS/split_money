/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'auth-back': "url('src/assets/texture-dark-background-purple-3840x2160-3086.jpg')",
      }
    },
  },
  plugins: [],
};
