import express from "express";
import https from "https";
import path from "path";
import { fileURLToPath } from "url";
import corsConfig from "../middlewares/corsConfig.js";
import httpsOptions from "../config/httpsOptions.js";
import logRequests from "../middlewares/logRequests.js";
import routesDocumentation from "../docs/routesDocumentation.js"; // Importação da documentação
import listFilesRouter from "../routes/listFiles.js";
import uploadFilesRouter from "../routes/uploadFiles.js";
import executeConversionRouter from "../routes/executeConversion.js";
import { createProxyMiddleware } from "http-proxy-middleware";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, "../dist");

const app = express();
app.use(corsConfig);
app.use(logRequests);

// Rota para exibir a documentação
app.get("/docs", (req, res) => {
  res.json(routesDocumentation);
});

// Configuração do proxy para /Controllogix
app.use(
  "/Controllogix",
  createProxyMiddleware({
    target: "https://localhost:8385", // Endereço do Tomcat
    changeOrigin: true,
    secure: false, // Ignorar problemas de certificados autoassinados
    pathRewrite: { "^/Controllogix": "" }, // Remove o prefixo "/Controllogix"
    logLevel: "debug", // Logs detalhados para verificar o redirecionamento
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[ProxyReq] ${req.method} ${req.originalUrl}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`[ProxyRes] ${req.method} <- Status: ${proxyRes.statusCode}`);
    },
    onError: (err, req, res) => {
      console.error(`[ProxyError] ${err.message}`);
      res.status(500).send("Erro no proxy ao redirecionar para o backend.");
    },
  })
);

// Configuração das rotas modularizadas
app.use(listFilesRouter);
app.use(uploadFilesRouter);
app.use(executeConversionRouter);

// Middleware para servir arquivos estáticos
app.use(express.static(distPath));

// Redirecionar outras rotas para React
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Inicializar o servidor HTTPS
const PORT = process.env.PORT || 8400; // Usa a variável de ambiente PORT ou a porta padrão 8400
https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`Servidor rodando com HTTPS na porta ${PORT}`);
});
