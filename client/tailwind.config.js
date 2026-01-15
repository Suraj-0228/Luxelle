/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#D4AF37', // Gold
                secondary: '#000000', // Black
                accent: '#f3f4f6', // Light Gray
            },
            fontFamily: {
                serif: ['Playfair Display', 'serif'],
                sans: ['Inter', 'sans-serif'],
            },
            keyframes: {
                'slow-zoom': {
                    '0%': { transform: 'scale(1)' },
                    '100%': { transform: 'scale(1.1)' },
                }
            },
            animation: {
                'slow-zoom': 'slow-zoom 20s linear infinite alternate',
            }
        },
    },
    plugins: [],
}
