import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Rutas tipadas: los enlaces se validan en tiempo de compilación.
  typedRoutes: true,
  // Tailwind CSS 4 se procesa con el loader oficial de Turbopack.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
