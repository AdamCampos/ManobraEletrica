import express from "express";
import configureMulter from "../middlewares/multerConfig.js"; // Middleware modularizado
import paths from "../config/paths.js";

const router = express.Router();

// Rota de upload
router.post("/upload/:type", (req, res) => {
  const fileType = req.params.type;
  const directoryPath = paths[fileType];

  if (!directoryPath) {
    return res.status(400).json({ error: "Tipo de arquivo desconhecido." });
  }

  const upload = configureMulter(directoryPath).array("files", 10);

  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Nenhum arquivo enviado ou formato inválido." });
    }

    res.json({ message: "Arquivos enviados com sucesso!" });
  });
});

export default router;
