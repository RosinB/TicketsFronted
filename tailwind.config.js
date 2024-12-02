/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit', // 確保啟用 JIT

  content: [

    "./src/**/*.{js,jsx,ts,tsx}",

  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out'
      }
    }
  }
}