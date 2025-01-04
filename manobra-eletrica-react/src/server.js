import express from "express";
import https from "https";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, "../dist");


// Carregar opções SSL
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, "../ssl", "server.key")),
  cert: fs.readFileSync(path.join(__dirname, "../ssl", "server.crt")),
};

const app = express();

// Middleware para CORS (básico por enquanto)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Middleware para log básico
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware para servir arquivos estáticos
app.use(express.static(distPath));

// Redirecionar todas as rotas para React
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Inicializar o servidor HTTPS
const PORT = 8400;
https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`Servidor rodando com HTTPS na porta ${PORT}`);
});
