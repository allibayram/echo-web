/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#09090B', // Zinc-950
                surface: '#18181B', // Zinc-900
                surfaceHover: '#27272A', // Zinc-800
                primary: '#10B981', // Emerald 500
                primaryHover: '#059669', // Emerald 600
                accent: '#3B82F6', // Blue 500
                textMain: '#FAFAFA', // Zinc-50
                textMuted: '#A1A1AA', // Zinc-400
                border: '#27272A', // Zinc-800
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'ticker': 'ticker 90s linear infinite',
            },
            keyframes: {
                ticker: {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(-100%)' },
                }
            }
        },
    },
    plugins: [],
}
