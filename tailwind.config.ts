import type { Config } from "tailwindcss";

const config: Config = {
  // Le content reste nécessaire pour que Tailwind sache quels fichiers scanner
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Vous pouvez supprimer tout le bloc 'theme' ici,
  // car il est maintenant géré par votre bloc @theme dans le CSS.
  plugins: [require("tailwindcss-animate")],
};

export default config;
