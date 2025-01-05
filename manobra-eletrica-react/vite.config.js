import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import svgr from 'vite-plugin-svgr';

// Função auxiliar para resolver caminhos
const resolvePath = (...segments) => path.resolve(__dirname, ...segments);

export default defineConfig({
  server: {
    host: "0.0.0.0", // Permite acesso externo pela rede local
    port: 8401, // Porta para o servidor de desenvolvimento
    https: {
      key: fs.existsSync(resolvePath("ssl", "server.key"))
        ? fs.readFileSync(resolvePath("ssl", "server.key"))
        : undefined, // Chave SSL
      cert: fs.existsSync(resolvePath("ssl", "server.crt"))
        ? fs.readFileSync(resolvePath("ssl", "server.crt"))
        : undefined, // Certificado SSL
    },
    strictPort: true,
    cors: true,
    proxy: {
      "/api": {
        target: "https://10.22.39.23:8400", // Backend Node.js (Express)
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    assetsDir: "assets",
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name]-[hash][extname]",
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      "@": resolvePath("src"),
    },
  },
  plugins: [
    react(),
    svgr(), // Adiciona suporte a SVG como componentes React
],
});
