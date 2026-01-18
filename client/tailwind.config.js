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
                sans: ['Poppins', 'sans-serif'],
            },
            keyframes: {
                'slow-zoom': {
                    '0%': { transform: 'scale(1)' },
                    '100%': { transform: 'scale(1.1)' },
                },
                'fadeIn': {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'scaleIn': {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                }
            },
            animation: {
                'slow-zoom': 'slow-zoom 20s linear infinite alternate',
                'fadeIn': 'fadeIn 0.5s ease-out forwards',
                'scaleIn': 'scaleIn 0.2s ease-out forwards',
            }
        },
    },
    plugins: [require("daisyui")],
}
