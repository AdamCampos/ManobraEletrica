import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import svgr from "vite-plugin-svgr";

// Função auxiliar para resolver caminhos
const resolvePath = (...segments) => path.resolve(__dirname, ...segments);

export default defineConfig({
  server: {
    host: "0.0.0.0", // Permite acesso externo pela rede local
    port: 8401, // Porta do servidor de desenvolvimento
    https: {
      key: fs.existsSync(resolvePath("ssl", "server.key"))
        ? fs.readFileSync(resolvePath("ssl", "server.key"))
        : undefined, // Chave SSL
      cert: fs.existsSync(resolvePath("ssl", "server.crt"))
        ? fs.readFileSync(resolvePath("ssl", "server.crt"))
        : undefined, // Certificado SSL
    },
    strictPort: true, // Garante que a porta especificada seja usada
    cors: true, // Habilita CORS globalmente
    proxy: {
      "/api": {
        target: "https://10.22.39.23:8400", // Backend Node.js (Express)
        changeOrigin: true,
        secure: false, // Ignora problemas com SSL no desenvolvimento
        rewrite: (path) => path.replace(/^\/api/, ""), // Remove o prefixo `/api`
      },
    },
  },
  build: {
    outDir: "dist", // Diretório para os arquivos de build
    emptyOutDir: true, // Limpa o diretório de saída antes do novo build
    assetsDir: "assets", // Subdiretório para ativos estáticos
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name]-[hash][extname]",
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        manualChunks: {
          vendor: ["react", "react-dom"], // Divide bibliotecas grandes em chunks separados
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Aumenta o limite do tamanho do chunk
  },
  resolve: {
    alias: {
      "@": resolvePath("src"), // Atalho para o diretório `src`
    },
  },
  plugins: [
    react(),
    svgr(), // Adiciona suporte a SVG como componentes React
  ],
});
