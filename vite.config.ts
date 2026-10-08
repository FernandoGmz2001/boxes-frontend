import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

const apiProxy = {
  target: "http://localhost:3000",
  changeOrigin: true,
  bypass(request: { headers: { accept?: string | string[] } }) {
    const accept = request.headers.accept
    const acceptsHtml = typeof accept === "string" && accept.includes("text/html")
    if (acceptsHtml) return "/index.html"
  },
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/auth": apiProxy,
      "/categorias": apiProxy,
      "/productos": apiProxy,
      "/impuestos": apiProxy,
      "/movimientos": apiProxy,
      "/claves-producto-servicio": apiProxy,
      "/claves-unidad": apiProxy,
      "/objetos-impuesto": apiProxy,
    },
  },
});
