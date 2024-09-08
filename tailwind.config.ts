import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: '#f5f1eb',
        'primary-dark': '#d4bdae',
        'primary-darker': '#a19085',
        'primary-darkest': '#5e534c',
        secondary: '#7a787a',
        'secondary-dark': '#484a49',
        danger: '#d95950',
        highlight: '#8f8472',
        hint: 'blue',
      },
      listStyleType: {
        none: 'none',
        disc: 'disc',
        decimal: 'decimal',
        square: 'square',
        roman: 'upper-roman',
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
};
export default config;
