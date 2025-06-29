/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    '../../apps/web/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../apps/web/components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
    '!../../**/node_modules',
    '!../../**/dist',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;

// content: [
//     '../../apps/**/*.{js,ts,jsx,tsx,mdx}',
//     './components/**/*.{js,ts,jsx,tsx,mdx}',
//     '../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}',
//   ]
