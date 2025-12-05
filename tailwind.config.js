/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    safelist: [
        'bg-gradient-to-br',
        'from-orange-200',
        'via-pink-200',
        'to-purple-200',
        'via-pink-100',
        'text-gray-900',
        'text-gray-800',
        'text-gray-700',
        'bg-white/40',
        'backdrop-blur-md'
    ],
    plugins: [],
}
