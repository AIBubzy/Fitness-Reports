/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0a0a0c',
                primary: {
                    blue: '#00f2ff',
                    purple: '#bc13fe',
                    pink: '#ff00bd',
                }
            },
            backgroundImage: {
                'gradient-futuristic': 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
                'glass': 'rgba(255, 255, 255, 0.05)',
            },
            boxShadow: {
                'neon': '0 0 10px rgba(0, 242, 255, 0.5), 0 0 20px rgba(0, 242, 255, 0.2)',
                'neon-purple': '0 0 10px rgba(188, 19, 254, 0.5), 0 0 20px rgba(188, 19, 254, 0.2)',
            }
        },
    },
    plugins: [],
}
