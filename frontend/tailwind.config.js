// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      lineClamp: {
        2: '2',
        3: '3',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        cabin: ['"Cabin Sketch"', 'cursive'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
  ],
};
