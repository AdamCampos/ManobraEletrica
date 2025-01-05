import fs from "fs";
import express from "express";
import paths from "../config/paths.js"; // Importa os caminhos do módulo centralizado

const router = express.Router();

// Rota para listar arquivos
router.get("/list-files/:type", (req, res) => {
  const fileType = req.params.type;

  if (fileType === "sql") {
    const estruturaPath = paths.sqlEstrutura;
    const dadosPath = paths.sqlDados;

    try {
      const estruturaFiles = fs
        .readdirSync(estruturaPath)
        .filter((file) => file.toLowerCase().endsWith(".sql"));
      const dadosFiles = fs
        .readdirSync(dadosPath)
        .filter((file) => file.toLowerCase().endsWith(".sql"));

      return res.json({ estrutura: estruturaFiles, dados: dadosFiles });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao listar arquivos SQL." });
    }
  }

  const directoryPath = paths[fileType];
  if (!directoryPath) {
    return res.status(400).json({ error: "Tipo de arquivo desconhecido." });
  }

  try {
    const files = fs
      .readdirSync(directoryPath)
      .filter((file) => file.toLowerCase().endsWith(`.${fileType}`));
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar arquivos." });
  }
});

export default router;
