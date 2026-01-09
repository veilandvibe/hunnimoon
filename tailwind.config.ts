import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          primary: '#C82777',
          light: '#FFF2F7',
          gradient: {
            from: '#FFF5FA',
            to: '#FFDCE8',
          },
        },
      },
      borderRadius: {
        '4xl': '24px',
        '5xl': '60px',
        'full': '100px',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        extrabold: '800',
        black: '900',
      },
      boxShadow: {
        card: '0px 4px 10px rgba(0, 0, 0, 0.05)',
        input: '0px 2px 10px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}
export default config
