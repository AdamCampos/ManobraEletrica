import express from "express";
import https from "https";
import path from "path";
import { fileURLToPath } from "url";
import corsConfig from "../middlewares/corsConfig.js";
import httpsOptions from "../config/httpsOptions.js";
import logRequests from "../middlewares/logRequests.js";
import routesDocumentation from "../docs/routesDocumentation.js";
import listFilesRouter from "../routes/listFiles.js";
import uploadFilesRouter from "../routes/uploadFiles.js";
import executeConversionRouter from "../routes/executeConversion.js";
import { createProxyMiddleware } from "http-proxy-middleware";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const distPath   = path.join(__dirname, "../dist");

const app = express();

app.use(corsConfig);
app.use(logRequests);

/* ====== ESTÁTICOS ====== */
// serve todo o build
app.use(express.static(distPath, {
  setHeaders: (res, p) => {
    if (p.endsWith(".svg")) res.type("image/svg+xml");
  }
}));

// se você colocar o arquivo em public/svg → dist/svg, exponha em /svg
const svgPath = path.join(distPath, "svg");
app.use("/svg", express.static(svgPath, {
  maxAge: "1h",
  setHeaders: (res) => res.type("image/svg+xml")
}));

/* ====== DOCS ====== */
app.get("/docs", (req, res) => {
  res.json(routesDocumentation);
});

/* ====== PROXY ====== */
app.use("/Controllogix", createProxyMiddleware({
  target: "https://localhost:8385",
  changeOrigin: true,
  secure: false,
  pathRewrite: { "^/Controllogix": "" },
  logLevel: "debug",
  onProxyReq: (proxyReq, req) => {
    console.log(`[ProxyReq] ${req.method} ${req.originalUrl}`);
  },
  onProxyRes: (proxyRes, req) => {
    console.log(`[ProxyRes] ${req.method} <- Status: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error(`[ProxyError] ${err.message}`);
    res.status(500).send("Erro no proxy ao redirecionar para o backend.");
  },
}));

/* ====== ROTAS DA API ====== */
app.use(listFilesRouter);
app.use(uploadFilesRouter);
app.use(executeConversionRouter);

/* ====== SPA FALLBACK ====== */
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

/* ====== HTTPS ====== */
const PORT = process.env.PORT || 8400;
https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`Servidor rodando com HTTPS na porta ${PORT}`);
});
